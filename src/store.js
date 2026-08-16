import { create } from 'zustand';
import { createNoise2D } from 'simplex-noise';

const nanoid = () => Math.random().toString(36).substring(2, 9);
const noise2D = createNoise2D();

export const worldMap = new Set();
const CHUNK_SIZE = 16;
const RENDER_DISTANCE = 2; // Raio (2 = 5x5 chunks = 25 chunks)

// Função para gerar um chunk de 16x16
function generateChunk(cx, cz) {
  const blocks = [];
  const animals = [];
  const startX = cx * CHUNK_SIZE;
  const startZ = cz * CHUNK_SIZE;

  for (let x = 0; x < CHUNK_SIZE; x++) {
    for (let z = 0; z < CHUNK_SIZE; z++) {
      const worldX = startX + x;
      const worldZ = startZ + z;
      
      const height = Math.floor(noise2D(worldX / 20, worldZ / 20) * 4);
      
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

        blocks.push({
          key: nanoid(),
          pos: blockPos,
          texture
        });
        
        if (y === height) topTexture = texture;
      }

      // Árvores
      if (height >= -1 && Math.random() < 0.01) {
        for (let i = 1; i <= 4; i++) {
          const ly = height + i;
          worldMap.add(`${worldX}_${ly}_${worldZ}`);
          blocks.push({ key: nanoid(), pos: [worldX, ly, worldZ], texture: 'log' });
        }
        for (let lx = -2; lx <= 2; lx++) {
          for (let lz = -2; lz <= 2; lz++) {
            for (let ly = 3; ly <= 5; ly++) {
              if (Math.abs(lx) === 2 && Math.abs(lz) === 2 && Math.abs(ly) === 5) continue;
              const hlx = worldX + lx;
              const hly = height + ly;
              const hlz = worldZ + lz;
              worldMap.add(`${hlx}_${hly}_${hlz}`);
              blocks.push({ key: nanoid(), pos: [hlx, hly, hlz], texture: 'leaves' });
            }
          }
        }
      }

      // Animais
      if (topTexture === 'grass' && Math.random() < 0.01) {
        animals.push({
          id: nanoid(),
          type: Math.random() > 0.5 ? 'pig' : 'cow',
          pos: [worldX, height + 1, worldZ]
        });
      }
    }
  }
  return { blocks, animals };
}

export const useStore = create((set, get) => ({
  chunks: {},
  texture: 'wood',
  playerChunk: null,
  isInventoryOpen: false,

  toggleInventory: () => set((state) => {
    // Se abrir o inventário, sair do pointer lock
    if (!state.isInventoryOpen && document.pointerLockElement) {
      document.exitPointerLock();
    }
    return { isInventoryOpen: !state.isInventoryOpen };
  }),

  closeInventory: () => set(() => ({ isInventoryOpen: false })),

  requestChunks: (px, pz) => {
    const cx = Math.floor(px / CHUNK_SIZE);
    const cz = Math.floor(pz / CHUNK_SIZE);
    
    // Evita gerar se o player ainda está no mesmo chunk
    if (get().playerChunk === `${cx}_${cz}`) return;

    set((state) => {
      const newChunks = { ...state.chunks };
      let updated = false;

      // Gerar chunks ao redor
      for (let x = cx - RENDER_DISTANCE; x <= cx + RENDER_DISTANCE; x++) {
        for (let z = cz - RENDER_DISTANCE; z <= cz + RENDER_DISTANCE; z++) {
          const chunkKey = `${x}_${z}`;
          if (!newChunks[chunkKey]) {
            newChunks[chunkKey] = generateChunk(x, z);
            updated = true;
          }
        }
      }

      if (updated) {
        return { chunks: newChunks, playerChunk: `${cx}_${cz}` };
      }
      return { playerChunk: `${cx}_${cz}` };
    });
  },

  addCube: (x, y, z, texture) => {
    const cx = Math.floor(x / CHUNK_SIZE);
    const cz = Math.floor(z / CHUNK_SIZE);
    const chunkKey = `${cx}_${cz}`;

    worldMap.add(`${x}_${y}_${z}`);
    
    set((state) => {
      const chunk = state.chunks[chunkKey];
      if (!chunk) return state;

      return {
        chunks: {
          ...state.chunks,
          [chunkKey]: {
            ...chunk,
            blocks: [...chunk.blocks, { key: nanoid(), pos: [x, y, z], texture }]
          }
        }
      };
    });
  },

  removeCube: (x, y, z) => {
    const cx = Math.floor(x / CHUNK_SIZE);
    const cz = Math.floor(z / CHUNK_SIZE);
    const chunkKey = `${cx}_${cz}`;

    worldMap.delete(`${x}_${y}_${z}`);

    set((state) => {
      const chunk = state.chunks[chunkKey];
      if (!chunk) return state;

      return {
        chunks: {
          ...state.chunks,
          [chunkKey]: {
            ...chunk,
            blocks: chunk.blocks.filter(b => b.pos[0] !== x || b.pos[1] !== y || b.pos[2] !== z)
          }
        }
      };
    });
  },

  setTexture: (texture) => set(() => ({ texture }))
}));
