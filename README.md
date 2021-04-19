# Grex.js

## About

Grex.js is a library that bindings Rust grex library to Node.js and to the browser.

Original library: <https://github.com/pemistahl/grex>.

Grex.js has built-in TypeScript support.

## Installation

Via npm:

```sh
npm i grex.js
```

Via yarn:

```sh
yarn add grex.js
```

Via pnpm:

```sh
pnpm i grex.js
```

## Usage

### With wasm module for browser

#### Import

```ts
import { load } from "grex.js";
// or
import grexJS from "grex.js";
// or
import { GrexJS } from "grex.js";
const grexJS: GrexJS = require("grex.js");
// or
import { GrexJS } from "grex.js";
const { load }: GrexJS = require("grex.js");
// or
import { GrexJS } from "grex.js";
const grexJS: GrexJS = await import("grex.js");
// or
import { GrexJS } from "grex.js";
const { load }: GrexJS = await import("grex.js");
```

Import for JavaScript targets other than UMD or ES modules:

```ts
"grex.js/lib/wasm/browser/index.(amd|commonjs|system).js";
```

### Function instantiation

With top level await:

```ts
import { load, BuildRegex } from "grex.js";
const buildRegex: BuildRegex = await load();
```

Without top level await:

```ts
import { load, BuildRegex } from "grex.js";
(async (): void => {
  const buildRegex: BuildRegex = await load();
})();
```

### Usage with wasm module for node

Import system is the same as wasm module for browser. You have to change `"grex.js"` in import statment to `"grex.js/lib/wasm/node"`.

Also works with `amd, commonjs and system` library targets.

Function instantiation has the same logic as version for the browser.

### Usage with native module for node

MacOS, Linux and Windows support:  
NodeJS version equal or higher than: `14`.

Import:

```ts
import { buildRegex } from "grex.js/lib/native";
// or
import grexJS from "grex.js/lib/native";
// or
import { GrexJS } from "grex.js/lib/native";
const grexJS: GrexJS = require("grex.js/lib/native");
// or
import { GrexJS } from "grex.js/lib/native";
const { buildRegex }: GrexJS = require("grex.js/lib/native");
// or
import { GrexJS } from "grex.js/lib/native";
const grexJS: GrexJS = await import("grex.js/lib/native");
// or
import { GrexJS } from "grex.js/lib/native";
const { buildRegex }: GrexJS = await import("grex.js/lib/native");
```

Also works with `amd, commonjs and system` library targets.

## API Reference

```ts
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

/** Load function type  */
export type Load = () => Promise<BuildRegex>; // avaible only in wasm module

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
export (default) const load: Load = async () => Promise<BuildRegex>; // avaible only in wasm module

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
export const buildRegex: BuildRegex = grexJS.buildRegex;

/**  GrexJS wrapper */
export default grexJS: GrexJS;
```
