import { DoubleSide } from "three";
import LiftMarker from "./LiftMarker";
import lifts from "../data/lifts.json";

type Lift = { id: string; name: string; status: "open"|"hold"|"closed"; x: number; z: number };

export default function ChamonixScene() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 300, 32, 32]} />
        <meshStandardMaterial color="#6aa06a" side={DoubleSide} />
      </mesh>

      <mesh position={[0, 3, 0]} castShadow>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial color="#e7ecef" />
      </mesh>

      {(lifts as Lift[]).map((lift) => (
        <LiftMarker key={lift.id} lift={lift} />
      ))}
    </>
  );
}