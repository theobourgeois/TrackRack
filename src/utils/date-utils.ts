/**
 * Formats a date object into a string based on how long ago the date was.
 * The output is adjusted based on the specified precision and clamp parameters.
 * 
 * @param date The date object to be formatted.
 * @param precision The smallest unit of time to be displayed. Determines the granularity of the time difference displayed.
 * Can be 'minute', 'hour', 'day', 'week', 'month', or 'year'. Defaults to 'year'.
 * @param clamp Sets the minimum unit of time to display. If the elapsed time is less than the clamp unit,
 * the function returns a string corresponding to the clamp unit. Can be 'minute', 'hour', 'day', 'week', 'month', or 'year'. Defaults to 'minute'.
 * 
 * @returns A string representing how long ago the date was, formatted based on the provided precision and clamp parameters.
 * 
 * Example usage:
 * - getDateString(new Date(), 'day', 'hour') // could return "3 hours ago" or "Today" depending on the current time and the date provided
 */
type TimeUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export function getDateString(
  date: Date,
  precision: TimeUnit = 'year',
  clamp: TimeUnit = 'minute'
): string {
  const now = new Date();
  const timeElapsed = now.getTime() - date.getTime();
  const timeUnits: { [K in TimeUnit]: number } = {
    minute: 60000,
    hour: 3600000,
    day: 86400000,
    week: 604800000,
    month: 2592000000,
    year: 31536000000
  };
  if (timeElapsed < timeUnits.minute) return 'Just now'

  const precisionIndex = Object.keys(timeUnits).indexOf(precision);
  const clampIndex = Math.max(Object.keys(timeUnits).indexOf(clamp), 0); // Ensure clamp is at least 0

  for (let i = precisionIndex; i >= 0; i--) {
    const unit = Object.keys(timeUnits)[i] as TimeUnit;
    const milliseconds = timeUnits[unit];

    if (timeElapsed < milliseconds) continue; // Skip if the time elapsed is less than the current unit

    if (i < clampIndex) {
      // If the unit is smaller than the clamp, display the clamp message
      const clampUnit = Object.keys(timeUnits)[clampIndex] as TimeUnit;
      switch (clampUnit) {
        case 'minute':
          return 'Just now';
        case 'hour':
          return 'Less than an hour ago';
        case 'day':
          return 'Less than 24 hours ago';
        case 'week':
          return 'This week';
        case 'month':
          return 'This month';
        default:
          return 'This year';
      }
    }

    const time = Math.floor(timeElapsed / milliseconds);
    return `${time} ${unit}${time === 1 ? '' : 's'} ago`;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}