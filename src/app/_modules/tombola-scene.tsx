"use client";

import { Ball } from "@/app/_components/ball";
import { Drawer } from "@/app/_components/drawer";
import { Hexagon } from "@/app/_components/hexagon";
import { useKeyboard } from "@/app/_hooks/use-keyboard";
import { Controls, useGravity } from "@/app/_modules/controls";
import { OrthographicCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
} from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import { useCallback, useState } from "react";
import { type Frequency } from "tone/build/esm/core/type/Units";
import { v4 as uuidv4 } from "uuid";

function TombolaScene() {
  const gravity = useGravity();
  const [balls, setBalls] = useState<{ id: string; note: Frequency[] }[]>([]);

  useKeyboard((note) => {
    setBalls((prev) => [...prev, { id: uuidv4(), note }]);
  });

  const handleOutOfBounds = useCallback((idToRemove: string) => {
    setBalls((prevBalls) => prevBalls.filter((ball) => ball.id !== idToRemove));
  }, []);

  return (
    <div className="relative h-full w-full">
      <Drawer>
        <Controls />
      </Drawer>
      <Canvas className="h-full w-full">
        <Physics
          colliders="ball"
          maxCcdSubsteps={10}
          timeStep="vary"
          gravity={[0, gravity, 0]}
        >
          <Hexagon />
          {balls.map(({ id, note }) => (
            <Ball
              key={`ball-${id}`}
              id={id}
              position={[0, 0, 0]}
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

export { TombolaScene };
