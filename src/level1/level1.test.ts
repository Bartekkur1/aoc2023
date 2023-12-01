import { describe, expect, it } from "vitest";
import { replaceStrToNum } from "./solution";

describe("level1", () => {
  it("Should correctly process input", () => {
    const input = {
      "two1nine": 29,
      "eightwothree": 83,
      "abcone2threexyz": 13,
      "xtwone3four": 24,
      "4nineeightseven2": 42,
      "zoneight234": 14,
      "7pqrstsixteen": 76
    };
    for (const key in input) {
      const res = replaceStrToNum(key);
      expect(Number(res[0] + res[res.length - 1]).toString()).toBe(input[key].toString());
    }
  });
});