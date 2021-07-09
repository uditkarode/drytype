import { ValidationError } from "../validation-error.ts";

import {
  BigInt,
  BigIntGreaterThan,
  BigIntLesserThan,
  ExactBigInt,
} from "../modules/primitives/BigInt.ts";
import { Boolean, ExactBoolean } from "../modules/primitives/Boolean.ts";
import { Function } from "../modules/primitives/Function.ts";
import {
  ExactNumber,
  Number,
  NumberGreaterThan,
  NumberLesserThan,
} from "../modules/primitives/Number.ts";
import { Object } from "../modules/primitives/Object.ts";
import { String } from "../modules/primitives/String.ts";
import { CommaSepOneOf, ExactString } from "../modules/StringExtensions.ts";
import { Symbol as DrySymbol } from "../modules/primitives/Symbol.ts";
import { Undefined } from "../modules/primitives/Undefined.ts";
import { assertThrows } from "https://deno.land/std@0.100.0/testing/asserts.ts";

// BigInt
Deno.test("BigInt", () => {
  BigInt.strictValidate(10n);
});

Deno.test("Throwing BigInt", () => {
  assertThrows(
    () => {
      BigInt.strictValidate("hello");
    },
    ValidationError,
    "expected: bigint, got: string",
  );
});

Deno.test("ExactBigInt", () => {
  ExactBigInt(10n).strictValidate(10n);
});

Deno.test("Throwing ExactBigInt", () => {
  assertThrows(
    () => {
      ExactBigInt(10n).strictValidate(11n);
    },
    ValidationError,
    "expected: 10n, got: 11n",
  );
});

Deno.test("BigIntGreaterThan", () => {
  BigIntGreaterThan(100n).strictValidate(200n);
});

Deno.test("Throwing BigIntGreaterThan", () => {
  assertThrows(
    () => {
      BigIntGreaterThan(100n).strictValidate(10n);
    },
    ValidationError,
    "expected bigint greater than: 100n, got: 10n",
  );
});

Deno.test("BigIntLesserThan", () => {
  BigIntLesserThan(100n).strictValidate(10n);
});

Deno.test("Throwing BigIntLesserThan", () => {
  assertThrows(
    () => {
      BigIntLesserThan(100n).strictValidate(200n);
    },
    ValidationError,
    "expected bigint lesser than: 100n, got: 200n",
  );
});

// Boolean
Deno.test("Boolean", () => {
  Boolean.strictValidate(true);
});

Deno.test("Throwing Boolean", () => {
  assertThrows(
    () => {
      Boolean.strictValidate("hello");
    },
    ValidationError,
    "expected: boolean, got: string",
  );
});

Deno.test("ExactBoolean", () => {
  ExactBoolean(true).strictValidate(true);
});

Deno.test("Throwing ExactBoolean", () => {
  assertThrows(
    () => {
      ExactBoolean(true).strictValidate(false);
    },
    ValidationError,
    "expected: true, got: false",
  );
});

// Function
Deno.test("Function", () => {
  Function.strictValidate((x: number) => x + 2);
});

Deno.test("Throwing Function", () => {
  assertThrows(
    () => {
      Function.strictValidate("hello");
    },
    ValidationError,
    "expected: function, got: string",
  );
});

// Number
Deno.test("Number", () => {
  Number.strictValidate(10);
});

Deno.test("Throwing Number", () => {
  assertThrows(
    () => {
      Number.strictValidate("hello");
    },
    ValidationError,
    "expected: number, got: string",
  );
});

Deno.test("ExactNumber", () => {
  ExactNumber(10).strictValidate(10);
});

Deno.test("Throwing ExactNumber", () => {
  assertThrows(
    () => {
      ExactNumber(10).strictValidate(15);
    },
    ValidationError,
    "expected: 10, got: 15",
  );
});

Deno.test("NumberGreaterThan", () => {
  NumberGreaterThan(100).strictValidate(200);
});

Deno.test("Throwing NumberGreaterThan", () => {
  assertThrows(
    () => {
      NumberGreaterThan(100).strictValidate(10);
    },
    ValidationError,
    "expected number greater than: 100, got: 10",
  );
});

Deno.test("NumberLesserThan", () => {
  NumberLesserThan(100).strictValidate(10);
});

Deno.test("Throwing NumberLesserThan", () => {
  assertThrows(
    () => {
      NumberLesserThan(100).strictValidate(200);
    },
    ValidationError,
    "expected number lesser than: 100, got: 200",
  );
});

// Object
Deno.test("Object", () => {
  Object.strictValidate({});
});

Deno.test("Throwing Object", () => {
  assertThrows(
    () => {
      Object.strictValidate("hello");
    },
    ValidationError,
    "expected: object, got: string",
  );
});

// String
Deno.test("String1", () => {
  String.strictValidate("hello");
});

Deno.test("Throwing String", () => {
  assertThrows(
    () => {
      String.strictValidate(10);
    },
    ValidationError,
    "expected: string, got: number",
  );
});

Deno.test("ExactString Equality", () => {
  ExactString("HeyThere").strictValidate("HeyThere");
});

Deno.test("ExactString Inequality", () => {
  assertThrows(
    () => {
      ExactString("HeyThere").strictValidate("NayThere");
    },
    ValidationError,
    "expected string to be: HeyThere, got: NayThere",
  );
});

Deno.test("CommaSepOneOf", () => {
  CommaSepOneOf(["abc", "def", "ghi", "jkl"]).strictValidate(
    "ghi,def,jkl,abc,ghi,abc,jkl",
  );
});

Deno.test("Throwing CommaSepOneOf", () => {
  assertThrows(
    () => {
      CommaSepOneOf(["abc", "def", "ghi", "jkl"]).strictValidate(
        "ghi,def,mno,abc,def",
      );
    },
    ValidationError,
    "expected: one of [abc,def,ghi,jkl], got: mno",
  );
});

// Symbol
Deno.test("Symbol", () => {
  DrySymbol.strictValidate(Symbol(10));
});

Deno.test("Throwing Symbol", () => {
  assertThrows(
    () => {
      DrySymbol.strictValidate("hello");
    },
    ValidationError,
    "expected: symbol, got: string",
  );
});

// Undefined
Deno.test("Undefined", () => {
  Undefined.strictValidate(undefined);
});

Deno.test("Throwing Undefined", () => {
  assertThrows(
    () => {
      Undefined.strictValidate("hello");
    },
    ValidationError,
    "expected: undefined, got: string",
  );
});
