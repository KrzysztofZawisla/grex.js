import grexJS, { GrexJS, buildRegex, BuildRegex } from ".";
import { expectType } from "tsd";

describe("grex.js", (): void => {
  it("Default export has correct type", (): void => {
    expectType<GrexJS>(grexJS);
  });
  it("buildRegex function has correct type", (): void => {
    expectType<BuildRegex>(buildRegex);
  });
  it("Default export has correct structure", (): void => {
    expect(grexJS?.buildRegex).toBeDefined();
  });
  it("buildRegex export is defined", (): void => {
    expect(buildRegex).toBeDefined();
  });
  it("Returns correct RegEx without config", (): void => {
    const regex: string = buildRegex(["a", "aa", "aaa"]);
    expect(regex).toBe("^a(?:aa?)?$");
  });
  it("Returns correct RegEx with convert to character classes", (): void => {
    const regex: string = buildRegex(["a", "aa", "123"], {
      conversionOf: ["digit", "word"],
    });
    expect(regex).toBe("^(?:\\d\\d\\d|\\w(?:\\w)?)$");
  });
  it("Returns correct RegEx with convert repeated substrings", (): void => {
    const regex: string = buildRegex(["aa", "bcbc", "defdefdef"], {
      conversionOf: ["repetition"],
    });
    expect(regex).toBe("^(?:a{2}|(?:bc){2}|(?:def){3})$");
  });
  it("Returns correct RegEx with convert repeated substrings with minimum substrings lenght equals 2", (): void => {
    const regex: string = buildRegex(["aa", "bcbc", "defdefdef"], {
      conversionOf: ["repetition"],
      minimumSubstringLength: 2,
    });
    expect(regex).toBe("^(?:aa|(?:bc){2}|(?:def){3})$");
  });
  it("Returns correct RegEx with escape non-ascii characters", (): void => {
    const regex: string = buildRegex(["You smell like 💩."], {
      escapedNonASCIIChars: true,
    });
    expect(regex).toBe("^You smell like \\u{1f4a9}\\.$");
  });
  it("Returns correct RegEx with escape non-ascii characters and conversion to surrogate pairs", (): void => {
    const regex: string = buildRegex(["You smell like 💩."], {
      escapedNonASCIIChars: true,
      surrogatePairs: true,
    });
    expect(regex).toBe("^You smell like \\u{d83d}\\u{dca9}\\.$");
  });
  it("Returns correct RegEx with minimum repetitions equals 2", (): void => {
    const regex: string = buildRegex(["aa", "bcbc", "defdefdef"], {
      conversionOf: ["repetition"],
      minimumRepetitions: 2,
    });
    expect(regex).toBe("^(?:bcbc|aa|(?:def){3})$");
  });
  it("Returns correct RegEx with case-insensitive matching", (): void => {
    const regex: string = buildRegex(["big", "BIGGER"], {
      conversionOf: ["caseInsensitivity"],
    });
    expect(regex).toBe("(?i)^big(?:ger)?$");
  });
  it("Returns correct RegEx with capturing groups", (): void => {
    const regex: string = buildRegex(["big", "BIGGER"], {
      conversionOf: ["caseInsensitivity", "capturingGroup"],
    });
    expect(regex).toBe("(?i)^big(ger)?$");
  });
});
