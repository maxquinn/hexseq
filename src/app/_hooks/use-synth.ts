import { useCallback, useEffect, useMemo, useRef } from "react";
import { Context, Filter, PolySynth, Reverb, setContext, start } from "tone";
import { type Frequency as Freq } from "tone/build/esm/core/type/Units";

function useSynth() {
  const maxPolyphony = 24;
  const context = useRef<Context>();

  const synth = useMemo<PolySynth>(() => {
    const filter = new Filter({
      type: "lowpass",
      frequency: 200,
      rolloff: -12,
      Q: 1,
    }).toDestination();

    const reverb = new Reverb({
      decay: 6,
      wet: 0.8,
      preDelay: 0.5,
    }).toDestination();

    const options: ConstructorParameters<typeof PolySynth>[0] = {
      maxPolyphony,
      options: {
        detune: -15,
        oscillator: {
          type: "triangle",
        },
        envelope: {
          attack: 1,
          decay: 0.2,
          sustain: 0.5,
          release: 1.2,
        },
      },
    };
    const detuneSynth = new PolySynth(options);
    detuneSynth.chain(filter, reverb);

    return detuneSynth;
  }, []);

  useEffect(() => {
    return () => {
      if (synth) {
        synth.dispose();
      }
    };
  }, [synth]);

  useEffect(() => {
    const newContext = new Context({
      latencyHint: "balanced",
    });
    context.current = newContext;
    setContext(context.current);
  }, []);

  const playSound = useCallback(
    (notes: Freq[], dur = "8n") => {
      if (context.current && context.current.state !== "running") {
        start().catch((error) => {
          console.error("Error starting Tone.js:", error);
        });
      }
      if (synth.activeVoices + notes.length <= maxPolyphony) {
        synth.triggerAttackRelease(notes, dur);
      }
    },
    [synth],
  );

  return playSound;
}

export { useSynth };
