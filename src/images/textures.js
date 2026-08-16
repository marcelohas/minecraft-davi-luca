import { CanvasTexture, NearestFilter, SRGBColorSpace } from 'three';

// Função para gerar texturas pixel-art via Canvas API
function generateTexture(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');

  const noise = (x, y) => (Math.random() - 0.5) * 30;

  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 16; y++) {
      let r = 0, g = 0, b = 0;
      
      if (type === 'grass_top') {
        r = 100 + noise(x, y);
        g = 200 + noise(x, y);
        b = 100 + noise(x, y);
      } else if (type === 'dirt') {
        r = 121 + noise(x, y);
        g = 85 + noise(x, y);
        b = 58 + noise(x, y);
      } else if (type === 'grass_side') {
        if (y < 4 + Math.random() * 2) {
          r = 100 + noise(x, y);
          g = 200 + noise(x, y);
          b = 100 + noise(x, y);
        } else {
          r = 121 + noise(x, y);
          g = 85 + noise(x, y);
          b = 58 + noise(x, y);
        }
      } else if (type === 'stone') {
        const gray = 120 + noise(x, y);
        r = gray; g = gray; b = gray;
      } else if (type === 'wood') { // Tábua
        r = 160 + noise(x, y);
        g = 120 + noise(x, y);
        b = 80 + noise(x, y);
        if (x % 4 === 0 || y % 8 === 0) { // Linhas da madeira
          r -= 30; g -= 30; b -= 30;
        }
      } else if (type === 'log_side') { // Tronco
        r = 90 + noise(x, y);
        g = 60 + noise(x, y);
        b = 40 + noise(x, y);
        if (x % 2 === 0) { // Textura vertical
          r -= 20; g -= 20; b -= 20;
        }
      } else if (type === 'leaves') {
        r = 50 + noise(x, y);
        g = 150 + noise(x, y);
        b = 50 + noise(x, y);
        if (Math.random() > 0.7) { r = 0; g = 0; b = 0; } // buracos
      } else if (type === 'sand') {
        r = 210 + noise(x, y);
        g = 200 + noise(x, y);
        b = 150 + noise(x, y);
      } else if (type === 'glass') {
        r = 200; g = 230; b = 255;
        if (x === 0 || x === 15 || y === 0 || y === 15 || Math.random() > 0.8) {
          r = 255; g = 255; b = 255;
        }
      }
      
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.magFilter = NearestFilter; // Essencial para visual pixelado de Minecraft
  texture.minFilter = NearestFilter;
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export const textures = {
  grass: [
    generateTexture('grass_side'),
    generateTexture('grass_side'),
    generateTexture('grass_top'),
    generateTexture('dirt'),
    generateTexture('grass_side'),
    generateTexture('grass_side')
  ],
  dirt: generateTexture('dirt'),
  stone: generateTexture('stone'),
  wood: generateTexture('wood'),
  log: generateTexture('log_side'),
  leaves: generateTexture('leaves'),
  sand: generateTexture('sand'),
  glass: generateTexture('glass')
};
