import { useState, useEffect, useRef } from 'react';
import { SOUND_KEYS, STEPS } from '../sounds/definitions';
import { playSound } from '../sounds/engine';

/**
 * Custom hook for the step sequencer playback engine.
 * 
 * SECURITY NOTE: The swing calculation is computed from user-controlled
 * values (bpm, swing). Both are clamped via the Knob component's
 * min/max props, but we add defensive clamping here as well
 * to prevent extreme timing values.
 */
export function useSequencer({ patterns, bpm, volume, swing, getContext }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      const ctx = getContext();
      let step = 0;

      // Defensive clamping — ensure no extreme values
      const safeBpm = Math.max(20, Math.min(300, bpm));
      const safeSwing = Math.max(0, Math.min(100, swing));
      const safeVolume = Math.max(0, Math.min(100, volume));

      const tick = () => {
        setCurrentStep(step);

        SOUND_KEYS.forEach(soundKey => {
          if (patterns[soundKey]?.[step]) {
            playSound(ctx, soundKey, safeVolume / 100);
          }
        });

        step = (step + 1) % STEPS;
      };

      tick();
      const baseInterval = 60000 / safeBpm / 4;
      const swingMs = (safeSwing / 100) * baseInterval;

      intervalRef.current = setInterval(() => {
        tick();
      }, baseInterval + (step % 2 === 1 ? swingMs : 0));

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      setCurrentStep(-1);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [isPlaying, bpm, patterns, volume, swing, getContext]);

  return { isPlaying, setIsPlaying, currentStep };
}
