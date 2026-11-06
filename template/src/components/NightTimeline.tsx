import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ramp, riseIn } from "../lib/motion";
import { COLORS, FONTS, toneColor } from "../theme";
import { Backdrop } from "./Backdrop";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

type TimelineEvent = { hour: number; text: string; tone: string };
export type NightTimelineProps = {
  axisLabel: string;
  hours: number;
  normalHours: number;
  stretchedHours: number;
  events: TimelineEvent[];
};

const LEFT = 160;
const WIDTH = 1600;
const AXIS_Y = 470;

/** A playhead sweeps the night; events appear as it reaches them. */
export const NightTimeline: SceneComponent<NightTimelineProps> = ({
  durationInFrames, axisLabel, hours, normalHours, stretchedHours, events,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sweepStart = fps * 0.6;
  const sweepEnd = durationInFrames * 0.85;
  const head = interpolate(frame, [sweepStart, sweepEnd], [0, hours], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const xOf = (h: number) => LEFT + (h / hours) * WIDTH;
  const normalW = Math.min(head, normalHours);
  const stretchedW = Math.min(head, stretchedHours);

  return (
    <AbsoluteFill>
      <Backdrop heat={interpolate(head, [1, 8], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={LEFT} x2={LEFT + WIDTH} y1={AXIS_Y} y2={AXIS_Y} stroke={COLORS.panelEdge} strokeWidth={4} />
        {Array.from({ length: hours + 1 }).map((_, h) => (
          <g key={h}>
            <line x1={xOf(h)} x2={xOf(h)} y1={AXIS_Y - 10} y2={AXIS_Y + 10} stroke={COLORS.muted} strokeWidth={2} />
            <text x={xOf(h)} y={AXIS_Y + 44} fill={COLORS.muted} fontFamily={FONTS.mono} fontSize={22} textAnchor="middle">{h}h</text>
          </g>
        ))}
        <rect x={LEFT} y={AXIS_Y - 110} width={(normalW / hours) * WIDTH} height={34} rx={8} fill={COLORS.ice} opacity={0.85} />
        <rect x={LEFT} y={AXIS_Y - 64} width={(stretchedW / hours) * WIDTH} height={34} rx={8} fill={COLORS.red} opacity={0.85} />
        <line x1={xOf(head)} x2={xOf(head)} y1={AXIS_Y - 160} y2={AXIS_Y + 20} stroke={COLORS.text} strokeWidth={3} />
        <circle cx={xOf(head)} cy={AXIS_Y} r={10} fill={COLORS.text} />
      </svg>

      <div style={{ position: "absolute", left: LEFT, top: AXIS_Y - 160, fontFamily: FONTS.mono, fontSize: 24, color: COLORS.ice, opacity: ramp(frame, sweepStart, sweepStart + 10) }}>
        NORMAL DEFROST · {normalHours}h
      </div>
      <div style={{ position: "absolute", left: xOf(Math.min(head, stretchedHours)) + 18, top: AXIS_Y - 66, fontFamily: FONTS.mono, fontSize: 24, color: COLORS.red, opacity: ramp(frame, sweepStart + 20, sweepStart + 30) }}>
        STRETCHED · {stretchedHours}h
      </div>
      <div style={{ position: "absolute", left: LEFT, top: AXIS_Y + 70, fontFamily: FONTS.mono, fontSize: 22, color: COLORS.muted }}>{axisLabel}</div>

      {events.map((ev, i) => {
        const reachedAt = interpolate(ev.hour, [0, hours], [sweepStart, sweepEnd]);
        const color = toneColor(ev.tone);
        const width = 420;
        const x = Math.min(Math.max(xOf(ev.hour) - width / 2, 60), 1920 - 60 - width);
        return (
          <div
            key={ev.text}
            style={{
              ...riseIn(frame, fps, reachedAt, 30),
              position: "absolute",
              left: x,
              top: AXIS_Y + 120 + (i % 2) * 130,
              width,
              padding: "16px 20px",
              borderRadius: 14,
              backgroundColor: COLORS.panel,
              borderLeft: `6px solid ${color}`,
              fontFamily: FONTS.sans,
              fontSize: 30,
              lineHeight: 1.18,
              color: COLORS.text,
            }}
          >
            {ev.text}
          </div>
        );
      })}
      {events.map((ev) => (
        <Sfx key={`s-${ev.text}`} name={ev.tone === "red" ? "thump" : "pop"} at={interpolate(ev.hour, [0, hours], [sweepStart, sweepEnd])} volume={ev.tone === "red" ? 0.55 : 0.7} />
      ))}
    </AbsoluteFill>
  );
};
