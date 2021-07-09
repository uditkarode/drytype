import { makeDryType } from "../../drytype.ts";

/**
 * Validates that a value is a boolean and
 * exactly equal to the given template value
 *
 * @param val the value to compare against
 * @returns an ExactBoolean DryType
 */
export const ExactBoolean = <S extends boolean>(val: S) =>
  makeDryType<S>((x) => {
    if (typeof (x) == "boolean") {
      if (x == val) return { success: true };
      else return { success: false, message: `expected: ${val}, got: ${x}` };
    } else return { success: false };
  });

/**
 * Validates that a value is a boolean
 */
export const Boolean = makeDryType<boolean>(
  (x) => typeof x == "boolean" ? { success: true } : { success: false },
  "boolean",
);
