import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { riseIn, springIn } from "../lib/motion";
import { COLORS, FONTS, toneColor } from "../theme";
import { Backdrop } from "./Backdrop";
import { AlarmMetaphor, CalendarMetaphor, DoorMetaphor, KeyMetaphor, LocksMetaphor } from "./metaphors/Metaphors";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

export type FailureCardProps = {
  number: number;
  title: string;
  body: string;
  metaphor: "door" | "calendar" | "key" | "locks" | "thermometer";
  tone: string;
  calendar?: { from: string; fromLabel: string; to: string; toLabel: string; gap: string };
  percent?: number;
};

const TOTAL_FAILURES = 5;

export const FailureCard: SceneComponent<FailureCardProps> = (props) => {
  const { durationInFrames, number, title, body, metaphor, tone } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const color = toneColor(tone);
  const numP = springIn(frame, fps, 0, 14);
  const metaStart = Math.round(fps * 1.2);
  const metaProps = { start: metaStart, durationInFrames };

  return (
    <AbsoluteFill>
      <Backdrop heat={number === 5 ? 0.5 : 0.15} />
      <div style={{ position: "absolute", top: 110, left: 120, display: "flex", gap: 14 }}>
        {Array.from({ length: TOTAL_FAILURES }).map((_, i) => (
          <div key={i} style={{ width: 56, height: 8, borderRadius: 4, backgroundColor: i < number ? color : COLORS.panelEdge }} />
        ))}
      </div>
      <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "120px 120px 220px", gap: 80 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ scale: String(numP), fontFamily: FONTS.mono, fontWeight: 700, fontSize: 180, color, lineHeight: 1, textShadow: `0 0 40px ${color}66` }}>
              {String(number).padStart(2, "0")}
            </div>
            <div style={{ ...riseIn(frame, fps, 6), fontFamily: FONTS.mono, fontSize: 26, letterSpacing: 6, color: COLORS.muted }}>FAILURE</div>
          </div>
          <div style={{ ...riseIn(frame, fps, 10), fontFamily: FONTS.sans, fontWeight: 700, fontSize: 84, lineHeight: 1.05, color: COLORS.text, marginTop: 20 }}>{title}</div>
          <div style={{ ...riseIn(frame, fps, 20), fontFamily: FONTS.sans, fontSize: 40, lineHeight: 1.35, color: COLORS.muted, marginTop: 28, maxWidth: 820 }}>{body}</div>
        </div>
        <div style={{ ...riseIn(frame, fps, metaStart - 6), width: 620, display: "flex", justifyContent: "center" }}>
          {metaphor === "door" ? <DoorMetaphor {...metaProps} /> : null}
          {metaphor === "calendar" && props.calendar ? <CalendarMetaphor {...metaProps} calendar={props.calendar} /> : null}
          {metaphor === "key" ? <KeyMetaphor {...metaProps} /> : null}
          {metaphor === "locks" ? <LocksMetaphor {...metaProps} percent={props.percent ?? 60} /> : null}
          {metaphor === "thermometer" ? <AlarmMetaphor {...metaProps} /> : null}
        </div>
      </AbsoluteFill>
      <Sfx name="thump" at={2} />
      {metaphor === "door" ? <Sfx name="whoosh" at={metaStart} volume={0.8} /> : null}
      {metaphor === "calendar" ? <Sfx name="pop" at={metaStart} /> : null}
      {metaphor === "calendar" ? <Sfx name="thump" at={metaStart + 55} volume={0.6} /> : null}
      {metaphor === "key" ? <Sfx name="chime" at={metaStart} volume={0.5} /> : null}
      {metaphor === "locks" ? <Sfx name="glitch" at={metaStart + 30} volume={0.8} /> : null}
      {metaphor === "thermometer" ? <Sfx name="riser" at={metaStart + 20} volume={0.4} /> : null}
      {metaphor === "thermometer" ? <Sfx name="tick" at={metaStart + 90} /> : null}
    </AbsoluteFill>
  );
};
