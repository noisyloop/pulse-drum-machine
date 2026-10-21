import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// PULSE-007: When deploying to CDN, install vite-plugin-sri and uncomment:
// import sri from 'vite-plugin-sri';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // sri(), // PULSE-007: Generates integrity hashes for all built assets
  ],
  base: './',
  build: {
    // Generate source maps for debugging but not in production CDN
    sourcemap: false,
    // Deterministic chunk names for cache busting
    rollupOptions: {
      output: {
        // Content-hash filenames ensure cache invalidation on code changes
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
