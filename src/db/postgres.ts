import { Client } from 'pg';
import { from as copyFrom } from 'pg-copy-streams';
import { pipeline } from 'node:stream/promises';
import { Queries } from './queries';
import { TableSchema } from '../models';
import { createReadableStream, generateCsvString } from '../utils';

const queries = new Queries();

const dbConfig = (dbName?: string) => ({
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  host: process.env.HOST_NAME,
  port: Number(process.env.DB_PORT),
  database: dbName || 'defaultdb',
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.CA_CERT,
  },
});

export class Postgres {
  pgClient: Client;
  dbName: string;

  // connect to the default database when no name is provided
  constructor(dbName?: string) {
    this.dbName = dbName;
  }

  async connect() {
    const config = dbConfig();
    this.pgClient = new Client(config);
    await this.pgClient.connect();
    const result = await this.pgClient.query('SELECT VERSION()', []);
    console.log(result.rows[0].version);
  }

  async disconnect() {
    await this.pgClient.end();
    console.log('database disconnected');
  }

  async runQuery(queryString: string) {
    return this.pgClient.query(queryString);
  }

  async runTransaction(queryString: string) {
    try {
      await this.pgClient.query('BEGIN');
      const result = await this.runQuery(queryString);
      await this.pgClient.query('COMMIT');
      return result;
    } catch (err) {
      await this.pgClient.query('ROLLBACK');
      throw err;
    }
  }

  async bulkInsert(schema: TableSchema, bulkData: any[]) {
    const { tableName, columns } = schema;
    const columnNameString = Object.values(columns).join(',');
    const queryText = `COPY ${tableName}(${columnNameString}) FROM STDIN WITH CSV DELIMITER ','`;
    const ingestStream = this.pgClient.query(copyFrom(queryText));
    const bulkDataCsv = generateCsvString(bulkData);
    const bulkDataStream = createReadableStream(bulkDataCsv);

    await bulkDataStream.pipe(ingestStream);

    ingestStream.on('finish', async () => {
      console.log(`Bulk insert completed.`);
      await this.disconnect();
    });
    ingestStream.on('error', async (err) => {
      console.log(`ERROR during Bulk insert.`);
      console.error(err);
      await this.disconnect();
    });
  }
}
