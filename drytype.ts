import { ValidationError } from "./validation-error";
import { ValidationResult } from "./utils";

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
  /*
    errorFrom refers to whether the error from the
    first type, second type, or the default one is
    to be thrown.

    when this is 0 or undefined, the default error is used
    when this is 1, the 'left' error is used
    when this is 2 (or any other value), the 'right' error is used
  */
  union<S>(dt: DryType<S>, errorFrom?: number): DryType<T | S>;

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

        if (!o.success && n.success) {
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
    union: <S>(dt: DryType<S>, errorFrom?: number) => {
      return makeDryType<S | T>((x) => {
        const o = validator(x);
        const n = dt.validate(x);

        if (!o.success && !n.success) {
          // both failed
          const defaultError = `expected: ${tag} | ${dt.tag}, got: ${
            x == null ? x : typeof x
          }`;
          return {
            success: false,
            message: errorFrom == 0 || errorFrom == undefined
              ? defaultError
              : errorFrom == 1
              ? o.message ?? defaultError
              : n.message ?? defaultError,
          };
        }

        // either or both passed
        return { success: true };
      }, `${tag} | ${dt.tag}`);
    },
  };
};

export type UnDryType<T> = T extends DryType<infer U> ? U : never;
