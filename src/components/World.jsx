import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { sounds } from '../utils/sounds';
import { BoxGeometry } from 'three';
import { Animal } from './Animal';
import { Chunk } from './Chunk';

export const World = () => {
  const chunks = useStore((state) => state.chunks);
  const activeTexture = useStore((state) => state.texture);
  const addCube = useStore((state) => state.addCube);
  const removeCube = useStore((state) => state.removeCube);

  const [hoveredPos, setHoveredPos] = useState(null);

  useEffect(() => {
    const handleInit = () => sounds.init();
    window.addEventListener('click', handleInit, { once: true });
    window.addEventListener('touchstart', handleInit, { once: true });
  }, []);

  const handlePointerDown = (e, textureName, blockList) => {
    e.stopPropagation();
    const { instanceId } = e;
    if (instanceId === undefined) return;
    
    const block = blockList[instanceId];
    if (!block) return;
    
    const clickedFace = Math.floor(e.faceIndex / 2);
    const { pos } = block;
    const [x, y, z] = pos;
    
    if (e.altKey || e.button === 2 || window.isMobileBreaking) {
      removeCube(x, y, z);
      sounds.break();
      setHoveredPos(null);
      return;
    }

    if (clickedFace === 0) addCube(x + 1, y, z, activeTexture);
    else if (clickedFace === 1) addCube(x - 1, y, z, activeTexture);
    else if (clickedFace === 2) addCube(x, y + 1, z, activeTexture);
    else if (clickedFace === 3) addCube(x, y - 1, z, activeTexture);
    else if (clickedFace === 4) addCube(x, y, z + 1, activeTexture);
    else if (clickedFace === 5) addCube(x, y, z - 1, activeTexture);
    sounds.place();
  };

  const handlePointerMove = (e, textureName, blockList) => {
    e.stopPropagation();
    const { instanceId } = e;
    if (instanceId === undefined) return;
    const block = blockList[instanceId];
    if (block) setHoveredPos(block.pos);
  };

  const handlePointerOut = () => {
    setHoveredPos(null);
  };

  return (
    <group onPointerOut={handlePointerOut}>
      {Object.entries(chunks).map(([chunkKey, chunkData]) => (
        <group key={chunkKey}>
          <Chunk 
            blocks={chunkData.blocks} 
            onClick={handlePointerDown}
            onMove={handlePointerMove}
          />
          {chunkData.animals.map((animal) => (
            <Animal key={animal.id} type={animal.type} position={animal.pos} />
          ))}
        </group>
      ))}
      
      {/* Contorno Preto do Bloco Selecionado */}
      {hoveredPos && (
        <lineSegments position={hoveredPos}>
          <edgesGeometry attach="geometry" args={[new BoxGeometry(1.001, 1.001, 1.001)]} />
          <lineBasicMaterial attach="material" color="black" />
        </lineSegments>
      )}
    </group>
  );
};
