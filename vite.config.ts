import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://auto-cleanse.co.uk',
      dynamicRoutes: [
        '/',
        '/services',
        '/postal-dpf',
        '/why-clean',
        '/maintenance',
        '/about',
        '/contact',
        '/pricing',
        '/fuel-savings-calculator',
        '/dpf-cleaning-devon',
        '/dpf-cleaning-totnes'
      ]
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
