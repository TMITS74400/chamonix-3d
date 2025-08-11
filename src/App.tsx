import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import ChamonixScene from "./scene/ChamonixScene";

export default function App() {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Canvas shadows camera={{ position: [12, 8, 12], fov: 55 }}>
      <fog attach="fog" args={["#bcd0ff", 60, 220]} />
        {/* lights & sky */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[8, 12, 6]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Sky sunPosition={[100, 20, 100]} turbidity={6} />
        {/* scene */}
        <ChamonixScene />
        {/* simple controls for now (we can switch to first-person later) */}
        <OrbitControls makeDefault enableDamping />
      </Canvas>

      {/* Minimal HUD label */}
      <div style={{
        position: "absolute", top: 12, left: 12, padding: "8px 12px",
        background: "rgba(0,0,0,0.45)", color: "white", borderRadius: 8,
        fontFamily: "system-ui, sans-serif", fontSize: 14
      }}>
        Chamonix 3D — Prototype
      </div>
    </div>
  );
}