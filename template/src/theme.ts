import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadUnifraktur } from "@remotion/google-fonts/UnifrakturMaguntia";
import { loadFont as loadOldStandard } from "@remotion/google-fonts/OldStandardTT";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

const sans = loadSpaceGrotesk("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });
const mono = loadJetBrainsMono("normal", { weights: ["400", "700"], subsets: ["latin"] });
const blackletter = loadUnifraktur("normal", { weights: ["400"], subsets: ["latin"] });
const serif = loadOldStandard("normal", { weights: ["400", "700"], subsets: ["latin"] });
const display = loadPlayfair("normal", { weights: ["700", "900"], subsets: ["latin"] });

export const FONTS = {
  sans: sans.fontFamily,
  mono: mono.fontFamily,
  blackletter: blackletter.fontFamily,
  serif: serif.fontFamily,
  display: display.fontFamily,
} as const;

export const COLORS = {
  bg: "#0B1117",
  bgDeep: "#070B0F",
  panel: "#131D26",
  panelEdge: "#22313E",
  grid: "rgba(127, 216, 245, 0.05)",
  text: "#E8EEF2",
  muted: "#8696A3",
  ice: "#7FD8F5",
  iceDeep: "#2E9CC4",
  amber: "#F5A623",
  orange: "#FF7A2F",
  red: "#FF4D4F",
  pink: "#FF7AB6",
  violet: "#B18CFF",
  green: "#4ADE80",
  paper: "#E8DCC0",
  paperDark: "#CDBB93",
  ink: "#2A2118",
  inkSoft: "#5A4A38",
} as const;

export type Tone = "ice" | "amber" | "red" | "orange" | "pink" | "violet" | "green";

export const toneColor = (tone: string | undefined): string => {
  const map: Record<string, string> = {
    ice: COLORS.ice,
    amber: COLORS.amber,
    red: COLORS.red,
    orange: COLORS.orange,
    pink: COLORS.pink,
    violet: COLORS.violet,
    green: COLORS.green,
  };
  return map[tone ?? "ice"] ?? COLORS.ice;
};

/** Temperature → colour: ice below 8°C, amber up to 30°C, red above. */
export const tempColor = (temp: number): string => {
  if (temp <= 8) return COLORS.ice;
  if (temp <= 30) return COLORS.amber;
  return COLORS.red;
};

export const LAYOUT = {
  safeX: 120,
  safeTop: 100,
  captionZone: 210,
} as const;
