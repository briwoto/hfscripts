import 'dotenv/config';
import { Postgres } from './db';
import { getNext4Weeks } from './utils';
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

    const userSegmentsList = groupUsersBySegment(result.rows);
    const bulkData = queryOps.deserealiseSegmentsData(userSegmentsList);
    await postgres.bulkInsert(RecCampaignWeeklySchema, bulkData);
  } catch (err) {
    console.error(err);
  }
})();
