"use client";

import { useDetuneSynth } from "@/app/_hooks/use-synth";
import {
  useBounciness,
  useOpenness,
  useRotationSpeed,
} from "@/app/_modules/controls";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, type RapierCollider } from "@react-three/rapier";
import { Fragment, useRef } from "react";
import { type Mesh, Quaternion, Vector3 } from "three";
import { type Frequency } from "tone/build/esm/core/type/Units";

const sides = 6;
const radius = 18;
const sideThickness = 1;
const sideHeight = 1;
const angleIncrement = (2 * Math.PI) / sides;
const distanceToSide = radius * Math.cos(Math.PI / 6) - sideThickness / 2;
const sideArray = Array.from({ length: sides });

function Hexagon() {
  const bounciness = useBounciness();
  const rotationSpeed = useRotationSpeed();
  const openness = useOpenness();
  const playSound = useDetuneSynth();
  const rotationAngle = useRef(0);
  const colliderRefs = useRef<(RapierCollider | null)[]>(
    Array(sides).fill(null) as null[],
  );
  const meshRefs = useRef<(Mesh | null)[]>(Array(sides).fill(null) as null[]);

  // Handle continuous rotation and update side positions
  useFrame((_, delta) => {
    rotationAngle.current += rotationSpeed * delta;
    const wholeRotation = new Quaternion().setFromAxisAngle(
      { x: 0, y: 0, z: 1 },
      rotationAngle.current,
    );

    colliderRefs.current.forEach((collider, i) => {
      if (collider) {
        const angle = i * angleIncrement;
        const baseRotation = Math.PI / openness + angle + Math.PI / 2;

        // Calculate position relative to center
        const baseX = distanceToSide * Math.cos(angle);
        const baseY = distanceToSide * Math.sin(angle);
        const basePosition = new Vector3(baseX, baseY, 0);

        // Rotate the position around the center
        basePosition.applyQuaternion(wholeRotation);

        // Update position
        // rigidBody.setNextKinematicTranslation(basePosition);
        collider.setTranslation(basePosition);
        const child = meshRefs.current[i];
        if (child) {
          child.position.copy(collider.translation());
        }

        // Combine the opening rotation with the whole shape rotation
        const sideRotation = new Quaternion().setFromAxisAngle(
          { x: 0, y: 0, z: 1 },
          baseRotation,
        );

        // Ensure proper quaternion multiplication order
        const finalRotation = sideRotation.multiply(wholeRotation);

        // rigidBody.setNextKinematicRotation(finalRotation);
        collider.setRotation(finalRotation);
        if (child) {
          child.rotation.setFromQuaternion(finalRotation);
        }
      }
    });
  });

  const setColliderRef = (index: number) => (ref: RapierCollider | null) => {
    colliderRefs.current[index] = ref;
  };

  const setMeshRef = (index: number) => (ref: Mesh | null) => {
    meshRefs.current[index] = ref;
  };

  return (
    <>
      {sideArray.map((_, i) => {
        const angle = i * angleIncrement;
        const baseRotation = angle + Math.PI / 2;
        const x = distanceToSide * Math.cos(angle);
        const y = distanceToSide * Math.sin(angle);

        return (
          <Fragment key={`hex-wall-${i}`}>
            <CuboidCollider
              ref={setColliderRef(i)}
              position={[x, y, 0]}
              rotation={[0, 0, baseRotation]}
              restitution={bounciness}
              friction={0}
              args={[radius / 2, sideThickness / 2, sideHeight / 2]}
              onCollisionEnter={(e) => {
                playSound(e.rigidBodyObject?.userData.note as Frequency[]);
              }}
            />
            <mesh castShadow receiveShadow ref={setMeshRef(i)}>
              <boxGeometry args={[radius, sideThickness, sideHeight]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </Fragment>
        );
      })}
    </>
  );
}

export { Hexagon };
