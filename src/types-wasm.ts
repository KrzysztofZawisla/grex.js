import type {
  ConversionOfEnum,
  ConversionOf,
  BuildRegex,
  Config,
  GrexJS,
} from "./types";
export type { ConversionOfEnum, ConversionOf, BuildRegex, Config, GrexJS };

/** Load function type  */
export type Load = () => Promise<BuildRegex>;
