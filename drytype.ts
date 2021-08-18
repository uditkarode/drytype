import { ValidationError } from "./validation-error.ts";
import { ValidationResult } from "./utils.ts";

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

const validatorGetter = (
  validator: (x: unknown) => ValidationResult,
  tag: string,
  strict = false,
) =>
  (x: unknown): ValidationResult => {
    const result = validator(x);

    if (result.success) return { success: true };
    else {
      const message = result.message ??
        `expected: ${tag}, got: ${typeof (x)}${
          result.in == undefined ? "" : `, in: ${result.in}`
        }`;

      if (strict) {
        throw new ValidationError(message);
      } else {
        return { success: false, message: message };
      }
    }
  };

export const makeDryType = <T>(
  validator: (x: unknown) => ValidationResult,
  tag = "unknown",
): DryType<T> => {
  return {
    validate: validatorGetter(validator, tag, false),
    strictValidate: validatorGetter(validator, tag, true),
    guard: (param: unknown): param is T => validator(param).success,
    strictGuard: (param: unknown): param is T =>
      validatorGetter(validator, tag, true)(param).success,
    tag: tag,
    toString: () => `DryType<${tag}>`,
    intersect: <S>(dt: DryType<S>) => {
      return makeDryType<S & T>((x) => {
        const o = validator(x);
        const n = dt.validate(x);

        if (!o.success && !n.success) {
          // both failed
          return {
            success: false,
            message: `expected: ${tag} & ${dt.tag}, got: ${
              x == null ? x : typeof x
            }`,
          };
        } else if (!o.success && n.success) {
          // new passed
          return {
            success: false,
            message: o.message,
          };
        } else if (o.success && !n.success) {
          // original passed
          return {
            success: false,
            message: n.message,
          };
        }

        // both passed
        return { success: true };
      }, `${tag} & ${dt.tag}`);
    },
    union: <S>(dt: DryType<S>) => {
      return makeDryType<S | T>((x) => {
        const o = validator(x);
        const n = dt.validate(x);

        if (!o.success && !n.success) {
          // both failed
          return {
            success: false,
            message: `expected: ${tag} | ${dt.tag}, got: ${
              x == null ? x : typeof x
            }`,
          };
        }

        // either or both passed
        return { success: true };
      }, `${tag} | ${dt.tag}`);
    },
  };
};

export type UnDryType<T> = T extends DryType<infer U> ? U : never;
