import 'dotenv/config';
import { Postgres } from './db';
import { getNext4Weeks } from './utils';
import { Queries } from './db/queries';
import { groupUsersBySegment } from './services';
const postgres = new Postgres();
const queries = new Queries();

(async () => {
  try {
    await postgres.connect();
    const weeksList = getNext4Weeks();
    const query = queries.getPausedSubscriptionsQuery(weeksList);
    const result = await postgres.runQuery(query);
    const userSegmentsList = groupUsersBySegment(result.rows);
    console.log(userSegmentsList);
    await postgres.disconnect();
  } catch (err) {
    console.error(err);
  }
})();
