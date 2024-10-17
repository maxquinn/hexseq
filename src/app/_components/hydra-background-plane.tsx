"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { type Texture } from "three";

function HydraBackgroundPlane({ texture }: { texture: Texture }) {
  const viewport = useThree((state) => state.viewport);

  useFrame(() => {
    texture.needsUpdate = true;
  });

  return (
    <mesh renderOrder={1} scale={[viewport.width * 2, viewport.height * 2, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={texture} transparent={true} depthWrite={false} />
    </mesh>
  );
}

export { HydraBackgroundPlane };
