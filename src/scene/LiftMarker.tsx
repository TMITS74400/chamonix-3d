import { Html } from "@react-three/drei";
import { useState } from "react";

type Lift = { id: string; name: string; status: "open" | "hold" | "closed"; x: number; z: number };

const statusColor: Record<Lift["status"], string> = {
  open: "#22c55e",
  hold: "#eab308",
  closed: "#ef4444",
};

const statusEmoji: Record<Lift["status"], string> = {
  open: "🟢",
  hold: "🟡",
  closed: "🔴",
};

export default function LiftMarker({ lift }: { lift: Lift }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <group position={[lift.x, 0.8, lift.z]}>
      <mesh
        castShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.8, 24, 24]} />
        <meshStandardMaterial
          color={statusColor[lift.status]}
          emissive={hovered ? statusColor[lift.status] : "black"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* Hover Tooltip */}
      {hovered && !clicked && (
        <Html distanceFactor={10} style={{ pointerEvents: "none" }}>
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
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{lift.name}</div>
            <div style={{ opacity: 0.8 }}>
              {statusEmoji[lift.status]} {lift.status.toUpperCase()}
            </div>
            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
              Click for details
            </div>
          </div>
        </Html>
      )}

      {/* Detailed Info Panel */}
      {clicked && (
        <Html distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div
            style={{
              width: 280,
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
              <div style={{ 
                width: 12, 
                height: 12, 
                borderRadius: "50%", 
                background: statusColor[lift.status],
                marginRight: 8 
              }} />
              <div style={{ fontWeight: 600, fontSize: 16 }}>{lift.name}</div>
            </div>
            
            <div style={{ marginBottom: 12 }}>
              <div style={{ opacity: 0.7, marginBottom: 4 }}>Status</div>
              <div style={{ 
                display: "inline-block",
                padding: "4px 8px",
                background: statusColor[lift.status] + "20",
                color: statusColor[lift.status],
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 500
              }}>
                {statusEmoji[lift.status]} {lift.status.toUpperCase()}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ opacity: 0.7, marginBottom: 4 }}>Current Wait Time</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {lift.status === "open" ? "5-10 min" : lift.status === "hold" ? "15-20 min" : "Closed"}
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ opacity: 0.7, marginBottom: 4 }}>Operating Hours</div>
              <div>8:30 AM - 4:30 PM</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ opacity: 0.7, marginBottom: 4 }}>Elevation</div>
              <div>1,035m - 3,842m</div>
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
                background: "#3b82f6",
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