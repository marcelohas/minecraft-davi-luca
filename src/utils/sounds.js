// Gerador de sons 8-bit simples usando Web Audio API
// Evita carregar arquivos MP3 pesados e funciona muito bem para um estilo retrô.

let audioCtx = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playTone = (freq, type, duration, vol = 0.1, slideFreq = null) => {
  if (!audioCtx) initAudio();
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  
  // Frequência inicial
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  if (slideFreq) {
    // Deslizar para outra frequência (ex: pulo)
    osc.frequency.exponentialRampToValueAtTime(slideFreq, audioCtx.currentTime + duration);
  }

  // Envelope de volume (Attack-Decay)
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(vol, audioCtx.currentTime + duration * 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration);
};

// Gera ruído branco para som de terra, passos e pedras
const playNoise = (duration, vol = 0.1, filterFreq = 1000) => {
  if (!audioCtx) initAudio();
  if (!audioCtx) return;

  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = filterFreq;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  noiseSource.start();
};

export const sounds = {
  jump: () => playTone(150, 'square', 0.2, 0.05, 300),
  place: () => playTone(400, 'sine', 0.05, 0.1, 200),
  break: () => playNoise(0.15, 0.3, 800),
  step: () => playNoise(0.05, 0.05, 300), // Passo abafado
  pig: () => playTone(120 + Math.random() * 40, 'sawtooth', 0.3, 0.05, 80), // Grunhido porco
  cow: () => playTone(80 + Math.random() * 20, 'square', 0.6, 0.05, 60),    // Mugido vaca
  init: initAudio
};
