import React from 'react';
import { STEPS } from '../sounds/definitions';

const StepIndicator = () => (
  <div className="max-w-7xl mx-auto mb-2">
    <div className="flex gap-2 ml-24">
      <div className="flex-1 grid grid-cols-16 gap-1">
        {Array(STEPS).fill(0).map((_, i) => (
          <div
            key={i}
            className="text-center text-xs opacity-30"
            style={{ color: i % 4 === 0 ? '#06ffa5' : '#ffffff' }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default StepIndicator;
