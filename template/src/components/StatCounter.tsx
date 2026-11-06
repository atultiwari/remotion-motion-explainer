import { cueFrame } from "../lib/cues";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ramp, riseIn } from "../lib/motion";
import { COLORS, FONTS } from "../theme";
import { Backdrop } from "./Backdrop";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

type Stat = { value: number; prefix: string; suffix: string; label: string; source: string };
export type StatCounterProps = { stats: Stat[]; quote: string; quoteBy: string; bins: number; binLabel: string; statCue?: { at?: number }; binCue?: { at?: number } };

const Bin: React.FC<{ fill: number }> = ({ fill }) => (
  <svg width={130} height={150} viewBox="0 0 130 150">
    <rect x={8} y={18} width={114} height={14} rx={4} fill={COLORS.muted} />
    <path d="M18 36 L112 36 L102 144 L28 144 Z" fill="#1b2732" stroke={COLORS.muted} strokeWidth={3} />
    <clipPath id="binclip"><path d="M18 36 L112 36 L102 144 L28 144 Z" /></clipPath>
    <g clipPath="url(#binclip)">
      <rect x={0} y={144 - 108 * fill} width={130} height={108 * fill} fill={COLORS.ice} opacity={0.5} />
      {[0, 1, 2].map((r) => (
        <rect key={r} x={30 + r * 24} y={144 - 108 * fill + 6} width={20} height={14} rx={3} fill={COLORS.ice} opacity={fill > 0.1 ? 0.8 : 0} />
      ))}
    </g>
  </svg>
);

export const StatCounter: SceneComponent<StatCounterProps> = ({ durationInFrames, stats, quote, quoteBy, bins, binLabel, statCue, binCue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const statStart = cueFrame(statCue, 0.35, durationInFrames);
  const binStart = cueFrame(binCue, 0.65, durationInFrames);

  return (
    <AbsoluteFill>
      <Backdrop heat={0.4} />
      <AbsoluteFill style={{ padding: "150px 140px 220px", gap: 50 }}>
        <div style={{ ...riseIn(frame, fps, 4), borderLeft: `8px solid ${COLORS.amber}`, paddingLeft: 36 }}>
          <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 66, lineHeight: 1.12, color: COLORS.text }}>{quote}</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 26, color: COLORS.muted, marginTop: 16 }}>— {quoteBy}</div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 60 }}>
          {stats.map((s) => {
            const v = Math.round(s.value * ramp(frame, statStart, statStart + fps * 2));
            return (
              <div key={s.label} style={riseIn(frame, fps, statStart)}>
                <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 120, color: COLORS.red, fontVariantNumeric: "tabular-nums" }}>
                  {s.prefix}{v.toLocaleString("en-US")}{s.suffix}
                </div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 38, color: COLORS.text }}>{s.label}</div>
              </div>
            );
          })}
          <div style={{ ...riseIn(frame, fps, binStart), display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ display: "flex", gap: 10 }}>
              {Array.from({ length: bins }).map((_, i) => (
                <Bin key={i} fill={ramp(frame, binStart + i * 6, binStart + i * 6 + fps)} />
              ))}
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 24, color: COLORS.muted, marginTop: 10 }}>{binLabel}</div>
          </div>
        </div>
      </AbsoluteFill>
      {Array.from({ length: Math.round(fps * 2 / 3) }).map((_, k) => (
        <Sfx key={`c-${k}`} name="counter" at={statStart + k * 3} volume={0.5} />
      ))}
      {Array.from({ length: bins }).map((_, i) => (
        <Sfx key={`b-${i}`} name="paper-drop" at={binStart + i * 6 + 4} volume={0.45} />
      ))}
    </AbsoluteFill>
  );
};
