import type {
  Config,
  GrexJS,
  BuildRegex,
  ConversionOf,
  ConversionOfEnum,
  Load,
} from "../../types-wasm";
export type {
  Config,
  GrexJS,
  BuildRegex,
  ConversionOf,
  ConversionOfEnum,
  Load,
};

export const load: Load = async (): Promise<BuildRegex> => {
  return (await ((await import("../native/pkg-browser")) as Promise<GrexJS>))
    .buildRegex;
};

export default load;
