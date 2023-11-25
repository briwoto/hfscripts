import 'dotenv/config';
import { Postgres } from './db';
import {
  createReadableStream,
  generateCsvString,
  getNext4Weeks,
} from './utils';
import { QueryOps } from './db';
import { groupUsersBySegment } from './services';
import { RecCampaignWeeklySchema } from './models';
const postgres = new Postgres();
const queryOps = new QueryOps();

(async () => {
  try {
    await postgres.connect();

    const weeksList = getNext4Weeks();
    const query = queryOps.getPausedSubscriptionsQuery(weeksList);

    // because of the size of the table,
    // it makes sense to execute a transaction instead of a query
    const result = await postgres.runTransaction(query);

    // get the user list grouped by segments
    const userSegmentsList = groupUsersBySegment(result.rows);

    // convert user list into a readable stream
    const bulkData = queryOps.deserealiseSegmentsData(userSegmentsList);
    const bulkDataCsv = generateCsvString(bulkData);
    const bulkDataStream = createReadableStream(bulkDataCsv);

    // stream data to db via stream
    await postgres.bulkInsert(RecCampaignWeeklySchema, bulkDataStream);
  } catch (err) {
    console.error(err);
  }
})();
