import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky, PointerLockControls } from "@react-three/drei";
import { useState } from "react";
import ChamonixScene from "./scene/ChamonixScene";

export default function App() {
  const [isFirstPerson, setIsFirstPerson] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Canvas shadows camera={{ position: [12, 18, 24], fov: 55 }}>
        <fog attach="fog" args={["#bcd0ff", 60, 220]} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[18, 12, 6]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Sky sunPosition={[100, 20, 100]} turbidity={6} />
        <ChamonixScene />
        {isFirstPerson ? (
          <PointerLockControls />
        ) : (
          <OrbitControls makeDefault enableDamping />
        )}
      </Canvas>

      {/* Top Navigation Bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 60,
        background: "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", color: "white", fontFamily: "system-ui, sans-serif"
      }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>
          Chamonix 3D — Interactive Discovery Platform
        </div>
        
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => setIsFirstPerson(!isFirstPerson)}
            style={{
              padding: "8px 16px", background: isFirstPerson ? "#22c55e" : "rgba(255,255,255,0.2)",
              border: "none", borderRadius: 6, color: "white", cursor: "pointer",
              fontSize: 14, fontWeight: 500
            }}
          >
            {isFirstPerson ? "Exit First Person" : "Enter First Person"}
          </button>
          
          <button
            onClick={() => setShowChat(!showChat)}
            style={{
              padding: "8px 16px", background: showChat ? "#3b82f6" : "rgba(255,255,255,0.2)",
              border: "none", borderRadius: 6, color: "white", cursor: "pointer",
              fontSize: 14, fontWeight: 500
            }}
          >
            {showChat ? "Close AI Guide" : "Open AI Guide"}
          </button>
        </div>
      </div>

      {/* AI Chat Interface */}
      {showChat && (
        <div style={{
          position: "absolute", bottom: 20, left: 20, right: 20, height: 300,
          background: "rgba(0,0,0,0.9)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.2)",
          display: "flex", flexDirection: "column", color: "white", fontFamily: "system-ui, sans-serif"
        }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)", fontWeight: 600 }}>
            🤖 AI Guide — Ask me anything about Chamonix!
          </div>
          
          <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
            <div style={{ 
              background: "rgba(59, 130, 246, 0.3)", 
              padding: "12px 16px", 
              borderRadius: 8, 
              marginBottom: 12,
              border: "1px solid rgba(59, 130, 246, 0.5)"
            }}>
              👋 Welcome to Chamonix! I'm your AI guide. Ask me about lifts, weather, restaurants, 
              activities, or anything else you'd like to know about this amazing mountain town.
            </div>
          </div>
          
          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                placeholder="Ask about lifts, weather, restaurants..."
                style={{
                  flex: 1, padding: "12px 16px", background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)", borderRadius: 8,
                  color: "white", fontSize: 14
                }}
              />
              <button style={{
                padding: "12px 20px", background: "#3b82f6", border: "none",
                borderRadius: 8, color: "white", cursor: "pointer", fontWeight: 500
              }}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Info Panel */}
      <div style={{
        position: "absolute", top: 80, right: 20, width: 280,
        background: "rgba(0,0,0,0.8)", borderRadius: 12, padding: 16,
        color: "white", fontFamily: "system-ui, sans-serif", fontSize: 14
      }}>
        <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 16 }}>
          📍 Current Location
        </div>
        <div style={{ marginBottom: 8 }}>
          <span style={{ opacity: 0.7 }}>Area:</span> Chamonix Valley
        </div>
        <div style={{ marginBottom: 8 }}>
          <span style={{ opacity: 0.7 }}>Weather:</span> ☀️ 12°C, Clear
        </div>
        <div style={{ marginBottom: 8 }}>
          <span style={{ opacity: 0.7 }}>Lifts Open:</span> 3/5
        </div>
        <div>
          <span style={{ opacity: 0.7 }}>Snow Depth:</span> 45cm
        </div>
      </div>
    </div>
  );
}