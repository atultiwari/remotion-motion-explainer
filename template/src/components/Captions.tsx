import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { CaptionCue } from "../data/schema";
import { COLORS, FONTS, LAYOUT } from "../theme";

/**
 * Burned-in captions (bottom). With word timings (public/captions/<sceneId>.json, built from
 * the real takes) the word being spoken is highlighted; otherwise the phrase shows plainly.
 */
export const Captions: React.FC<{ cues: CaptionCue[] }> = ({ cues }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const cue = cues.find((c) => ms >= c.startMs && ms < c.endMs);
  if (!cue) return null;
  const words = cue.words ?? [];
  const active = words.reduce((idx, w, i) => (ms >= w.startMs ? i : idx), -1);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", pointerEvents: "none" }}>
      <div
        style={{
          marginBottom: 56,
          maxWidth: 1920 - LAYOUT.safeX * 2,
          padding: "14px 30px",
          borderRadius: 14,
          backgroundColor: "rgba(4, 8, 12, 0.82)",
          color: COLORS.text,
          fontFamily: FONTS.sans,
          fontSize: 50,
          fontWeight: 500,
          lineHeight: 1.25,
          textAlign: "center",
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
        }}
      >
        {words.length === 0
          ? cue.text
          : words.map((w, i) => (
              <span key={`${i}-${w.text}`} style={{ color: i === active ? COLORS.amber : i < active ? COLORS.text : "rgba(232,238,242,0.7)" }}>
                {i > 0 ? " " : ""}
                {w.text}
              </span>
            ))}
      </div>
    </AbsoluteFill>
  );
};
