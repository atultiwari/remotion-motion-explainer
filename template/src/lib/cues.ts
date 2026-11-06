import type { CaptionCue } from "../data/schema";

/**
 * Word cues: anywhere in a scene's props, an object like {"atWord": "fifty"} (optionally
 * "nth": 2) gets an `at` fraction (0..1 of the scene) from the moment that word is spoken.
 * Visual events then land on the word in the real take, and move with it on a re-take.
 */
export type WordCue = { atWord: string; nth?: number; at?: number; offsetSec?: number };

export const normWord = (w: string): string =>
  w
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

export type TimedWord = { text: string; startMs: number };

export const flattenWords = (cues: CaptionCue[]): TimedWord[] => cues.flatMap((c) => c.words ?? []);

/** Start time (ms) of the nth word that begins with `target`, or null. */
export const findWordMs = (words: TimedWord[], target: string, nth = 1): number | null => {
  const want = normWord(target);
  if (!want) return null;
  const hits = words.filter((w) => normWord(w.text).startsWith(want));
  return hits[nth - 1]?.startMs ?? null;
};

const isCueObject = (v: unknown): v is WordCue =>
  typeof v === "object" && v !== null && typeof (v as Record<string, unknown>).atWord === "string";

/** Returns a new props tree with every word cue resolved; never mutates the input. */
export const resolveWordCues = (
  value: unknown,
  words: TimedWord[],
  sceneMs: number,
  onMissing: (word: string) => void,
): unknown => {
  if (Array.isArray(value)) return value.map((v) => resolveWordCues(v, words, sceneMs, onMissing));
  if (typeof value !== "object" || value === null) return value;
  const entries = Object.entries(value).map(([k, v]) => [k, resolveWordCues(v, words, sceneMs, onMissing)] as const);
  const next = Object.fromEntries(entries) as Record<string, unknown>;
  if (!isCueObject(value) || sceneMs <= 0) return next;
  const ms = findWordMs(words, value.atWord, value.nth ?? 1);
  if (ms === null) {
    onMissing(value.atWord);
    return next;
  }
  const at = Math.min(1, Math.max(0, (ms + (value.offsetSec ?? 0) * 1000) / sceneMs));
  return { ...next, at };
};

/** Frame for a cue, falling back to a fraction of the scene when unresolved. */
export const cueFrame = (cue: { at?: number } | undefined, fallbackFraction: number, durationInFrames: number): number =>
  Math.round((cue?.at ?? fallbackFraction) * durationInFrames);
