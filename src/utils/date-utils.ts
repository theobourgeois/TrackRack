/**
 * formats a date object into a string based on how long ago the date was
 * @param date Date object
 * @returns formatted date string based on how long ago the date was
 */
export function getDateString(date: Date) {
  const updatedLessThanMinuteAgo =
    new Date().getTime() - date.getTime() < 60000;
  if (updatedLessThanMinuteAgo) {
    return "Just now";
  }
  const updatedLessThanHourAgo =
    new Date().getTime() - date.getTime() < 3600000;
  if (updatedLessThanHourAgo) {
    const minutes = Math.floor(
      (new Date().getTime() - date.getTime()) / 60000
    );
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  const updatedLessThanDayAgo =
    new Date().getTime() - date.getTime() < 86400000;
  if (updatedLessThanDayAgo) {
    const hours = Math.floor(
      (new Date().getTime() - date.getTime()) / 3600000
    );
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const updatedLessThanWeekAgo =
    new Date().getTime() - date.getTime() < 604800000;
  if (updatedLessThanWeekAgo) {
    const days = Math.floor(
      (new Date().getTime() - date.getTime()) / 86400000
    );
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
  const updatedLessThanMonthAgo =
    new Date().getTime() - date.getTime() < 2592000000;
  if (updatedLessThanMonthAgo) {
    const weeks = Math.floor(
      (new Date().getTime() - date.getTime()) / 604800000
    );
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }
  const dateString = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return dateString;
}