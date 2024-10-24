import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  FeedbackDelay,
  Filter,
  FMSynth,
  Frequency,
  PingPongDelay,
  PolySynth,
  Reverb,
  Synth,
} from "tone";
import { type Frequency as Freq } from "tone/build/esm/core/type/Units";

type Play = (root: Freq) => void;

function usePadSynth(): Play {
  const pad = new PolySynth({
    options: {
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 2,
        decay: 3,
        sustain: 0.4,
        release: 4,
      },
    },
  }).toDestination();
  const synth = useRef<PolySynth>(pad);

  return (root: Freq) => {
    const third: Freq = Frequency(root).transpose(4).toNote();
    const fifth: Freq = Frequency(root).transpose(7).toNote();

    synth.current.triggerAttackRelease([root, third, fifth], "8n");
  };
}

function useShimmerSynth(): Play {
  const shimmer = new Synth({
    oscillator: {
      type: "sine",
    },
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 1,
      release: 4,
    },
  });

  const pingPongDelay = new PingPongDelay("4n", 0.5).toDestination();
  const reverb = new Reverb(5).toDestination();
  shimmer.connect(pingPongDelay);
  shimmer.connect(reverb);
  const synth = useRef<Synth>(shimmer);

  return (root: Freq) => {
    const octave = Math.random() > 0.5 ? "5" : "6";

    synth.current.triggerAttackRelease(
      root.toString().replace(/\d/, octave),
      "16n",
    );
  };
}

function useAtmosphereSynth(): Play {
  const atmosphere = new FMSynth({
    harmonicity: 3,
    modulationIndex: 10,
    envelope: {
      attack: 1,
      decay: 2,
      sustain: 0.8,
      release: 4,
    },
    modulation: {
      type: "triangle",
    },
  });
  const reverb = new Reverb({
    decay: 10,
    wet: 0.8,
    preDelay: 0.1,
  }).toDestination();
  atmosphere.connect(reverb);
  const synth = useRef<FMSynth>(atmosphere);

  return (root: Freq) => {
    synth.current.triggerAttackRelease(root, "4n");
  };
}

function useAmbientSynth(): Play {
  const polySynth = new PolySynth({
    options: {
      oscillator: {
        type: "sine",
      },
      envelope: {
        attack: 3,
        decay: 2,
        sustain: 0.3,
        release: 4,
      },
    },
  });

  const reverb = new Reverb({
    decay: 6,
    wet: 0.8,
    preDelay: 0.5,
  }).toDestination();

  const delay = new FeedbackDelay("4n", 0.6).connect(reverb);
  polySynth.connect(delay);
  const synth = useRef<PolySynth>(polySynth);

  return (root: Freq) => {
    synth.current.triggerAttackRelease(root, "8n");
  };
}

function useDetuneSynth() {
  const maxPolyphony = 24;
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

  const playSound = useCallback(
    (notes: Freq | Freq[], dur = "8n") => {
      if (synth.activeVoices < maxPolyphony) {
        synth.triggerAttackRelease(notes, dur);
      }
    },
    [synth],
  );

  return playSound;
}

export {
  useAmbientSynth,
  useAtmosphereSynth,
  useDetuneSynth,
  usePadSynth,
  useShimmerSynth,
};
