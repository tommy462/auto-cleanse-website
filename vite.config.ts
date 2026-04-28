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
        '/ecu-remapping-kingsbridge',
        // Batch 2
        '/ecu-remapping-brixham',
        '/ecu-remapping-teignmouth',
        '/ecu-remapping-dawlish',
        '/ecu-remapping-ashburton',
        '/ecu-remapping-buckfastleigh',
        '/ecu-remapping-dartmouth',
        '/ecu-remapping-salcombe',
        '/ecu-remapping-okehampton',
        '/ecu-remapping-sidmouth',
        // Batch 3
        '/ecu-remapping-barnstaple',
        '/ecu-remapping-bideford',
        '/ecu-remapping-tiverton',
        '/ecu-remapping-honiton',
        '/ecu-remapping-axminster',
        '/ecu-remapping-crediton',
        '/ecu-remapping-cullompton',
        '/ecu-remapping-south-hams',
        '/ecu-remapping-east-devon',
        '/ecu-remapping-north-devon',
        // Batch 4 — service type pages
        '/mobile-ecu-remapping-devon',
        '/stage-1-remaps-devon',
        '/van-remapping-devon',
        '/performance-remapping-devon',
        '/fuel-economy-remaps-devon',
        '/diesel-remapping-devon',
        '/petrol-remapping-devon',
        '/4x4-remapping-devon',
        '/fleet-vehicle-remapping-devon',
        '/ecu-tuning-devon'
      ]
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
