import { makeDryType } from "../../drytype";

/**
 * Validates that a value is an object
 */

// since we're checking for exactly this type
// deno-lint-ignore ban-types
export const Object = makeDryType<object>(
  (x) => (typeof x == "object" ? { success: true } : { success: false }),
  "object"
);
