import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";


export default function SimpleMovementController({ speed = 50 }: { speed?: number }) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      console.log("Key pressed:", e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 1/30);
    const moveSpeed = speed * clampedDelta;
    
    // Simple WASD movement in world space
    if (keys.current["KeyW"]) camera.position.z -= moveSpeed;
    if (keys.current["KeyS"]) camera.position.z += moveSpeed;
    if (keys.current["KeyA"]) camera.position.x -= moveSpeed;
    if (keys.current["KeyD"]) camera.position.x += moveSpeed;
    
    // Debug movement
    if (keys.current["KeyW"] || keys.current["KeyS"] || keys.current["KeyA"] || keys.current["KeyD"]) {
      console.log("SimpleMovement: Camera position:", camera.position.toArray());
    }
  });

  return null;
}
