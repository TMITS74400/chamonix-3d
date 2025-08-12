import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3, Euler } from "three";

type HeightSampler = (x: number, z: number) => number;

export default function FirstPersonGroundController({
  sampler,
  eyeHeight = 1.7,
  speed = 8,
  initialPosition,
  onPosition,
  onInstructionsStateChange,
}: {
  sampler: HeightSampler;
  eyeHeight?: number;
  speed?: number;
  enablePointerLock?: boolean;
  initialPosition?: [number, number, number];
  onPosition?: (pos: [number, number, number]) => void;
  onInstructionsStateChange?: (state: { moved: boolean; closed: boolean }) => void;
}) {
  const { camera, gl } = useThree();
  const velocity = useRef(new Vector3());
  const direction = useRef(new Vector3());
  const euler = useRef(new Euler(0, 0, 0, "YXZ"));
  const keys = useRef<Record<string, boolean>>({});
  const hasInit = useRef(false);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const [instructionsMoved, setInstructionsMoved] = useState(false);


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
    const canvas = gl.domElement;
    
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left mouse button only
        isDragging.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        canvas.style.cursor = 'grabbing';
        
        // Move instructions to corner after first interaction
        if (!instructionsMoved) {
          setInstructionsMoved(true);
          onInstructionsStateChange?.({ moved: true, closed: false });
        }
      }
    };
    
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        isDragging.current = false;
        canvas.style.cursor = 'grab';
      }
    };
    
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      
      // Mouse sensitivity
      const sensitivity = 0.003;
      euler.current.y -= deltaX * sensitivity; // yaw
      euler.current.x -= deltaY * sensitivity; // pitch
      
      // Clamp pitch to prevent over-rotation
      euler.current.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, euler.current.x));
      
      // Apply rotation to camera
      camera.quaternion.setFromEuler(euler.current);
      
      // Update last mouse position
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", () => {
      isDragging.current = false;
      canvas.style.cursor = 'grab';
    });
    
    // Set initial cursor style
    canvas.style.cursor = 'grab';
    
    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", () => {
        isDragging.current = false;
        canvas.style.cursor = 'grab';
      });
    };
  }, [gl, camera, instructionsMoved, onInstructionsStateChange]);

  useFrame((_, delta) => {
    // Clamp delta to prevent huge jumps if frame rate drops
    const clampedDelta = Math.min(delta, 1/30); // Max 30fps equivalent
    
    // Update euler from camera quaternion if not dragging
    if (!isDragging.current) {
      euler.current.setFromQuaternion(camera.quaternion);
    }
    
    // WASD movement in the camera's local space
    direction.current.set(0, 0, 0);
    if (keys.current["KeyW"]) direction.current.z -= 1;
    if (keys.current["KeyS"]) direction.current.z += 1;
    if (keys.current["KeyA"]) direction.current.x -= 1;
    if (keys.current["KeyD"]) direction.current.x += 1;
    
    if (direction.current.lengthSq() > 0) direction.current.normalize();

    // Transform direction into world space using camera rotation (yaw only)
    const yaw = euler.current.y;
    const forward = new Vector3(Math.sin(yaw), 0, Math.cos(yaw)).multiplyScalar(direction.current.z);
    const strafe = new Vector3(Math.cos(yaw), 0, -Math.sin(yaw)).multiplyScalar(direction.current.x);

    // Apply speed with proper delta time
    velocity.current.copy(forward.add(strafe)).multiplyScalar(speed * clampedDelta);

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
