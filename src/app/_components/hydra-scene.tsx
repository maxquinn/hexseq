"use client";

import { Ball } from "@/app/_components/ball";
import { Hexagon } from "@/app/_components/hexagon";
import { HydraBackgroundPlane } from "@/app/_components/hydra-background-plane";
import { HydraRenderer } from "@/app/_components/hydra-renderer";
import { Knob } from "@/app/_components/knob";
import { useKeyboard } from "@/app/_hooks/use-keyboard";
import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import type Hydra from "hydra-synth";
import { useCallback, useState } from "react";
import { CanvasTexture, RepeatWrapping, type Texture } from "three";
import { type Frequency } from "tone/build/esm/core/type/Units";

function HydraScene() {
  const [hydraTexture, setHydraTexture] = useState<Texture | null>(null);
  const [balls, setBalls] = useState<Frequency[]>([]);
  const [gravity, setGravity] = useState<number>(20);
  const [bounciness, setBounciness] = useState<number>(50);

  useKeyboard((note) => {
    setBalls((prev) => [...prev, note]);
  });

  const handleHydraReady = useCallback((canvas: HTMLCanvasElement) => {
    const texture = new CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = RepeatWrapping;
    setHydraTexture(texture);
  }, []);

  const sketch = useCallback((h: Hydra["synth"]) => {
    h.voronoi(10, 0.5, 10)
      // .brightness(() => h.mouse.x / 1000)
      .modulatePixelate(h.noise(25, 0.5), 100)
      .modulate(h.o0, () => h.mouse.x * 0.02)
      // .saturate(() => h.mouse.y / 1000)
      .out(h.o0);
  }, []);

  return (
    <div className="h-full w-full">
      <div className="absolute bottom-6 left-6 z-10">
        <div className="flex flex-col gap-6 md:flex-row">
          <Knob
            label="Gravity"
            min={-100}
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
        </div>
      </div>
      <HydraRenderer sketch={sketch} onHydraReady={handleHydraReady} />
      <Canvas className="h-full w-full">
        {hydraTexture && <HydraBackgroundPlane texture={hydraTexture} />}
        <Physics gravity={[0, gravity, 0]}>
          <Hexagon bounciness={bounciness > 0 ? bounciness * 0.025 : 0} />
          {balls.map((note, i) => (
            <Ball
              key={`ball-${i}-${note}`}
              position={[0, 0, 0]}
              restitution={0}
              note={note}
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
      </Canvas>
    </div>
  );
}

export { HydraScene };
