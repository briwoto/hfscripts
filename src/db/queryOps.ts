import { UserSegment } from '../models';
import { getPausedUserClauseList, getPausedUserMainQuery } from './queries';

export class QueryOps {
  constructor() {}

  getPausedSubscriptionsQuery(weeksList?: string[]) {
    const nextWeek = weeksList[0];

    // add single quotes around each value
    // to render it correct inside the "IN" clause in the query
    const weeksListFormatted = weeksList.map((w) => `'${w}'`);

    const pausedUserClauseList = getPausedUserClauseList(nextWeek);
    const mainQueryClauseList = getPausedUserMainQuery(
      weeksListFormatted,
      pausedUserClauseList
    );
    return `${mainQueryClauseList.join('\n')}`;
  }

  deserealiseSegmentsData(usersList: UserSegment[]) {
    return usersList.map((e) => [Number(e.user_id), e.email, e.segment]);
  }
}
