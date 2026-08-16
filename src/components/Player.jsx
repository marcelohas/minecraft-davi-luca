import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { Vector3 } from 'three';
import { useKeyboard } from '../hooks/useKeyboard';

const SPEED = 5;

export const Player = () => {
  const { camera } = useThree();
  const actions = useKeyboard();
  const controlsRef = useRef();

  // Setup inicial da câmera
  useEffect(() => {
    camera.position.set(0, 1, 0); // Posição inicial acima do chão
  }, [camera]);

  useFrame((state, delta) => {
    if (!controlsRef.current || !controlsRef.current.isLocked) return;

    const { moveForward, moveBackward, moveLeft, moveRight, jump } = actions;

    // Movimentação básica baseada na direção da câmera
    const direction = new Vector3();
    const frontVector = new Vector3(0, 0, (moveBackward ? 1 : 0) - (moveForward ? 1 : 0));
    const sideVector = new Vector3((moveLeft ? 1 : 0) - (moveRight ? 1 : 0), 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED * delta)
      .applyEuler(camera.rotation);

    camera.position.add(direction);
    
    // Travar altura para simular estar no chão
    // Uma física real exigiria raycasting para colisão, mas simplificaremos para a criança.
    if (camera.position.y < 1) camera.position.y = 1;
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
    </>
  );
};
