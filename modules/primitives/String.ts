import { makeDryType } from "../../drytype";

/**
 * Validates that a value is a string
 */
export const String = makeDryType<string>(
  (x) => (typeof x == "string" ? { success: true } : { success: false }),
  "string",
);
