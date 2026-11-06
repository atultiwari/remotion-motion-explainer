import { cueFrame } from "../lib/cues";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { riseIn, springIn } from "../lib/motion";
import { COLORS, FONTS, toneColor } from "../theme";
import { Backdrop } from "./Backdrop";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

export type KineticTextProps = {
  accent?: string;
  align?: "center" | "left";
  size?: "lg" | "xl";
  stamp?: string;
  caption?: string;
  /** One word cue per line of onScreenText, and one for the stamp. */
  lineCues?: { at?: number }[];
  stampCue?: { at?: number };
};

const SIZES = { lg: 72, xl: 96 } as const;

/** Lines from `onScreenText`, revealed one by one; the last line carries the accent. */
export const KineticText: SceneComponent<KineticTextProps> = ({
  durationInFrames, onScreenText, accent = "ice", align = "center", size = "lg", stamp, caption, lineCues = [], stampCue,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = onScreenText.length;
  const span = durationInFrames * 0.55;
  const color = toneColor(accent);
  const stampAt = cueFrame(stampCue, 0.6, durationInFrames);
  const lineAt = (i: number) =>
    cueFrame(lineCues[i], (n <= 1 ? 4 : Math.round((i / (n - 1)) * span) + 4) / durationInFrames, durationInFrames);
  const stampP = springIn(frame, fps, stampAt, 12);

  return (
    <AbsoluteFill>
      <Backdrop heat={accent === "red" ? 0.5 : 0} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: align === "center" ? "center" : "flex-start", padding: "0 160px 160px", gap: 26 }}>
        {onScreenText.map((line, i) => {
          const start = lineAt(i);
          const isLast = i === n - 1 && n > 1;
          return (
            <div
              key={line}
              style={{
                ...riseIn(frame, fps, start, 50),
                fontFamily: FONTS.sans,
                fontWeight: 700,
                fontSize: isLast || n === 1 ? SIZES[size] : SIZES[size] * 0.78,
                lineHeight: 1.12,
                color: isLast || n === 1 ? color : COLORS.text,
                textAlign: align,
                maxWidth: 1600,
                textShadow: isLast ? `0 0 30px ${color}55` : "none",
              }}
            >
              {line}
            </div>
          );
        })}
        {caption ? (
          <div style={{ ...riseIn(frame, fps, Math.round(span * 0.5)), fontFamily: FONTS.mono, fontSize: 28, color: COLORS.muted, marginTop: 18 }}>
            {caption}
          </div>
        ) : null}
      </AbsoluteFill>
      {stamp ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 160 }}>
          <div
            style={{
              opacity: interpolate(stampP, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
              scale: String(interpolate(stampP, [0, 1], [2.4, 1])),
              rotate: "-9deg",
              marginTop: 640,
              border: `8px solid ${COLORS.red}`,
              color: COLORS.red,
              padding: "10px 40px",
              borderRadius: 12,
              fontFamily: FONTS.mono,
              fontWeight: 700,
              fontSize: 76,
              letterSpacing: 10,
              mixBlendMode: "screen",
            }}
          >
            {stamp}
          </div>
        </AbsoluteFill>
      ) : null}
      {onScreenText.map((line, i) => (
        <Sfx key={`s-${line}`} name="pop" at={lineAt(i)} volume={0.6} />
      ))}
      {stamp ? <Sfx name="thump" at={stampAt + 4} /> : null}
    </AbsoluteFill>
  );
};
