import { useStore } from '../store';
import { Cube } from './Cube';

export const World = () => {
  const [cubes] = useStore((state) => [state.cubes]);

  return (
    <>
      {cubes.map((cube) => {
        // Marcamos os cubos iniciais (y === -1) como chão para não serem deletados acidentalmente e esburacarem o mundo.
        return (
          <Cube
            key={cube.key}
            position={cube.pos}
            texture={cube.texture}
            isFloor={cube.pos[1] === -1}
          />
        );
      })}
    </>
  );
};
