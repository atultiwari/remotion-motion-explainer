import { Audio } from "@remotion/media";
import { AbsoluteFill, Series, staticFile, useVideoConfig } from "remotion";
import type { ExplainerProps } from "./calculateMetadata";
import { COLORS } from "./theme";
import { SceneShell } from "./scenes/SceneShell";

const DUCK_RAMP_FRAMES = 6;

/**
 * The full video. Scenes are generated from scenes.json on purpose: the JSON is
 * the single source of truth, so edit the story there rather than here.
 */
export const MotionExplainer: React.FC<ExplainerProps & { showCaptions?: boolean }> = ({ graph, timed, musicAvailable, showCaptions = true }) => {
  const { fps } = useVideoConfig();
  if (!timed) return <AbsoluteFill style={{ backgroundColor: COLORS.bg }} />;

  // Music ducks under any scene that has recorded narration.
  const starts = timed.reduce<number[]>((acc, s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + timed[i - 1].durationInFrames], []);
  const narratedAt = (f: number) =>
    timed.some((s, i) => s.audioSrc !== null && f >= starts[i] && f < starts[i] + s.durationInFrames);
  const { music } = graph.meta;
  // Average the duck state over a short window so the bed glides instead of stepping.
  const musicVolume = (f: number) => {
    const samples = Array.from({ length: DUCK_RAMP_FRAMES * 2 + 1 }, (_, k) => f - DUCK_RAMP_FRAMES + k);
    const ducked = samples.filter(narratedAt).length / samples.length;
    return music.volume + (music.duckedVolume - music.volume) * ducked;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Series>
        {timed.map((scene) => (
          <Series.Sequence key={scene.id} name={scene.id} durationInFrames={scene.durationInFrames} premountFor={fps}>
            <SceneShell scene={scene} meta={graph.meta} showCaptions={showCaptions} />
          </Series.Sequence>
        ))}
      </Series>
      {musicAvailable ? (
        <Audio src={staticFile(music.src)} loop volume={musicVolume} />
      ) : null}
    </AbsoluteFill>
  );
};
