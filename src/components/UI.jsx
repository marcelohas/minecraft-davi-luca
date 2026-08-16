import { useStore } from '../store';
import { useEffect } from 'react';
import { useKeyboard } from '../hooks/useKeyboard';
import { MobileControls } from './MobileControls';

const blocks = ['grass', 'dirt', 'stone', 'wood', 'log', 'leaves', 'sand', 'glass'];

export const UI = () => {
  const activeTexture = useStore((state) => state.texture);
  const setTexture = useStore((state) => state.setTexture);
  const actions = useKeyboard();

  useEffect(() => {
    // Teclas 1 a 8
    const handleNumberKeys = (e) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 8) {
        setTexture(blocks[num - 1]);
      }
    };
    document.addEventListener('keydown', handleNumberKeys);
    return () => document.removeEventListener('keydown', handleNumberKeys);
  }, [setTexture]);

  return (
    <>
      <div className="crosshair"></div>
      
      {/* Container Hotbar Clássico */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        backgroundColor: 'rgba(50, 50, 50, 0.8)',
        border: '3px solid #111',
        padding: '5px',
        zIndex: 10
      }}>
        {blocks.map((block) => {
          // Gerando preview visual
          let bg = '#CCC';
          if (block === 'grass') bg = '#4CAF50';
          if (block === 'dirt') bg = '#795548';
          if (block === 'stone') bg = '#808080';
          if (block === 'wood') bg = '#C19A6B';
          if (block === 'log') bg = '#5D4037';
          if (block === 'leaves') bg = '#228B22';
          if (block === 'sand') bg = '#C2B280';
          if (block === 'glass') bg = '#ADD8E6';

          const isActive = activeTexture === block;

          return (
            <div
              key={block}
              onClick={() => setTexture(block)}
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: bg,
                opacity: block === 'glass' ? 0.6 : 1,
                border: isActive ? '3px solid white' : '3px solid #555',
                margin: '2px',
                cursor: 'pointer',
                boxShadow: isActive ? '0 0 10px white' : 'none'
              }}
            ></div>
          );
        })}
      </div>

      <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 5, pointerEvents: 'none', zIndex: 10, fontFamily: 'monospace' }}>
        <h3>Minecraft Classic (Reversa)</h3>
        <p><b>W, A, S, D</b>: Andar</p>
        <p><b>Espaço</b>: Pular</p>
        <p><b>Mouse Esq</b>: Construir</p>
        <p><b>Mouse Dir / Alt</b>: Quebrar</p>
        <p><b>1-8</b>: Trocar bloco</p>
      </div>

      <MobileControls />
    </>
  );
};
