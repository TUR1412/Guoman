import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command }) => ({
  // GitHub Pages 部署时使用 /Guoman/，本地开发保持 / 更顺手
  base: command === 'build' ? '/Guoman/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@styles': path.resolve(__dirname, './src/assets/styles'),
      '@images': path.resolve(__dirname, './src/assets/images'),
      '@data': path.resolve(__dirname, './src/data'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined;

          if (
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/')
          ) {
            return 'vendor-react';
          }

          if (id.includes('node_modules/framer-motion')) return 'vendor-motion';
          if (id.includes('node_modules/styled-components')) return 'vendor-styled';
          if (id.includes('node_modules/react-icons')) return 'vendor-icons';
          if (id.includes('node_modules/swiper')) return 'vendor-swiper';

          return 'vendor';
        },
      },
    },
  },
}));
