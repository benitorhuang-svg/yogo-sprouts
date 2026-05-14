import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SAMPLE_RATE = 44100;

function createWavBuffer(samples) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = SAMPLE_RATE * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write audio samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.floor(s * 32767), offset);
    offset += 2;
  }

  return buffer;
}

// Ensure output directory exists
const outputDir = path.resolve(__dirname, '../public/audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. sfx-category-switch.wav (Glassy pluck)
{
  const duration = 0.2;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  const freq = 523.25; // C5
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 25);
    // Sine + subtle FM for glassy tone
    samples[i] = Math.sin(2 * Math.PI * freq * t + Math.sin(2 * Math.PI * freq * 2 * t) * 0.5) * env * 0.5;
  }
  fs.writeFileSync(path.join(outputDir, 'sfx-category-switch.wav'), createWavBuffer(samples));
  console.log('Created sfx-category-switch.wav');
}

// 2. sfx-cart-add.wav (Sprout pop-bounce arpeggio)
{
  const duration = 0.4;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  const note1 = 659.25; // E5
  const note2 = 783.99; // G5
  const switchTime = 0.08;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    if (t < switchTime) {
      const env = Math.exp(-t * 15);
      samples[i] = Math.sin(2 * Math.PI * note1 * t) * env * 0.6;
    } else {
      const t2 = t - switchTime;
      const env = Math.exp(-t2 * 12);
      samples[i] = Math.sin(2 * Math.PI * note2 * t2) * env * 0.6;
    }
  }
  fs.writeFileSync(path.join(outputDir, 'sfx-cart-add.wav'), createWavBuffer(samples));
  console.log('Created sfx-cart-add.wav');
}

// 3. sfx-success.wav (Sunny harvest arpeggio chord)
{
  const duration = 1.5;
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  const notes = [523.25, 659.25, 783.99, 987.77, 1046.50]; // Cmaj7 arpeggio
  const delays = [0, 0.06, 0.12, 0.18, 0.24];
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    let s = 0;
    for (let n = 0; n < notes.length; n++) {
      if (t >= delays[n]) {
        const tn = t - delays[n];
        const env = Math.exp(-tn * 3.5);
        s += Math.sin(2 * Math.PI * notes[n] * tn) * env * 0.2;
      }
    }
    samples[i] = s;
  }
  fs.writeFileSync(path.join(outputDir, 'sfx-success.wav'), createWavBuffer(samples));
  console.log('Created sfx-success.wav');
}

// 4. bgm-theme.wav (Ambient greenhouse morning loop)
{
  const duration = 8.0; // 8 seconds loop
  const totalSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(totalSamples);
  
  // Ambient chord progression: Cmaj9 -> Fmaj9 -> G6 -> Cmaj9
  const chords = [
    [261.63, 392.00, 659.25, 987.77], // Cmaj7
    [174.61, 349.23, 659.25, 880.00], // Fmaj7(9)
    [196.00, 392.00, 659.25, 783.99], // G6
    [261.63, 392.00, 659.25, 987.77]  // Cmaj7
  ];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const chordIndex = Math.floor(t / 2.0) % 4;
    const currentChord = chords[chordIndex];
    
    // Soft synth pad
    let pad = 0;
    for (let freq of currentChord) {
      pad += Math.sin(2 * Math.PI * freq * t) * 0.08;
    }
    
    // Smooth LFO for greenhouse breeze / organic feel
    const lfo = Math.sin(2 * Math.PI * 0.25 * t) * 0.02;
    samples[i] = pad + lfo;
  }
  fs.writeFileSync(path.join(outputDir, 'bgm-theme.wav'), createWavBuffer(samples));
  console.log('Created bgm-theme.wav');
}

console.log('🎉 All YoGo audio files successfully generated!');
