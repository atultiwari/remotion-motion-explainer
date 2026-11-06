import { cueFrame } from "../lib/cues";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ramp, riseIn } from "../lib/motion";
import { COLORS, FONTS } from "../theme";
import { Backdrop } from "./Backdrop";
import { Icon } from "./Icon";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

export type RecallSceneProps = {
  leftTitle: string;
  leftText: string;
  rightTitle: string;
  rightText: string;
  windowLabel: string;
  reports: number;
  lesson: string;
  rightCue?: { at?: number };
  flipCue?: { at?: number };
  lessonCue?: { at?: number };
};

const Panel: React.FC<{ title: string; text: string; start: number; children: React.ReactNode }> = ({ title, text, start, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ ...riseIn(frame, fps, start, 30), flex: 1, borderRadius: 22, backgroundColor: COLORS.panel, border: `2px solid ${COLORS.panelEdge}`, padding: "28px 34px" }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 28, letterSpacing: 4, color: COLORS.muted }}>{title.toUpperCase()}</div>
      <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
      <div style={{ fontFamily: FONTS.sans, fontSize: 38, lineHeight: 1.25, color: COLORS.text }}>{text}</div>
    </div>
  );
};

/** "Can't prove it was safe → recall everything", supermarket beside hospital AI. */
export const RecallScene: SceneComponent<RecallSceneProps> = ({ durationInFrames, leftTitle, leftText, rightTitle, rightText, windowLabel, reports, lesson, rightCue, flipCue, lessonCue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rightStart = cueFrame(rightCue, 0.25, durationInFrames);
  const flipStart = cueFrame(flipCue, 0.5, durationInFrames);
  const lessonStart = cueFrame(lessonCue, 0.78, durationInFrames);

  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ padding: "120px 120px 230px", gap: 30 }}>
        <div style={{ display: "flex", gap: 50 }}>
          <Panel title={leftTitle} text={leftText} start={4}>
            <div style={{ display: "flex", gap: 22, color: COLORS.red }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ opacity: ramp(frame, 10 + i * 6, 20 + i * 6) }}><Icon name="snowflake" size={90} /></div>
              ))}
            </div>
          </Panel>
          <Panel title={rightTitle} text={rightText} start={rightStart}>
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 12 }}>
                {Array.from({ length: reports }).map((_, i) => {
                  const flipped = ramp(frame, flipStart + i * 1.5, flipStart + i * 1.5 + 8);
                  return (
                    <div key={i} style={{ color: flipped > 0.5 ? COLORS.amber : COLORS.ice }}>
                      <Icon name="file" size={52} />
                    </div>
                  );
                })}
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 22, color: COLORS.amber, marginTop: 16, opacity: ramp(frame, flipStart, flipStart + 10) }}>{windowLabel}</div>
            </div>
          </Panel>
        </div>
        <div style={{ ...riseIn(frame, fps, lessonStart, 30), fontFamily: FONTS.sans, fontWeight: 700, fontSize: 64, color: COLORS.amber, textAlign: "center" }}>{lesson}</div>
      </AbsoluteFill>
      {Array.from({ length: Math.ceil(reports / 3) }).map((_, k) => (
        <Sfx key={`r-${k}`} name="counter" at={flipStart + k * 4.5} volume={0.45} />
      ))}
      <Sfx name="thump" at={lessonStart} volume={0.6} />
    </AbsoluteFill>
  );
};
