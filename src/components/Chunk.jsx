import { useRef, useMemo, useEffect } from 'react';
import { Object3D } from 'three';
import { textures } from '../images/textures';

const o = new Object3D();

export const Chunk = ({ blocks, onClick, onMove }) => {
  const blocksByTexture = useMemo(() => {
    const map = {};
    blocks.forEach(cube => {
      if (!map[cube.texture]) map[cube.texture] = [];
      map[cube.texture].push(cube);
    });
    return map;
  }, [blocks]);

  return (
    <group>
      {Object.entries(blocksByTexture).map(([textureName, blockList]) => (
        <InstancedCubes
          key={textureName}
          textureName={textureName}
          blocks={blockList}
          onClick={(e) => onClick(e, textureName, blockList)}
          onMove={(e) => onMove(e, textureName, blockList)}
        />
      ))}
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
