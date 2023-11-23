const todaysdate = new Date();
const currentYear = todaysdate.getFullYear();
const jan1 = new Date(`${currentYear}-01-01`);

// if 1st Jan is a saturday, total weeks in the year will be 53
// else total weeks will be 52
const totalWeeks = jan1.getDay() === 6 ? 53 : 52;

const getCyclicWeekString = (weekNumber: number) => {
  const weekNumberString = `0${weekNumber}`.slice(-2);
  return weekNumber > totalWeeks
    ? `${String(currentYear + 1)}-W${weekNumber - totalWeeks}`
    : `${String(currentYear)}-W${weekNumberString}`;
};

const getWeekNumber = (date: Date) => {
  let dayJan1 = jan1.getDay();

  // change value from sunday-based to saturday-based
  dayJan1 = (dayJan1 + 6) % 7;

  const daysSinceJan1 =
    Math.floor((date.getTime() - jan1.getTime()) / (24 * 60 * 60 * 1000)) + 1;

  return Math.floor((daysSinceJan1 + dayJan1) / 7);
};

export const getNext4Weeks = () => {
  const currentWeek = getWeekNumber(todaysdate);
  return [
    getCyclicWeekString(currentWeek + 1),
    getCyclicWeekString(currentWeek + 2),
    getCyclicWeekString(currentWeek + 3),
    getCyclicWeekString(currentWeek + 4),
  ];
};
