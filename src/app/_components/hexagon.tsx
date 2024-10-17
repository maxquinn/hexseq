import { useSynth } from "@/app/_hooks/use-synth";
import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  type RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useRef } from "react";
import { Quaternion } from "three";

const sides = 6;
const radius = 24;
const sideThickness = 1;
const sideHeight = 1;
const angleIncrement = (2 * Math.PI) / sides;
const distanceToSide = radius * Math.cos(Math.PI / 6) - sideThickness / 2;
const sideArray = Array.from({ length: sides });
const rotationSpeed = 0.7;

function Hexagon({ bounciness }: { bounciness: number }) {
  const synth = useSynth();
  const rotationAngle = useRef(0);
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  useFrame((_, delta) => {
    if (rigidBodyRef.current) {
      rotationAngle.current += rotationSpeed * delta;
      // Create a quaternion for Z-axis rotation
      const quaternion = new Quaternion();
      quaternion.setFromAxisAngle({ x: 0, y: 0, z: 1 }, rotationAngle.current);

      rigidBodyRef.current.setNextKinematicRotation(quaternion);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition"
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      restitution={bounciness}
    >
      {sideArray.map((_, i) => {
        const angle = Math.PI / 2 + i * angleIncrement;
        const x = distanceToSide * Math.cos(angle);
        const y = distanceToSide * Math.sin(angle);
        return (
          <group
            key={i}
            position={[x, y, 0]}
            rotation={[0, 0, angle + Math.PI / 2]}
          >
            <CuboidCollider
              args={[radius / 2, sideThickness / 2, sideHeight / 2]}
              restitution={bounciness}
              onCollisionEnter={(e) => {
                if (typeof e.rigidBodyObject?.userData.note === "string") {
                  synth.triggerAttackRelease(
                    e.rigidBodyObject?.userData.note,
                    "8n",
                  );
                }
              }}
            />
            <mesh castShadow receiveShadow>
              <boxGeometry args={[radius, sideThickness, sideHeight]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        );
      })}
    </RigidBody>
  );
}

export { Hexagon };
