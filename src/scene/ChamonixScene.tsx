import { DoubleSide } from "three";
import LiftMarker from "./LiftMarker";
import lifts from "../data/lifts.json";

type Lift = { id: string; name: string; status: "open"|"hold"|"closed"; x: number; z: number };

export default function ChamonixScene() {
  return (
    <>
      {/* Terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 300, 64, 64]} />
        <meshStandardMaterial 
          color="#4a7c59" 
          side={DoubleSide}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Snow-capped peaks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} receiveShadow>
        <planeGeometry args={[300, 300, 64, 64]} />
        <meshStandardMaterial 
          color="#ffffff" 
          side={DoubleSide}
          transparent
          opacity={0.3}
          roughness={0.2}
        />
      </mesh>

      {/* Valley floor (Chamonix town area) */}
      <mesh position={[0, 0.5, 0]} receiveShadow>
        <cylinderGeometry args={[20, 20, 1, 32]} />
        <meshStandardMaterial color="#6aa06a" />
      </mesh>

      {/* Central landmark (representing Chamonix town center) */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[3, 3, 4, 16]} />
        <meshStandardMaterial color="#e7ecef" />
      </mesh>

      {/* Mountain peaks as simple geometries */}
      <group>
        {/* Mont Blanc */}
        <mesh position={[0, 8, -80]} castShadow>
          <coneGeometry args={[12, 16, 8]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        
        {/* Aiguille du Midi */}
        <mesh position={[40, 6, -10]} castShadow>
          <coneGeometry args={[8, 12, 6]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        
        {/* Brévent */}
        <mesh position={[-25, 5, 15]} castShadow>
          <coneGeometry args={[6, 10, 5]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        
        {/* Flégère */}
        <mesh position={[-60, 4, 10]} castShadow>
          <coneGeometry args={[5, 8, 4]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        
        {/* Grands Montets */}
        <mesh position={[-80, 7, -40]} castShadow>
          <coneGeometry args={[10, 14, 7]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>

      {/* Lift markers */}
      {(lifts as Lift[]).map((lift) => (
        <LiftMarker key={lift.id} lift={lift} />
      ))}

      {/* Atmospheric elements */}
      <mesh position={[0, 50, 0]}>
        <sphereGeometry args={[200, 32, 32]} />
        <meshBasicMaterial color="#bcd0ff" transparent opacity={0.1} side={DoubleSide} />
      </mesh>
    </>
  );
}