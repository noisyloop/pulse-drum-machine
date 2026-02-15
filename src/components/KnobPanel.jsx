import React from 'react';
import Knob from './Knob';

const KnobPanel = ({ bpm, setBpm, volume, setVolume, swing, setSwing, density, setDensity }) => (
  <div className="max-w-7xl mx-auto mb-6">
    <div
      className="rounded-2xl p-4 flex justify-center gap-8 flex-wrap"
      style={{
        background: 'linear-gradient(145deg, #1a1a2e, #0f0f23)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <Knob value={bpm} onChange={setBpm} min={60} max={200} label="BPM" color="#06ffa5" />
      <Knob value={volume} onChange={setVolume} min={0} max={100} label="VOLUME" color="#00bbf9" />
      <Knob value={swing} onChange={setSwing} min={0} max={100} label="SWING" color="#9b5de5" />
      <Knob value={density} onChange={setDensity} min={10} max={80} label="DENSITY" color="#f72585" />
    </div>
  </div>
);

export default KnobPanel;
