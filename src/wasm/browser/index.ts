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

/** Loads and instantiates `buildRegex` function
 *
 * @example
 * import { load, BuildRegex } from "grex.js";
 * const buildRegex: BuildRegex = await load();
 * @example
 * import { load, BuildRegex } from "grex.js";
 * (async (): void => {
 *   const buildRegex: BuildRegex = await load();
 * })();
 * @type {Load}
 * @returns {Promise<BuildRegex>} returns `Promise` with imported and instantiated `buildRegex` function
 */
export const load: Load = async (): Promise<BuildRegex> => {
  return (await ((await import("../native/pkg-browser")) as Promise<GrexJS>))
    .buildRegex;
};

export default load;
