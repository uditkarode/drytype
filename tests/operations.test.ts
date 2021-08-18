import { String } from "../modules/primitives/String.ts";
import { ExactString } from "../modules/StringExtensions.ts";
import { ExactRecord, Record } from "../modules/Record.ts";
import { Undefined } from "../modules/primitives/Undefined.ts";
import { ValidationError } from "../validation-error.ts";
import { assertThrows } from "https://deno.land/std@0.100.0/testing/asserts.ts";

// Union
Deno.test("Union Left", () => {
  String.union(Undefined).strictValidate("hey!");
});

Deno.test("Union Right", () => {
  String.union(Undefined).strictValidate(undefined);
});

Deno.test("ExactRecord Union", () => {
  ExactRecord({ one: String }).union(ExactRecord({ two: String }))
    .strictValidate({ two: "two" });
});

Deno.test("ExactString Union", () => {
  ExactString("One").union(ExactString("Two")).union(ExactString("Three"))
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

// Intersection
Deno.test("Intersection", () => {
  Record({ greeting: String }).intersect(Record({ farewell: String }))
    .strictValidate({
      greeting: "Hey!",
      farewell: "Bye!",
    });
});

Deno.test("Throwing Intersection", () => {
  assertThrows(
    () => {
      Record({ greeting: String }).intersect(Record({ farewell: String }))
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
      Record({ greeting: String }).intersect(Record({ farewell: String }))
        .strictValidate({
          nogreeting: "Hey!",
          farewell: "Bye!",
        });
    },
    ValidationError,
    "expected: string, got: undefined, in: greeting",
  );
});
