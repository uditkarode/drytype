import { makeDryType } from "../../drytype.ts";

/**
 * Validates that a value is a function
 */
// since we're checking for
// exactly this type
export const Function = makeDryType<Function>(
  (x) => (typeof x == "function" ? { success: true } : { success: false }),
  "function"
);
