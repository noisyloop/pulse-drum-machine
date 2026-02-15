import { useState, useCallback } from 'react';
import { SOUNDS, SOUND_KEYS, STEPS } from '../sounds/definitions';

/**
 * Generates an empty pattern grid (all steps off for all sounds).
 */
const createEmptyPatterns = () =>
  Object.fromEntries(SOUND_KEYS.map(key => [key, Array(STEPS).fill(false)]));

/**
 * Custom hook for managing sequencer patterns.
 * Handles toggle, randomize (with musical heuristics), and clear operations.
 *
 * SECURITY NOTE: The `density` value drives the randomize probabilities.
 * It is clamped by the Knob UI (min: 10, max: 80), but we defensively
 * clamp it here as well before using it in calculations.
 */
export function usePatterns(density) {
  const [patterns, setPatterns] = useState(createEmptyPatterns);

  const toggleStep = useCallback((soundKey, step) => {
    // Validate inputs to prevent prototype pollution / unexpected keys
    if (!SOUNDS[soundKey] || step < 0 || step >= STEPS) return;

    setPatterns(prev => ({
      ...prev,
      [soundKey]: prev[soundKey].map((v, i) => i === step ? !v : v)
    }));
  }, []);

  const randomize = useCallback(() => {
    const safeDensity = Math.max(0, Math.min(100, density));
    const densityFactor = safeDensity / 100;
    const newPatterns = {};

    SOUND_KEYS.forEach(key => {
      const sound = SOUNDS[key];
      let probability = densityFactor;

      // Musical probability weighting by sound type
      const typeWeights = {
        drum: key === 'kick' ? 1.5 : key === 'hihat' ? 2 : key === 'snare' ? 0.8 : 1,
        pad: 0.25,
        bass: 0.5,
        key: 0.35,
        bell: 0.25,
        stab: 0.2,
        lead: 0.3,
        fx: 0.15,
      };
      probability *= typeWeights[sound.type] ?? 1;

      newPatterns[key] = Array(STEPS).fill(false).map((_, i) => {
        // Favor beats on quarter notes for kick/snare
        if (sound.type === 'drum' && (key === 'kick' || key === 'snare')) {
          if (i % 4 === 0) return Math.random() < probability * 2;
          if (i % 4 === 2 && key === 'snare') return Math.random() < probability * 1.5;
        }
        if (sound.type === 'bass' && i % 4 === 0) {
          return Math.random() < probability * 1.8;
        }
        if (sound.type === 'stab' && i % 4 === 2) {
          return Math.random() < probability * 1.5;
        }
        return Math.random() < probability;
      });
    });

    setPatterns(newPatterns);
  }, [density]);

  const clearAll = useCallback(() => {
    setPatterns(createEmptyPatterns());
  }, []);

  return { patterns, toggleStep, randomize, clearAll };
}
