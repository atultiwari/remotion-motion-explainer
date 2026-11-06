import { describe, expect, it } from "vitest";
import { cueFrame, findWordMs, normWord, resolveWordCues } from "../src/lib/cues";

const words = [
  { text: "Ten", startMs: 1000 },
  { text: "degrees,", startMs: 1400 },
  { text: "then", startMs: 2000 },
  { text: "fifty.", startMs: 4000 },
  { text: "Intermarché", startMs: 5000 },
  { text: "fifty", startMs: 6000 },
];

describe("word cues", () => {
  it("normalises accents and punctuation", () => {
    expect(normWord("Intermarché,")).toBe("intermarche");
  });
  it("finds the nth matching word", () => {
    expect(findWordMs(words, "fifty")).toBe(4000);
    expect(findWordMs(words, "fifty", 2)).toBe(6000);
    expect(findWordMs(words, "intermarche")).toBe(5000);
    expect(findWordMs(words, "absent")).toBeNull();
  });
  it("resolves nested cues without mutating the input", () => {
    const props = { keyframes: [{ at: 0, temp: 4 }, { atWord: "fifty", temp: 50 }], label: "x" };
    const frozen = JSON.parse(JSON.stringify(props));
    const out = resolveWordCues(props, words, 8000, () => {}) as typeof props & { keyframes: { at: number }[] };
    expect(out.keyframes[1].at).toBeCloseTo(0.5, 5);
    expect(props).toEqual(frozen);
  });
  it("reports missing words and leaves them unresolved", () => {
    const missing: string[] = [];
    const out = resolveWordCues({ c: { atWord: "nope" } }, words, 8000, (w) => missing.push(w)) as { c: { at?: number } };
    expect(missing).toEqual(["nope"]);
    expect(out.c.at).toBeUndefined();
  });
  it("applies offsets and clamps to the scene", () => {
    const out = resolveWordCues({ c: { atWord: "ten", offsetSec: -5 } }, words, 8000, () => {}) as { c: { at: number } };
    expect(out.c.at).toBe(0);
  });
  it("converts a cue to a frame with fallback", () => {
    expect(cueFrame({ at: 0.5 }, 0.1, 300)).toBe(150);
    expect(cueFrame(undefined, 0.1, 300)).toBe(30);
  });
});
