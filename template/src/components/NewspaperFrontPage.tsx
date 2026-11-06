import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { springIn } from "../lib/motion";
import { keyframeValue } from "../lib/timing";
import { COLORS, FONTS } from "../theme";
import { MovingPicture } from "./newspaper/MovingPicture";
import { PaperTexture } from "./newspaper/PaperTexture";
import { Sfx } from "./Sfx";
import type { SceneComponent } from "./types";

export type NewspaperProps = {
  masthead: string;
  edition: string;
  headline: string;
  subhead: string;
  photo: "thermometer" | "agent";
  photoCaption: string;
  columns: string[];
  sideHeadline: string;
  sideText: string;
  footnote: string;
  /** Camera stops over the page: at (0..1 of scene), zoom, and focus point in page px. */
  camera?: { at: number; zoom: number; x: number; y: number }[];
};

const PAGE_W = 1400;
const PAGE_H = 1880;
const VIEW_CX = 960;
const VIEW_CY = 455; // optical centre, above the caption band

const DEFAULT_CAMERA = [
  { at: 0, zoom: 0.5, x: 700, y: 940 },
  { at: 0.14, zoom: 0.5, x: 700, y: 940 },
  { at: 0.3, zoom: 0.92, x: 700, y: 420 },
  { at: 0.55, zoom: 0.95, x: 700, y: 900 },
  { at: 0.8, zoom: 0.95, x: 700, y: 1400 },
  { at: 1, zoom: 0.88, x: 700, y: 1450 },
];

const Rule: React.FC<{ double?: boolean }> = ({ double }) => (
  <div style={{ borderTop: `3px solid ${COLORS.ink}`, borderBottom: double ? `1px solid ${COLORS.ink}` : "none", height: double ? 6 : 0, margin: "10px 0" }} />
);

const bodyText: React.CSSProperties = {
  fontFamily: FONTS.serif,
  fontSize: 27,
  lineHeight: 1.42,
  color: COLORS.ink,
  textAlign: "justify",
  hyphens: "auto",
};

export const NewspaperFrontPage: SceneComponent<NewspaperProps> = ({
  durationInFrames, masthead, edition, headline, subhead, photo, photoCaption, columns,
  sideHeadline, sideText, footnote, camera = DEFAULT_CAMERA,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / Math.max(1, durationInFrames - 1);

  // Classic spinning-newspaper arrival, then a slow camera move across the page.
  const spin = springIn(frame, fps, 0, 18, Math.round(fps * 1.3));
  const zoom = keyframeValue(camera.map((c) => ({ at: c.at, value: c.zoom })), t) * interpolate(spin, [0, 1], [0.05, 1]);
  const fx = keyframeValue(camera.map((c) => ({ at: c.at, value: c.x })), t);
  const fy = keyframeValue(camera.map((c) => ({ at: c.at, value: c.y })), t);
  const rotation = interpolate(spin, [0, 1], [-720, -1.5]);
  const highlight = interpolate(t, [0.3, 0.42], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const [lead, ...rest] = columns;

  return (
    <AbsoluteFill style={{ backgroundColor: "#120e0a" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #3a2c1e 0%, #120e0a 70%)" }} />
      <div
        style={{
          position: "absolute",
          width: PAGE_W,
          height: PAGE_H,
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: `translate(${VIEW_CX - fx * zoom}px, ${VIEW_CY - fy * zoom}px) scale(${zoom})`,
          }}
      >
        <div style={{ position: "absolute", inset: 0, transformOrigin: `${fx}px ${fy}px`, rotate: `${rotation}deg`, boxShadow: "0 40px 120px rgba(0,0,0,0.8)" }}>
          <PaperTexture id={headline.slice(0, 6).replace(/\W/g, "")} />
          <div style={{ position: "absolute", inset: 0, padding: "48px 64px" }}>
            <div style={{ fontFamily: FONTS.blackletter, fontSize: 132, textAlign: "center", color: COLORS.ink, lineHeight: 1.05 }}>{masthead}</div>
            <Rule double />
            <div style={{ fontFamily: FONTS.serif, fontSize: 22, letterSpacing: 4, textAlign: "center", color: COLORS.inkSoft }}>{edition}</div>
            <Rule double />
            <div style={{ position: "relative", fontFamily: FONTS.display, fontWeight: 900, fontSize: 104, lineHeight: 1.02, textAlign: "center", color: COLORS.ink, margin: "26px 0 14px", letterSpacing: -1 }}>
              {headline}
              <div style={{ position: "absolute", left: "8%", bottom: -8, height: 8, width: `${84 * highlight}%`, backgroundColor: "#8b1a1a", opacity: 0.8, borderRadius: 4 }} />
            </div>
            <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 36, lineHeight: 1.3, textAlign: "center", color: COLORS.inkSoft, padding: "0 60px" }}>{subhead}</div>
            <Rule />

            <div style={{ display: "flex", gap: 36, marginTop: 18 }}>
              <div style={{ width: 830 }}>
                <div style={{ padding: 12, border: `3px double ${COLORS.ink}` }}>
                  <MovingPicture kind={photo} width={800} height={500} />
                </div>
                <div style={{ fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 22, color: COLORS.inkSoft, marginTop: 10, textAlign: "center" }}>{photoCaption}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ border: `2px solid ${COLORS.ink}`, padding: "16px 20px", marginBottom: 18 }}>
                  <div style={{ fontFamily: FONTS.display, fontWeight: 900, fontSize: 40, color: "#8b1a1a" }}>{sideHeadline}</div>
                  <div style={{ ...bodyText, fontSize: 26, marginTop: 8 }}>{sideText}</div>
                </div>
                <div style={bodyText}>
                  <span style={{ float: "left", fontFamily: FONTS.display, fontWeight: 900, fontSize: 92, lineHeight: 0.85, marginRight: 10, marginTop: 6 }}>{lead?.charAt(0)}</span>
                  {lead?.slice(1)}
                </div>
              </div>
            </div>

            <Rule />
            <div style={{ display: "flex", gap: 34, marginTop: 10 }}>
              {rest.map((col) => (
                <div key={col.slice(0, 24)} style={{ ...bodyText, flex: 1, borderLeft: `1px solid ${COLORS.inkSoft}`, paddingLeft: 18 }}>{col}</div>
              ))}
            </div>
            <div style={{ position: "absolute", left: 64, right: 64, bottom: 40, fontFamily: FONTS.serif, fontStyle: "italic", fontSize: 21, color: COLORS.inkSoft, textAlign: "center", borderTop: `1px solid ${COLORS.inkSoft}`, paddingTop: 10 }}>
              {footnote}
            </div>
          </div>
        </div>
      </div>
      <Sfx name="paper-spin" at={0} />
      <Sfx name="paper-drop" at={Math.round(fps * 1.05)} volume={0.9} />
    </AbsoluteFill>
  );
};
