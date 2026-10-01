import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const manualChunks = (id: string): string | void => {
  if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
    return 'vendor-react';
  }
  if (id.includes('node_modules/react-router-dom')) {
    return 'vendor-router';
  }
  if (id.includes('node_modules/lucide-react')) {
    return 'vendor-lucide';
  }
  if (id.includes('node_modules/zod')) {
    return 'vendor-utils';
  }
  if (
    id.includes('HermesChatView') ||
    id.includes('useHermesStream') ||
    id.includes('useFileUpload') ||
    id.includes('hermesClient')
  ) {
    return 'features-chat';
  }
  if (id.includes('CriticalCounterpartView') || id.includes('useHashLockedPatch')) {
    return 'features-critical';
  }
  if (id.includes('DecisionEngineView') || id.includes('hermesEngine')) {
    return 'features-decision';
  }
  if (id.includes('DocumentMasterView')) {
    return 'features-document';
  }
  if (id.includes('EpistemologyMatrixView') || id.includes('useCapabilityFilter')) {
    return 'features-epistemology';
  }
  if (id.includes('HierarchyAndSecurityView')) {
    return 'features-hierarchy';
  }
  if (id.includes('MasterCycleView') || id.includes('usePhaseFilter')) {
    return 'features-cycle';
  }
  if (id.includes('PhasesReadinessView')) {
    return 'features-phases';
  }
  if (id.includes('src/data/modules/') || id.includes('src/data/index')) {
    return 'shared-data';
  }
  if (id.includes('src/utils/')) {
    return 'shared-utils';
  }
  if (id.includes('src/types/')) {
    return 'shared-types';
  }
  if (id.includes('src/hooks/')) {
    return 'shared-hooks';
  }
  if (id.includes('src/services/')) {
    return 'shared-services';
  }
};

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      modulePreload: {
        polyfill: true,
      },
      rollupOptions: {
        output: {
          manualChunks,
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name ?? 'unknown';
            const info = name.split('.');
            const ext = info[info.length - 1];
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(name)) {
              return `assets/images/[name]-[hash].${ext}`;
            }
            if (/\.(woff2?|ttf|eot)$/.test(name)) {
              return `assets/fonts/[name]-[hash].${ext}`;
            }
            return `assets/[ext]/[name]-[hash].${ext}`;
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      reportCompressedSize: true,
    },
  };
});
