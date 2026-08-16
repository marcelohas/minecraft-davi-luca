
import { useState } from 'react';
import { useStore } from '../store';

const colors = {
  grass: '#4CAF50',
  dirt: '#795548',
  wood: '#8D6E63',
  log: '#5D4037',
  glass: '#ADD8E6'
};

export const Cube = ({ position, texture, isFloor = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const addCube = useStore((state) => state.addCube);
  const removeCube = useStore((state) => state.removeCube);
  const activeTexture = useStore((state) => state.texture);

  return (
    <mesh
      position={position}
      onPointerMove={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        const clickedFace = Math.floor(e.faceIndex / 2);
        const { x, y, z } = position;
        
        // Se clicar com o botão direito (ou alt), remove
        if (e.altKey || e.button === 2) {
          if (!isFloor) removeCube(x, y, z);
          return;
        }

        // Adiciona um cubo na face clicada
        if (clickedFace === 0) addCube(x + 1, y, z, activeTexture);
        else if (clickedFace === 1) addCube(x - 1, y, z, activeTexture);
        else if (clickedFace === 2) addCube(x, y + 1, z, activeTexture);
        else if (clickedFace === 3) addCube(x, y - 1, z, activeTexture);
        else if (clickedFace === 4) addCube(x, y, z + 1, activeTexture);
        else if (clickedFace === 5) addCube(x, y, z - 1, activeTexture);
      }}
    >
      <boxGeometry attach="geometry" />
      <meshStandardMaterial 
        attach="material" 
        color={isHovered ? '#DDDDDD' : colors[texture] || '#FFFFFF'} 
        transparent={texture === 'glass'}
        opacity={texture === 'glass' ? 0.6 : 1}
      />
    </mesh>
  );
};
