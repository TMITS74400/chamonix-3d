import { Texture } from 'three';

export function sampleHeightAtPosition(
  heightTexture: Texture,
  worldX: number,
  worldZ: number,
  planeWidth: number,
  planeHeight: number,
  displacementScale: number,
  displacementBias: number
): number {
  // Convert world coordinates to UV coordinates
  const u = (worldX + planeWidth / 2) / planeWidth;
  const v = (worldZ + planeHeight / 2) / planeHeight;
  
  // Clamp UV coordinates to valid range
  const clampedU = Math.max(0, Math.min(1, u));
  const clampedV = Math.max(0, Math.min(1, v));
  
  // Create a temporary canvas to sample the texture
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx || !heightTexture.image) {
    // Fallback to mathematical approximation
    return Math.sin(clampedU * 10) * Math.cos(clampedV * 8) * displacementScale + displacementBias;
  }
  
  canvas.width = 1;
  canvas.height = 1;
  
  try {
    // Draw a 1x1 pixel from the texture at the specified UV coordinates
    ctx.drawImage(
      heightTexture.image,
      clampedU * heightTexture.image.width,
      clampedV * heightTexture.image.height,
      1, 1,
      0, 0, 1, 1
    );
    
    // Get the pixel data
    const imageData = ctx.getImageData(0, 0, 1, 1);
    const heightValue = imageData.data[0] / 255; // Red channel
    
    return heightValue * displacementScale + displacementBias;
  } catch (error) {
    // Fallback if texture sampling fails
    return Math.sin(clampedU * 10) * Math.cos(clampedV * 8) * displacementScale + displacementBias;
  }
}
