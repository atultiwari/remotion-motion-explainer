import type { CalculateMetadataFunction } from "remotion";
import { parseSceneGraph, type SceneGraph, type TimedScene } from "./data/schema";
import { getAudioDurationSec, loadCaptionFile, publicFileExists } from "./lib/assets";
import { flattenWords, resolveWordCues } from "./lib/cues";
import { estimateCues, sceneFrames } from "./lib/timing";

export type ExplainerProps = {
  readonly graph: SceneGraph;
  readonly timed?: TimedScene[];
  readonly musicAvailable?: boolean;
};

const audioPathFor = (sceneId: string, audioFile: string | undefined) =>
  audioFile ?? `audio/${sceneId}.wav`;

export const calculateExplainerMetadata: CalculateMetadataFunction<ExplainerProps> = async ({
  props,
  abortSignal,
}) => {
  const graph = parseSceneGraph(props.graph);
  const { fps } = graph.meta;

  const timed: TimedScene[] = await Promise.all(
    graph.scenes.map(async (scene) => {
      const audioPath = audioPathFor(scene.id, scene.audioFile);
      const audioSec = scene.narration ? await getAudioDurationSec(audioPath, abortSignal) : null;
      const durationInFrames = sceneFrames(audioSec, scene.estimatedDurationSec, fps);
      const fileCues = await loadCaptionFile(`captions/${scene.id}.json`, abortSignal);
      const spokenMs = audioSec !== null ? audioSec * 1000 : (durationInFrames / fps) * 1000 - 600;
      const captions = fileCues ?? estimateCues(scene.narration, spokenMs);
      const words = flattenWords(captions);
      // Before narration exists there are no word timings, so cues fall back silently.
      const props = resolveWordCues(scene.props, words, (durationInFrames / fps) * 1000, (word) => {
        if (words.length > 0) console.warn(`Scene ${scene.id}: cue word "${word}" not found in the narration; using the fallback timing.`);
      }) as Record<string, unknown>;
      return {
        ...scene,
        props,
        durationInFrames,
        audioSrc: audioSec !== null ? audioPath : null,
        captions,
      };
    }),
  );

  const musicAvailable = await publicFileExists(graph.meta.music.src, abortSignal);
  const total = timed.reduce((sum, s) => sum + s.durationInFrames, 0);

  return {
    durationInFrames: total,
    fps,
    width: graph.meta.width,
    height: graph.meta.height,
    props: { ...props, graph, timed, musicAvailable },
    defaultOutName: "explainer",
  };
};
