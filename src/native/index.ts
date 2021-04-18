import grexJSAddon from "./native/index.node";
import {
  ConversionOfEnum,
  ConversionOf,
  BuildRegex,
  GrexJS,
  Config,
} from "../types-native";
export type { ConversionOfEnum, ConversionOf, BuildRegex, GrexJS, Config };

/**  GrexJS wrapper */
const grexJS: GrexJS = grexJSAddon as GrexJS;

/**
 * Basic function to build Regex based on input array
 *
 * @example
 * const regex: string = buildRegex(["a", "aa", "aaa"]);
 * console.log(regex); // "^a(?:aa?)?$"
 * @param {Array<ConversionOf | ConversionOfEnum>} testCaces
 * @param {Config} config
 * @returns {string} Returns regular expresion.
 */
export const buildRegex: BuildRegex = grexJS.buildRegex;

export default grexJS;
