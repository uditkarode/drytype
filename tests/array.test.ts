import { Array, ArrayOf, Tuple } from "../modules/Array.ts";
import { Number } from "../modules/primitives/Number.ts";
import { BigInt } from "../modules/primitives/BigInt.ts";
import { String } from "../modules/primitives/String.ts";
import { ValidationError } from "../validation-error.ts";
import { assertThrows } from "https://deno.land/std@0.100.0/testing/asserts.ts";

Deno.test("Array", () => {
  Array.strictValidate([1, 2, 3]);
});

Deno.test("Throwing Array", () => {
  assertThrows(
    () => {
      Array.strictValidate("hey");
    },
    ValidationError,
    "expected: array, got: string",
  );
});

Deno.test("ArrayOf", () => {
  ArrayOf(String.union(Number)).strictValidate(["hey", 20, "nay", 40]);
});

Deno.test("Throwing ArrayOf", () => {
  assertThrows(
    () => {
      ArrayOf(String.union(Number)).strictValidate(["hey", 20n]);
    },
    ValidationError,
    "array contains unexpected: bigint, expected: string | number, index: 1",
  );
});

Deno.test("Tuple", () => {
  Tuple([String, Number, BigInt]).strictValidate(["hey", 3, 10n]);
});

Deno.test("Throwing Tuple", () => {
  assertThrows(
    () => {
      Tuple([String, Number, BigInt]).strictValidate(["hey", 3, "ok"]);
    },
    ValidationError,
    "tuple contains unexpected: string, expected: bigint, index: 2",
  );
});
