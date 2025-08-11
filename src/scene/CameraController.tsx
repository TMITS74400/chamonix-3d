import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";

type CameraControllerProps = {
  position?: [number, number, number];
  onChange?: (position: [number, number, number]) => void;
};

export default function CameraController({ position, onChange }: CameraControllerProps) {
  const { camera } = useThree();
  const previous = useRef<Vector3>(camera.position.clone());

  // Apply external position when it changes
  useEffect(() => {
    if (position) {
      camera.position.set(position[0], position[1], position[2]);
      camera.updateProjectionMatrix();
    }
  }, [position, camera]);

  // Report camera movement back to parent (e.g., from OrbitControls)
  useFrame(() => {
    if (!previous.current.equals(camera.position)) {
      previous.current.copy(camera.position);
      onChange?.([camera.position.x, camera.position.y, camera.position.z]);
    }
  });

  return null;
}
