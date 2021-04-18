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

## API Reference

```ts
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

// Avaible only in wasm version
export type Load = () => Promise<BuildRegex>;

// Avaible only in wasm version
export default load: Load;

// Avaible only in native version
export default grexJS: GrexJS;

// Avaible only in native version
export const buildRegex: BuildRegex;
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
"grex.js/wasm/browser/index.(amd|commonjs|system).js";
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

Import system is the same as wasm module for browser. You have to change `"grex.js"` in import statment to `"grex.js/wasm/node"`.

Also works with `amd, commonjs and system` library targets.

Function instantiation has the same logic as version for the browser.

### Usage with native module for node

Import:

```ts
import { buildRegex } from "grex.js/native";
// or
import grexJS from "grex.js/native";
// or
import { GrexJS } from "grex.js/native";
const grexJS: GrexJS = require("grex.js/native");
// or
import { GrexJS } from "grex.js/native";
const { buildRegex }: GrexJS = require("grex.js/native");
// or
import { GrexJS } from "grex.js/native";
const grexJS: GrexJS = await import("grex.js/native");
// or
import { GrexJS } from "grex.js/native";
const { buildRegex }: GrexJS = await import("grex.js/native");
```

Also works with `amd, commonjs and system` library targets.
