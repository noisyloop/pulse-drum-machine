import React from 'react';

const StepButton = ({ active, current, color, onClick }) => (
  <button
    onClick={onClick}
    className="w-full aspect-square rounded-lg transition-all duration-75 border-2"
    style={{
      background: active 
        ? `linear-gradient(145deg, ${color}, ${color}aa)` 
        : 'linear-gradient(145deg, #2a2a4a, #1a1a2e)',
      borderColor: current ? '#ffffff' : active ? color : '#3a3a5a',
      boxShadow: active 
        ? `0 0 15px ${color}66, inset 0 0 10px ${color}33` 
        : current 
          ? '0 0 10px rgba(255,255,255,0.3)' 
          : 'inset 0 2px 4px rgba(0,0,0,0.3)',
      transform: current ? 'scale(1.05)' : 'scale(1)',
    }}
  />
);

export default StepButton;
