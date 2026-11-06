import { cueFrame } from "../lib/cues";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ramp, riseIn } from "../lib/motion";
import { COLORS, FONTS } from "../theme";
import { Backdrop } from "./Backdrop";
import { Icon } from "./Icon";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

export type HospitalNetworkProps = {
  phase: "closed" | "open";
  nodes: string[];
  wallLabel: string;
  doors?: string[];
  note: string;
  incident?: string;
  doorCues?: { at?: number }[];
  incidentCue?: { at?: number };
};

const WALL = { x: 580, y: 190, w: 760, h: 560 };
const COLS = [720, 960, 1200];
const ROWS = [370, 610];
const DOOR_SLOTS = [
  { x: 110, y: 200, side: "left" }, { x: 1480, y: 260, side: "right" }, { x: 110, y: 430, side: "left" },
  { x: 1480, y: 560, side: "right" }, { x: 110, y: 660, side: "left" },
] as const;

const nodePos = (i: number) => ({ x: COLS[i % 3], y: ROWS[Math.floor(i / 3) % 2] });

export const HospitalNetwork: SceneComponent<HospitalNetworkProps> = ({ durationInFrames, phase, nodes, wallLabel, doors = [], note, incident, doorCues = [], incidentCue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (doors.length > DOOR_SLOTS.length) {
    throw new Error(`HospitalNetwork supports at most ${DOOR_SLOTS.length} doors, got ${doors.length}.`);
  }
  const isOpen = phase === "open";
  const per = (durationInFrames * 0.7) / Math.max(1, doors.length);
  const doorStart = (i: number) => cueFrame(doorCues[i], (fps * 1 + i * per) / durationInFrames, durationInFrames);
  const incidentAt = cueFrame(incidentCue, 0.55, durationInFrames);
  const opened = doors.filter((_, i) => frame > doorStart(i)).length;
  const danger = isOpen ? opened / Math.max(1, doors.length) : 0;
  const wallColor = isOpen ? (danger > 0.5 ? COLORS.red : COLORS.amber) : COLORS.ice;
  const links: [number, number][] = [[0, 1], [1, 2], [3, 4], [4, 5], [0, 3], [1, 4], [2, 5]];

  return (
    <AbsoluteFill>
      <Backdrop heat={danger * 0.6} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <rect x={WALL.x} y={WALL.y} width={WALL.w} height={WALL.h} rx={36} fill="rgba(127,216,245,0.04)" stroke={wallColor} strokeWidth={8} opacity={ramp(frame, 0, 15)} />
        {links.map(([a, b]) => {
          const pa = nodePos(a);
          const pb = nodePos(b);
          return <line key={`${a}-${b}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={COLORS.iceDeep} strokeWidth={3} strokeDasharray="10 8" strokeDashoffset={-frame} opacity={ramp(frame, 10, 30)} />;
        })}
        {doors.map((door, i) => {
          const slot = DOOR_SLOTS[i];
          const node = nodePos(slot.side === "left" ? (i % 2 === 0 ? 0 : 3) : i % 2 === 0 ? 2 : 5);
          const p = ramp(frame, doorStart(i), doorStart(i) + 18);
          const ex = slot.side === "left" ? slot.x + 330 : slot.x;
          const ey = slot.y + 45;
          const wx = slot.side === "left" ? WALL.x : WALL.x + WALL.w;
          const wy = node.y + (ey - node.y) * ((wx - node.x) / (ex - node.x));
          return (
            <g key={door} opacity={p}>
              <line x1={node.x} y1={node.y} x2={node.x + (ex - node.x) * p} y2={node.y + (ey - node.y) * p} stroke={COLORS.red} strokeWidth={4} />
              <rect x={wx - 14} y={wy - 34} width={28} height={68} rx={6} fill={COLORS.bg} stroke={COLORS.red} strokeWidth={4} />
            </g>
          );
        })}
      </svg>

      <div style={{ position: "absolute", left: WALL.x, top: WALL.y - 56, width: WALL.w, textAlign: "center", fontFamily: FONTS.mono, fontSize: 26, letterSpacing: 4, color: wallColor }}>
        {wallLabel.toUpperCase()}
      </div>

      {nodes.map((label, i) => {
        const p = nodePos(i);
        return (
          <div key={label} style={{ ...riseIn(frame, fps, 4 + i * 3, 20), position: "absolute", left: p.x - 105, top: p.y - 42, width: 210, height: 84, borderRadius: 14, backgroundColor: COLORS.panel, border: `2px solid ${COLORS.panelEdge}`, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontFamily: FONTS.sans, fontSize: 28, fontWeight: 500, color: COLORS.text }}>
            {label}
          </div>
        );
      })}

      {doors.map((door, i) => {
        const slot = DOOR_SLOTS[i];
        return (
          <div key={door} style={{ ...riseIn(frame, fps, doorStart(i) + 8, 20), position: "absolute", left: slot.x, top: slot.y, width: 330, minHeight: 90, borderRadius: 14, padding: "12px 18px", backgroundColor: "rgba(255,77,79,0.12)", border: `2px solid ${COLORS.red}`, display: "flex", alignItems: "center", gap: 14, fontFamily: FONTS.sans, fontSize: 27, lineHeight: 1.15, color: COLORS.text }}>
            <div style={{ color: COLORS.red, flexShrink: 0 }}><Icon name={i % 2 === 0 ? "cloud" : "globe"} size={38} /></div>
            {door}
          </div>
        );
      })}

      {incident ? (
        <div style={{ ...riseIn(frame, fps, incidentAt, 20), position: "absolute", left: WALL.x, top: WALL.y + WALL.h + 26, width: WALL.w, textAlign: "center", fontFamily: FONTS.mono, fontSize: 28, color: COLORS.amber }}>
          ⚠ {incident}
        </div>
      ) : null}
      <div style={{ position: "absolute", right: 60, bottom: 214, fontFamily: FONTS.mono, fontSize: 22, color: COLORS.muted, opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }) }}>{note}</div>
      {nodes.map((label, i) => (
        <Sfx key={`s-${label}`} name="tick" at={4 + i * 3} volume={0.5} />
      ))}
      {doors.map((door, i) => (
        <Sfx key={`d-${door}`} name="glitch" at={doorStart(i)} volume={0.75} />
      ))}
      {incident ? <Sfx name="thump" at={incidentAt} volume={0.6} /> : null}
    </AbsoluteFill>
  );
};
