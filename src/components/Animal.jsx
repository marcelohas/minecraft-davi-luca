import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Euler } from 'three';
import { worldMap } from '../store';

const clean = (n) => (n === 0 ? 0 : n);
const hasBlock = (x, y, z) => {
  return worldMap.has(`${clean(Math.round(x))}_${clean(Math.round(y))}_${clean(Math.round(z))}`);
};

// Modelos simplificados
const PigModel = () => (
  <group>
    {/* Corpo */}
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[0.6, 0.5, 1.0]} />
      <meshStandardMaterial color="#FFB5C5" />
    </mesh>
    {/* Cabeça */}
    <mesh position={[0, 0.8, 0.6]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#FFC0CB" />
    </mesh>
    {/* Focinho */}
    <mesh position={[0, 0.7, 0.86]}>
      <boxGeometry args={[0.2, 0.2, 0.1]} />
      <meshStandardMaterial color="#E799A3" />
    </mesh>
    {/* Pernas */}
    <mesh position={[-0.2, 0.2, 0.3]}><boxGeometry args={[0.2, 0.4, 0.2]} /><meshStandardMaterial color="#FFB5C5" /></mesh>
    <mesh position={[0.2, 0.2, 0.3]}><boxGeometry args={[0.2, 0.4, 0.2]} /><meshStandardMaterial color="#FFB5C5" /></mesh>
    <mesh position={[-0.2, 0.2, -0.3]}><boxGeometry args={[0.2, 0.4, 0.2]} /><meshStandardMaterial color="#FFB5C5" /></mesh>
    <mesh position={[0.2, 0.2, -0.3]}><boxGeometry args={[0.2, 0.4, 0.2]} /><meshStandardMaterial color="#FFB5C5" /></mesh>
  </group>
);

const CowModel = () => (
  <group>
    {/* Corpo */}
    <mesh position={[0, 0.7, 0]}>
      <boxGeometry args={[0.8, 0.7, 1.2]} />
      <meshStandardMaterial color="#FFFFFF" />
    </mesh>
    {/* Manchas Negras (Simples) */}
    <mesh position={[0, 0.7, 0]}>
      <boxGeometry args={[0.81, 0.4, 0.4]} />
      <meshStandardMaterial color="#111111" />
    </mesh>
    {/* Cabeça */}
    <mesh position={[0, 1.1, 0.7]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#111111" />
    </mesh>
    {/* Focinho */}
    <mesh position={[0, 1.0, 0.96]}>
      <boxGeometry args={[0.4, 0.3, 0.1]} />
      <meshStandardMaterial color="#DDDDDD" />
    </mesh>
    {/* Chifres */}
    <mesh position={[-0.2, 1.4, 0.6]}><boxGeometry args={[0.1, 0.2, 0.1]} /><meshStandardMaterial color="#DDDDDD" /></mesh>
    <mesh position={[0.2, 1.4, 0.6]}><boxGeometry args={[0.1, 0.2, 0.1]} /><meshStandardMaterial color="#DDDDDD" /></mesh>
    {/* Pernas */}
    <mesh position={[-0.3, 0.35, 0.4]}><boxGeometry args={[0.2, 0.7, 0.2]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
    <mesh position={[0.3, 0.35, 0.4]}><boxGeometry args={[0.2, 0.7, 0.2]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
    <mesh position={[-0.3, 0.35, -0.4]}><boxGeometry args={[0.2, 0.7, 0.2]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
    <mesh position={[0.3, 0.35, -0.4]}><boxGeometry args={[0.2, 0.7, 0.2]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
  </group>
);

export const Animal = ({ type, position }) => {
  const groupRef = useRef();
  const velocityY = useRef(0);
  
  const state = useRef({
    action: 'idle',
    targetRotation: Math.random() * Math.PI * 2,
    timer: Math.random() * 2
  });

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Atualiza IA
    state.current.timer -= delta;
    if (state.current.timer <= 0) {
      if (state.current.action === 'idle') {
        state.current.action = 'walking';
        state.current.targetRotation = Math.random() * Math.PI * 2;
        state.current.timer = 1 + Math.random() * 3;
      } else {
        state.current.action = 'idle';
        state.current.timer = 2 + Math.random() * 5;
      }
    }

    const currentRot = groupRef.current.rotation.y;
    const diff = state.current.targetRotation - currentRot;
    groupRef.current.rotation.y += diff * delta * 2;

    const pos = groupRef.current.position;

    // Movimento Horizontal
    if (state.current.action === 'walking') {
      const speed = type === 'pig' ? 1.0 : 0.8;
      
      // Vetor de direção baseado na rotação atual
      const dir = new Vector3(0, 0, 1).applyEuler(new Euler(0, currentRot, 0));
      const nx = pos.x + dir.x * speed * delta;
      const nz = pos.z + dir.z * speed * delta;
      
      // Checar parede na frente
      if (!hasBlock(nx, pos.y, nz) && !hasBlock(nx, pos.y + 1, nz)) {
         pos.x = nx;
         pos.z = nz;
      } else {
         // Se bater num bloco, vira para outro lado imediatamente
         state.current.action = 'idle';
         state.current.timer = 1;
         state.current.targetRotation = currentRot + Math.PI;
      }
      
      // Limite do mundo
      if (pos.x > 14 || pos.x < -14 || pos.z > 14 || pos.z < -14) {
         state.current.targetRotation += Math.PI; // Volta pro centro
      }
    }

    // Gravidade
    velocityY.current -= 15 * delta;
    const nextY = pos.y + velocityY.current * delta;
    
    // Altura das pernas (porco e vaca têm barriga/pernas em 0.5)
    // Se o chão (Y-1) existe, pousar no bloco.
    if (hasBlock(pos.x, nextY - 0.5, pos.z)) {
      velocityY.current = 0;
      pos.y = Math.ceil(nextY - 0.5) + 0.5;
    } else {
      pos.y += velocityY.current * delta;
    }
    
    
    if (pos.y < -20 || isNaN(pos.x) || isNaN(pos.y) || isNaN(pos.z)) {
      pos.set(0, 10, 0); // Respawn se cair no abismo ou der NaN
      velocityY.current = 0;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {type === 'pig' ? <PigModel /> : <CowModel />}
    </group>
  );
};
