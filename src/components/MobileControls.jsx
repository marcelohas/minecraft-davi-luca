import { Joystick } from 'react-joystick-component';
import { useState, useEffect } from 'react';

export const MobileControls = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);

  useEffect(() => {
    // Detectar mobile básico
    if (window.innerWidth <= 800 || 'ontouchstart' in window) {
      setIsMobile(true);
    }
    
    // Área da direita para olhar ao redor
    const handleTouchMove = (e) => {
      // Pega o touch que está do lado direito da tela
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        if (touch.clientX > window.innerWidth / 2) {
          if (!window.lastTouch) {
            window.lastTouch = { x: touch.clientX, y: touch.clientY };
          } else {
            const dx = touch.clientX - window.lastTouch.x;
            const dy = touch.clientY - window.lastTouch.y;
            window.mobileLook = { x: dx, y: dy };
            window.lastTouch = { x: touch.clientX, y: touch.clientY };
          }
        }
      }
    };

    const handleTouchEnd = () => {
      window.lastTouch = null;
      window.mobileLook = { x: 0, y: 0 };
    };

    if (isMobile) {
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
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

      {/* Instrução visual na parte superior direita */}
      <div style={{ position: 'absolute', top: 10, right: 10, color: 'white', textShadow: '1px 1px 2px black', fontSize: 12, textAlign: 'right' }}>
        Deslize na direita para olhar <br/>
        Toque na tela para agir
      </div>
    </div>
  );
};
