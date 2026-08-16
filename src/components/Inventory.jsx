import { useStore } from '../store';
import dirtImg from '../images/dirt.png';
import grassImg from '../images/grass_side.png'; // or grass_top
import glassImg from '../images/glass.png';
import woodImg from '../images/planks_oak.png';
import logImg from '../images/log_oak.png';
import leavesImg from '../images/leaves_oak.png';
import sandImg from '../images/sand.png';
import stoneImg from '../images/stone.png';

const blockIcons = {
  dirt: dirtImg,
  grass: grassImg,
  glass: glassImg,
  wood: woodImg,
  log: logImg,
  leaves: leavesImg,
  sand: sandImg,
  stone: stoneImg,
};

export const Inventory = () => {
  const isInventoryOpen = useStore((state) => state.isInventoryOpen);
  const closeInventory = useStore((state) => state.closeInventory);
  const setTexture = useStore((state) => state.setTexture);
  const activeTexture = useStore((state) => state.texture);

  if (!isInventoryOpen) return null;

  const handleSelect = (textureName) => {
    setTexture(textureName);
    closeInventory();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Inventário</h2>
          <button style={styles.closeBtn} onClick={closeInventory}>X</button>
        </div>
        
        <div style={styles.grid}>
          {Object.entries(blockIcons).map(([textureName, iconSrc]) => {
            const isActive = textureName === activeTexture;
            return (
              <div 
                key={textureName}
                style={{
                  ...styles.slot,
                  borderColor: isActive ? 'yellow' : 'transparent',
                  transform: isActive ? 'scale(1.05)' : 'none',
                }}
                onClick={() => handleSelect(textureName)}
              >
                <img src={iconSrc} alt={textureName} style={styles.icon} />
                <span style={styles.label}>{textureName.toUpperCase()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    pointerEvents: 'auto',
  },
  modal: {
    width: '90%',
    maxWidth: '500px',
    backgroundColor: '#c6c6c6', // Cor clássica do menu do Minecraft
    border: '4px solid #fff',
    borderRightColor: '#555',
    borderBottomColor: '#555',
    padding: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '2px solid #555',
    paddingBottom: '10px',
  },
  title: {
    margin: 0,
    color: '#333',
    fontFamily: 'monospace',
    fontSize: '24px',
  },
  closeBtn: {
    backgroundColor: 'red',
    color: 'white',
    border: '2px solid darkred',
    width: '30px',
    height: '30px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
    gap: '15px',
  },
  slot: {
    backgroundColor: '#8b8b8b',
    border: '3px solid',
    borderTopColor: '#fff',
    borderLeftColor: '#fff',
    borderRightColor: '#373737',
    borderBottomColor: '#373737',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    cursor: 'pointer',
    transition: 'all 0.1s',
  },
  icon: {
    width: '40px',
    height: '40px',
    imageRendering: 'pixelated', // Mantém o estilo clássico
  },
  label: {
    marginTop: '5px',
    fontSize: '10px',
    fontFamily: 'monospace',
    color: '#fff',
    textShadow: '1px 1px 0 #000',
  }
};
