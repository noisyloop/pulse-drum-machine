import React, { useState } from 'react';
import Header from './components/Header';
import KnobPanel from './components/KnobPanel';
import StepIndicator from './components/StepIndicator';
import PatternGrid from './components/PatternGrid';
import Footer from './components/Footer';
import { useAudio } from './hooks/useAudio';
import { usePatterns } from './hooks/usePatterns';
import { useSequencer } from './hooks/useSequencer';

function App() {
  const [bpm, setBpm] = useState(120);
  const [volume, setVolume] = useState(75);
  const [swing, setSwing] = useState(0);
  const [density, setDensity] = useState(30);

  const { triggerSound, getContext } = useAudio(volume);
  const { patterns, toggleStep, randomize, clearAll } = usePatterns(density);
  const { isPlaying, setIsPlaying, currentStep } = useSequencer({
    patterns, bpm, volume, swing, getContext,
  });

  return (
    <div className="min-h-screen p-4 md:p-6">
      <Header
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onRandomize={randomize}
        onClear={clearAll}
      />
      <KnobPanel
        bpm={bpm} setBpm={setBpm}
        volume={volume} setVolume={setVolume}
        swing={swing} setSwing={setSwing}
        density={density} setDensity={setDensity}
      />
      <StepIndicator />
      <PatternGrid
        patterns={patterns}
        currentStep={currentStep}
        onToggleStep={toggleStep}
        onTriggerSound={triggerSound}
      />
      <Footer />
    </div>
  );
}

export default App;
