import { String } from "../modules/primitives/String.ts";
import { ExactString } from "../modules/StringExtensions.ts";
import { ExactRecord, Record } from "../modules/Record.ts";
import { Undefined } from "../modules/primitives/Undefined.ts";
import { ValidationError } from "../validation-error.ts";
import { makeDryType } from "../drytype.ts";
import { assertThrows } from "https://deno.land/std@0.100.0/testing/asserts.ts";

// Union
Deno.test("Union Left", () => {
  String.union(Undefined).strictValidate("hey!");
});

Deno.test("Union Right", () => {
  String.union(Undefined).strictValidate(undefined);
});

Deno.test("ExactRecord Union", () => {
  ExactRecord({ one: String })
    .union(ExactRecord({ two: String }))
    .strictValidate({ two: "two" });
});

Deno.test("ExactString Union", () => {
  ExactString("One")
    .union(ExactString("Two"))
    .union(ExactString("Three"))
    .strictValidate("Three");
});

Deno.test("Throwing Union", () => {
  assertThrows(
    () => {
      String.union(Undefined).strictValidate(10);
    },
    ValidationError,
    "expected: string | undefined, got: number",
  );
});

const makeCustomErrDt = (str: string, tag: string) =>
  makeDryType<string>(
    (x) =>
      typeof x == "string"
        ? { success: true }
        : { success: false, message: str },
    tag,
  );

Deno.test("Throwing Union Custom Message Left", () => {
  assertThrows(
    () => {
      makeCustomErrDt("Hohoho!", "CustomStrOne")
        .union(Undefined, 1)
        .strictValidate(10);
    },
    ValidationError,
    "Hohoho!",
  );
});

Deno.test("Throwing Union Custom Message Right", () => {
  assertThrows(
    () => {
      Undefined.union(
        makeCustomErrDt("Custom two!", "CustomStrTwo"),
        2,
      ).strictValidate(10);
    },
    ValidationError,
    "Custom two!",
  );
});

// Intersection
Deno.test("Intersection", () => {
  Record({ greeting: String })
    .intersect(Record({ farewell: String }))
    .strictValidate({
      greeting: "Hey!",
      farewell: "Bye!",
    });
});

Deno.test("Throwing Intersection Right", () => {
  assertThrows(
    () => {
      Record({ greeting: String })
        .intersect(Record({ farewell: String }))
        .strictValidate({
          greeting: "Hey!",
          nofarewell: "Bye!",
        });
    },
    ValidationError,
    "expected: string, got: undefined, in: farewell",
  );
});

Deno.test("Throwing Intersection Left", () => {
  assertThrows(
    () => {
      Record({ greeting: String })
        .intersect(Record({ farewell: String }))
        .strictValidate({
          nogreeting: "Hey!",
          farewell: "Bye!",
        });
    },
    ValidationError,
    "expected: string, got: undefined, in: greeting",
  );
});

Deno.test("Throwing Intersection Both Invalid", () => {
  assertThrows(
    () => {
      Record({ greeting: String })
        .intersect(Record({ farewell: String }))
        .strictValidate({
          nogreeting: "Hey!",
          nofarewell: "Bye!",
        });
    },
    ValidationError,
    "expected: string, got: undefined, in: greeting",
  );
});
