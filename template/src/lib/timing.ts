import type { CaptionCue } from "../data/schema";

/** Padding added after narration so a scene can breathe before the cut. */
export const TAIL_PAD_SEC = 0.6;
export const MIN_SCENE_SEC = 2;

export const secondsToFrames = (sec: number, fps: number): number =>
  Math.max(1, Math.ceil(Number((sec * fps).toFixed(6))));

export const sceneFrames = (
  audioSec: number | null,
  estimatedSec: number,
  fps: number,
): number => {
  const sec = audioSec === null ? estimatedSec : audioSec + TAIL_PAD_SEC;
  return secondsToFrames(Math.max(MIN_SCENE_SEC, sec), fps);
};

export const countWords = (text: string): number =>
  text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

export const estimateSeconds = (text: string, wordsPerSecond: number): number => {
  const words = countWords(text);
  if (words === 0) return 0;
  return Math.round((words / wordsPerSecond + TAIL_PAD_SEC) * 10) / 10;
};

const MAX_WORDS_PER_CUE = 11;

/** Split narration into readable caption chunks: sentences, then commas if long. */
export const splitIntoChunks = (text: string, maxWords = MAX_WORDS_PER_CUE): string[] => {
  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return sentences.flatMap((sentence) => {
    if (countWords(sentence) <= maxWords) return [sentence];
    const parts = sentence.split(/(?<=,)\s+/);
    const merged = parts.reduce<string[]>((chunks, part) => {
      const last = chunks[chunks.length - 1];
      if (last !== undefined && countWords(last) + countWords(part) <= maxWords) {
        return [...chunks.slice(0, -1), `${last} ${part}`];
      }
      return [...chunks, part];
    }, []);
    return merged.flatMap((chunk) => splitEvenly(chunk, maxWords));
  });
};

/** Break a chunk with no usable commas into near-equal word runs. */
export const splitEvenly = (chunk: string, maxWords: number): string[] => {
  const words = chunk.split(/\s+/);
  if (words.length <= maxWords) return [chunk];
  const pieces = Math.ceil(words.length / maxWords);
  const size = Math.ceil(words.length / pieces);
  return Array.from({ length: pieces }, (_, i) => words.slice(i * size, (i + 1) * size).join(" "));
};

/**
 * Sentence-level cues spread over the spoken part of a scene, weighted by
 * character length. Used until word-level timestamps exist.
 */
export const estimateCues = (text: string, spokenMs: number): CaptionCue[] => {
  const chunks = splitIntoChunks(text);
  const totalChars = chunks.reduce((sum, c) => sum + c.length, 0);
  if (totalChars === 0 || spokenMs <= 0) return [];

  return chunks.reduce<CaptionCue[]>((cues, chunk) => {
    const startMs = cues.length === 0 ? 0 : cues[cues.length - 1].endMs;
    const endMs = startMs + (chunk.length / totalChars) * spokenMs;
    return [...cues, { text: chunk, startMs, endMs }];
  }, []);
};

/** Piecewise-linear lookup over keyframes sorted by `at` (0..1). */
export const keyframeValue = (
  keyframes: ReadonlyArray<{ at: number; value: number }>,
  t: number,
): number => {
  if (keyframes.length === 0) return 0;
  if (t <= keyframes[0].at) return keyframes[0].value;
  const last = keyframes[keyframes.length - 1];
  if (t >= last.at) return last.value;
  const i = keyframes.findIndex((k) => k.at > t);
  const a = keyframes[i - 1];
  const b = keyframes[i];
  const local = (t - a.at) / (b.at - a.at || 1);
  return a.value + (b.value - a.value) * local;
};
