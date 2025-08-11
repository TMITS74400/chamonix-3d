import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3, Euler } from "three";
import type { HeightSampler } from "./heightSampler";

export default function FirstPersonGroundController({
  sampler,
  eyeHeight = 1.7,
  speed = 8,
  enablePointerLock = false,
  initialPosition,
  onPosition,
}: {
  sampler: HeightSampler;
  eyeHeight?: number;
  speed?: number;
  enablePointerLock?: boolean;
  initialPosition?: [number, number, number];
  onPosition?: (pos: [number, number, number]) => void;
}) {
  const { camera, gl } = useThree();
  const velocity = useRef(new Vector3());
  const direction = useRef(new Vector3());
  const euler = useRef(new Euler(0, 0, 0, "YXZ"));
  const keys = useRef<Record<string, boolean>>({});
  const hasInit = useRef(false);

  useEffect(() => {
    if (initialPosition && !hasInit.current) {
      camera.position.set(initialPosition[0], initialPosition[1], initialPosition[2]);
      // Set initial camera rotation
      euler.current.setFromQuaternion(camera.quaternion);
      hasInit.current = true;
    }
  }, [initialPosition, camera]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const onKeyUp = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!enablePointerLock) return;
    const canvas = gl.domElement;
    const onClick = () => canvas.requestPointerLock();
    canvas.addEventListener("click", onClick);

    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return;
      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;
      euler.current.y -= movementX * 0.0025; // yaw
      euler.current.x -= movementY * 0.0025; // pitch
      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
    };

    document.addEventListener("mousemove", onMouseMove);
    return () => {
      canvas.removeEventListener("click", onClick);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [enablePointerLock, gl, camera]);

  useFrame((_, delta) => {
    // Clamp delta to prevent huge jumps if frame rate drops
    const clampedDelta = Math.min(delta, 1/30); // Max 30fps equivalent
    
    // Update euler from camera quaternion if not in pointer lock mode
    if (!enablePointerLock) {
      euler.current.setFromQuaternion(camera.quaternion);
    }
    
    // WASD movement in the camera's local space
    direction.current.set(0, 0, 0);
    if (keys.current["KeyW"]) direction.current.z -= 1;
    if (keys.current["KeyS"]) direction.current.z += 1;
    if (keys.current["KeyA"]) direction.current.x -= 1;
    if (keys.current["KeyD"]) direction.current.x += 1;
    
    // Debug: log key presses
    if (keys.current["KeyW"] || keys.current["KeyS"] || keys.current["KeyA"] || keys.current["KeyD"]) {
      console.log("Keys pressed:", Object.keys(keys.current).filter(k => keys.current[k]));
    }
    
    if (direction.current.lengthSq() > 0) direction.current.normalize();

    // Transform direction into world space using camera rotation (yaw only)
    const yaw = euler.current.y;
    const forward = new Vector3(Math.sin(yaw), 0, Math.cos(yaw)).multiplyScalar(direction.current.z);
    const strafe = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw)).multiplyScalar(direction.current.x);

    // Apply speed with proper delta time - much faster movement
    velocity.current.copy(forward.add(strafe)).multiplyScalar(speed * clampedDelta * 10);

    // Move camera
    camera.position.add(velocity.current);

    // Clamp to ground
    const groundY = sampler(camera.position.x, camera.position.z);
    const desiredY = groundY + eyeHeight;
    // Smoothly approach desiredY to avoid jitter
    camera.position.y += (desiredY - camera.position.y) * Math.min(1, clampedDelta * 10);

    onPosition?.([camera.position.x, camera.position.y, camera.position.z]);
  });

  return null;
}
