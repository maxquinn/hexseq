import { RigidBody } from "@react-three/rapier";
import { type Frequency } from "tone/build/esm/core/type/Units";

function Ball({
  position,
  restitution,
  note,
}: {
  position: [number, number, number];
  restitution: number;
  note: Frequency;
}) {
  return (
    <RigidBody
      position={position}
      restitution={restitution}
      friction={0.2}
      linearDamping={0.2}
      angularDamping={0.2}
      colliders="ball"
      userData={{
        note: note,
      }}
    >
      <mesh>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color="aqua" />
      </mesh>
    </RigidBody>
  );
}

export { Ball };
