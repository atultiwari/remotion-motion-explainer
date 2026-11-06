import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { BeatTag } from "../components/BeatTag";
import { Captions } from "../components/Captions";
import { Sfx, SfxContext } from "../components/Sfx";
import { SourceLowerThird } from "../components/SourceLowerThird";
import { Watermark } from "../components/Watermark";
import type { SceneMeta, TimedScene } from "../data/schema";
import { SCENE_COMPONENTS } from "./registry";

const TRANSITION_FRAMES = 12;
/** Newspaper-style scenes print their sources on the paper itself. */
const PAPER_COMPONENTS = new Set(["NewspaperFrontPage", "ClippingsWall"]);

const enterStyle = (transition: TimedScene["transition"], frame: number): React.CSSProperties => {
  const p = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (transition === "fade") return { opacity: p };
  if (transition === "slide") return { opacity: p, translate: `${(1 - p) * 120}px 0px` };
  return {};
};

/** One scene: its visual, the file tag, source tag, captions, narration, transition sound and watermark. */
export const SceneShell: React.FC<{ scene: TimedScene; meta: SceneMeta; showCaptions: boolean }> = ({ scene, meta, showCaptions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Component = SCENE_COMPONENTS[scene.component];
  if (!Component) {
    throw new Error(`Scene "${scene.id}" uses unknown component "${scene.component}". Register it in src/scenes/registry.ts.`);
  }
  const showTag = scene.beat !== "S1" && scene.beat !== "S2" && !PAPER_COMPONENTS.has(scene.component);
  const transitionSound = scene.transition === "slide" || scene.transition === "fade";

  return (
    <SfxContext.Provider value={meta.sfx}>
      <AbsoluteFill>
        {/* The ground stays put while the scene fades in, so a fade never passes through black. */}
        <Backdrop />
        <AbsoluteFill style={enterStyle(scene.transition, frame)}>
          <Component {...scene.props} onScreenText={scene.onScreenText} durationInFrames={scene.durationInFrames} meta={meta} />
        </AbsoluteFill>
        {showTag ? <BeatTag title={meta.beatTitles[scene.beat] ?? scene.beat} /> : null}
        {scene.sourceCitation && !PAPER_COMPONENTS.has(scene.component) ? <SourceLowerThird citation={scene.sourceCitation} /> : null}
        {showCaptions && scene.captions ? <Captions cues={scene.captions} /> : null}
        <Watermark text={meta.brand.watermark} handle={meta.brand.handle} />
        {transitionSound ? <Sfx name="whoosh" at={0} volume={scene.transition === "slide" ? 0.7 : 0.35} /> : null}
        {scene.audioSrc ? <Audio src={staticFile(scene.audioSrc)} premountFor={fps} /> : null}
      </AbsoluteFill>
    </SfxContext.Provider>
  );
};
