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
        '/dpf-cleaning-totnes',
        '/remapping',
        '/remapping-booking',
        '/dpf-cleaning-exeter',
        '/dpf-cleaning-plymouth',
        '/dpf-cleaning-torquay',
        '/dpf-cleaning-paignton',
        '/remapping-devon',
        '/ecu-remapping-plymouth',
        '/ecu-remapping-exeter',
        '/ecu-remapping-torquay',
        '/ecu-remapping-paignton',
        '/ecu-remapping-newton-abbot',
        '/ecu-remapping-torbay',
        '/ecu-remapping-totnes',
        '/ecu-remapping-ivybridge',
        '/ecu-remapping-tavistock',
        '/ecu-remapping-kingsbridge'
      ]
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
