import { Texture } from "three";
import { PLANE_WIDTH, PLANE_HEIGHT } from "./constants";

export type HeightSampler = (x: number, z: number) => number;

export async function createHeightSampler(heightTexture: Texture, displacementScale: number, displacementBias: number): Promise<HeightSampler> {
  // Create an offscreen canvas to sample the height texture
  const image = heightTexture.image as HTMLImageElement | HTMLCanvasElement | ImageBitmap;

  // Ensure the texture is loaded
  if (!image) {
    return () => 0;
  }

  const canvas = document.createElement("canvas");
  canvas.width = (image as any).width || 1024;
  canvas.height = (image as any).height || 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => 0;

  ctx.drawImage(image as any, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  // Convert scene x,z to pixel coords and sample grayscale
  return (x: number, z: number) => {
    const u = (x / PLANE_WIDTH) + 0.5;
    const v = 0.5 - (z / PLANE_HEIGHT);

    const px = Math.min(canvas.width - 1, Math.max(0, Math.floor(u * canvas.width)));
    const py = Math.min(canvas.height - 1, Math.max(0, Math.floor(v * canvas.height)));

    const idx = (py * canvas.width + px) * 4;
    const r = imageData[idx];
    const g = imageData[idx + 1];
    const b = imageData[idx + 2];
    // Grayscale (simple average)
    const gray = (r + g + b) / 3 / 255;

    // Convert to world height
    return gray * displacementScale + displacementBias;
  };
}
