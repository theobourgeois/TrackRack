
/**
 * Converts a camel case string to a title case string.
 * @param str camel case string
 */
export function camelCaseToTitleCase(str: string) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
}

/**
 * Adjusts the font size of a string based on its length.
 * @param text The text to adjust the font size of.
 * @returns The appropriate tailwind class to adjust the font size.
 */
export const adjustFontSize = (text: string) => {
  const length = text.length;
  if (length > 50) {
    return "text-4xl";
  } else if (length > 30) {
    return "text-[40px]";
  } else {
    return "text-[60px]";
  }
};