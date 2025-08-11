import { Html } from "@react-three/drei";
import { useState } from "react";

type Lift = { id: string; name: string; status: "open"|"hold"|"closed"; x: number; z: number };

const statusColor: Record<Lift["status"], string> = {
  open: "#22c55e",
  hold: "#eab308",
  closed: "#ef4444",
};

export default function LiftMarker({ lift }: { lift: Lift }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[lift.x, 0.8, lift.z]}>
      <mesh
        castShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.8, 24, 24]} />
        <meshStandardMaterial color={statusColor[lift.status]} emissive={hovered ? statusColor[lift.status] : "black"} />
      </mesh>

      {hovered && (
        <Html distanceFactor={10} style={{ pointerEvents: "none" }}>
          <div style={{
            padding: "6px 8px", borderRadius: 6, background: "rgba(0,0,0,0.7)",
            color: "white", fontSize: 12, fontFamily: "system-ui, sans-serif", whiteSpace: "nowrap"
          }}>
            {lift.name} — {lift.status.toUpperCase()}
          </div>
        </Html>
      )}
    </group>
  );
}