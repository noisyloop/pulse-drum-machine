import { useRef, useCallback, useEffect } from 'react';
import { createAudioContext, playSound } from '../sounds/engine';

/**
 * Minimum milliseconds between consecutive triggers of the same sound.
 * Prevents audio node exhaustion from rapid clicking (PULSE-008).
 */
const TRIGGER_COOLDOWN_MS = 50;

/**
 * Custom hook for audio context management and sound triggering.
 *
 * Fixes applied:
 *  - PULSE-006: Closes AudioContext on component unmount to prevent
 *    leaking contexts (browsers limit ~6 per origin).
 *  - PULSE-008: Rate-limits triggerSound calls per sound key to prevent
 *    node exhaustion from rapid clicking or automated scripts.
 */
export function useAudio(volume) {
  const audioCtxRef = useRef(null);
  const lastTriggerRef = useRef({}); // { [soundKey]: timestamp }

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = createAudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // PULSE-006 FIX: Close AudioContext on unmount to free resources
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {
          // Ignore errors during cleanup — context may already be closed
        });
        audioCtxRef.current = null;
      }
    };
  }, []);

  // PULSE-008 FIX: Rate-limited sound trigger
  const triggerSound = useCallback((soundKey) => {
    const now = performance.now();
    const lastTime = lastTriggerRef.current[soundKey] || 0;

    if (now - lastTime < TRIGGER_COOLDOWN_MS) {
      return; // Skip — too soon since last trigger of this sound
    }

    lastTriggerRef.current[soundKey] = now;

    const ctx = initAudio();
    const safeVolume = Math.max(0, Math.min(100, volume));
    playSound(ctx, soundKey, safeVolume / 100);
  }, [initAudio, volume]);

  const getContext = useCallback(() => {
    return initAudio();
  }, [initAudio]);

  return { triggerSound, getContext };
}
