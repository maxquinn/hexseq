import { useRef } from "react";
import { Synth, Reverb } from "tone";

type Options = ConstructorParameters<typeof Synth>[0];

function useSynth(options?: Options): Synth {
  const reverb = new Reverb({
    wet: 1,
    decay: 1.5,
    preDelay: 0.01,
  }).toDestination();
  const synth = useRef<Synth>(new Synth(options).connect(reverb));

  return synth.current;
}

export { useSynth };
