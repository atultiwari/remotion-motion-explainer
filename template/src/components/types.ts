import type { SceneMeta } from "../data/schema";

/** Props every scene component receives, on top of its own `props` from scenes.json. */
export type SceneBaseProps = {
  readonly durationInFrames: number;
  readonly onScreenText: string[];
  readonly meta: SceneMeta;
};

export type SceneComponent<P> = React.FC<P & SceneBaseProps>;
