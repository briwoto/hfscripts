// NOTE: the part "1=1" is there with every WHERE clause
// it practically means nothing. it will always be true.
// it exists for simplicity of code, so that we won't have to worry about
// where to put the WHERE clause vs the AND clause

export const getPausedUserClauseList = (nextWeek: string) => [
  'select user_id from subscription where 1=1',
  `AND subscription_week = '${nextWeek}'`,
  `AND status = 'paused'`,
];

// The inner join exists only to fetch the email id.
// The alternative to join was to run a separate query to fetch the email
// And then write the emails to the table
// This would've been more time-consuming and expensive
export const getPausedUserMainQuery = (
  weeksListFormatted: string[],
  pausedUserClauseList: string[]
) => [
  `SELECT s.user_id, s.subscription_week, s.status, c.email, FROM subscription s`,
  'INNER JOIN customer c on s.user_id = c.user_id',
  `WHERE 1=1`,
  `AND s.subscription_week IN (${weeksListFormatted.join(', ')})`,
  `AND s.user_id in (${pausedUserClauseList.join('\n')})`,
  'ORDER BY s.user_id, s.subscription_week',
];
