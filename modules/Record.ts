import { makeDryType } from "../drytype";
import { dtObj, dtObjStatic } from "../utils";

function isProperObject(x: unknown): x is Record<string, unknown> {
  return (x != null && typeof x == "object");
}

/**
 * Validates that a value validates with
 * a given object, with no extra keys
 * being permitted
 *
 * @param structure the template object
 * @returns an ExactRecord DryType
 */
export const ExactRecord = <T extends dtObj>(structure: dtObj) => {
  return makeDryType<dtObjStatic<T>>((target) => {
    const x = Object.assign({}, target);
    if (isProperObject(x) && x != null) {
      const targetLength = Object.keys(x).length;
      const structureLength = Object.keys(structure).length;

      if (targetLength > Object.keys(structure).length) {
        return {
          success: false,
          message:
            `expected target to have at most ${structureLength} items, had ${targetLength}`,
        };
      }

      for (const [k, v] of Object.entries(structure)) {
        const result = v.validate(x[k]);
        if (!result.success) {
          return {
            success: false,
            in: k,
            message: `expected: ${v.tag}, got: ${
              x[k] == null ? x[k] : typeof (x[k])
            }, in: ${k}`,
          };
        } else delete x[k];
      }

      const newKeys = Object.keys(x);

      if (newKeys.length > 0) {
        return {
          success: false,
          message: `Extra parameter ${newKeys[0]} found`,
        };
      }

      return { success: true };
    } else {
      return {
        success: false,
        message: `expected object, received ${x == null ? x : typeof (x)}`,
      };
    }
  }, "object");
};

/**
 * Validates that a value validates with
 * the given template object, with additional
 * keys being permitted
 *
 * @param structure the template object
 * @returns a record DryType
 */
export const Record = <T extends dtObj>(structure: dtObj) => {
  return makeDryType<dtObjStatic<T>>((x) => {
    if (isProperObject(x) && x != null) {
      for (const [k, v] of Object.entries(structure)) {
        const result = v.validate(x[k]);
        if (!result.success) {
          return {
            success: false,
            message: `expected: ${v.tag}, got: ${
              x[k] == null ? x[k] : typeof (x[k])
            }, in: ${k}`,
          };
        }
      }
      return { success: true };
    } else {
      return { success: false };
    }
  }, "object");
};

/**
 * Validates that a given value validates
 * with at least one key that the template
 * object contains
 *
 * @param structure the template object
 * @returns a partial record DryType
 */
export const PartialRecord = <T extends dtObj>(structure: dtObj) => {
  return makeDryType<dtObjStatic<T>>((x) => {
    if (isProperObject(x) && x != null) {
      let someValidated = false;

      for (const [k, v] of Object.entries(structure)) {
        const result = v.validate(x[k]);
        if (!result.success) {
          return {
            success: false,
            message: `expected: ${v.tag}, got: ${
              x[k] == null ? x[k] : typeof (x[k])
            }, in: ${k}`,
          };
        } else someValidated = true;
      }

      if (!someValidated) {
        return {
          success: false,
          message:
            `expected at least 1 passing element from template, got none`,
        };
      }
      return { success: true };
    } else {
      return { success: false, message: `expected: object, got: ${x}` };
    }
  }, "object");
};
