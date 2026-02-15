import { SOUNDS } from './definitions';

// ─── PULSE-002 FIX: Audio Node Pool & Exhaustion Prevention ───
// Track active source nodes globally and enforce a ceiling to prevent
// browser tab crashes from runaway node creation.
const MAX_ACTIVE_NODES = 150;
let activeNodeCount = 0;

/**
 * Register a source node for tracking. Auto-decrements counter on end.
 * Works with OscillatorNode and AudioBufferSourceNode.
 */
const trackNode = (node) => {
  activeNodeCount++;
  node.onended = () => {
    activeNodeCount = Math.max(0, activeNodeCount - 1);
  };
};

/**
 * Check if we can safely allocate more source nodes.
 * @param {number} count - Number of nodes about to be created
 */
const canAllocate = (count = 1) => (activeNodeCount + count) <= MAX_ACTIVE_NODES;

/** Expose for debugging / monitoring */
export const getActiveNodeCount = () => activeNodeCount;

// ─── AudioContext Factory ───
export const createAudioContext = () => {
  return new (window.AudioContext || window.webkitAudioContext)();
};

// ─── Main Sound Trigger ───
export const playSound = (audioCtx, soundKey, volume = 0.7) => {
  // PULSE-001 reinforcement: validate soundKey against whitelist
  const sound = SOUNDS[soundKey];
  if (!sound) return;

  // PULSE-002: refuse to create nodes if pool is exhausted
  if (!canAllocate(4)) return;

  const now = audioCtx.currentTime;

  // Defensive volume clamping
  const safeVol = Math.max(0, Math.min(1, volume));

  const masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);
  masterGain.gain.value = safeVol;

  switch (sound.type) {
    case 'drum': {
      if (soundKey === 'kick') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);
        gain.gain.setValueAtTime(1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        trackNode(osc);
      } else if (soundKey === 'snare') {
        const noise = audioCtx.createBufferSource();
        const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.2, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < output.length; i++) output[i] = Math.random() * 2 - 1;
        noise.buffer = noiseBuffer;
        const noiseGain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noiseGain.gain.setValueAtTime(0.8, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        noise.start(now);
        noise.stop(now + 0.15);
        trackNode(noise);

        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.frequency.setValueAtTime(180, now);
        oscGain.gain.setValueAtTime(0.5, now);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        trackNode(osc);
      } else if (soundKey === 'hihat') {
        const noise = audioCtx.createBufferSource();
        const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.05, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < output.length; i++) output[i] = Math.random() * 2 - 1;
        noise.buffer = noiseBuffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 7000;
        const gain = audioCtx.createGain();
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        noise.start(now);
        noise.stop(now + 0.05);
        trackNode(noise);
      } else if (soundKey === 'clap') {
        for (let i = 0; i < 3; i++) {
          if (!canAllocate(1)) break;
          const noise = audioCtx.createBufferSource();
          const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.02, audioCtx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let j = 0; j < output.length; j++) output[j] = Math.random() * 2 - 1;
          noise.buffer = noiseBuffer;
          const filter = audioCtx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 2500;
          const gain = audioCtx.createGain();
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);
          gain.gain.setValueAtTime(0.6, now + i * 0.01);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.01 + 0.1);
          noise.start(now + i * 0.01);
          noise.stop(now + i * 0.01 + 0.1);
          trackNode(noise);
        }
      } else if (soundKey === 'tom') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        trackNode(osc);
      } else if (soundKey === 'rim') {
        const osc = audioCtx.createOscillator();
        osc.type = 'triangle';
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
        trackNode(osc);
      }
      break;
    }
    case 'pad': {
      const freqMap = { pad1: [261.63, 329.63], pad2: [293.66, 369.99], pad3: [349.23, 440], pad4: [392, 493.88] };
      const freqs = freqMap[soundKey] || [261.63, 329.63];
      freqs.forEach(freq => {
        if (!canAllocate(2)) return;
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        const osc2 = audioCtx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 1.002, now);
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.2);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc2.start(now);
        osc.stop(now + 0.6);
        osc2.stop(now + 0.6);
        trackNode(osc);
        trackNode(osc2);
      });
      break;
    }
    case 'key': {
      const freqMap = { key1: 523.25, key2: 659.25, key3: 783.99, key4: 987.77 };
      const freq = freqMap[soundKey] || 523.25;
      const osc = audioCtx.createOscillator();
      osc.type = 'triangle';
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, now);
      filter.frequency.exponentialRampToValueAtTime(500, now + 0.3);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
      trackNode(osc);
      break;
    }
    case 'bell': {
      const freqMap = { bell1: 1046.5, bell2: 1318.5, bell3: 1568 };
      const freq = freqMap[soundKey] || 1046.5;
      [1, 2.4, 5.95].forEach((ratio, i) => {
        if (!canAllocate(1)) return;
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);
        osc.frequency.setValueAtTime(freq * ratio, now);
        const amp = 0.3 / (i + 1);
        gain.gain.setValueAtTime(amp, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8 - i * 0.1);
        osc.start(now);
        osc.stop(now + 0.8);
        trackNode(osc);
      });
      break;
    }
    case 'stab': {
      const freqs = soundKey === 'stab1' ? [261.63, 329.63, 392] : [293.66, 369.99, 440];
      freqs.forEach(freq => {
        if (!canAllocate(1)) return;
        const osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + 0.15);
        const gain = audioCtx.createGain();
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        trackNode(osc);
      });
      break;
    }
    case 'bass': {
      const freqMap = { bass1: 65.41, bass2: 82.41, bass3: 98 };
      const freq = freqMap[soundKey] || 65.41;
      const osc = audioCtx.createOscillator();
      osc.type = 'sawtooth';
      const osc2 = audioCtx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(freq * 0.5, now);
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.2);
      const gain = audioCtx.createGain();
      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.3);
      osc2.stop(now + 0.3);
      trackNode(osc);
      trackNode(osc2);
      break;
    }
    case 'lead': {
      const freqMap = { lead1: 523.25, lead2: 659.25, lead3: 783.99 };
      const freq = freqMap[soundKey] || 523.25;
      const osc = audioCtx.createOscillator();
      osc.type = 'sawtooth';
      const osc2 = audioCtx.createOscillator();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(freq * 1.005, now);
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(4000, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + 0.25);
      const gain = audioCtx.createGain();
      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.35);
      osc2.stop(now + 0.35);
      trackNode(osc);
      trackNode(osc2);
      break;
    }
    case 'fx': {
      if (soundKey === 'fx1') {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        trackNode(osc);
      } else if (soundKey === 'fx2') {
        const osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.15);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.15);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        trackNode(osc);
      } else if (soundKey === 'fx3') {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = 10;
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(4000, now + 0.4);
        const gain = audioCtx.createGain();
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        osc.frequency.setValueAtTime(100, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        trackNode(osc);
      } else if (soundKey === 'fx4') {
        const noise = audioCtx.createBufferSource();
        const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < output.length; i++) output[i] = Math.random() * 2 - 1;
        noise.buffer = noiseBuffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1500;
        filter.Q.value = 2;
        const gain = audioCtx.createGain();
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        noise.start(now);
        noise.stop(now + 0.15);
        trackNode(noise);
      }
      break;
    }
  }
};
