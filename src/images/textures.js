import { TextureLoader, NearestFilter, SRGBColorSpace } from 'three';

import dirtImg from './dirt.png';
import grassTopImg from './grass_top.png';
import grassSideImg from './grass_side.png';
import stoneImg from './stone.png';
import woodImg from './planks_oak.png';
import logImg from './log_oak.png';
import leavesImg from './leaves_oak.png';
import sandImg from './sand.png';
import glassImg from './glass.png';

const loader = new TextureLoader();

function loadTex(img) {
  const tex = loader.load(img);
  tex.magFilter = NearestFilter;
  tex.minFilter = NearestFilter;
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

export const textures = {
  dirt: loadTex(dirtImg),
  grass: [
    loadTex(grassSideImg), // right
    loadTex(grassSideImg), // left
    loadTex(grassTopImg),  // top
    loadTex(dirtImg),      // bottom
    loadTex(grassSideImg), // front
    loadTex(grassSideImg)  // back
  ],
  stone: loadTex(stoneImg),
  wood: loadTex(woodImg),
  log: loadTex(logImg), // No classic original a madeira era igual todos lados
  leaves: loadTex(leavesImg),
  sand: loadTex(sandImg),
  glass: loadTex(glassImg)
};
