import { z } from "zod";

export const TRANSITIONS = ["cut", "fade", "slide", "spin"] as const;

export const sceneSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/, "scene id must be snake_case"),
  beat: z.string(),
  narration: z.string(),
  audioFile: z.string().optional(),
  estimatedDurationSec: z.number().positive(),
  component: z.string(),
  props: z.record(z.string(), z.unknown()),
  onScreenText: z.array(z.string()).default([]),
  sourceCitation: z.string().nullable(),
  // eslint-disable-next-line @remotion/non-pure-animation -- schema field name, not a CSS transition
  transition: z.enum(TRANSITIONS),
});

export const metaSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  fps: z.number().int().positive(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  wordsPerSecondEstimate: z.number().positive(),
  music: z.object({
    src: z.string(),
    volume: z.number().min(0).max(1),
    duckedVolume: z.number().min(0).max(1),
  }),
  factsAsOf: z.string(),
  beatTitles: z.record(z.string(), z.string()),
  mirrorHeaders: z.object({ left: z.string(), right: z.string() }),
  mirrorRows: z.array(z.object({ left: z.string(), right: z.string() })),
  checklist: z.object({
    title: z.string(),
    items: z.array(z.object({ icon: z.string(), text: z.string() })),
    indiaLowerThird: z.string(),
  }),
  thumbnail: z.object({ temp: z.string(), headline: z.string(), sub: z.string() }).optional(),
  sfx: z.object({ volume: z.number().min(0).max(1), enabled: z.boolean() }),
  brand: z.object({ watermark: z.string(), handle: z.string() }),
  chapterTitles: z.record(z.string(), z.string()).optional(),
  ttsPronunciations: z.record(z.string(), z.string()).default({}),
});

export const sceneGraphSchema = z
  .object({ meta: metaSchema, scenes: z.array(sceneSchema).min(1) })
  .superRefine((graph, ctx) => {
    const seen = new Set<string>();
    graph.scenes.forEach((scene, i) => {
      if (seen.has(scene.id)) {
        ctx.addIssue({ code: "custom", message: `duplicate scene id "${scene.id}"`, path: ["scenes", i, "id"] });
      }
      seen.add(scene.id);
    });
  });

export type Scene = z.infer<typeof sceneSchema>;
export type SceneMeta = z.infer<typeof metaSchema>;
export type SceneGraph = z.infer<typeof sceneGraphSchema>;

/** A scene with its resolved timing (from audio, or the estimate). */
export type TimedScene = Scene & {
  durationInFrames: number;
  audioSrc: string | null;
  captions: CaptionCue[] | null;
};

/** One caption cue in milliseconds, relative to the scene start. */
export type CaptionWord = { text: string; startMs: number };
export type CaptionCue = { text: string; startMs: number; endMs: number; words?: CaptionWord[] };

export const parseSceneGraph = (raw: unknown): SceneGraph => {
  const result = sceneGraphSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`scenes.json is invalid:\n${issues}`);
  }
  return result.data;
};
