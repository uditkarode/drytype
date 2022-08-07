import { makeDryType } from "../../drytype";

/**
 * Validates that a value is a number and
 * exactly equal to the given template value
 *
 * @param val the value to compare against
 * @returns an ExactNumber DryType
 */
export const ExactNumber = <S extends number>(val: S) =>
  makeDryType<S>((x) => {
    if (typeof x == "number") {
      if (x == val) return { success: true };
      else return { success: false, message: `expected: ${val}, got: ${x}` };
    } else return { success: false };
  }, `the number ${val}`);

/**
 * Validates that a number is greater than
 * the given template number
 *
 * @param num the number to compare against
 * @returns a NumberGreaterThan DryType
 */
export const NumberGreaterThan = (num: number) =>
  makeDryType<number>((x) => {
    if (typeof x == "number") {
      if (x > num) return { success: true };
      else {
        return {
          success: false,
          message: `expected number greater than: ${num}, got: ${x}`,
        };
      }
    } else return { success: false };
  }, `number greater than ${num}`);

/**
 * Validates that a number is less than
 * the given template number
 *
 * @param num the number to compare against
 * @returns a NumberLesserThan DryType
 */
export const NumberLesserThan = (num: number) =>
  makeDryType<number>((x) => {
    if (typeof x == "number") {
      if (x < num) return { success: true };
      else {
        return {
          success: false,
          message: `expected number lesser than: ${num}, got: ${x}`,
        };
      }
    } else return { success: false };
  }, `number lesser than ${num}`);

/**
 * Validates that a value is a number
 */
export const Number = makeDryType<number>(
  (x) => (typeof x == "number" ? { success: true } : { success: false }),
  "number",
);
