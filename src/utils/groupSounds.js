import { SOUNDS, SOUND_KEYS } from '../sounds/definitions';

/**
 * Groups SOUND_KEYS by their type for section-based rendering.
 * Returns a stable object (same reference per call) that maps
 * section names to arrays of sound keys.
 */
export const groupSoundsByType = () => ({
  drums: SOUND_KEYS.filter(k => SOUNDS[k].type === 'drum'),
  bass:  SOUND_KEYS.filter(k => SOUNDS[k].type === 'bass'),
  pads:  SOUND_KEYS.filter(k => SOUNDS[k].type === 'pad'),
  keys:  SOUND_KEYS.filter(k => SOUNDS[k].type === 'key'),
  bells: SOUND_KEYS.filter(k => SOUNDS[k].type === 'bell'),
  stabs: SOUND_KEYS.filter(k => SOUNDS[k].type === 'stab'),
  leads: SOUND_KEYS.filter(k => SOUNDS[k].type === 'lead'),
  fx:    SOUND_KEYS.filter(k => SOUNDS[k].type === 'fx'),
});

/**
 * Section display configuration for rendering the grid.
 * Maps internal group keys to display labels.
 */
export const SECTION_CONFIG = [
  { key: 'drums', label: 'DRUMS' },
  { key: 'bass',  label: 'BASS' },
  { key: 'pads',  label: 'PADS' },
  { key: 'keys',  label: 'PLUCKS' },
  { key: 'bells', label: 'BELLS' },
  { key: 'stabs', label: 'STABS' },
  { key: 'leads', label: 'LEADS' },
  { key: 'fx',    label: 'FX' },
];
