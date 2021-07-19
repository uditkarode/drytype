import { makeDryType } from "../../drytype";

/**
 * Validates that a value is a symbol
 */
export const Symbol = makeDryType<symbol>(
  (x) => typeof x == "symbol" ? { success: true } : { success: false },
  "symbol",
);
