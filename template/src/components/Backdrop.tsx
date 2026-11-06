import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export type Mood = "cool" | "violet" | "hope";

/** Three soft glows per mood; heat blends them toward amber and red. */
const MOODS: Record<Mood, [string, string, string]> = {
  cool: ["15,163,177", "76,59,207", "194,24,91"],
  violet: ["124,77,255", "33,150,243", "236,64,122"],
  hope: ["0,191,165", "38,166,154", "41,121,255"],
};
const WARM: [string, string, string] = ["255,122,47", "255,77,79", "245,166,35"];

const glow = (rgb: string, alpha: number, x: number, y: number, size: number) =>
  `radial-gradient(circle at ${x}% ${y}%, rgba(${rgb},${alpha}) 0%, rgba(${rgb},0) ${size}%)`;

/**
 * Colour-rich "incident report" ground: navy base, drifting aurora glows, a faint
 * grid and a light vignette. Motion is driven by the frame only (no CSS animation).
 */
export const Backdrop: React.FC<{ heat?: number; mood?: Mood }> = ({ heat = 0, mood = "cool" }) => {
  const frame = useCurrentFrame();
  const [a, b, c] = MOODS[mood];
  const d = (speed: number, phase: number, amp: number) => Math.sin(frame / speed + phase) * amp;
  const cool = 1 - heat;
  const layers = [
    glow(a, 0.34 * cool, 18 + d(140, 0, 6), 22 + d(170, 1, 5), 48),
    glow(b, 0.3 * cool, 82 + d(160, 2, 6), 30 + d(150, 3, 6), 46),
    glow(c, 0.16 * cool, 60 + d(190, 4, 8), 88 + d(130, 5, 4), 44),
    glow(WARM[0], 0.38 * heat, 22 + d(120, 1, 5), 30, 50),
    glow(WARM[1], 0.42 * heat, 75 + d(110, 2, 5), 60, 52),
    glow(WARM[2], 0.2 * heat, 50, 95, 40),
  ];

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, #0B1B30 0%, ${COLORS.bg} 50%, #170F30 100%)` }}>
      <AbsoluteFill style={{ background: layers.join(", ") }} />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(rgba(127,216,245,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(127,216,245,0.06) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          backgroundPosition: `${(frame * 0.15) % 64}px 0px`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
    </AbsoluteFill>
  );
};
