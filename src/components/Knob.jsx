import React, { useState, useEffect, useRef } from 'react';

const Knob = ({ value, onChange, min = 0, max = 100, label, color = '#06ffa5' }) => {
  const knobRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startValue = useRef(0);

  const rotation = ((value - min) / (max - min)) * 270 - 135;

  const handleStart = (clientY) => {
    setIsDragging(true);
    startY.current = clientY;
    startValue.current = value;
  };

  const handleMouseDown = (e) => {
    handleStart(e.clientY);
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientY);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMove = (clientY) => {
      if (!isDragging) return;
      const delta = startY.current - clientY;
      const range = max - min;
      const newValue = Math.max(min, Math.min(max, startValue.current + (delta / 100) * range));
      onChange(Math.round(newValue));
    };

    const handleMouseMove = (e) => handleMove(e.clientY);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientY);
    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, min, max, onChange]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={knobRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative w-14 h-14 rounded-full cursor-pointer select-none touch-none"
        style={{
          background: `conic-gradient(from -135deg, ${color}33 0deg, ${color} ${((value - min) / (max - min)) * 270}deg, #1a1a2e ${((value - min) / (max - min)) * 270}deg, #1a1a2e 270deg)`,
          boxShadow: `0 0 20px ${color}22, inset 0 0 20px rgba(0,0,0,0.5)`,
        }}
      >
        <div 
          className="absolute inset-2 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(145deg, #2a2a4a, #1a1a2e)' }}
        >
          <div
            className="w-1 h-5 rounded-full origin-bottom"
            style={{
              background: color,
              transform: `rotate(${rotation}deg) translateY(-4px)`,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        </div>
      </div>
      <span className="text-xs font-medium tracking-wider" style={{ color: color }}>{label}</span>
      <span className="text-xs opacity-60">{value}</span>
    </div>
  );
};

export default Knob;
