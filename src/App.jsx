import { Canvas } from '@react-three/fiber';
import { Player } from './components/Player';
import { World } from './components/World';
import { UI } from './components/UI';

function App() {
  return (
    <>
      <Canvas>
        <color attach="background" args={['#99ccff']} />
        <fog attach="fog" args={['#99ccff', 10, 40]} />
        <ambientLight intensity={0.7} />
        <pointLight position={[100, 100, 100]} intensity={0.8} />
        <Player />
        <World />
      </Canvas>
      <UI />
    </>
  );
}

export default App;
