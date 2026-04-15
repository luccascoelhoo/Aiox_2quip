import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@game': path.resolve(__dirname, './src/game'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@bridge': path.resolve(__dirname, './src/bridge'),
      '@services': path.resolve(__dirname, './src/services'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
