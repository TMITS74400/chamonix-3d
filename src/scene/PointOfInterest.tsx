import { Html } from "@react-three/drei";
import { useState } from "react";

type PointOfInterest = {
  id: string;
  name: string;
  type: string;
  description: string;
  x: number;
  z: number;
  icon: string;
};

const typeColors: Record<string, string> = {
  town: "#3b82f6",
  village: "#8b5cf6", 
  glacier: "#06b6d4",
  transport: "#f59e0b",
  entertainment: "#ef4444",
  culture: "#10b981"
};



export default function PointOfInterest({ poi }: { poi: PointOfInterest }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <group position={[poi.x, 1, poi.z]}>
      {/* Main marker */}
      <mesh
        castShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
        <meshStandardMaterial
          color={typeColors[poi.type] || "#6b7280"}
          emissive={hovered ? typeColors[poi.type] || "#6b7280" : "black"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* Icon on top */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Hover tooltip */}
      {hovered && !clicked && (
        <Html distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.9)",
              color: "white",
              fontSize: 13,
              fontFamily: "system-ui, sans-serif",
              whiteSpace: "nowrap",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 16 }}>{poi.icon}</span>
              <span style={{ fontWeight: 600 }}>{poi.name}</span>
            </div>
            <div style={{ fontSize: 11, opacity: 0.7, textTransform: "capitalize" }}>
              {poi.type}
            </div>
            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
              Click for details
            </div>
          </div>
        </Html>
      )}

      {/* Detailed info panel */}
      {clicked && (
        <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div
            style={{
              width: 300,
              padding: "16px",
              borderRadius: 12,
              background: "rgba(0,0,0,0.95)",
              color: "white",
              fontSize: 14,
              fontFamily: "system-ui, sans-serif",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 24, marginRight: 8 }}>{poi.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{poi.name}</div>
                <div style={{ 
                  fontSize: 12, 
                  opacity: 0.7, 
                  textTransform: "capitalize",
                  color: typeColors[poi.type] || "#6b7280"
                }}>
                  {poi.type}
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ opacity: 0.8, lineHeight: 1.4 }}>
                {poi.description}
              </div>
            </div>

            <div style={{ 
              display: "flex", 
              gap: 8, 
              padding: "8px 0",
              borderTop: "1px solid rgba(255,255,255,0.1)" 
            }}>
              <button style={{
                flex: 1,
                padding: "8px 12px",
                background: typeColors[poi.type] || "#3b82f6",
                border: "none",
                borderRadius: 6,
                color: "white",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 500
              }}>
                Get Directions
              </button>
              <button style={{
                flex: 1,
                padding: "8px 12px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 6,
                color: "white",
                fontSize: 12,
                cursor: "pointer"
              }}>
                More Info
              </button>
            </div>

            <div style={{ 
              textAlign: "center", 
              fontSize: 11, 
              opacity: 0.5, 
              marginTop: 8,
              cursor: "pointer"
            }} onClick={() => setClicked(false)}>
              Click to close
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
