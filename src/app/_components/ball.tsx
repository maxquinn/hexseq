import { useFrame } from "@react-three/fiber";
import { type RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { type Frequency } from "tone/build/esm/core/type/Units";

function Ball({
  id,
  position,
  bounciness,
  note,
  onOutOfBounds,
}: {
  id: string;
  position: [number, number, number];
  bounciness: number;
  note: Frequency[];
  onOutOfBounds: (id: string) => void;
}) {
  const ballRef = useRef<RapierRigidBody>(null);
  const [collided, setCollided] = useState<boolean>(false);

  useEffect(() => {
    if (collided) {
      setTimeout(() => {
        setCollided(false);
      }, 1000);
    }
  }, [collided]);

  useFrame(() => {
    if (ballRef.current) {
      const { x, y, z } = ballRef.current.translation();

      if (Math.abs(x) > 100 || Math.abs(y) > 100 || Math.abs(z) > 100) {
        onOutOfBounds(id);
      }
    }
  });

  return (
    <RigidBody
      key={id}
      ref={ballRef}
      position={position}
      restitution={bounciness}
      colliders="ball"
      type="dynamic"
      ccd
      userData={{
        note: note,
      }}
      onCollisionExit={() => {
        setCollided(true);
      }}
    >
      <mesh>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial
          color="aqua"
          emissive="aqua"
          emissiveIntensity={collided ? 4 : 0}
        />
      </mesh>
    </RigidBody>
  );
}

export { Ball };
