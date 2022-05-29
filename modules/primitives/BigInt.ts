import { makeDryType } from "../../drytype.ts";

/**
 * Validates that a value is a bigint and
 * exactly equal to the given template value
 *
 * @param val the value to compare against
 * @returns an ExactBigInt DryType
 */
export const ExactBigInt = <S extends bigint>(val: S) =>
  makeDryType<S>((x) => {
    if (typeof x == "bigint") {
      if (x == val) return { success: true };
      else return { success: false, message: `expected: ${val}n, got: ${x}n` };
    } else return { success: false };
  }, `the bigint ${val}`);

/**
 * Validates that a bigint is greater than
 * the given template bigint
 *
 * @param num the bigint to compare against
 * @returns a BigIntGreaterThan DryType
 */
export const BigIntGreaterThan = (num: bigint) =>
  makeDryType<bigint>((x) => {
    if (typeof x == "bigint") {
      if (x > num) return { success: true };
      else {
        return {
          success: false,
          message: `expected bigint greater than: ${num}n, got: ${x}n`,
        };
      }
    } else return { success: false };
  }, `bigint greater than ${num}`);

/**
 * Validates that a bigint is less than
 * the given template bigint
 *
 * @param num the bigint to compare against
 * @returns a BigIntLesserThan DryType
 */
export const BigIntLesserThan = (num: bigint) =>
  makeDryType<bigint>((x) => {
    if (typeof x == "bigint") {
      if (x < num) return { success: true };
      else {
        return {
          success: false,
          message: `expected bigint lesser than: ${num}n, got: ${x}n`,
        };
      }
    } else return { success: false };
  }, `bigint lesser than ${num}`);

/**
 * Validates that a value is a bigint
 */
export const BigInt = makeDryType<bigint>(
  (x) => (typeof x == "bigint" ? { success: true } : { success: false }),
  "bigint"
);
