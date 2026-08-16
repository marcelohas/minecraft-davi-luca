import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { Vector3, Euler } from 'three';
import { useKeyboard } from '../hooks/useKeyboard';
import { worldMap } from '../store';

const SPEED = 5;
const GRAVITY = 20;
const JUMP_FORCE = 8;
const _euler = new Euler(0, 0, 0, 'YXZ');
const velocity = new Vector3();

const clean = (n) => (n === 0 ? 0 : n);
// Pega se existe bloco no cubo exato
const hasBlock = (x, y, z) => {
  return worldMap.has(`${clean(Math.round(x))}_${clean(Math.round(y))}_${clean(Math.round(z))}`);
};

export const Player = () => {
  const { camera } = useThree();
  const actions = useKeyboard();
  const controlsRef = useRef();

  useEffect(() => {
    camera.position.set(0, 10, 0); 
  }, [camera]);

  useFrame((state, delta) => {
    // Delta limite para evitar saltos se a aba travar
    const dt = Math.min(delta, 0.1); 
    
    const isMobile = window.innerWidth <= 800 || 'ontouchstart' in window;
    if (!isMobile && (!controlsRef.current || !controlsRef.current.isLocked)) return;

    if (isMobile && window.mobileLook) {
      _euler.setFromQuaternion(camera.quaternion);
      _euler.y -= window.mobileLook.x * 0.005;
      _euler.x -= window.mobileLook.y * 0.005;
      _euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, _euler.x)); 
      camera.quaternion.setFromEuler(_euler);
      window.mobileLook = { x: 0, y: 0 };
    }

    const { moveForward, moveBackward, moveLeft, moveRight, jump } = actions;
    
    let moveZ = (moveBackward ? 1 : 0) - (moveForward ? 1 : 0);
    let moveX = (moveRight ? 1 : 0) - (moveLeft ? 1 : 0);
    
    if (window.mobileMove) {
      if (window.mobileMove.y !== 0) moveZ = -window.mobileMove.y / 50; 
      if (window.mobileMove.x !== 0) moveX = window.mobileMove.x / 50;
    }

    const direction = new Vector3(moveX, 0, moveZ);
    if (direction.lengthSq() > 0.001) {
      direction.normalize().multiplyScalar(SPEED * dt).applyEuler(camera.rotation);
      direction.y = 0; 
    } else {
      direction.set(0, 0, 0);
    }
    
    const pos = camera.position;
    
    if (isNaN(pos.x) || isNaN(pos.y) || isNaN(pos.z)) {
      pos.set(0, 10, 0);
      velocity.set(0, 0, 0);
    }
    
    // Raio do jogador
    const radius = 0.3;
    const playerHeight = 1.5; 
    
    // Colisão horizontal X
    const checkWall = (px, py, pz) => {
      // Checamos a cabeça e o pé
      return hasBlock(px, py - playerHeight + 0.1, pz) || hasBlock(px, py - 0.1, pz);
    };

    const nextX = pos.x + direction.x;
    if (!checkWall(nextX + Math.sign(direction.x) * radius, pos.y, pos.z)) {
      pos.x = nextX;
    }
    
    const nextZ = pos.z + direction.z;
    if (!checkWall(pos.x, pos.y, nextZ + Math.sign(direction.z) * radius)) {
      pos.z = nextZ;
    }

    // Gravidade
    velocity.y -= GRAVITY * dt;
    const nextY = pos.y + velocity.y * dt;
    
    // O chão sob o jogador (Y do bloco é Math.round(nextY - playerHeight - 0.5))
    // A superfície de um bloco Y é sempre Y + 0.5
    // O pé do jogador está em pos.y - playerHeight
    const feetY = nextY - playerHeight;
    const blockY = Math.round(feetY - 0.5); 
    const isGrounded = hasBlock(pos.x, blockY, pos.z) && feetY <= blockY + 0.5;

    if (isGrounded) {
      velocity.y = 0;
      pos.y = blockY + 0.5 + playerHeight; // Crava o pé exatamente no topo do bloco
      
      if (jump || window.mobileJump) {
         velocity.y = JUMP_FORCE;
         if (window.mobileJump) window.mobileJump = false; 
      }
    } else {
      // Teto
      const headY = nextY;
      const ceilBlockY = Math.round(headY + 0.5);
      if (hasBlock(pos.x, ceilBlockY, pos.z) && headY >= ceilBlockY - 0.5) {
         velocity.y = 0;
         pos.y = ceilBlockY - 0.5;
      }
    }

    pos.y += velocity.y * dt;
    
    if (pos.y < -20) {
      pos.set(0, 10, 0);
      velocity.set(0, 0, 0);
    }
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
    </>
  );
};
