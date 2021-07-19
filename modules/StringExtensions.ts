import { makeDryType } from "../drytype";

/**
 * Validates that a given value is a
 * string and the same as str
 *
 * @param str the string to check against
 * @returns an ExactString DryType
 */
export const ExactString = <S extends string>(str: S) =>
  makeDryType<string>((x) => {
    if (typeof (x) == "string") {
      if (x == str) {
        return { success: true };
      } else {
        return {
          success: false,
          message: `expected string to be: ${str}, got: ${x}`,
        };
      }
    } else {
      return { success: false };
    }
  }, `"${str}"`);

/**
 * Validates that the given value is a string
 * in the format of comma separated items
 * with each item belonging to the array
 * inOneOf
 *
 * @param inOneOf the string array to check in
 * @returns a CommaSepOneOf DryType
 */
export const CommaSepOneOf = (inOneOf: string[]) =>
  makeDryType<string>((x) => {
    if (typeof (x) == "string") {
      const list = x.split(",");
      for (const v of list) {
        if (inOneOf.find((x) => x === v) == undefined) {
          return {
            success: false,
            message: `expected: one of [${inOneOf}], got: ${v}`,
          };
        }
      }
      return { success: true };
    } else return { success: false };
  });
