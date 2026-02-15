#!/usr/bin/env node

/**
 * Bundle Script
 * 
 * Flattens modular React components into a single JSX file for:
 * - Claude artifacts
 * - CodePen/JSFiddle
 * - Quick prototyping
 * 
 * Usage: npm run bundle
 * Output: dist/bundle.jsx
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Read all source files
const readFile = (relativePath) => {
  const fullPath = path.join(srcDir, relativePath);
  if (fs.existsSync(fullPath)) {
    return fs.readFileSync(fullPath, 'utf-8');
  }
  return '';
};

// Extract code between imports and exports
const extractBody = (content, removeExports = true) => {
  // Remove import statements
  let body = content.replace(/^import\s+.*?;?\s*$/gm, '');
  
  // Remove "export default" but keep the content
  if (removeExports) {
    body = body.replace(/export\s+default\s+/g, '');
    body = body.replace(/export\s+/g, '');
  }
  
  return body.trim();
};

// Build the monolithic file
const buildBundle = () => {
  console.log('📦 Building bundle...\n');

  // Collect all pieces
  const definitions = readFile('sounds/definitions.js');
  const engine = readFile('sounds/engine.js');
  const knob = readFile('components/Knob.jsx');
  const stepButton = readFile('components/StepButton.jsx');
  const soundRow = readFile('components/SoundRow.jsx');
  const app = readFile('App.jsx');
  const css = readFile('index.css');

  // Extract the CSS that should be inlined
  const inlineStyles = css
    .replace(/@tailwind\s+\w+;/g, '') // Remove tailwind directives
    .trim();

  // Build the bundle
  const bundle = `import React, { useState, useEffect, useRef, useCallback } from 'react';

// ============================================
// Sound Definitions
// ============================================
${extractBody(definitions)}

// ============================================
// Audio Engine
// ============================================
${extractBody(engine)}

// ============================================
// Knob Component
// ============================================
${extractBody(knob)}

// ============================================
// StepButton Component
// ============================================
${extractBody(stepButton)}

// ============================================
// SoundRow Component
// ============================================
${extractBody(soundRow)
  .replace("import StepButton from './StepButton';", '')
  .replace("import { SOUNDS } from '../sounds/definitions';", '')}

// ============================================
// Main App Component
// ============================================
${extractBody(app)
  .replace(/import\s+\w+\s+from\s+['"]\.\/components\/\w+['"];?\s*/g, '')
  .replace(/import\s+{[^}]+}\s+from\s+['"]\.\/sounds\/\w+['"];?\s*/g, '')
  .replace('function App()', 'export default function DrumMachine()')
  .replace('export default App;', '')}

{/* Inline Styles */}
<style>{\`
.grid-cols-16 {
  grid-template-columns: repeat(16, minmax(0, 1fr));
}

@media (max-width: 768px) {
  .grid-cols-16 {
    grid-template-columns: repeat(16, minmax(18px, 1fr));
  }
}

* {
  color: #e0e0e0;
}

::-webkit-scrollbar {
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a2e;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #3a3a5a;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4a4a6a;
}
\`}</style>
`;

  // Clean up any double blank lines
  const cleaned = bundle.replace(/\n{3,}/g, '\n\n');

  // Write the bundle
  const outputPath = path.join(distDir, 'bundle.jsx');
  fs.writeFileSync(outputPath, cleaned);

  console.log('✅ Bundle created: dist/bundle.jsx');
  console.log(`   Size: ${(cleaned.length / 1024).toFixed(2)} KB`);
  console.log('\n📋 Copy this file for Claude artifacts or quick prototypes.\n');
};

buildBundle();
