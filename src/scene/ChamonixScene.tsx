import { useEffect, useMemo, useRef } from "react";
import { BufferAttribute, DoubleSide, Mesh, Vector3 } from "three";
import SimplexNoise from "simplex-noise";
import LiftMarker from "./LiftMarker";
import lifts from "../data/lifts.json";

type Lift = { id: string; name: string; status: "open"|"hold"|"closed"; x: number; z: number };

export default function ChamonixScene() {
  const meshRef = useRef<Mesh>(null);

  // create the plane once
  const plane = useMemo(() => ({ width: 400, height: 400, segs: 256 }), []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // mutate geometry positions using simplex noise
    const geo = mesh.geometry;
    const pos = geo.getAttribute("position") as BufferAttribute;
    const simplex = new SimplexNoise("chamonix"); // seed for repeatability

    const freq = 0.02;    // higher = more bumps
    const scale = 12;     // height scale of mountains
    const tmp = new Vector3();

    for (let i = 0; i < pos.count; i++) {
      tmp.fromBufferAttribute(pos, i); // x, y, z (y=0 initially)
      const nx = tmp.x * freq;
      const nz = tmp.z * freq;

      // layered noise: base valley + roughness
      const h =
        simplex.noise2D(nx, nz) * 0.7 +
        simplex.noise2D(nx * 2.0, nz * 2.0) * 0.3;

      pos.setY(i, h * scale);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }, []);

  return (
    <>
      {/* procedural terrain */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[plane.width, plane.height, plane.segs, plane.segs]} />
        <meshStandardMaterial color="#6aa06a" side={DoubleSide} />
      </mesh>

      {/* a little “ice cap” cone for Mont Blanc vibe */}
      <mesh position={[0, 18, 0]} castShadow>
        <coneGeometry args={[10, 16, 64]} />
        <meshStandardMaterial color="#e7ecef" />
      </mesh>

      {/* lift markers (same as before) */}
      {(lifts as Lift[]).map(lift => (
        <LiftMarker key={lift.id} lift={lift} />
      ))}
    </>
  );
}