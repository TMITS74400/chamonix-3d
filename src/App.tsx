import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { useState } from "react";
import ChamonixScene from "./scene/ChamonixScene";

import SimpleMovementController from "./scene/SimpleMovementController";



export default function App() {
  // Terrain controls
  const [displacementScale, setDisplacementScale] = useState(4.0);
  const [displacementBias, setDisplacementBias] = useState(0.0);
  const [wireframe, setWireframe] = useState(false);

  // Lighting controls - improved for better contour visibility
  const [ambient, setAmbient] = useState(0.4);
  const [sunIntensity, setSunIntensity] = useState(2.0);
  const [sunX, setSunX] = useState(80);
  const [sunY, setSunY] = useState(40);
  const [sunZ, setSunZ] = useState(80);

  // Camera and movement
  const initialCam: [number, number, number] = [-3.7, 0.9, 4.8];
  const [cameraXZ, setCameraXZ] = useState<[number, number]>([initialCam[0], initialCam[2]]);
  const [enableOrbit, setEnableOrbit] = useState(false);
  const [cameraSpeed, setCameraSpeed] = useState(50);



  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Canvas shadows camera={{ position: [initialCam[0], initialCam[1], initialCam[2]], fov: 55 }}>
        <fog attach="fog" args={["#bcd0ff", 60, 220]} />
        <ambientLight intensity={ambient} />
        <directionalLight
          position={[sunX, sunY, sunZ]}
          intensity={sunIntensity}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Sky sunPosition={[sunX, sunY, sunZ]} turbidity={6} />
        <ChamonixScene 
          displacementScale={displacementScale} 
          displacementBias={displacementBias}
          wireframe={wireframe}
        />
        {enableOrbit ? (
          <OrbitControls makeDefault enableDamping />
        ) : (
          // Simple movement controller for now
          <SimpleMovementController speed={cameraSpeed} />
        )}
      </Canvas>

      <ControlPanel
        values={{
          displacementScale, displacementBias, wireframe,
          ambient, sunIntensity, sunX, sunY, sunZ,
          cameraXZ, enableOrbit, cameraSpeed
        }}
        onChange={{
          setDisplacementScale, setDisplacementBias, setWireframe,
          setAmbient, setSunIntensity, setSunX, setSunY, setSunZ,
          setCameraXZ, setEnableOrbit, setCameraSpeed
        }}
      />
    </div>
  );
}



