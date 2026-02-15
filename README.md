# PULSE - Drum Machine & Synthesizer

A web-based drum machine and synthesizer with 28 sounds, built with React, Vite, and Tailwind CSS.

## Features

- 🥁 **28 Synthesized Sounds** - Drums, Bass, Pads, Plucks, Bells, Stabs, Leads, FX
- 🎲 **Pattern Randomizer** - Smart randomization with musical weighting
- 🎛️ **Knob Controls** - BPM, Volume, Swing, Density
- 📱 **Mobile Friendly** - Touch-optimized with responsive layout
- 🎨 **Modern UI** - Neon accents, gradient buttons, glowing indicators

## Quick Start

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
pulse-drum-machine/
├── src/
│   ├── components/
│   │   ├── Knob.jsx        # Draggable knob control
│   │   ├── StepButton.jsx  # Step sequencer button
│   │   └── SoundRow.jsx    # Row with trigger + steps
│   ├── sounds/
│   │   ├── definitions.js  # Sound configs (type, color, label)
│   │   └── engine.js       # Web Audio synthesis
│   ├── App.jsx             # Main application
│   ├── main.jsx            # Entry point
│   └── index.css           # Tailwind + custom styles
├── scripts/
│   └── bundle.js           # Flatten to single JSX
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Bundle for Artifacts

To create a single-file version for Claude artifacts or quick sharing:

```bash
npm run bundle
```

This creates `dist/bundle.jsx` - a monolithic file with everything inlined.

## Adding New Sounds

1. Add to `src/sounds/definitions.js`:
```js
newSound: { type: 'synth', color: '#ff0000', label: 'NEW' },
```

2. Add synthesis in `src/sounds/engine.js`:
```js
case 'synth': {
  // Your Web Audio synthesis code
  break;
}
```

3. The sound automatically appears in the UI!

## Customization

### Colors
Edit `definitions.js` to change sound colors.

### BPM Range
In `App.jsx`, adjust the Knob props: `min={60} max={200}`

### Grid Size
Change `STEPS` in `definitions.js` (default: 16)

## Tech Stack

- **React 18** - UI components
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Web Audio API** - Sound synthesis

## License

MIT
