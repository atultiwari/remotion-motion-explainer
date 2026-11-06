import { cueFrame } from "../lib/cues";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ramp, riseIn, springIn } from "../lib/motion";
import { COLORS, FONTS } from "../theme";
import { Backdrop } from "./Backdrop";
import { Icon } from "./Icon";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

export type PoisonedThermometerProps = {
  stage: "poison" | "benchmark";
  fraction?: string;
  fractionLabel?: string;
  ratio?: string;
  cleanLabel?: string;
  poisonedLabel?: string;
  benchmarkLabel?: string;
  verdict?: string;
  ringCue?: { at?: number };
  ratioCue?: { at?: number };
  passCue?: { at?: number };
  verdictCue?: { at?: number };
};

/** Stage 1: one poisoned token in a sea of clean ones. */
const PoisonField: React.FC<{ frame: number; fps: number; fraction: string; label: string; ratio: string; ringAt: number; ratioAt: number }> = ({ frame, fps, fraction, label, ratio, ringAt, ratioAt }) => {
  const ring = springIn(frame, fps, ringAt, 30);
  const pulse = 0.6 + 0.4 * Math.sin(frame / 5);
  return (
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "120px 120px 230px", gap: 70 }}>
      <div style={{ position: "relative", width: 900, height: 620, borderRadius: 20, overflow: "hidden", border: `2px solid ${COLORS.panelEdge}`, opacity: ramp(frame, 0, 20) }}>
        <svg width={900} height={620}>
          <defs>
            <pattern id="tokens" width={9} height={9} patternUnits="userSpaceOnUse">
              <rect x={1.5} y={1.5} width={5} height={5} rx={1} fill="rgba(127,216,245,0.32)" />
            </pattern>
          </defs>
          <rect width={900} height={620} fill="url(#tokens)" />
          <rect x={604.5} y={262.5} width={5} height={5} rx={1} fill={COLORS.red} opacity={pulse} />
          <circle cx={607} cy={265} r={interpolate(ring, [0, 1], [300, 26])} fill="none" stroke={COLORS.red} strokeWidth={4} opacity={ring} />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ ...riseIn(frame, fps, fps * 0.5), fontFamily: FONTS.mono, fontWeight: 700, fontSize: 140, color: COLORS.red }}>{fraction}</div>
        <div style={{ ...riseIn(frame, fps, fps), fontFamily: FONTS.sans, fontSize: 44, lineHeight: 1.25, color: COLORS.text }}>{label}</div>
        <div style={{ ...riseIn(frame, fps, ratioAt), fontFamily: FONTS.mono, fontSize: 48, color: COLORS.amber, marginTop: 28 }}>= {ratio}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Stage 2: clean and poisoned models pass the same benchmark "thermometer". */
const BenchmarkPass: React.FC<{ frame: number; fps: number; durationInFrames: number; passAt: number; verdictAt: number } & Required<Pick<PoisonedThermometerProps, "cleanLabel" | "poisonedLabel" | "benchmarkLabel" | "verdict">>> = ({
  frame, fps, durationInFrames, cleanLabel, poisonedLabel, benchmarkLabel, verdict, passAt, verdictAt,
}) => {
  const fill = ramp(frame, Math.max(0, passAt - fps * 2.2), passAt);
  const models = [{ label: cleanLabel, poisoned: false }, { label: poisonedLabel, poisoned: true }];
  return (
    <AbsoluteFill style={{ alignItems: "center", padding: "120px 120px 230px" }}>
      <div style={{ ...riseIn(frame, fps, 0), fontFamily: FONTS.mono, fontSize: 30, letterSpacing: 4, color: COLORS.muted }}>{benchmarkLabel.toUpperCase()}</div>
      <div style={{ display: "flex", gap: 160, marginTop: 40 }}>
        {models.map((m, i) => (
          <div key={m.label} style={{ ...riseIn(frame, fps, 6 + i * 6), display: "flex", alignItems: "flex-end", gap: 40 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <div style={{ position: "relative", color: COLORS.ice }}>
                <Icon name="bot" size={170} strokeWidth={1.3} />
                {m.poisoned ? (
                  <div style={{ position: "absolute", left: 66, top: 92, width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.red, opacity: ramp(frame, durationInFrames * 0.45, durationInFrames * 0.6), boxShadow: `0 0 30px ${COLORS.red}` }} />
                ) : null}
              </div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 40, color: COLORS.text }}>{m.label}</div>
            </div>
            <div style={{ width: 54, height: 330, borderRadius: 27, border: `4px solid ${COLORS.panelEdge}`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: 0, width: "100%", height: `${82 * fill}%`, backgroundColor: COLORS.green, opacity: 0.85 }} />
            </div>
            <div style={{ fontFamily: FONTS.mono, fontWeight: 700, fontSize: 40, color: COLORS.green, opacity: ramp(frame, passAt, passAt + 10) }}>PASS</div>
          </div>
        ))}
      </div>
      <div style={{ ...riseIn(frame, fps, verdictAt), fontFamily: FONTS.sans, fontWeight: 700, fontSize: 64, color: COLORS.amber, marginTop: 50 }}>{verdict}</div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 22, color: COLORS.muted, marginTop: 12, opacity: ramp(frame, fps, fps * 1.5) }}>Illustrative: no benchmark scores shown</div>
    </AbsoluteFill>
  );
};

export const PoisonedThermometer: SceneComponent<PoisonedThermometerProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = props.durationInFrames;
  const ringAt = cueFrame(props.ringCue, (fps * 2.2) / d, d);
  const ratioAt = cueFrame(props.ratioCue, (fps * 2.6) / d, d);
  const passAt = cueFrame(props.passCue, (fps * 3) / d, d);
  const verdictAt = cueFrame(props.verdictCue, 0.62, d);
  return (
    <AbsoluteFill>
      <Backdrop heat={props.stage === "poison" ? 0.2 : 0} mood="violet" />
      {props.stage === "poison" ? (
        <PoisonField ringAt={ringAt} ratioAt={ratioAt} frame={frame} fps={fps} fraction={props.fraction ?? ""} label={props.fractionLabel ?? ""} ratio={props.ratio ?? ""} />
      ) : (
        <BenchmarkPass
          frame={frame}
          fps={fps}
          durationInFrames={props.durationInFrames}
          passAt={passAt}
          verdictAt={verdictAt}
          cleanLabel={props.cleanLabel ?? ""}
          poisonedLabel={props.poisonedLabel ?? ""}
          benchmarkLabel={props.benchmarkLabel ?? ""}
          verdict={props.verdict ?? ""}
        />
      )}
      {props.stage === "poison" ? <Sfx name="pop" at={fps * 0.5} /> : null}
      {props.stage === "poison" ? <Sfx name="blip" at={ringAt} volume={0.9} /> : null}
      {props.stage === "poison" ? <Sfx name="whoosh" at={ratioAt} volume={0.4} /> : null}
      {props.stage === "benchmark" ? <Sfx name="tick" at={passAt} /> : null}
      {props.stage === "benchmark" ? <Sfx name="tick" at={passAt + 3} /> : null}
      {props.stage === "benchmark" ? <Sfx name="thump" at={verdictAt} volume={0.7} /> : null}
    </AbsoluteFill>
  );
};
