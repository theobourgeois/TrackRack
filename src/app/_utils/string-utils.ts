
/**
 * Converts a camel case string to a title case string.
 * @param str camel case string
 */
export function camelCaseToTitleCase(str: string) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
}