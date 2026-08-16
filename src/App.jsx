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
        <ambientLight intensity={0.5} />
        <Player />
        <World />
      </Canvas>
      <UI />
    </>
  );
}

export default App;
