import { useStore } from '../store';
import { useEffect } from 'react';
import { useKeyboard } from '../hooks/useKeyboard';

const blocks = ['dirt', 'grass', 'glass', 'wood', 'log'];

export const UI = () => {
  const [activeTexture, setTexture] = useStore((state) => [state.texture, state.setTexture]);
  const actions = useKeyboard();

  useEffect(() => {
    if (actions.dirt) setTexture('dirt');
    if (actions.grass) setTexture('grass');
    if (actions.glass) setTexture('glass');
    if (actions.wood) setTexture('wood');
    if (actions.log) setTexture('log');
  }, [actions, setTexture]);

  return (
    <>
      <div className="crosshair"></div>
      <div className="hotbar">
        {blocks.map((block) => (
          <div
            key={block}
            className={`hotbar-item ${activeTexture === block ? 'active' : ''}`}
            onClick={() => setTexture(block)}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: 
                  block === 'grass' ? '#4CAF50' : 
                  block === 'dirt' ? '#795548' : 
                  block === 'wood' ? '#8D6E63' : 
                  block === 'log' ? '#5D4037' : 
                  '#ADD8E6',
                opacity: block === 'glass' ? 0.6 : 1,
                border: '2px solid rgba(0,0,0,0.2)'
              }}
            ></div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 5, pointerEvents: 'none', zIndex: 10 }}>
        <h3>Minecraft do Davi Lucca</h3>
        <p><b>W, A, S, D</b> para andar</p>
        <p><b>Espaço</b> para pular</p>
        <p><b>Clique Esquerdo</b> para colocar bloco</p>
        <p><b>Clique Direito</b> para quebrar</p>
        <p><b>Números 1-5</b> para trocar bloco</p>
      </div>
    </>
  );
};
