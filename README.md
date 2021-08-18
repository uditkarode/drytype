# drytype

DryType is a runtime type-validation library with TypeScript in mind.

Runtime type validations are performed with a runtime type -- a `DryType` as
I've called it throughout this library (beats me why).

A DryType is an object of the type:

```typescript
export type DryType<T> = {
  validate(param: unknown): ValidationResult;
  // will throw if check fails
  strictValidate(
    param: unknown,
  ): ValidationResult;
  guard(param: unknown): param is T;
  // will throw if check fails
  strictGuard(param: unknown): param is T;
  toString(): string;

  intersect<S>(dt: DryType<S>): DryType<T & S>;
  union<S>(dt: DryType<S>): DryType<T | S>;

  tag: string;
};

type ValidationResult = {
  success: boolean;
  message?: string;
  in?: string;
};
```

Might look fancy, but it's actually pretty simple.

`validate(param: unknown)` is used to check if a value `param` confirms to the
type specification of that `DryType`, for example

```typescript
import { String } from "drytype";

String.validate("hello"); // { success: true }
String.validate(20); // { success: false, message: "expected: string, got: number" }
```

`strictValidate` is the same as `validate`, with one big difference: when the
validation fails, instead of returning a ValidationResult object, it throws a
ValidationError(message)`.

`guard` and `strictGuard` are the same as `validate` and `strictValidate`, with
the difference being that they are TypeScript guards instead of regular boolean
returning functions.

`union` is the same as TypeScript `|`. `A.union(B)` returns a new DryType, which
now checks if either A or B succeed. For example,

```typescript
import { Number, String } from "drytype";

String.union(Number).validate(10); // { success: true }
```

`intersect` is the same as TypeScript `&`. `A.intersect(B)` returns a new
DryType, which now checks if both A and B succeed. For example,

```typescript
import { NumberGreaterThan, NumberLessThan } from "drytype";

// a number between between 5 and 10
NumberGreaterThan(5).intersect(NumberLessThan(10)).validate(7); // { success: true }
```

That covers what a DryType is composed of. A set of useful DryTypes have been
provided by default in the
[modules](https://github.com/uditkarode/drytype/tree/master/modules) directory
for convenience. However, creating a new DryType is also very easy.

To create a new DryType, you can use `makeDryType`, which has the type:

```typescript
const makeDryType = <T>(
  validator: (x: unknown) => ValidationResult,
  tag = "unknown",
): DryType<T>
```

Here's an example:

```typescript
export const Function = makeDryType<Function>(
  (x) => typeof x == "function" ? { success: true } : { success: false },
  "function",
);
```

The generic type parameter is the type that the validated value should be of.
This is used for TypeScript guards. The first parameter is a function that takes
`x: unknown` and validates it. This function has to return a `ValidationResult`
object, where `success: boolean` is a compulsory field. The `message` field will
never be used if `success` is `true`, so you can skip it if `success` is `true`.
However, if `success` is `false`, and you still skip the `message` field, a
default message will be used, which is:

```typescript
`expected: ${drytypeInQuestion.tag}, got: ${typeof (unknownParam)}${
  result.in == undefined ? "" : `, in: ${result.in}`
}`;
```

The only use of the `in` parameter in `ValidationResult` is to be inserted this
way into the default error message. This can be useful for, say, Records where
you need to give out additional information about where the validation failed.

**NOTE**: Also have a look at the
[tests](https://github.com/uditkarode/drytype/tree/master/tests) for an example
usage. Every provided DryType has at least one test present.

That's all you need to know to use this library. Happy validatin'!
