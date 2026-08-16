import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { Vector3, Euler } from 'three';
import { useKeyboard } from '../hooks/useKeyboard';
import { worldMap } from '../store';

const SPEED = 5;
const GRAVITY = 15;
const JUMP_FORCE = 6;
const _euler = new Euler(0, 0, 0, 'YXZ');
const velocity = new Vector3();

// Função auxiliar para verificar se um bloco existe numa coordenada arredondada
const hasBlock = (x, y, z) => {
  return worldMap.has(`${Math.round(x)}_${Math.round(y)}_${Math.round(z)}`);
};

export const Player = () => {
  const { camera } = useThree();
  const actions = useKeyboard();
  const controlsRef = useRef();

  useEffect(() => {
    camera.position.set(0, 10, 0); // Nasce caindo do alto
  }, [camera]);

  useFrame((state, delta) => {
    const isMobile = window.innerWidth <= 800 || 'ontouchstart' in window;
    if (!isMobile && (!controlsRef.current || !controlsRef.current.isLocked)) return;

    // ----- LOOK (Rotação) Mobile -----
    if (isMobile && window.mobileLook) {
      _euler.setFromQuaternion(camera.quaternion);
      _euler.y -= window.mobileLook.x * 0.005;
      _euler.x -= window.mobileLook.y * 0.005;
      _euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, _euler.x)); 
      camera.quaternion.setFromEuler(_euler);
      window.mobileLook = { x: 0, y: 0 };
    }

    // ----- MOVIMENTO -----
    const { moveForward, moveBackward, moveLeft, moveRight, jump } = actions;
    
    let moveZ = (moveBackward ? 1 : 0) - (moveForward ? 1 : 0);
    let moveX = (moveRight ? 1 : 0) - (moveLeft ? 1 : 0);
    
    if (window.mobileMove) {
      if (window.mobileMove.y !== 0) moveZ = -window.mobileMove.y / 50; 
      if (window.mobileMove.x !== 0) moveX = window.mobileMove.x / 50;
    }

    const direction = new Vector3(moveX, 0, moveZ);
    direction.normalize().multiplyScalar(SPEED * delta).applyEuler(camera.rotation);
    direction.y = 0; 
    
    const pos = camera.position;
    
    // --- COLISÃO X/Z (Paredes) ---
    // Checamos a altura dos pés (pos.y - 1.5) e do corpo (pos.y - 0.5)
    const checkWall = (nx, ny, nz) => {
      return hasBlock(nx, ny - 1.5, nz) || hasBlock(nx, ny - 0.5, nz);
    };

    if (!checkWall(pos.x + direction.x, pos.y, pos.z)) {
      pos.x += direction.x;
    }
    if (!checkWall(pos.x, pos.y, pos.z + direction.z)) {
      pos.z += direction.z;
    }

    // --- GRAVIDADE E COLISÃO Y (Chão) ---
    velocity.y -= GRAVITY * delta;
    
    // Verificamos se o bloco abaixo dos pés existe
    // Subtraímos um pouco mais para ver se vamos bater
    const nextY = pos.y + velocity.y * delta;
    const isGrounded = hasBlock(pos.x, nextY - 1.5, pos.z) || hasBlock(pos.x, nextY - 1.0, pos.z);

    if (isGrounded) {
      velocity.y = 0;
      // Arredondar a posição Y para ficar perfeitamente em cima do bloco (evitar trepidação)
      pos.y = Math.ceil(nextY - 1.5) + 1.5; 
      
      // Pulo (só pode pular se estiver no chão)
      if (jump || window.mobileJump) {
         velocity.y = JUMP_FORCE;
         if (window.mobileJump) window.mobileJump = false; // consome o pulo mobile
      }
    } else {
      // Bater a cabeça no teto
      if (hasBlock(pos.x, nextY, pos.z)) {
        velocity.y = 0;
      }
    }

    pos.y += velocity.y * delta;
    
    // Limite extremo para não cair para sempre no vazio
    if (pos.y < -20) {
      pos.set(0, 10, 0);
      velocity.y = 0;
    }
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
    </>
  );
};