function ControlPanel({
  values, onChange
}: {
  values: any;
  onChange: any;
}) {
  const {
    displacementScale, displacementBias, wireframe,
    ambient, sunIntensity, sunX, sunY, sunZ,
    cameraXZ, enableOrbit, cameraSpeed
  } = values;

  return (
    <div style={{
      position: "absolute", left: 12, bottom: 12, padding: 12,
      background: "rgba(0,0,0,0.8)", color: "white", borderRadius: 10,
      fontFamily: "system-ui, sans-serif", fontSize: 13, display: "grid",
      gridTemplateColumns: "auto 1fr auto", gap: 8, width: 520
    }}>
      <label style={{ opacity: 0.8 }}>Height</label>
      <input type="range" min={0} max={8} step={0.05} value={displacementScale}
        onChange={(e) => onChange.setDisplacementScale(parseFloat(e.target.value))} />
      <input type="number" min={0} max={8} step={0.05} value={displacementScale}
        onChange={(e) => onChange.setDisplacementScale(parseFloat(e.target.value))}
        style={{ width: 60, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, color: "white", padding: "2px 4px" }} />

      <label style={{ opacity: 0.8 }}>Bias</label>
      <input type="range" min={-4} max={4} step={0.01} value={displacementBias}
        onChange={(e) => onChange.setDisplacementBias(parseFloat(e.target.value))} />
      <input type="number" min={-4} max={4} step={0.01} value={displacementBias}
        onChange={(e) => onChange.setDisplacementBias(parseFloat(e.target.value))}
        style={{ width: 60, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, color: "white", padding: "2px 4px" }} />

      <label style={{ opacity: 0.8 }}>Wireframe</label>
      <input type="checkbox" checked={wireframe}
        onChange={(e) => onChange.setWireframe(e.target.checked)} />
      <span />

      <div style={{ gridColumn: "1 / -1", height: 1, background: "rgba(255,255,255,0.2)", margin: "8px 0" }} />

      <label style={{ opacity: 0.8 }}>Ambient</label>
      <input type="range" min={0} max={2} step={0.05} value={ambient}
        onChange={(e) => onChange.setAmbient(parseFloat(e.target.value))} />
      <input type="number" min={0} max={2} step={0.05} value={ambient}
        onChange={(e) => onChange.setAmbient(parseFloat(e.target.value))}
        style={{ width: 60, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, color: "white", padding: "2px 4px" }} />

      <label style={{ opacity: 0.8 }}>Sun Intensity</label>
      <input type="range" min={0} max={5} step={0.05} value={sunIntensity}
        onChange={(e) => onChange.setSunIntensity(parseFloat(e.target.value))} />
      <input type="number" min={0} max={5} step={0.05} value={sunIntensity}
        onChange={(e) => onChange.setSunIntensity(parseFloat(e.target.value))}
        style={{ width: 60, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, color: "white", padding: "2px 4px" }} />

      <label style={{ opacity: 0.8 }}>Sun X</label>
      <input type="range" min={-200} max={200} step={1} value={sunX}
        onChange={(e) => onChange.setSunX(parseFloat(e.target.value))} />
      <input type="number" min={-200} max={200} step={1} value={sunX}
        onChange={(e) => onChange.setSunX(parseFloat(e.target.value))}
        style={{ width: 60, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, color: "white", padding: "2px 4px" }} />

      <label style={{ opacity: 0.8 }}>Sun Y</label>
      <input type="range" min={0} max={200} step={1} value={sunY}
        onChange={(e) => onChange.setSunY(parseFloat(e.target.value))} />
      <input type="number" min={0} max={200} step={1} value={sunY}
        onChange={(e) => onChange.setSunY(parseFloat(e.target.value))}
        style={{ width: 60, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, color: "white", padding: "2px 4px" }} />

      <label style={{ opacity: 0.8 }}>Sun Z</label>
      <input type="range" min={-200} max={200} step={1} value={sunZ}
        onChange={(e) => onChange.setSunZ(parseFloat(e.target.value))} />
      <input type="number" min={-200} max={200} step={1} value={sunZ}
        onChange={(e) => onChange.setSunZ(parseFloat(e.target.value))}
        style={{ width: 60, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, color: "white", padding: "2px 4px" }} />

      <div style={{ gridColumn: "1 / -1", height: 1, background: "rgba(255,255,255,0.2)", margin: "8px 0" }} />

      <label style={{ opacity: 0.8 }}>Camera Speed</label>
      <input type="range" min={1} max={200} step={1} value={cameraSpeed}
        onChange={(e) => onChange.setCameraSpeed(parseFloat(e.target.value))} />
      <input type="number" min={1} max={200} step={1} value={cameraSpeed}
        onChange={(e) => onChange.setCameraSpeed(parseFloat(e.target.value))}
        style={{ width: 60, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, color: "white", padding: "2px 4px" }} />

      <label style={{ opacity: 0.8 }}>Camera X</label>
      <input type="number" step={0.1} value={cameraXZ[0]}
        onChange={(e) => onChange.setCameraXZ([parseFloat(e.target.value), cameraXZ[1]])}
        style={{ width: 60, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, color: "white", padding: "2px 4px" }} />
      <span />

      <label style={{ opacity: 0.8 }}>Camera Z</label>
      <input type="number" step={0.1} value={cameraXZ[1]}
        onChange={(e) => onChange.setCameraXZ([cameraXZ[0], parseFloat(e.target.value)])}
        style={{ width: 60, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, color: "white", padding: "2px 4px" }} />
      <span />

      <label style={{ opacity: 0.8 }}>Orbit Mode</label>
      <input type="checkbox" checked={enableOrbit}
        onChange={(e) => onChange.setEnableOrbit(e.target.checked)} />
      <span />
    </div>
  );
}