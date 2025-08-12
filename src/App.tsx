import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { useState } from "react";
import ChamonixScene, { useSceneTextures } from "./scene/ChamonixScene";
import { sampleHeightAtPosition } from "./scene/heightSampler";
import { PLANE_WIDTH, PLANE_HEIGHT } from "./scene/constants";

import FirstPersonGroundController from "./scene/FirstPersonGroundController";

// Component for stylized low-poly trees
function StylizedTrees() {
  const treePositions = [
    // Foreground trees
    { x: -8, z: 5, scale: 1.2 },
    { x: 6, z: 3, scale: 1.0 },
    { x: -4, z: 8, scale: 0.8 },
    { x: 10, z: 6, scale: 1.1 },
    
    // Midground trees
    { x: -15, z: 12, scale: 0.9 },
    { x: 12, z: 15, scale: 0.7 },
    { x: -2, z: 18, scale: 0.8 },
    { x: 8, z: 20, scale: 0.6 },
    
    // Background trees (smaller and more faded)
    { x: -20, z: 25, scale: 0.5 },
    { x: 18, z: 28, scale: 0.4 },
    { x: -10, z: 30, scale: 0.5 },
    { x: 15, z: 32, scale: 0.4 },
  ];

  return (
    <group>
      {treePositions.map((pos, index) => (
        <TreeOnSurface key={index} x={pos.x} z={pos.z} scale={pos.scale} index={index} />
      ))}
    </group>
  );
}

