export class Queries {
  constructor() {}

  // NOTE: the part "1=1" is there with every WHERE clause
  // it practically means nothing. it will always be true.
  // it exists for simplicity of code, so that we won't have to worry about
  // where to put the WHERE clause vs the AND clause
  getPausedSubscriptionsQuery(weeksList?: string[]) {
    const returnColumns = [
      's.user_id',
      's.subscription_week',
      's.status',
      'c.email',
    ];
    const nextWeek = weeksList[0];

    // add single quotes around each value
    // to render it correct inside the "IN" clause in the query
    weeksList = weeksList.map((w) => `'${w}'`);

    const pausedUserClauseList = [
      'select user_id from subscription where 1=1',
      `AND subscription_week = '${nextWeek}'`,
      `AND status = 'paused'`,
    ];
    const mainQueryClauseList = [
      `SELECT ${returnColumns} FROM subscription s`,
      'INNER JOIN customer c on s.user_id = c.user_id',
      `WHERE 1=1`,
      `AND s.subscription_week IN (${weeksList.join(', ')})`,
      `AND s.user_id in (${pausedUserClauseList.join('\n')})`,
      'order by s.user_id, s.subscription_week',
    ];
    return `${mainQueryClauseList.join('\n')}`;
  }
}
