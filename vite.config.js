import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite ayarları. base: './' sayesinde site hangi klasörde yayınlanırsa yayınlansın çalışır.
export default defineConfig({
  plugins: [react()],
  base: './'
});
