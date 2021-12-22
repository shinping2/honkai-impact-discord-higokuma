const DAY_IN_MILLIS_SECOND = 60 * 60 * 24 * 1000;
const HOUR_IN_MILLIS_SECOND = 60 * 60 * 1000;
const DAYS_IN_WEEK = 7;
const HOUR_IN_EST_ZONE = 4;  // EST is UTC+4

const DAY_TO_NUMBER_MAP_ = {
  'Mon': 1,
  'Tue': 2,
  'Wed': 3,
  'Thu': 4,
  'Fri': 5,
  'Sat': 6,
  'Sun': 7,
};

/* Date */ function currentDateInESTInMillis_(/* int */ dayInWeek, /* int */ hours) {
  const date = new Date();
  return new Date(date.getTime() - HOUR_IN_EST_ZONE * HOUR_IN_MILLIS_SECOND);
}

/* Date */ function createNextDateInESTWithDayAndHour_(/* int */ dayInWeek, /* int */ hours) {
  const date = currentDateInESTInMillis_();
  const currentDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), hours));
  let dayDifference = dayInWeek - date.getDay();
  const didPastCurrentDate = dayDifference == 0 && date.getTime() > currentDate.getTime();
  if (dayDifference < 0 || didPastCurrentDate) {
    dayDifference += DAYS_IN_WEEK;
  }

  return new Date(currentDate.getTime() + dayDifference * DAY_IN_MILLIS_SECOND);
}

module.exports = {
  createNextDateInESTWithDayAndHour: createNextDateInESTWithDayAndHour_,
  currentDateInESTInMillis: currentDateInESTInMillis_,
  DAY_TO_NUMBER_MAP: DAY_TO_NUMBER_MAP_,
};
