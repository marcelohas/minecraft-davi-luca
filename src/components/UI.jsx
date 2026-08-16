import { useStore } from '../store';
import { useEffect } from 'react';
import { useKeyboard } from '../hooks/useKeyboard';
import { MobileControls } from './MobileControls';
import { Inventory } from './Inventory';

import dirtImg from '../images/dirt.png';
import grassTopImg from '../images/grass_top.png';
import grassSideImg from '../images/grass_side.png';
import stoneImg from '../images/stone.png';
import woodImg from '../images/planks_oak.png';
import logImg from '../images/log_oak.png';
import leavesImg from '../images/leaves_oak.png';
import sandImg from '../images/sand.png';
import glassImg from '../images/glass.png';

const blockImages = {
  grass: grassSideImg,
  dirt: dirtImg,
  stone: stoneImg,
  wood: woodImg,
  log: logImg,
  leaves: leavesImg,
  sand: sandImg,
  glass: glassImg
};

const blocks = Object.keys(blockImages);

export const UI = () => {
  const activeTexture = useStore((state) => state.texture);
  const setTexture = useStore((state) => state.setTexture);
  const toggleInventory = useStore((state) => state.toggleInventory);
  const actions = useKeyboard();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= blocks.length) {
        setTexture(blocks[num - 1]);
      }
      if (e.key.toLowerCase() === 'e') {
        toggleInventory();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setTexture, toggleInventory]);

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
        border: '4px solid #333',
        boxShadow: 'inset 0 0 0 2px #555',
        padding: '4px',
        zIndex: 10
      }}>
        {blocks.map((block) => {
          const isActive = activeTexture === block;
          return (
            <div
              key={block}
              onClick={() => setTexture(block)}
              style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#888',
                backgroundImage: `url(${blockImages[block]})`,
                backgroundSize: 'cover',
                imageRendering: 'pixelated', // Essencial para visual retrô
                opacity: block === 'glass' ? 0.7 : 1,
                border: isActive ? '4px solid white' : '2px solid transparent',
                boxShadow: isActive ? 'inset 0 0 0 2px #AAA' : 'inset -2px -2px 0 0 rgba(0,0,0,0.5)',
                margin: '2px',
                cursor: 'pointer',
              }}
            ></div>
          );
        })}
      </div>

      <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', textShadow: '2px 2px 0 #3f3f3f', fontFamily: 'monospace', fontSize: '14px', zIndex: 10 }}>
        <h2 style={{margin: '0 0 10px 0'}}>Minecraft Classic</h2>
        <p style={{margin: '5px 0'}}><b>W, A, S, D</b>: Andar</p>
        <p style={{margin: '5px 0'}}><b>Espaço</b>: Pular</p>
        <p style={{margin: '5px 0'}}><b>Mouse Esq</b>: Construir</p>
        <p style={{margin: '5px 0'}}><b>Mouse Dir</b>: Quebrar</p>
        <p style={{margin: '5px 0'}}><b>1-8</b>: Trocar bloco</p>
        <p style={{margin: '5px 0'}}><b>E</b>: Inventário</p>
      </div>

      <MobileControls />
      <Inventory />
    </>
  );
};
