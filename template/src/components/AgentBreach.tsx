import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { keyframeValue } from "../lib/timing";
import { ramp, riseIn } from "../lib/motion";
import { COLORS, FONTS } from "../theme";
import { Backdrop } from "./Backdrop";
import { Icon } from "./Icon";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

type Step = { at: number; text: string; status: "ok" | "blocked" | "warn" | "breach" };
export type AgentBreachProps = { task: string; steps: Step[]; quote: string; quoteBy: string; note: string };

const STATUS = {
  ok: { mark: "✓", color: COLORS.green },
  blocked: { mark: "✕", color: COLORS.amber },
  warn: { mark: "!", color: COLORS.amber },
  breach: { mark: "●", color: COLORS.red },
} as const;

// Agent path across the "portal" diagram, one stop per step (px inside a 760×520 box).
const PATH = [{ x: 120, y: 200 }, { x: 300, y: 200 }, { x: 330, y: 470 }, { x: 560, y: 380 }, { x: 600, y: 200 }];

export const AgentBreach: SceneComponent<AgentBreachProps> = ({ durationInFrames, task, steps, quote, quoteBy, note }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / Math.max(1, durationInFrames - 1);
  const stops = steps.map((s, i) => ({ at: s.at, ...PATH[Math.min(i, PATH.length - 1)] }));
  const ax = keyframeValue(stops.map((s) => ({ at: s.at, value: s.x })), t);
  const ay = keyframeValue(stops.map((s) => ({ at: s.at, value: s.y })), t);
  const blockedAt = steps.find((s) => s.status === "blocked")?.at ?? 0.3;
  const shake = t > blockedAt && t < blockedAt + 0.06 ? Math.sin(frame * 2.2) * 10 : 0;
  const breachAt = steps.find((s) => s.status === "breach")?.at ?? 0.7;
  const filesRed = ramp(frame, breachAt * durationInFrames, breachAt * durationInFrames + 15);
  const writeAt = steps[steps.length - 1]?.at ?? 0.85;
  const newFile = ramp(frame, writeAt * durationInFrames, writeAt * durationInFrames + 15);

  return (
    <AbsoluteFill>
      <Backdrop heat={filesRed * 0.5} mood="violet" />
      <AbsoluteFill style={{ flexDirection: "row", padding: "130px 110px 230px", gap: 60 }}>
        <div style={{ ...riseIn(frame, fps, 0), width: 760, borderRadius: 20, backgroundColor: "#05090d", border: `2px solid ${COLORS.panelEdge}`, padding: "26px 32px", fontFamily: FONTS.mono }}>
          <div style={{ fontSize: 24, color: COLORS.muted }}>AGENT TASK</div>
          <div style={{ fontSize: 34, color: COLORS.ice, marginTop: 6, marginBottom: 24 }}>&gt; {task}</div>
          {steps.map((s) => {
            const st = STATUS[s.status];
            return (
              <div key={s.text} style={{ ...riseIn(frame, fps, s.at * durationInFrames, 14), display: "flex", gap: 18, fontSize: 32, color: COLORS.text, marginTop: 14 }}>
                <span style={{ color: st.color, width: 30 }}>{st.mark}</span>
                <span style={{ color: s.status === "breach" ? COLORS.red : COLORS.text }}>{s.text}</span>
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ position: "relative", width: 760, height: 520, borderRadius: 20, backgroundColor: COLORS.panel, border: `2px solid ${COLORS.panelEdge}`, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 24, top: 18, fontFamily: FONTS.mono, fontSize: 22, color: COLORS.green }}>PUBLIC STATISTICS</div>
            <div style={{ position: "absolute", right: 24, top: 18, fontFamily: FONTS.mono, fontSize: 22, color: COLORS.red }}>NON-PUBLIC FILES</div>
            <div style={{ position: "absolute", left: 400, top: 0, width: 14, height: 400, backgroundColor: COLORS.muted }} />
            <div style={{ position: "absolute", left: 382, top: 150, color: COLORS.amber }}><Icon name="lock" size={50} /></div>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: "absolute", left: 480 + (i % 2) * 120, top: 90 + i * 90, color: interpolate(filesRed, [0, 1], [0, 1]) > 0.5 ? COLORS.red : COLORS.muted }}>
                <Icon name="file" size={64} />
              </div>
            ))}
            <div style={{ position: "absolute", left: 620, top: 330, color: COLORS.red, opacity: newFile, scale: String(newFile) }}>
              <Icon name="file" size={64} />
              <div style={{ fontFamily: FONTS.mono, fontSize: 20 }}>+ written</div>
            </div>
            <div style={{ position: "absolute", left: ax - 40 + shake, top: ay - 40, color: COLORS.ice }}>
              <Icon name="bot" size={80} />
            </div>
          </div>
          <div style={{ ...riseIn(frame, fps, (blockedAt + 0.08) * durationInFrames, 20), borderLeft: `6px solid ${COLORS.amber}`, paddingLeft: 24 }}>
            <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 46, color: COLORS.text }}>{quote}</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 22, color: COLORS.muted, marginTop: 6 }}>— {quoteBy}</div>
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 110, bottom: 214, fontFamily: FONTS.mono, fontSize: 22, color: COLORS.muted }}>{note}</div>
      {steps.map((s) => (
        <Sfx
          key={`s-${s.text}`}
          name={s.status === "breach" ? "glitch" : s.status === "blocked" ? "thump" : "tick"}
          at={s.at * durationInFrames}
          volume={s.status === "ok" ? 0.8 : 0.7}
        />
      ))}
    </AbsoluteFill>
  );
};
