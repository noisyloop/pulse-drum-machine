import React from 'react';
import StepButton from './StepButton';
import { SOUNDS } from '../sounds/definitions';

const SoundRow = ({ soundKey, pattern, currentStep, onToggle, onTrigger }) => {
  const sound = SOUNDS[soundKey];
  
  return (
    <div className="flex items-center gap-2 mb-2">
      <button
        onClick={onTrigger}
        className="w-20 h-10 rounded-lg font-bold text-xs tracking-wider transition-all hover:scale-105 active:scale-95 flex-shrink-0"
        style={{
          background: `linear-gradient(145deg, ${sound.color}dd, ${sound.color}88)`,
          boxShadow: `0 4px 15px ${sound.color}44`,
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        {sound.label}
      </button>
      <div className="flex-1 grid grid-cols-16 gap-1">
        {pattern.map((active, step) => (
          <StepButton
            key={step}
            active={active}
            current={currentStep === step}
            color={sound.color}
            onClick={() => onToggle(step)}
          />
        ))}
      </div>
    </div>
  );
};

export default SoundRow;
