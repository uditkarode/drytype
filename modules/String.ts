import { makeDryType, UnDryType } from "../drytype.ts";

const DryString = makeDryType<string>((x) => typeof x == "string");

type topkek = UnDryType<typeof DryString>;
