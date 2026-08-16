import { Joystick } from 'react-joystick-component';
import { useState, useEffect } from 'react';
import { useStore } from '../store';

export const MobileControls = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const toggleInventory = useStore((state) => state.toggleInventory);

  useEffect(() => {
    // Detectar mobile básico
    if (window.innerWidth <= 800 || 'ontouchstart' in window) {
      setIsMobile(true);
    }
    
    // Área da direita para olhar ao redor
    const handleTouchStart = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        // Se tocou na metade direita e ainda não temos um dedo controlando a câmera
        if (touch.clientX > window.innerWidth / 2 && window.activeLookTouchId === undefined) {
          window.activeLookTouchId = touch.identifier;
          window.lastTouch = { x: touch.clientX, y: touch.clientY };
        }
      }
    };

    const handleTouchMove = (e) => {
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.identifier === window.activeLookTouchId) {
          if (window.lastTouch) {
            const dx = touch.clientX - window.lastTouch.x;
            const dy = touch.clientY - window.lastTouch.y;
            window.mobileLook = { x: dx, y: dy };
          }
          window.lastTouch = { x: touch.clientX, y: touch.clientY };
        }
      }
    };

    const handleTouchEnd = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === window.activeLookTouchId) {
          window.activeLookTouchId = undefined;
          window.lastTouch = null;
          window.mobileLook = { x: 0, y: 0 };
        }
      }
    };

    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('touchcancel', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isMobile]);

  if (!isMobile) return null;

  const handleMove = (e) => {
    window.mobileMove = { x: e.x, y: e.y };
  };
  const handleStop = () => {
    window.mobileMove = { x: 0, y: 0 };
  };

  const handleJump = () => {
    window.mobileJump = true;
    setTimeout(() => { window.mobileJump = false; }, 100);
  };

  const toggleBreaking = () => {
    const newVal = !isBreaking;
    setIsBreaking(newVal);
    window.isMobileBreaking = newVal; // Lido no World.jsx
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }}>
      {/* Joystick lado esquerdo */}
      <div style={{ position: 'absolute', bottom: 100, left: 30, pointerEvents: 'auto' }}>
        <Joystick size={100} sticky={false} baseColor="rgba(255,255,255,0.3)" stickColor="rgba(255,255,255,0.6)" move={handleMove} stop={handleStop} />
      </div>

      {/* Botões lado direito */}
      <div style={{ position: 'absolute', bottom: 100, right: 30, pointerEvents: 'auto', display: 'flex', flexDirection: 'column', gap: 15 }}>
        <button 
          onClick={handleJump}
          style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.5)', border: 'none', fontSize: 12, fontWeight: 'bold' }}>
          Pular
        </button>
        <button 
          onClick={toggleBreaking}
          style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: isBreaking ? 'rgba(255,0,0,0.5)' : 'rgba(0,255,0,0.5)', border: 'none', fontSize: 12, fontWeight: 'bold' }}>
          {isBreaking ? 'Quebrar' : 'Colocar'}
        </button>
      </div>

      {/* Botão do Inventário (Canto superior direito) */}
      <div 
        style={{ position: 'absolute', top: 20, right: 20, width: 50, height: 50, borderRadius: '10px', backgroundColor: 'rgba(50,50,50,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid white', fontSize: '24px', pointerEvents: 'auto' }}
        onTouchStart={(e) => { e.stopPropagation(); toggleInventory(); }}
      >
        🎒
      </div>

      {/* Instrução visual na parte superior direita */}
      <div style={{ position: 'absolute', top: 10, right: 80, color: 'white', textShadow: '1px 1px 2px black', fontSize: 12, textAlign: 'right' }}>
        Deslize na direita para olhar <br/>
        Toque na tela para agir
      </div>
    </div>
  );
};
