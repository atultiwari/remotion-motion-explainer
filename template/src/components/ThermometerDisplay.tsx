import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { keyframeValue } from "../lib/timing";
import { riseIn } from "../lib/motion";
import { COLORS, FONTS, tempColor } from "../theme";
import { Backdrop } from "./Backdrop";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

type Keyframe = { at: number; temp: number };

export type ThermometerProps = {
  label: string;
  keyframes: Keyframe[];
  alarmWorking: boolean;
  alarmOn: boolean;
  night?: boolean;
  melting?: boolean;
  clock?: { from: string; to: string };
  caption?: string;
};

const TUBE_MIN = -10;
const TUBE_MAX = 90;

const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const clockAt = (from: string, to: string, t: number): string => {
  const a = toMinutes(from);
  const b0 = toMinutes(to);
  const b = b0 < a ? b0 + 24 * 60 : b0;
  const m = Math.round(a + (b - a) * t) % (24 * 60);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

/** A vertical glass tube that fills with the current temperature colour. */
const Tube: React.FC<{ temp: number }> = ({ temp }) => {
  const fill = (temp - TUBE_MIN) / (TUBE_MAX - TUBE_MIN);
  const color = tempColor(temp);
  const ticks = [0, 20, 40, 60, 80];
  return (
    <svg width={170} height={620} viewBox="0 0 170 620">
      <rect x={55} y={20} width={60} height={500} rx={30} fill="rgba(255,255,255,0.04)" stroke={COLORS.panelEdge} strokeWidth={3} />
      <rect x={67} y={20 + 488 * (1 - fill)} width={36} height={488 * fill} rx={18} fill={color} opacity={0.9} />
      <circle cx={85} cy={560} r={52} fill={color} stroke={COLORS.panelEdge} strokeWidth={3} />
      <circle cx={70} cy={545} r={12} fill="rgba(255,255,255,0.35)" />
      {ticks.map((t) => {
        const y = 20 + 488 * (1 - (t - TUBE_MIN) / (TUBE_MAX - TUBE_MIN));
        return (
          <g key={t}>
            <line x1={122} x2={140} y1={y} y2={y} stroke={COLORS.muted} strokeWidth={2} />
            <text x={146} y={y + 7} fill={COLORS.muted} fontFamily={FONTS.mono} fontSize={18}>{t}</text>
          </g>
        );
      })}
    </svg>
  );
};

/** Drips that fall from the panel once the temperature passes freezing. */
const Drips: React.FC<{ intensity: number; frame: number }> = ({ intensity, frame }) => (
  <>
    {Array.from({ length: 14 }).map((_, i) => {
      const x = 40 + random(`drip-x-${i}`) * 820;
      const period = 40 + random(`drip-p-${i}`) * 50;
      const phase = (frame + random(`drip-o-${i}`) * period) % period;
      const y = (phase / period) * 260;
      const visible = random(`drip-v-${i}`) < intensity;
      return visible ? (
        <div key={i} style={{ position: "absolute", left: x, top: 430 + y, width: 10, height: 18, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", backgroundColor: "rgba(127,216,245,0.7)", opacity: 1 - phase / period }} />
      ) : null;
    })}
  </>
);

const SAFE_MAX = 8;

/** First frame at which `test(temp)` holds, scanning the scene; -1 if never. */
const firstFrame = (keyframes: Keyframe[], durationInFrames: number, test: (t: number) => boolean, from = 0): number => {
  const kf = keyframes.map((k) => ({ at: k.at, value: k.temp }));
  for (let f = from; f < durationInFrames; f++) {
    if (test(keyframeValue(kf, f / Math.max(1, durationInFrames - 1)))) return f;
  }
  return -1;
};

export const ThermometerDisplay: SceneComponent<ThermometerProps> = ({
  durationInFrames, label, keyframes, alarmWorking, alarmOn, night = false, melting = false, clock, caption,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / Math.max(1, durationInFrames - 1);
  const temp = keyframeValue(keyframes.map((k) => ({ at: k.at, value: k.temp })), t);
  const color = tempColor(temp);
  const heat = interpolate(temp, [8, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const frost = interpolate(temp, [0, 15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = temp > 45 ? (random(`shake-${frame}`) - 0.5) * 2 * heat : 0;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 4);
  const alarmLit = alarmWorking && (alarmOn || temp > SAFE_MAX);
  const unsafeAt = firstFrame(keyframes, durationInFrames, (v) => v > SAFE_MAX);
  const safeAgainAt = unsafeAt >= 0 ? firstFrame(keyframes, durationInFrames, (v) => v <= SAFE_MAX, unsafeAt) : -1;
  const climbs = keyframes.length > 1 && keyframes[keyframes.length - 1].temp > keyframes[0].temp;

  return (
    <AbsoluteFill>
      <Backdrop heat={heat} />
      {night ? <AbsoluteFill style={{ backgroundColor: "rgba(2,4,10,0.22)" }} /> : null}

      {clock ? (
        <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontFamily: FONTS.mono, fontSize: 30, color: COLORS.muted, letterSpacing: 6 }}>
          {night ? "NIGHT · " : ""}{clockAt(clock.from, clock.to, t)}
        </div>
      ) : null}

      <AbsoluteFill style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 90, paddingBottom: 90 }}>
        <div style={riseIn(frame, fps, 0)}>
          <Tube temp={temp} />
        </div>

        <div style={{ ...riseIn(frame, fps, 6), position: "relative", width: 900 }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 28, letterSpacing: 4, color: COLORS.muted, marginBottom: 18 }}>{label}</div>
          <div
            style={{
              position: "relative",
              height: 400,
              borderRadius: 28,
              backgroundColor: COLORS.panel,
              border: `3px solid ${COLORS.panelEdge}`,
              boxShadow: `0 0 ${60 + 80 * heat}px rgba(${temp > 30 ? "255,77,79" : "127,216,245"},${0.15 + 0.25 * heat})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 70px",
              translate: `${shake * 6}px 0px`,
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", inset: 0, opacity: frost * 0.6, background: "linear-gradient(180deg, rgba(200,240,255,0.25), transparent 30%, transparent 70%, rgba(200,240,255,0.18))" }} />
            <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 180, color, textShadow: `0 0 40px ${color}`, fontVariantNumeric: "tabular-nums" }}>
              {temp.toFixed(1)}
              <span style={{ fontSize: 90 }}>°C</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 55,
                  backgroundColor: alarmLit ? COLORS.red : "#1a2129",
                  opacity: alarmLit ? 0.55 + 0.45 * pulse : 1,
                  border: `4px solid ${alarmWorking ? COLORS.panelEdge : "#2a2f35"}`,
                  boxShadow: alarmLit ? `0 0 ${50 * pulse}px ${COLORS.red}` : "inset 0 6px 16px rgba(0,0,0,0.7)",
                }}
              />
              <div style={{ fontFamily: FONTS.mono, fontSize: 20, letterSpacing: 3, whiteSpace: "nowrap", color: alarmWorking ? COLORS.muted : "#5a6570" }}>
                {alarmWorking ? "ALARM" : "ALARM · SILENT"}
              </div>
            </div>
          </div>
          {melting ? <Drips intensity={1 - frost} frame={frame} /> : null}
          {caption ? (
            <div style={{ marginTop: 22, fontFamily: FONTS.mono, fontSize: 28, color: COLORS.muted }}>{caption}</div>
          ) : null}
        </div>
      </AbsoluteFill>
      <Sfx name="hum" at={0} loop durationInFrames={durationInFrames} volume={night ? 0.55 : 0.35} />
      {climbs && unsafeAt >= 0 ? <Sfx name="riser" at={Math.max(0, unsafeAt - fps * 2)} volume={0.6} /> : null}
      {climbs && unsafeAt >= 0 ? <Sfx name="riser" at={Math.max(0, unsafeAt + fps * 2)} volume={0.8} /> : null}
      {alarmWorking && unsafeAt >= 0 ? <Sfx name="alarm" at={unsafeAt} volume={0.7} /> : null}
      {alarmWorking && safeAgainAt >= 0 ? <Sfx name="chime" at={safeAgainAt} volume={0.7} /> : null}
    </AbsoluteFill>
  );
};
