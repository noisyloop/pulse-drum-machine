// Sound definitions with synthesis parameters
export const SOUNDS = {
  // Drums
  kick: { type: 'drum', color: '#ff3366', label: 'KICK' },
  snare: { type: 'drum', color: '#ff6b35', label: 'SNARE' },
  hihat: { type: 'drum', color: '#ffd23f', label: 'HI-HAT' },
  clap: { type: 'drum', color: '#ee4266', label: 'CLAP' },
  tom: { type: 'drum', color: '#ff5e5b', label: 'TOM' },
  rim: { type: 'drum', color: '#d81159', label: 'RIM' },
  
  // Synth pads
  pad1: { type: 'pad', color: '#3a86ff', label: 'PAD C' },
  pad2: { type: 'pad', color: '#8338ec', label: 'PAD D' },
  pad3: { type: 'pad', color: '#06ffa5', label: 'PAD F' },
  pad4: { type: 'pad', color: '#00a896', label: 'PAD G' },
  
  // Keys / Plucks
  key1: { type: 'key', color: '#00f5d4', label: 'PLUCK C' },
  key2: { type: 'key', color: '#00bbf9', label: 'PLUCK E' },
  key3: { type: 'key', color: '#9b5de5', label: 'PLUCK G' },
  key4: { type: 'key', color: '#c77dff', label: 'PLUCK B' },
  
  // Bells / Mallets
  bell1: { type: 'bell', color: '#ffc8dd', label: 'BELL C' },
  bell2: { type: 'bell', color: '#ffafcc', label: 'BELL E' },
  bell3: { type: 'bell', color: '#bde0fe', label: 'BELL G' },
  
  // Arps / Stabs
  stab1: { type: 'stab', color: '#cdb4db', label: 'STAB 1' },
  stab2: { type: 'stab', color: '#a2d2ff', label: 'STAB 2' },
  
  // Bass
  bass1: { type: 'bass', color: '#f72585', label: 'BASS C' },
  bass2: { type: 'bass', color: '#b5179e', label: 'BASS E' },
  bass3: { type: 'bass', color: '#7209b7', label: 'BASS G' },
  
  // Leads
  lead1: { type: 'lead', color: '#80ffdb', label: 'LEAD C' },
  lead2: { type: 'lead', color: '#72efdd', label: 'LEAD E' },
  lead3: { type: 'lead', color: '#64dfdf', label: 'LEAD G' },
  
  // FX
  fx1: { type: 'fx', color: '#4cc9f0', label: 'BLIP' },
  fx2: { type: 'fx', color: '#7400b8', label: 'ZAP' },
  fx3: { type: 'fx', color: '#e0aaff', label: 'SWEEP' },
  fx4: { type: 'fx', color: '#48bfe3', label: 'NOISE' },
};

export const SOUND_KEYS = Object.keys(SOUNDS);
export const STEPS = 16;
