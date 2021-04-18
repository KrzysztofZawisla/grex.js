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

export type BuildRegex = (testCaces: string[], config?: Config) => string;

/**  GrexJS wrapper interface */
export interface GrexJS {
  /**
   * Basic function to build Regex based on input array
   *
   * @example
   * const regex: string = buildRegex(["a", "aa", "aaa"]);
   * console.log(regex); // "^a(?:aa?)?$"
   * @param {Array<ConversionOf | ConversionOfEnum>} testCaces
   * @param {Config} config
   * @returns {string} Returns regular expresion
   */
  buildRegex: BuildRegex;
}

/** Config type */
export interface Config {
  conversionOf?: (ConversionOf | ConversionOfEnum)[];
  minimumRepetitions?: number;
  syntaxHighlighting?: boolean;
  escapedNonASCIIChars?: boolean;
  surrogatePairs?: boolean;
  minimumSubstringLength?: number;
}
