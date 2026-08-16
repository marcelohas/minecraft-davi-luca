import { useRef, useMemo, useEffect, useState } from 'react';
import { useStore } from '../store';
import { Object3D, BoxGeometry } from 'three';
import { textures } from '../images/textures';

const o = new Object3D();

export const World = () => {
  const cubes = useStore((state) => state.cubes);
  const activeTexture = useStore((state) => state.texture);
  const addCube = useStore((state) => state.addCube);
  const removeCube = useStore((state) => state.removeCube);

  const [hoveredPos, setHoveredPos] = useState(null);

  const blocksByTexture = useMemo(() => {
    const map = {};
    cubes.forEach(cube => {
      if (!map[cube.texture]) map[cube.texture] = [];
      map[cube.texture].push(cube);
    });
    return map;
  }, [cubes]);

  const handlePointerDown = (e, textureName) => {
    e.stopPropagation();
    const { instanceId } = e;
    if (instanceId === undefined) return;
    
    const block = blocksByTexture[textureName][instanceId];
    if (!block) return;
    
    const clickedFace = Math.floor(e.faceIndex / 2);
    const { pos } = block;
    const [x, y, z] = pos;
    
    if (e.altKey || e.button === 2 || window.isMobileBreaking) {
      if (y > -4) removeCube(x, y, z);
      setHoveredPos(null);
      return;
    }

    if (clickedFace === 0) addCube(x + 1, y, z, activeTexture);
    else if (clickedFace === 1) addCube(x - 1, y, z, activeTexture);
    else if (clickedFace === 2) addCube(x, y + 1, z, activeTexture);
    else if (clickedFace === 3) addCube(x, y - 1, z, activeTexture);
    else if (clickedFace === 4) addCube(x, y, z + 1, activeTexture);
    else if (clickedFace === 5) addCube(x, y, z - 1, activeTexture);
  };

  const handlePointerMove = (e, textureName) => {
    e.stopPropagation();
    const { instanceId } = e;
    if (instanceId === undefined) return;
    const block = blocksByTexture[textureName][instanceId];
    if (block) setHoveredPos(block.pos);
  };

  const handlePointerOut = () => {
    setHoveredPos(null);
  };

  return (
    <group onPointerOut={handlePointerOut}>
      {Object.entries(blocksByTexture).map(([textureName, blocks]) => (
        <InstancedCubes 
          key={textureName}
          textureName={textureName}
          blocks={blocks}
          onClick={(e) => handlePointerDown(e, textureName)}
          onMove={(e) => handlePointerMove(e, textureName)}
        />
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

const InstancedCubes = ({ textureName, blocks, onClick, onMove }) => {
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      blocks.forEach((block, i) => {
        o.position.set(...block.pos);
        o.updateMatrix();
        meshRef.current.setMatrixAt(i, o.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [blocks]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, blocks.length]}
      onPointerDown={onClick}
      onPointerMove={onMove}
    >
      <boxGeometry attach="geometry" />
      {Array.isArray(textures[textureName]) ? (
        textures[textureName].map((tex, i) => (
          <meshStandardMaterial key={i} attach={`material-${i}`} map={tex} />
        ))
      ) : (
        <meshStandardMaterial attach="material" map={textures[textureName]} transparent={textureName === 'glass'} opacity={textureName === 'glass' ? 0.6 : 1} />
      )}
    </instancedMesh>
  );
};
