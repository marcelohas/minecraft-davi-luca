import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Euler } from 'three';

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
  
  // Estado da IA do animal
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
        // Decide andar
        state.current.action = 'walking';
        state.current.targetRotation = Math.random() * Math.PI * 2;
        state.current.timer = 1 + Math.random() * 3; // anda por 1 a 4 segs
      } else {
        // Decide parar
        state.current.action = 'idle';
        state.current.timer = 2 + Math.random() * 5; // para por 2 a 7 segs
      }
    }

    // Suaviza a rotação (interpolação)
    const currentRot = groupRef.current.rotation.y;
    const diff = state.current.targetRotation - currentRot;
    groupRef.current.rotation.y += diff * delta * 2;

    // Movimento
    if (state.current.action === 'walking') {
      const speed = type === 'pig' ? 1.0 : 0.8;
      groupRef.current.translateZ(speed * delta);
      
      // Limite simples do mundo (evitar que caiam para fora do 32x32)
      if (groupRef.current.position.x > 14) groupRef.current.position.x = 14;
      if (groupRef.current.position.x < -14) groupRef.current.position.x = -14;
      if (groupRef.current.position.z > 14) groupRef.current.position.z = 14;
      if (groupRef.current.position.z < -14) groupRef.current.position.z = -14;
      
      // TODO: Gravidade e colisão com terreno real
      // Para simular, vamos mantê-lo sempre em Y=1 (plano base) ou ler do store.
      // Como o terreno tem colinas, num jogo real faríamos um Raycast. 
      // Por simplicidade, fixaremos a altura inicial.
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {type === 'pig' ? <PigModel /> : <CowModel />}
    </group>
  );
};
