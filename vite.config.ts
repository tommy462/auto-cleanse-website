import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://auto-cleanse.co.uk'
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
