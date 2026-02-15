import React from 'react';

const Header = ({ isPlaying, onTogglePlay, onRandomize, onClear }) => (
  <div className="max-w-7xl mx-auto mb-6">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1
          className="text-3xl md:text-4xl font-black tracking-tighter"
          style={{
            background: 'linear-gradient(135deg, #06ffa5, #00bbf9, #9b5de5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(6, 255, 165, 0.3)',
          }}
        >
          PULSE
        </h1>
        <p className="text-xs tracking-widest opacity-40 mt-1">
          DRUM MACHINE &bull; SYNTHESIZER
        </p>
      </div>

      {/* Transport controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePlay}
          className="w-14 h-14 rounded-xl font-bold text-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          style={{
            background: isPlaying
              ? 'linear-gradient(145deg, #ff3366, #ff6b35)'
              : 'linear-gradient(145deg, #06ffa5, #00bbf9)',
            boxShadow: isPlaying
              ? '0 0 30px rgba(255, 51, 102, 0.5)'
              : '0 0 30px rgba(6, 255, 165, 0.5)',
          }}
          aria-label={isPlaying ? 'Stop playback' : 'Start playback'}
        >
          {isPlaying ? '■' : '▶'}
        </button>

        <button
          onClick={onRandomize}
          className="px-5 h-14 rounded-xl font-bold text-sm tracking-wider transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(145deg, #9b5de5, #f72585)',
            boxShadow: '0 0 25px rgba(155, 93, 229, 0.4)',
          }}
        >
          🎲 RANDOMIZE
        </button>

        <button
          onClick={onClear}
          className="px-5 h-14 rounded-xl font-bold text-sm tracking-wider transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(145deg, #3a3a5a, #2a2a4a)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          }}
        >
          CLEAR
        </button>
      </div>
    </div>
  </div>
);

export default Header;
