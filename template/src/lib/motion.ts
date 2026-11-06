import { Easing, interpolate, spring } from "remotion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 spring that starts at `startFrame`. Calm by default (no overshoot). */
export const springIn = (
  frame: number,
  fps: number,
  startFrame = 0,
  damping = 200,
  durationInFrames?: number,
): number =>
  spring({ frame: frame - startFrame, fps, config: { damping }, durationInFrames });

/** Linear 0→1 between two frames, clamped, eased out. */
export const ramp = (frame: number, from: number, to: number): number =>
  interpolate(frame, [from, Math.max(from + 1, to)], [0, 1], {
    ...CLAMP,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

/** Fade + rise style for an element arriving at `startFrame`. */
export const riseIn = (frame: number, fps: number, startFrame: number, distance = 40) => {
  const p = springIn(frame, fps, startFrame);
  return { opacity: p, translate: `0px ${(1 - p) * distance}px` } as const;
};

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
