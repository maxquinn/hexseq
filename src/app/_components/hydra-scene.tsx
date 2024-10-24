"use client";

import { Ball } from "@/app/_components/ball";
import { Fader } from "@/app/_components/fader";
import { Hexagon } from "@/app/_components/hexagon";
import { HydraBackgroundPlane } from "@/app/_components/hydra-background-plane";
import { HydraRenderer } from "@/app/_components/hydra-renderer";
import { Knob } from "@/app/_components/knob";
import { useKeyboard } from "@/app/_hooks/use-keyboard";
import { useVinylSim } from "@/app/_hooks/use-vinyl-sim";
import { lerp } from "@/app/_utils/lerp";
import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import type Hydra from "hydra-synth";
import { useCallback, useEffect, useState } from "react";
import { CanvasTexture, RepeatWrapping, type Texture } from "three";
import { type Frequency } from "tone/build/esm/core/type/Units";
import { v4 as uuidv4 } from "uuid";

const realValues = {
  gravity: {
    min: 0,
    max: 100,
  },
  bounciness: {
    min: 0,
    max: 1.1,
  },
  rotationSpeed: {
    min: 0,
    max: 1,
  },
  openness: {
    min: 1,
    max: 2,
  },
  vinylSim: {
    min: 0,
    max: 25,
  },
} as const;

function HydraScene() {
  const [hydraTexture, setHydraTexture] = useState<Texture | null>(null);
  const [balls, setBalls] = useState<{ id: string; note: Frequency[] }[]>([]);
  const [gravity, setGravity] = useState<number>(100);
  const [bounciness, setBounciness] = useState<number>(100);
  const [rotationSpeed, setRotationSpeed] = useState<number>(70);
  const [openness, setOpenness] = useState<number>(0);
  const [vinylSim, setVinylSim] = useState<number>(0);
  const { start, stop, setVolume, state } = useVinylSim({
    initialVolume: 0,
    audioUrl: "/audio/vinyl-sim.mp3",
  });

  useKeyboard((note) => {
    setBalls((prev) => [...prev, { id: uuidv4(), note }]);
  });

  const handleHydraReady = useCallback((canvas: HTMLCanvasElement) => {
    const texture = new CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = RepeatWrapping;
    setHydraTexture(texture);
  }, []);

  const handleOutOfBounds = useCallback((idToRemove: string) => {
    setBalls((prevBalls) => prevBalls.filter((ball) => ball.id !== idToRemove));
  }, []);

  const sketch = useCallback((h: Hydra["synth"]) => {
    h.voronoi(10, 0.5, 10).modulatePixelate(h.noise(25, 0.5), 100).out(h.o0);
  }, []);

  useEffect(() => {
    if (!state.isPlaying) {
      start().catch((error) => {
        console.error("Error starting audio player:", error);
      });
    }

    setVolume(lerp(0, 25, vinylSim));
  }, [vinylSim, setVolume, state.isPlaying, start, stop]);

  useEffect(() => {
    start().catch((error) => {
      console.error("Error starting audio player:", error);
    });
  }, [start]);

  return (
    <div className="h-full w-full bg-black">
      <div className="absolute left-6 top-6 z-10">
        <div className="flex flex-col gap-6 md:flex-row">
          <Fader
            label="Vinyl Sim"
            min={0}
            max={100}
            value={vinylSim}
            onChange={(value) => {
              setVinylSim(value);
            }}
          />
        </div>
      </div>
      <div className="absolute bottom-6 left-6 z-10">
        <div className="flex flex-col gap-6 md:flex-row">
          <Knob
            label="Openness"
            min={0}
            max={100}
            value={openness}
            onChange={(value) => {
              setOpenness(value);
            }}
          />
          <Knob
            label="Gravity"
            min={0}
            max={100}
            value={gravity}
            onChange={(value) => {
              setGravity(value);
            }}
          />
          <Knob
            label="Bounciness"
            min={0}
            max={100}
            value={bounciness}
            onChange={(value) => {
              setBounciness(value);
            }}
          />
          <Knob
            label="Rotation"
            min={0}
            max={100}
            value={rotationSpeed}
            onChange={(value) => {
              setRotationSpeed(value);
            }}
          />
        </div>
      </div>
      <HydraRenderer sketch={sketch} onHydraReady={handleHydraReady} />
      <Canvas className="h-full w-full">
        {hydraTexture && <HydraBackgroundPlane texture={hydraTexture} />}
        <Physics
          colliders="ball"
          maxCcdSubsteps={10}
          timeStep="vary"
          gravity={[
            0,
            lerp(realValues.gravity.min, realValues.gravity.max, gravity),
            0,
          ]}
          debug
        >
          <Hexagon
            bounciness={lerp(
              realValues.bounciness.min,
              realValues.bounciness.max,
              bounciness,
            )}
            rotationSpeed={lerp(
              realValues.rotationSpeed.min,
              realValues.rotationSpeed.max,
              rotationSpeed,
            )}
            openness={lerp(
              realValues.openness.min,
              realValues.openness.max,
              openness,
            )}
          />
          {balls.map(({ id, note }) => (
            <Ball
              key={`ball-${id}`}
              id={id}
              position={[0, 0, 0]}
              bounciness={lerp(
                realValues.bounciness.min,
                realValues.bounciness.max,
                bounciness,
              )}
              note={note}
              onOutOfBounds={handleOutOfBounds}
            />
          ))}
        </Physics>
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <OrthographicCamera makeDefault position={[0, 0, 1]} zoom={-10} />
        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={1} levels={7} intensity={1} />
          <ToneMapping />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

export { HydraScene };
