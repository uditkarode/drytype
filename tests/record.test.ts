import { ExactRecord } from "../modules/Record.ts";
import { BigInt } from "../modules/primitives/BigInt.ts";
import { Boolean } from "../modules/primitives/Boolean.ts";
import { Function } from "../modules/primitives/Function.ts";
import { Number } from "../modules/primitives/Number.ts";
import { String } from "../modules/primitives/String.ts";
import { Symbol as DrySymbol } from "../modules/primitives/Symbol.ts";
import { Undefined } from "../modules/primitives/Undefined.ts";
import { ValidationError } from "../validation-error.ts";
import { makeDryType } from "../drytype.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.100.0/testing/asserts.ts";

const CustomObject = makeDryType(
  (x) =>
    typeof x == "object"
      ? { success: true }
      : { success: false, message: "Custom message!" },
  "CustomObject",
);

const testObj = {
  bigint: BigInt,
  boolean: Boolean,
  function: Function,
  number: Number,
  objectOrUndefined: CustomObject.union(Undefined),
  string: String,
  symbol: DrySymbol,
  undefined: Undefined,
};

const anotherTest = {
  something: CustomObject,
};

Deno.test("ExactRecord mutation check", () => {
  const sample = { username: "uditKarode" };

  ExactRecord({ username: String }).strictValidate(sample);

  assertEquals(sample, { username: "uditKarode" });
});

Deno.test("ExactRecord", () => {
  ExactRecord(testObj).strictValidate({
    bigint: 10n,
    boolean: true,
    function: () => {},
    number: 10,
    objectOrUndefined: {},
    string: "",
    symbol: Symbol(10),
    undefined: undefined,
  });
});

Deno.test("ExactRecord Custom Error Propogation", () => {
  assertThrows(
    () => {
      ExactRecord(anotherTest).strictValidate({ something: "5" });
    },
    ValidationError,
    "Custom message!, in: something",
  );
});

Deno.test("ExactRecord with missing optional property", () => {
  ExactRecord(testObj).strictValidate({
    bigint: 10n,
    boolean: true,
    function: () => {},
    number: 10,
    string: "",
    symbol: Symbol(10),
    undefined: undefined,
  });
});

Deno.test("ExactRecord with some more keys than template", () => {
  assertThrows(
    () => {
      ExactRecord(testObj).strictValidate({
        bigint: 10n,
        boolean: true,
        function: () => {},
        number: 10,
        objectOrUndefined: {},
        string: "",
        symbol: Symbol(10),
        undefined: undefined,
        someExtraField: 100,
      });
    },
    ValidationError,
    "expected target to have at most 8 items, had 9",
  );
});

Deno.test("ExactRecord with same number of keys as template, but an extra key (using optional params)", () => {
  assertThrows(
    () => {
      ExactRecord(testObj).strictValidate({
        bigint: 10n,
        boolean: true,
        function: () => {},
        number: 10,
        string: "",
        symbol: Symbol(10),
        undefined: undefined,
        someExtraField: 100,
      });
    },
    ValidationError,
    "Extra parameter someExtraField found",
  );
});
