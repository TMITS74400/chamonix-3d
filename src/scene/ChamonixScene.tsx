import { DoubleSide, SRGBColorSpace } from "three";
import { useLoader } from "@react-three/fiber";
import { TextureLoader, Texture } from "three";
import mapImg from '../assets/chamonix-map.png';
import heightImg from '../assets/chamonix.png';
import { PLANE_WIDTH, PLANE_HEIGHT } from "./constants";

export { PLANE_WIDTH, PLANE_HEIGHT } from "./constants";

export type SceneTextures = { map: Texture; height: Texture };

export function useSceneTextures(): SceneTextures {
  const [mapTexture, heightTexture] = useLoader(TextureLoader, [
    mapImg,
    heightImg
  ]);
  mapTexture.colorSpace = SRGBColorSpace;
  mapTexture.anisotropy = 8;
  heightTexture.anisotropy = 4;
  return { map: mapTexture, height: heightTexture };
}

export default function ChamonixScene({ 
  displacementScale = 0.3, 
  displacementBias = -0.15,
  wireframe = false,
}: { displacementScale?: number; displacementBias?: number; wireframe?: boolean }) {
  const { map: mapTexture, height: heightTexture } = useSceneTextures();

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[PLANE_WIDTH, PLANE_HEIGHT, 300, 150]} />
      <meshStandardMaterial 
        map={mapTexture}
        displacementMap={heightTexture}
        displacementScale={displacementScale}
        displacementBias={displacementBias}
        side={DoubleSide}
        wireframe={wireframe}
      />
    </mesh>
  );
}