// Component for individual tree placed on surface
function TreeOnSurface({ x, z, scale, index }: { x: number; z: number; scale: number; index: number }) {
  const { height: heightTexture } = useSceneTextures();
  
  // Sample height at this position using the height sampler
  const displacementScale = 6.0;
  const displacementBias = -0.2;
  
  const height = sampleHeightAtPosition(
    heightTexture,
    x,
    z,
    PLANE_WIDTH,
    PLANE_HEIGHT,
    displacementScale,
    displacementBias
  );
  
  return (
    <group position={[x, height, z]}>
      {/* Tree trunk */}
      <mesh position={[0, 0.5 * scale, 0]} castShadow>
        <cylinderGeometry args={[0.1 * scale, 0.1 * scale, 1 * scale, 6]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      
      {/* Tree foliage - conical shape */}
      <mesh position={[0, 1.5 * scale, 0]} castShadow>
        <coneGeometry args={[0.8 * scale, 2 * scale, 6]} />
        <meshStandardMaterial 
          color={index < 4 ? "#228B22" : "#32CD32"} 
          roughness={0.9}
          transparent
          opacity={index < 8 ? 0.9 : 0.7}
        />
      </mesh>
    </group>
  );
}

// Component for distant mountain silhouettes
function DistantMountains() {
  return (
    <group position={[0, -0.5, -30]}>
      {/* Left distant mountains - more jagged silhouette with color variation */}
      <mesh position={[-35, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 12, 8, 4]} />
        <meshBasicMaterial color="#8ba3b8" transparent opacity={0.5} />
      </mesh>
      
      {/* Right distant mountains - different profile with warmer tones */}
      <mesh position={[35, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 10, 6, 3]} />
        <meshBasicMaterial color="#9bb5c8" transparent opacity={0.45} />
      </mesh>
      
      {/* Center distant mountains - main backdrop with blue tones */}
      <mesh position={[0, 0, -8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[25, 15, 10, 5]} />
        <meshBasicMaterial color="#a8c0d5" transparent opacity={0.4} />
      </mesh>
      
      {/* Additional atmospheric layer for depth with warm sunset tones */}
      <mesh position={[0, 0, -15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 20, 1, 1]} />
        <meshBasicMaterial color="#d4e5f5" transparent opacity={0.25} />
      </mesh>
      
      {/* Warm atmospheric glow layer */}
      <mesh position={[0, 0, -25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 25, 1, 1]} />
        <meshBasicMaterial color="#f0f8ff" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}


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

  // Instructions state
  const [instructionsMoved, setInstructionsMoved] = useState(false);
  const [instructionsClosed, setInstructionsClosed] = useState(false);

  const handleInstructionsStateChange = (state: { moved: boolean; closed: boolean }) => {
    setInstructionsMoved(state.moved);
    setInstructionsClosed(state.closed);
  };



  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Canvas shadows camera={{ position: [initialCam[0], initialCam[1], initialCam[2]], fov: 40 }}>
        {/* Enhanced atmospheric fog with warmer tones */}
        <fog attach="fog" args={["#e6f3ff", 120, 450]} />
        <ambientLight intensity={ambient} color="#fff8f0" />
        <directionalLight
          position={[sunX, sunY, sunZ]}
          intensity={sunIntensity}
          color="#fff8e6"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        {/* Enhanced sky with more vibrant colors */}
        <Sky 
          sunPosition={[sunX, sunY, sunZ]} 
          turbidity={1.2} 
          rayleigh={1.5}
          mieCoefficient={0.002}
          mieDirectionalG={0.95}
        />
        
        {/* Distant mountain silhouettes for depth */}
        <DistantMountains />
        
        {/* Stylized low-poly trees */}
        <StylizedTrees />
        
        <ChamonixScene 
          displacementScale={displacementScale} 
          displacementBias={displacementBias}
          wireframe={wireframe}
        />
        {enableOrbit ? (
          <OrbitControls makeDefault enableDamping />
        ) : (
          // First person ground controller with mouse look
          <FirstPersonGroundController 
            sampler={(x: number, z: number) => sampleHeightAtPosition(
              useSceneTextures().height,
              x, z,
              PLANE_WIDTH,
              PLANE_HEIGHT,
              displacementScale,
              displacementBias
            )}
            speed={cameraSpeed / 10}
            enablePointerLock={true}
            initialPosition={initialCam}
            onPosition={([x, y, z]) => setCameraXZ([x, z])}
            onInstructionsStateChange={handleInstructionsStateChange}
          />
        )}
      </Canvas>

      {/* Instructions overlay */}
      {!instructionsClosed && (
        <div
          style={{
            position: 'fixed',
            top: instructionsMoved ? 'auto' : '50%',
            left: instructionsMoved ? 'auto' : '50%',
            right: instructionsMoved ? '20px' : 'auto',
            bottom: instructionsMoved ? '20px' : 'auto',
            transform: instructionsMoved ? 'none' : 'translate(-50%, -50%)',
            background: "rgba(0, 0, 0, 0.9)",
            color: "white",
            padding: "16px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            fontFamily: "system-ui, sans-serif",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            pointerEvents: "auto",
            textAlign: "center",
            minWidth: "240px",
            maxWidth: "300px",
            zIndex: 1000,
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ marginBottom: "8px", fontWeight: "600", fontSize: "16px" }}>
            🖱️ Click and Drag to Look Around
          </div>
          <div style={{ fontSize: "13px", opacity: "0.8", marginBottom: "12px" }}>
            WASD to move • Mouse to look around
          </div>
          
          <button
            onClick={() => setInstructionsClosed(true)}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
          >
            Got it!
          </button>
        </div>
      )}

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

  // Preset functions for different mountain views
  const applyMountainPreset = () => {
    onChange.setDisplacementScale(6.0);
    onChange.setDisplacementBias(-0.2);
    onChange.setAmbient(0.6);
    onChange.setSunIntensity(1.5);
    onChange.setSunX(50);
    onChange.setSunY(60);
    onChange.setSunZ(30);
  };

  const applyDramaticPreset = () => {
    onChange.setDisplacementScale(8.0);
    onChange.setDisplacementBias(-0.3);
    onChange.setAmbient(0.4);
    onChange.setSunIntensity(2.0);
    onChange.setSunX(30);
    onChange.setSunY(80);
    onChange.setSunZ(20);
  };

  const applySunsetPreset = () => {
    onChange.setDisplacementScale(6.5);
    onChange.setDisplacementBias(-0.25);
    onChange.setAmbient(0.8);
    onChange.setSunIntensity(1.2);
    onChange.setSunX(-20);
    onChange.setSunY(40);
    onChange.setSunZ(-10);
  };

  const applyGoldenHourPreset = () => {
    onChange.setDisplacementScale(7.0);
    onChange.setDisplacementBias(-0.3);
    onChange.setAmbient(0.7);
    onChange.setSunIntensity(1.8);
    onChange.setSunX(40);
    onChange.setSunY(50);
    onChange.setSunZ(15);
  };

  const applyLowPolyPreset = () => {
    onChange.setDisplacementScale(5.5);
    onChange.setDisplacementBias(-0.2);
    onChange.setAmbient(0.8);
    onChange.setSunIntensity(1.2);
    onChange.setSunX(60);
    onChange.setSunY(70);
    onChange.setSunZ(40);
  };

  const applyTwilightPreset = () => {
    onChange.setDisplacementScale(6.5);
    onChange.setDisplacementBias(-0.25);
    onChange.setAmbient(0.6);
    onChange.setSunIntensity(0.8);
    onChange.setSunX(-30);
    onChange.setSunY(30);
    onChange.setSunZ(-20);
  };

  const applyArtisticPreset = () => {
    onChange.setDisplacementScale(7.5);
    onChange.setDisplacementBias(-0.35);
    onChange.setAmbient(0.9);
    onChange.setSunIntensity(1.0);
    onChange.setSunX(45);
    onChange.setSunY(60);
    onChange.setSunZ(25);
  };

  return (
    <div style={{
      position: "absolute", left: 12, bottom: 12, padding: 12,
      background: "rgba(0,0,0,0.8)", color: "white", borderRadius: 10,
      fontFamily: "system-ui, sans-serif", fontSize: 13, display: "grid",
      gridTemplateColumns: "auto 1fr auto", gap: 8, width: 520
    }}>
      {/* Preset buttons */}
      <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, marginBottom: 8 }}>
        <button 
          onClick={applyMountainPreset}
          style={{ 
            padding: "4px 8px", 
            background: "rgba(255,255,255,0.2)", 
            border: "1px solid rgba(255,255,255,0.3)", 
            borderRadius: 4, 
            color: "white", 
            cursor: "pointer",
            fontSize: 11
          }}
        >
          Mountain View
        </button>
        <button 
          onClick={applyDramaticPreset}
          style={{ 
            padding: "4px 8px", 
            background: "rgba(255,255,255,0.2)", 
            border: "1px solid rgba(255,255,255,0.3)", 
            borderRadius: 4, 
            color: "white", 
            cursor: "pointer",
            fontSize: 11
          }}
        >
          Dramatic
        </button>
        <button 
          onClick={applySunsetPreset}
          style={{ 
            padding: "4px 8px", 
            background: "rgba(255,255,255,0.2)", 
            border: "1px solid rgba(255,255,255,0.3)", 
            borderRadius: 4, 
            color: "white", 
            cursor: "pointer",
            fontSize: 11
          }}
        >
          Sunset
        </button>
        <button 
          onClick={applyGoldenHourPreset}
          style={{ 
            padding: "4px 8px", 
            background: "rgba(255,255,255,0.2)", 
            border: "1px solid rgba(255,255,255,0.3)", 
            borderRadius: 4, 
            color: "white", 
            cursor: "pointer",
            fontSize: 11
          }}
        >
          Golden Hour
        </button>
        <button 
          onClick={applyLowPolyPreset}
          style={{ 
            padding: "4px 8px", 
            background: "rgba(255,255,255,0.2)", 
            border: "1px solid rgba(255,255,255,0.3)", 
            borderRadius: 4, 
            color: "white", 
            cursor: "pointer",
            fontSize: 11
          }}
        >
          Low Poly
        </button>
        <button 
          onClick={applyTwilightPreset}
          style={{ 
            padding: "4px 8px", 
            background: "rgba(255,255,255,0.2)", 
            border: "1px solid rgba(255,255,255,0.3)", 
            borderRadius: 4, 
            color: "white", 
            cursor: "pointer",
            fontSize: 11
          }}
        >
          Twilight
        </button>
        <button 
          onClick={applyArtisticPreset}
          style={{ 
            padding: "4px 8px", 
            background: "rgba(255,255,255,0.2)", 
            border: "1px solid rgba(255,255,255,0.3)", 
            borderRadius: 4, 
            color: "white", 
            cursor: "pointer",
            fontSize: 11
          }}
        >
          Artistic
        </button>
      </div>

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