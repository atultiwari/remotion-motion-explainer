import { describe, expect, it } from "vitest";
import {
  MIN_SCENE_SEC, TAIL_PAD_SEC, countWords, estimateCues, estimateSeconds, keyframeValue,
  sceneFrames, splitEvenly, splitIntoChunks,
} from "../src/lib/timing";

describe("sceneFrames", () => {
  it("uses audio duration plus tail padding when audio exists", () => {
    expect(sceneFrames(10, 99, 30)).toBe(Math.ceil((10 + TAIL_PAD_SEC) * 30));
  });
  it("falls back to the estimate when audio is missing", () => {
    expect(sceneFrames(null, 12, 30)).toBe(360);
  });
  it("never goes below the minimum scene length", () => {
    expect(sceneFrames(null, 0.2, 30)).toBe(MIN_SCENE_SEC * 30);
  });
});

describe("word counting and estimates", () => {
  it("counts words and handles empty text", () => {
    expect(countWords("  one two  three ")).toBe(3);
    expect(countWords("")).toBe(0);
    expect(estimateSeconds("", 3)).toBe(0);
  });
  it("estimates seconds from words per second", () => {
    expect(estimateSeconds("a b c d e f", 3)).toBeCloseTo(2 + TAIL_PAD_SEC, 5);
  });
});

describe("caption chunking", () => {
  it("splits on sentence boundaries", () => {
    expect(splitIntoChunks("One two. Three four? Five!")).toEqual(["One two.", "Three four?", "Five!"]);
  });
  it("splits long sentences at commas, merging short parts", () => {
    const chunks = splitIntoChunks("a b c, d e f, g h i j k l m n o p", 6);
    chunks.forEach((c) => expect(countWords(c)).toBeLessThanOrEqual(6));
    expect(chunks.join(" ")).toBe("a b c, d e f, g h i j k l m n o p");
  });
  it("splits comma-free runs into near-equal pieces", () => {
    expect(splitEvenly("a b c d e f g", 4)).toEqual(["a b c d", "e f g"]);
    expect(splitEvenly("short one", 4)).toEqual(["short one"]);
  });
});

describe("estimateCues", () => {
  it("covers the whole spoken span contiguously", () => {
    const cues = estimateCues("First sentence here. Second one is a bit longer.", 5000);
    expect(cues[0].startMs).toBe(0);
    expect(cues[cues.length - 1].endMs).toBeCloseTo(5000, 5);
    cues.slice(1).forEach((c, i) => expect(c.startMs).toBe(cues[i].endMs));
  });
  it("returns nothing for empty narration", () => {
    expect(estimateCues("", 4000)).toEqual([]);
  });
});

describe("keyframeValue", () => {
  const kf = [{ at: 0, value: 4 }, { at: 0.5, value: 50 }, { at: 1, value: 50 }];
  it("clamps before and after the range", () => {
    expect(keyframeValue(kf, -1)).toBe(4);
    expect(keyframeValue(kf, 2)).toBe(50);
  });
  it("interpolates linearly between keyframes", () => {
    expect(keyframeValue(kf, 0.25)).toBeCloseTo(27, 5);
  });
  it("returns 0 for no keyframes", () => {
    expect(keyframeValue([], 0.5)).toBe(0);
  });
});
