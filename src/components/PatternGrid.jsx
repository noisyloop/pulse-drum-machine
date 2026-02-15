import React, { useMemo } from 'react';
import SoundRow from './SoundRow';
import { groupSoundsByType, SECTION_CONFIG } from '../utils/groupSounds';

const PatternGrid = ({ patterns, currentStep, onToggleStep, onTriggerSound }) => {
  const groupedSounds = useMemo(() => groupSoundsByType(), []);

  return (
    <div className="max-w-7xl mx-auto">
      <div
        className="rounded-2xl p-4 overflow-x-auto"
        style={{
          background: 'linear-gradient(145deg, #1a1a2e, #0f0f23)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {SECTION_CONFIG.map(({ key, label }, sectionIndex) => (
          <div key={key} className={sectionIndex < SECTION_CONFIG.length - 1 ? 'mb-4' : ''}>
            <div className="text-xs tracking-widest opacity-40 mb-2 ml-24">{label}</div>
            {groupedSounds[key].map(soundKey => (
              <SoundRow
                key={soundKey}
                soundKey={soundKey}
                pattern={patterns[soundKey]}
                currentStep={currentStep}
                onToggle={(step) => onToggleStep(soundKey, step)}
                onTrigger={() => onTriggerSound(soundKey)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatternGrid;
