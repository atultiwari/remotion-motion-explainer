import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../../theme";
import { Icon } from "../Icon";

/**
 * The "moving photograph" inside the newspaper, Daily Prophet style:
 * a sepia, slightly flickering loop rather than a still.
 */
export const MovingPicture: React.FC<{ kind: string; width: number; height: number }> = ({ kind, width, height }) => {
  const frame = useCurrentFrame();
  const flicker = 0.92 + 0.08 * Math.sin(frame * 1.7) * Math.sin(frame * 0.37);
  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#1d1812",
        filter: `sepia(0.85) contrast(1.15) brightness(${flicker})`,
        boxShadow: "inset 0 0 60px rgba(0,0,0,0.8)",
      }}
    >
      {kind === "agent" ? <AgentLoop frame={frame} /> : <ThermoLoop frame={frame} />}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)" }} />
    </div>
  );
};

const LOOP = 150;

const ThermoLoop: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame % LOOP;
  const temp = interpolate(f, [0, 110, LOOP], [4, 50, 50], { extrapolateRight: "clamp" });
  const color = temp > 30 ? COLORS.red : temp > 8 ? COLORS.amber : COLORS.ice;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 50 }}>
      <div style={{ width: 46, height: 300, borderRadius: 23, border: "4px solid #ddd", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: 0, width: "100%", height: `${(temp / 60) * 100}%`, backgroundColor: color }} />
      </div>
      <div style={{ fontFamily: FONTS.mono, fontSize: 130, fontWeight: 700, color }}>{temp.toFixed(0)}°C</div>
    </div>
  );
};

const AgentLoop: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame % LOOP;
  const x = interpolate(f, [0, 40, 55, 70, 85, 120, LOOP], [-260, -60, -90, -60, -90, 220, 220], { extrapolateRight: "clamp" });
  const lockOpen = f > 95;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", left: "50%", top: "50%", translate: "-50% -50%", color: lockOpen ? COLORS.red : "#eee" }}>
        <Icon name={lockOpen ? "door" : "lock"} size={150} strokeWidth={1.5} />
      </div>
      <div style={{ position: "absolute", left: "50%", top: "50%", translate: `${x - 70}px -50%`, color: "#eee", opacity: f > 110 ? 0.4 : 1 }}>
        <Icon name="bot" size={140} strokeWidth={1.5} />
      </div>
    </div>
  );
};
