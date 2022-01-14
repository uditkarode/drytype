import { DryType, UnDryType } from "./drytype.ts";

export type dtObj = { [_: string]: DryType<unknown> };

export type dtObjStatic<O extends dtObj> = {
  [K in keyof O]: UnDryType<O[K]>;
};

export type ValidationResult = {
  success: boolean;
  message?: string;
  in?: string;
};

export const isArray = Array.isArray;
