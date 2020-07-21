export const daysAgoAsDate = (days = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const inDaysAsDate = (days = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

export const daysAgo = (days = 0) => {
  return daysAgoAsDate(days).toISOString();
};

export const inDays = (days = 0) => {
  return inDaysAsDate(days).toISOString();
};
