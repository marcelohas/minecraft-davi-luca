import { create } from 'zustand';
import { createNoise2D } from 'simplex-noise';

const nanoid = () => Math.random().toString(36).substring(2, 9);
const noise2D = createNoise2D();

// Mapa global para acesso ultra-rápido à colisão
export const worldMap = new Set();

// Função para gerar mundo com colinas
function generateWorld(size = 32) {
  const cubes = [];
  const animals = [];
  const startX = -size / 2;
  const startZ = -size / 2;

  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      const worldX = startX + x;
      const worldZ = startZ + z;
      
      // Ruído para altura (frequência baixa para colinas suaves)
      const height = Math.floor(noise2D(worldX / 20, worldZ / 20) * 4);
      
      // Criar de baixo até a altura
      let topTexture = 'stone';
      for (let y = -4; y <= height; y++) {
        let texture = 'stone';
        if (y === height) {
          texture = y < -1 ? 'sand' : 'grass';
        } else if (y >= height - 2) {
          texture = 'dirt';
        }

        const blockPos = [worldX, y, worldZ];
        worldMap.add(`${worldX}_${y}_${worldZ}`);

        cubes.push({
          key: nanoid(),
          pos: blockPos,
          texture
        });
        
        if (y === height) topTexture = texture;
      }

      // Árvores aleatórias (1% de chance)
      if (height >= -1 && Math.random() < 0.01) {
        // Tronco
        for (let i = 1; i <= 4; i++) {
          const ly = height + i;
          worldMap.add(`${worldX}_${ly}_${worldZ}`);
          cubes.push({
            key: nanoid(),
            pos: [worldX, ly, worldZ],
            texture: 'log'
          });
        }
        // Folhas
        for (let lx = -2; lx <= 2; lx++) {
          for (let lz = -2; lz <= 2; lz++) {
            for (let ly = 3; ly <= 5; ly++) {
              // Deixar os cantos vazios para formato arredondado
              if (Math.abs(lx) === 2 && Math.abs(lz) === 2 && Math.abs(ly) === 5) continue;
              
              const hlx = worldX + lx;
              const hly = height + ly;
              const hlz = worldZ + lz;
              worldMap.add(`${hlx}_${hly}_${hlz}`);

              cubes.push({
                key: nanoid(),
                pos: [hlx, hly, hlz],
                texture: 'leaves'
              });
            }
          }
        }
      }

      // Animais aleatórios na grama (2% chance)
      if (topTexture === 'grass' && Math.random() < 0.02) {
        animals.push({
          id: nanoid(),
          type: Math.random() > 0.5 ? 'pig' : 'cow',
          pos: [worldX, height + 1, worldZ]
        });
      }
    }
  }
  return { cubes, animals };
}

const initialWorld = generateWorld(32);

export const useStore = create((set) => ({
  cubes: initialWorld.cubes,
  animals: initialWorld.animals,
  texture: 'wood',

  addCube: (x, y, z, texture) => {
    worldMap.add(`${x}_${y}_${z}`);
    set((state) => ({
      cubes: [
        ...state.cubes,
        {
          key: nanoid(),
          pos: [x, y, z],
          texture
        }
      ]
    }));
  },

  removeCube: (x, y, z) => {
    worldMap.delete(`${x}_${y}_${z}`);
    set((state) => ({
      cubes: state.cubes.filter(cube => {
        const [X, Y, Z] = cube.pos;
        return X !== x || Y !== y || Z !== z;
      })
    }));
  },

  setTexture: (texture) => set(() => ({
    texture
  }))
}));
