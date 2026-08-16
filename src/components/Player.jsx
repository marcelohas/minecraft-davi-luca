import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { Vector3, Euler } from 'three';
import { useKeyboard } from '../hooks/useKeyboard';

const SPEED = 5;
const _euler = new Euler(0, 0, 0, 'YXZ');

export const Player = () => {
  const { camera } = useThree();
  const actions = useKeyboard();
  const controlsRef = useRef();

  useEffect(() => {
    camera.position.set(0, 10, 0); // Nascer mais alto devido às colinas
  }, [camera]);

  useFrame((state, delta) => {
    // Se for desktop, requer estar travado. Se for mobile, move sempre.
    const isMobile = window.innerWidth <= 800 || 'ontouchstart' in window;
    if (!isMobile && (!controlsRef.current || !controlsRef.current.isLocked)) return;

    // ----- LOOK (Rotação) Mobile -----
    if (isMobile && window.mobileLook) {
      _euler.setFromQuaternion(camera.quaternion);
      _euler.y -= window.mobileLook.x * 0.005;
      _euler.x -= window.mobileLook.y * 0.005;
      _euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, _euler.x)); // Trava olhar pra cima/baixo
      camera.quaternion.setFromEuler(_euler);
      window.mobileLook = { x: 0, y: 0 }; // Reseta
    }

    // ----- MOVIMENTO -----
    const { moveForward, moveBackward, moveLeft, moveRight, jump } = actions;
    
    let moveZ = (moveBackward ? 1 : 0) - (moveForward ? 1 : 0);
    let moveX = (moveRight ? 1 : 0) - (moveLeft ? 1 : 0);
    
    // Joystick sobrescreve teclado se usado
    if (window.mobileMove) {
      // Joystick y é positivo pra cima, mas precisamos negativo pra frente.
      // x é positivo pra direita.
      if (window.mobileMove.y !== 0) moveZ = -window.mobileMove.y / 50; 
      if (window.mobileMove.x !== 0) moveX = window.mobileMove.x / 50;
    }

    const direction = new Vector3();
    const frontVector = new Vector3(0, 0, moveZ);
    const sideVector = new Vector3(moveX, 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED * delta)
      .applyEuler(camera.rotation);
      
    // Ignora movimento em Y gerado pelo olhar
    direction.y = 0; 
    
    camera.position.add(direction);
    
    // Pulo (Simples)
    if (jump || window.mobileJump) {
       camera.position.y += 0.2;
    } else {
       // Gravidade suave até o chão
       camera.position.y -= 0.1;
    }

    // Travar altura provisoriamente (num jogo real seria raycast contra o terreno)
    // Para simplificar e não atravessar o chão, limitamos Y dependendo de X,Z.
    // Como não temos acesso fácil ao bloco exato sob os pés aqui, vamos limitar em Y=1 globalmente
    // ou pegar do mundo (se o usuário for pra baixo de 1, volta).
    if (camera.position.y < 1) camera.position.y = 1; 
  });

  return (
    <>
      <PointerLockControls ref={controlsRef} />
    </>
  );
};
