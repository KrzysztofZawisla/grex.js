/** Enum of available options in param: `conversionOf` of `config` argument
 *
 * @example
 * const regex: string = buildRegex(["a", "aa", "123"], {
 *  conversionOf: [ConversionOfEnum.Digit, ConversionOfEnum.Word]
 * });
 */
export const enum ConversionOfEnum {
  Digit = "digit",
  NoDigit = "noDigit",
  Space = "space",
  NoSpace = "noSpace",
  Word = "word",
  NoWord = "noWord",
  Repetition = "repetition",
  CaseInsensitivity = "caseInsensitivity",
  CapturingGroup = "capturingGroup",
}

/** Type of `conversionOf` param of the `config` argument
 *
 * @see Config, buildRegex, BuildRegex
 */
export type ConversionOf =
  | "digit"
  | "noDigit"
  | "space"
  | "noSpace"
  | "word"
  | "noWord"
  | "repetition"
  | "caseInsensitivity"
  | "capturingGroup";

/** Type of `buildRegex` function
 *
 * @see buildRegex
 */
export type BuildRegex = (testCaces: string[], config?: Config) => string;

/**  GrexJS wrapper interface */
export interface GrexJS {
  /**
   * Function to build Regex based on input array
   *
   * @example
   * const regex: string = buildRegex(["a", "aa", "aaa"]);
   * console.log(regex); // "^a(?:aa?)?$"
   * @param {Array<ConversionOf | ConversionOfEnum>} testCaces
   * @param {Config} config
   * @returns {string} Returns regular expresion
   * @type {BuildRegex}
   * @see @link https://github.com/pemistahl/grex#52--the-library-top-
   */
  buildRegex: BuildRegex;
}

/** Config type
 *
 * @see buildRegex BuildRegex
 * @see @link https://github.com/pemistahl/grex#52--the-library-top-
 */
export interface Config {
  /**
   * @see @link https://github.com/pemistahl/grex#52--the-library-top-
   */
  conversionOf?: (ConversionOf | ConversionOfEnum)[];
  /**
   * @see @link https://github.com/pemistahl/grex#523-convert-repeated-substrings
   */
  minimumRepetitions?: number;
  /**
   * @see @link https://github.com/pemistahl/grex#528-syntax-highlighting
   */
  syntaxHighlighting?: boolean;
  /**
   * @see @link https://github.com/pemistahl/grex#524-escape-non-ascii-characters
   */
  escapedNonASCIIChars?: boolean;
  /**
   * @see @link https://github.com/pemistahl/grex#524-escape-non-ascii-characters
   */
  surrogatePairs?: boolean;
  /**
   * @see @link https://github.com/pemistahl/grex#523-convert-repeated-substrings
   */
  minimumSubstringLength?: number;
}
