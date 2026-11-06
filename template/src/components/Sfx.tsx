import { Audio } from "@remotion/media";
import { createContext, useContext } from "react";
import { Sequence, staticFile, useVideoConfig } from "remotion";

export const SFX_NAMES = [
  "whoosh", "paper-spin", "paper-drop", "thump", "tick", "pop", "blip", "chime",
  "riser", "alarm", "hum", "glitch", "counter",
] as const;
export type SfxName = (typeof SFX_NAMES)[number];

/** Master effects level, provided once per scene from scenes.json meta.sfx. */
export const SfxContext = createContext<{ volume: number; enabled: boolean }>({ volume: 0.5, enabled: true });

/**
 * A sound effect fired by the component that owns the visual event, at that
 * event's frame. Timing therefore follows the picture when a scene is retimed.
 */
export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number; loop?: boolean; durationInFrames?: number }> = ({
  name,
  at,
  volume = 1,
  loop = false,
  durationInFrames,
}) => {
  const { fps } = useVideoConfig();
  const master = useContext(SfxContext);
  if (!master.enabled || at < 0) return null;
  return (
    <Sequence name={`sfx:${name}`} from={Math.round(at)} durationInFrames={durationInFrames} layout="none">
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={master.volume * volume} loop={loop} premountFor={fps} />
    </Sequence>
  );
};
