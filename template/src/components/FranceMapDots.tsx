import { cueFrame } from "../lib/cues";
import { useMemo } from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { CORSICA_LATLON, FRANCE_LATLON, project, scatterInside, toPath } from "../lib/geo";
import { ramp, riseIn } from "../lib/motion";
import { COLORS, FONTS, toneColor } from "../theme";
import { Backdrop } from "./Backdrop";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

type Chain = { name: string; count: number; prefix: string; note: string; label?: string; color: string; cue?: { at?: number } };
export type FranceMapProps = { chains: Chain[]; mapNote: string };

const PX_PER_DEG = 72;
const REVEAL_SPAN = 0.78; // share of the scene over which chains light up

export const FranceMapDots: SceneComponent<FranceMapProps> = ({ durationInFrames, chains, mapNote }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { mainland, corsica, dots } = useMemo(() => {
    const main = FRANCE_LATLON.map((p) => project(p, PX_PER_DEG));
    const cor = CORSICA_LATLON.map((p) => project(p, PX_PER_DEG));
    const all = chains.flatMap((chain, ci) =>
      scatterInside(main, chain.count, random, `chain-${ci}`).map((pt, di) => ({ ...pt, ci, di })),
    );
    return { mainland: main, corsica: cor, dots: all };
  }, [chains]);

  // Each chain lights up when it is named (word cue), else in equal steps.
  const per = (durationInFrames * REVEAL_SPAN) / chains.length;
  const startOf = (ci: number) => cueFrame(chains[ci]?.cue, (ci * per + fps * 0.4) / durationInFrames, durationInFrames);
  const windowFor = (ci: number) => {
    const start = startOf(ci);
    const next = ci + 1 < chains.length ? startOf(ci + 1) : Math.max(start + fps * 1.5, durationInFrames * REVEAL_SPAN);
    return { start, end: Math.max(start + fps * 0.6, next) };
  };

  return (
    <AbsoluteFill>
      <Backdrop heat={0.25} />
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "90px 120px 200px", gap: 80 }}>
        <div style={{ position: "relative", width: 780, height: 760 }}>
          <svg width={780} height={760} viewBox="-20 -20 780 760">
            <path d={toPath(mainland)} fill="rgba(127,216,245,0.06)" stroke={COLORS.iceDeep} strokeWidth={3} strokeLinejoin="round" />
            <path d={toPath(corsica)} fill="rgba(127,216,245,0.06)" stroke={COLORS.iceDeep} strokeWidth={3} strokeLinejoin="round" />
            {dots.map((d) => {
              const { start, end } = windowFor(d.ci);
              const appear = start + random(`dot-${d.ci}-${d.di}`) * (end - start);
              const p = ramp(frame, appear, appear + 8);
              const ring = interpolate(frame - appear, [0, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const color = toneColor(chains[d.ci].color);
              return p > 0 ? (
                <g key={`${d.ci}-${d.di}`}>
                  <circle cx={d.x} cy={d.y} r={4.5 * p} fill={color} />
                  {ring < 1 ? <circle cx={d.x} cy={d.y} r={4 + 18 * ring} fill="none" stroke={color} strokeWidth={2} opacity={1 - ring} /> : null}
                </g>
              ) : null;
            })}
          </svg>
          <div style={{ position: "absolute", bottom: -10, left: 10, fontFamily: FONTS.mono, fontSize: 22, color: COLORS.muted }}>{mapNote}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26, flex: 1 }}>
          {chains.map((chain, ci) => {
            const { start, end } = windowFor(ci);
            const shown = Math.round(chain.count * ramp(frame, start, end));
            const color = toneColor(chain.color);
            return (
              <div key={chain.name} style={{ ...riseIn(frame, fps, start, 24), display: "flex", alignItems: "baseline", gap: 22 }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: color, boxShadow: `0 0 14px ${color}`, alignSelf: "center" }} />
                <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: chain.label ? 44 : 64, color, width: 250, fontVariantNumeric: "tabular-nums" }}>
                  {chain.label ?? `${chain.prefix}${shown}`}
                </div>
                <div>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 44, fontWeight: 500, color: COLORS.text }}>{chain.name}</div>
                  {chain.note ? <div style={{ fontFamily: FONTS.mono, fontSize: 22, color: COLORS.muted }}>{chain.note}</div> : null}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {chains.flatMap((chain, ci) => {
        const { start, end } = windowFor(ci);
        return Array.from({ length: 6 }).map((_, k) => (
          <Sfx key={`s-${ci}-${k}`} name="blip" at={start + ((end - start) * k) / 6} volume={0.35 + (k === 0 ? 0.3 : 0)} />
        ));
      })}
    </AbsoluteFill>
  );
};
