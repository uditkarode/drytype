import { makeDryType } from "../../drytype";

/**
 * Validates that a value is undefined
 */
export const Undefined = makeDryType<undefined>(
  (x) => typeof x == "undefined" ? { success: true } : { success: false },
  "undefined",
);
