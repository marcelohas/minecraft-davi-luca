import { create } from 'zustand';

// Função auxiliar para criar ID único para cada bloco
const nanoid = () => Math.random().toString(36).substring(2, 9);

export const useStore = create((set) => ({
  cubes: [
    // Mundo inicial: chão plano de grama (10x10)
    ...Array.from({ length: 100 }, (_, i) => ({
      key: nanoid(),
      pos: [(i % 10) - 5, -1, Math.floor(i / 10) - 5],
      texture: 'grass'
    }))
  ],
  texture: 'grass', // textura atual selecionada (grass, dirt, wood, glass)

  // Ações
  addCube: (x, y, z, texture) => set((state) => ({
    cubes: [
      ...state.cubes,
      {
        key: nanoid(),
        pos: [x, y, z],
        texture: texture // ou state.texture
      }
    ]
  })),

  removeCube: (x, y, z) => set((state) => ({
    cubes: state.cubes.filter(cube => {
      const [X, Y, Z] = cube.pos;
      return X !== x || Y !== y || Z !== z;
    })
  })),

  setTexture: (texture) => set(() => ({
    texture
  }))
}));
