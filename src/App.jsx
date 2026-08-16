import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Player } from './components/Player';
import { World } from './components/World';
import { UI } from './components/UI';

function App() {
  return (
    <>
      <Canvas>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[100, 100, 100]} intensity={1.5} />
        <Player />
        <World />
      </Canvas>
      <UI />
    </>
  );
}

export default App;
