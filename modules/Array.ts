import { DryType, makeDryType } from "../drytype.ts";
import { isArray } from "../utils.ts";

export const Array = makeDryType<unknown[]>((x) => {
  if (typeof (x) == "object") {
    if (isArray(x)) return { success: true };
    else {
      return {
        success: false,
        message: `expected: array, got: ${x == null ? x : "object"}`,
      };
    }
  } else {
    return {
      success: false,
      message: `expected: array, got: ${x == null ? x : typeof (x)}`,
    };
  }
}, "array");

export const Tuple = <S extends DryType<unknown>[]>(tt: S) =>
  makeDryType<S>((x) => {
    if (typeof (x) == "object" && isArray(x)) {
      for (let i = 0; i < tt.length; i++) {
        const validated = tt[i].validate(x[i]);

        if (!validated.success) {
          return {
            success: false,
            message: `tuple contains unexpected: ${
              x[i] == null ? null : typeof (x[i])
            }, expected: ${tt[i].tag}, index: ${i}`,
          };
        }
      }

      return { success: true };
    } else return { success: false };
  }, "tuple");

export const ArrayOf = <S>(dt: DryType<S>) =>
  makeDryType<S[]>((x) => {
    if (typeof (x) == "object") {
      if (isArray(x)) {
        for (let i = 0; i < x.length; i++) {
          const v = x[i];
          if (!dt.validate(v).success) {
            return {
              success: false,
              message: `array contains unexpected: ${
                v == null ? v : typeof (v)
              }, expected: ${dt.tag}, index: ${i}`,
            };
          }
        }

        return { success: true };
      } else {
        return {
          success: false,
          message: `expected: array, got: ${x == null ? x : "object"}`,
        };
      }
    } else {
      return {
        success: false,
        message: `expected: array, got: ${x == null ? x : typeof (x)}`,
      };
    }
  }, `array<${dt.tag}>`);
