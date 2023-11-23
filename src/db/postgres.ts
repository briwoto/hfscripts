import { Client } from 'pg';
import { Queries } from './queries';
const queries = new Queries();

export class Postgres {
  pgClient: Client;
  dbName: string;

  // connect to the default database when no name is provided
  constructor(dbName?: string) {
    this.dbName = dbName;
  }

  async connect() {
    const config = {
      user: process.env.USER_NAME,
      password: process.env.PASSWORD,
      host: process.env.HOST_NAME,
      port: Number(process.env.DB_PORT),
      database: this.dbName || 'defaultdb',
      ssl: {
        rejectUnauthorized: true,
        ca: process.env.CA_CERT,
      },
    };
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
}
