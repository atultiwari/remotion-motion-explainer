import { ALL_FORMATS, Input, UrlSource } from "mediabunny";
import { staticFile } from "remotion";
import type { CaptionCue } from "../data/schema";

/**
 * True when a real file exists in public/. A 404 (or an HTML fallback page) means
 * "not recorded yet", which is expected. Any other failure is logged, not hidden.
 */
export const publicFileExists = async (path: string, signal?: AbortSignal): Promise<boolean> => {
  try {
    const res = await fetch(staticFile(path), { method: "HEAD", signal });
    if (res.status === 404) return false;
    if (!res.ok) {
      console.error(`Unexpected ${res.status} checking ${path}; treating it as missing.`);
      return false;
    }
    return !(res.headers.get("content-type") ?? "").includes("text/html");
  } catch (err) {
    if (signal?.aborted) throw err;
    console.error(`Could not check ${path}; treating it as missing.`, err);
    return false;
  }
};

/** Duration of an audio file in public/, or null when it is missing or unreadable. */
export const getAudioDurationSec = async (path: string, signal?: AbortSignal): Promise<number | null> => {
  if (!(await publicFileExists(path, signal))) return null;
  const input = new Input({ formats: ALL_FORMATS, source: new UrlSource(staticFile(path)) });
  try {
    const sec = await input.computeDuration();
    signal?.throwIfAborted();
    return sec;
  } catch (err) {
    if (signal?.aborted) throw err;
    console.warn(`Could not read audio duration for ${path}; using the estimate instead.`, err);
    return null;
  } finally {
    input.dispose();
  }
};

const isCue = (value: unknown): value is CaptionCue => {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.text === "string" &&
    typeof v.startMs === "number" && Number.isFinite(v.startMs) &&
    typeof v.endMs === "number" && Number.isFinite(v.endMs) &&
    v.endMs > v.startMs
  );
};

/**
 * Word- or phrase-level captions from public/captions/<sceneId>.json
 * (the @remotion/captions Caption format, e.g. from Whisper). Null when absent or invalid.
 */
export const loadCaptionFile = async (path: string, signal?: AbortSignal): Promise<CaptionCue[] | null> => {
  if (!(await publicFileExists(path, signal))) return null;
  try {
    const res = await fetch(staticFile(path), { signal });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!Array.isArray(data) || !data.every(isCue)) {
      console.warn(`${path} is not a valid Caption[] array; falling back to sentence captions.`);
      return null;
    }
    return data
      .map(({ text, startMs, endMs, words }) => ({
        text,
        startMs,
        endMs,
        words: Array.isArray(words) ? words.filter((w) => typeof w?.text === "string" && Number.isFinite(w?.startMs)) : undefined,
      }))
      .sort((a, b) => a.startMs - b.startMs);
  } catch (err) {
    if (signal?.aborted) throw err;
    console.warn(`Could not read ${path}; falling back to sentence captions.`, err);
    return null;
  }
};
