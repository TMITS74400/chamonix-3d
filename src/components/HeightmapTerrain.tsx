import { useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { DoubleSide, Color, Mesh, BufferAttribute } from "three";

type Props = {
  heightmapSrc: string;   // "/assets/chamonix-heightmap.png"
  size?: number;          // default 400
  segments?: number;      // default 512
  displacement?: number;  // default 140 (tweak)
};

export default function HeightmapTerrain({
  heightmapSrc,
  size = 400,
  segments = 512,
  displacement = 140
}: Props) {
  // Load the heightmap texture
  const heightmapTexture = useTexture(heightmapSrc);
  const meshRef = useRef<Mesh>(null);
  
  // Configure texture properties for better quality
  heightmapTexture.anisotropy = 16;
  heightmapTexture.wrapS = heightmapTexture.wrapT = 1000;

  // Compute vertex colors based on height
  useEffect(() => {
    if (!meshRef.current) return;
    
    const geometry = meshRef.current.geometry;
    const positions = geometry.attributes.position.array;
    const colors = new Float32Array(positions.length);
    
    for (let i = 0; i < positions.length; i += 3) {
      const y = positions[i + 1]; // Height value
      const height = (y + displacement / 2) / displacement; // Normalize to 0-1
      
      let r, g, b;
      
      if (height < 0.3) {
        // Grass (dark green to light green)
        const t = height / 0.3;
        r = 0.37 + t * 0.1; // 0.37 to 0.47
        g = 0.54 + t * 0.1; // 0.54 to 0.64
        b = 0.29 + t * 0.1; // 0.29 to 0.39
      } else if (height < 0.7) {
        // Rock (gray)
        r = g = b = 0.4 + (height - 0.3) * 0.1; // 0.4 to 0.5
      } else {
        // Snow (white)
        const t = (height - 0.7) / 0.3;
        r = g = b = 0.5 + t * 0.5; // 0.5 to 1.0
      }
      
      colors[i] = r;
      colors[i + 1] = g;
      colors[i + 2] = b;
    }
    
    geometry.setAttribute('color', new BufferAttribute(colors, 3));
  }, [displacement]);

  return (
    <mesh 
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]} 
      castShadow 
      receiveShadow
    >
      <planeGeometry args={[size, size, segments, segments]} />
      <meshStandardMaterial 
        vertexColors
        displacementMap={heightmapTexture}
        displacementScale={displacement}
        displacementBias={-displacement / 2}
        side={DoubleSide}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}
