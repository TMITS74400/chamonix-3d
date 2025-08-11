import { DoubleSide, Vector3 } from "three";
import { useMemo } from "react";
import LiftMarker from "./LiftMarker";
import lifts from "../data/lifts.json";

type Lift = { id: string; name: string; status: "open"|"hold"|"closed"; x: number; z: number };

// Generate realistic mountain terrain
function generateTerrain(width: number, height: number, segments: number) {
  const geometry = new Float32Array((segments + 1) * (segments + 1) * 3);
  const indices = [];
  
  for (let i = 0; i <= segments; i++) {
    for (let j = 0; j <= segments; j++) {
      const index = (i * (segments + 1) + j) * 3;
      const x = (j / segments - 0.5) * width;
      const z = (i / segments - 0.5) * height;
      
      // Create mountain peaks and valleys
      let y = 0;
      
      // Main valley (Chamonix valley)
      y += Math.exp(-((x * x) / 1000)) * 2;
      
      // Mont Blanc massif (north)
      const montBlancDist = Math.sqrt(x * x + (z + 80) * (z + 80));
      y += Math.max(0, 15 - montBlancDist / 8) * Math.exp(-montBlancDist / 40);
      
      // Aiguille du Midi peak
      const aiguilleDist = Math.sqrt((x - 40) * (x - 40) + (z + 10) * (z + 10));
      y += Math.max(0, 12 - aiguilleDist / 6) * Math.exp(-aiguilleDist / 20);
      
      // Brévent peak (south)
      const breventDist = Math.sqrt((x + 25) * (x + 25) + (z - 15) * (z - 15));
      y += Math.max(0, 10 - breventDist / 8) * Math.exp(-breventDist / 25);
      
      // Flégère peak
      const flegereDist = Math.sqrt((x + 60) * (x + 60) + (z - 10) * (z - 10));
      y += Math.max(0, 8 - flegereDist / 10) * Math.exp(-flegereDist / 30);
      
      // Grands Montets peak
      const grandsMontetsDist = Math.sqrt((x + 80) * (x + 80) + (z + 40) * (z + 40));
      y += Math.max(0, 14 - grandsMontetsDist / 7) * Math.exp(-grandsMontetsDist / 35);
      
      geometry[index] = x;
      geometry[index + 1] = y;
      geometry[index + 2] = z;
      
      if (i < segments && j < segments) {
        const a = i * (segments + 1) + j;
        const b = a + 1;
        const c = (i + 1) * (segments + 1) + j;
        const d = c + 1;
        
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }
  }
  
  return { geometry, indices };
}

export default function ChamonixScene() {
  const terrain = useMemo(() => {
    return generateTerrain(300, 300, 64);
  }, []);

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