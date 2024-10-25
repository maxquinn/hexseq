"use client";

import { Knob } from "@/app/_components/knob";
import { useAudioPlayer } from "@/app/_hooks/use-audio-player";
import { lerp } from "@/app/_utils/lerp";
import { atom, useAtom, useAtomValue } from "jotai";

const realValues = {
  gravity: {
    min: 0,
    max: 98,
  },
  bounciness: {
    min: 0,
    max: 1,
  },
  rotationSpeed: {
    min: 0,
    max: 1.5,
  },
  openness: {
    min: 1,
    max: 2,
  },
} as const;

const gravityAtom = atom<number>(100);
const realGravityAtom = atom<number>((get) => {
  const gravity = get(gravityAtom);
  return lerp(realValues.gravity.min, realValues.gravity.max, gravity);
});
export const useGravity = () => useAtomValue(realGravityAtom);

const bouncinessAtom = atom<number>(100);
const realBouncinessAtom = atom<number>((get) => {
  const bounciness = get(bouncinessAtom);
  return lerp(realValues.bounciness.min, realValues.bounciness.max, bounciness);
});
export const useBounciness = () => useAtomValue(realBouncinessAtom);

const rotationSpeedAtom = atom<number>(30);
const realRotationSpeedAtom = atom<number>((get) => {
  const rotationSpeed = get(rotationSpeedAtom);
  return lerp(
    realValues.rotationSpeed.min,
    realValues.rotationSpeed.max,
    rotationSpeed,
  );
});
export const useRotationSpeed = () => useAtomValue(realRotationSpeedAtom);

const opennessAtom = atom<number>(0);
const realOpennessAtom = atom<number>((get) => {
  const openness = get(opennessAtom);
  return lerp(realValues.openness.min, realValues.openness.max, openness);
});
export const useOpenness = () => useAtomValue(realOpennessAtom);

function Controls() {
  const [gravity, setGravity] = useAtom(gravityAtom);
  const [bounciness, setBounciness] = useAtom(bouncinessAtom);
  const [rotationSpeed, setRotationSpeed] = useAtom(rotationSpeedAtom);
  const [openness, setOpenness] = useAtom(opennessAtom);
  const {
    start: startVinylSim,
    stop: stopVinylSim,
    volume: vinylSimVolume,
    setVolume: setVinylSimVolume,
    state: vinylSimState,
  } = useAudioPlayer({
    initialVolume: 0,
    audioUrl: "/audio/vinyl-sim.mp3",
  });
  const {
    start: startRain,
    stop: stopRain,
    volume: rainVolume,
    setVolume: setRainVolume,
    state: rainState,
  } = useAudioPlayer({
    initialVolume: 0,
    audioUrl: "/audio/rain.mp3",
  });

  const handleVinylSimVolumeChange = (v: number) => {
    if (v > 0) {
      if (!vinylSimState.isPlaying) {
        startVinylSim().catch((error) => {
          console.error("Error starting audio player:", error);
        });
      }
    } else {
      stopVinylSim();
    }
    setVinylSimVolume(v);
  };

  const handleRainVolumeChange = (v: number) => {
    if (v > 0) {
      if (!rainState.isPlaying) {
        startRain().catch((error) => {
          console.error("Error starting audio player:", error);
        });
      }
    } else {
      stopRain();
    }
    setRainVolume(v);
  };

  return (
    <>
      <div className="absolute z-20 flex h-full w-full flex-1 flex-col justify-between p-6 md:p-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-[repeat(4,minmax(min-content,max-content))]">
          <Knob
            label="Vinyl Sim Volume"
            valueMin={0}
            valueMax={100}
            value={vinylSimVolume}
            onChange={handleVinylSimVolumeChange}
          />
          <Knob
            label="Rain Volume"
            valueMin={0}
            valueMax={100}
            value={rainVolume}
            onChange={handleRainVolumeChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-[repeat(4,minmax(min-content,max-content))]">
          <Knob
            label="Shape"
            valueMin={0}
            valueMax={100}
            value={openness}
            onChange={(value) => {
              setOpenness(value);
            }}
          />
          <Knob
            label="Gravity"
            valueMin={0}
            valueMax={100}
            value={gravity}
            onChange={(value) => {
              setGravity(value);
            }}
          />
          <Knob
            label="Bounce"
            valueMin={0}
            valueMax={100}
            value={bounciness}
            onChange={(value) => {
              setBounciness(value);
            }}
          />
          <Knob
            label="Rotation"
            valueMin={0}
            valueMax={100}
            value={rotationSpeed}
            onChange={(value) => {
              setRotationSpeed(value);
            }}
          />
        </div>
      </div>
    </>
  );
}

export { Controls };
