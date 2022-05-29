import { DryType, UnDryType } from "./drytype";

export type dtObj = { [_: string]: DryType<unknown> };

export type dtObjStatic<O extends dtObj> = {
  [K in keyof O]: UnDryType<O[K]>;
};

// typeof null is object, which is misleading, so just say null when null
export const properType = (v: unknown) => (v == null ? v : typeof v);

export type ValidationResult = {
  success: boolean;
  message?: string;
  in?: string;
};

export const isArray = Array.isArray;
