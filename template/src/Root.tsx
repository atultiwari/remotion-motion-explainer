import { CalculateMetadataFunction, Composition, Folder } from "remotion";
import {
  calculateExplainerMetadata,
  type ExplainerProps,
} from "./calculateMetadata";
import { parseSceneGraph } from "./data/schema";
import scenesJson from "./data/scenes.json";
import { MotionExplainer } from "./MotionExplainer";

const graph = parseSceneGraph(scenesJson);

/** Preview a single scene: same pipeline, filtered to one scene id. */
const singleScene =
  (sceneId: string): CalculateMetadataFunction<ExplainerProps> =>
  async (args) => {
    const only = {
      ...args.props.graph,
      scenes: args.props.graph.scenes.filter((s) => s.id === sceneId),
    };
    return calculateExplainerMetadata({
      ...args,
      props: { ...args.props, graph: only },
    });
  };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Explainer"
        component={MotionExplainer}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ graph }}
        calculateMetadata={calculateExplainerMetadata}
      />
      <Folder name="Scenes">
        {graph.scenes.map((scene) => (
          <Composition
            key={scene.id}
            id={scene.id.replace(/_/g, "-")}
            component={MotionExplainer}
            durationInFrames={300}
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ graph }}
            calculateMetadata={singleScene(scene.id)}
          />
        ))}
      </Folder>
    </>
  );
};
