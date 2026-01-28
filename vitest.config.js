import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 10000,
    environment: 'jsdom',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.{git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,eslint,prettier}.config.*',
      'e2e/**',
    ],
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/',
      },
    },
    setupFiles: ['./vitest.setup.js'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'json-summary', 'html'],
      all: true,
      include: [
        'src/utils/**/*.{js,jsx,ts,tsx}',
        'src/components/CommandPalette.jsx',
        'src/components/NetworkStatusBanner.jsx',
        'src/components/AnimeList.jsx',
        'src/components/anime/AnimeCard.jsx',
        'src/components/FavoritesProvider.jsx',
        'src/components/Header.jsx',
        'scripts/seo.js',
      ],
      exclude: ['**/*.test.*', '**/*.spec.*', '**/dist/**', '**/coverage/**', '**/node_modules/**'],
      thresholds: {
        perFile: true,
        // Core logic should be near “极限”覆盖率。
        'src/utils/**/*.{js,jsx,ts,tsx}': {
          statements: 92,
          lines: 92,
          functions: 90,
          branches: 85,
        },

        // Script helpers are small and should be fully covered.
        'scripts/seo.js': {
          statements: 95,
          lines: 95,
          functions: 100,
          branches: 100,
        },

        // Component thresholds are tuned per-file: UI 逻辑分支多，追求“高覆盖 + 可维护”而非硬刷 100%。
        'src/components/CommandPalette.jsx': {
          statements: 85,
          lines: 85,
          functions: 65,
          branches: 75,
        },
        'src/components/AnimeList.jsx': {
          statements: 85,
          lines: 85,
          functions: 60,
          branches: 75,
        },
        'src/components/NetworkStatusBanner.jsx': {
          statements: 90,
          lines: 90,
          functions: 60,
          branches: 75,
        },
        'src/components/FavoritesProvider.jsx': {
          statements: 65,
          lines: 65,
          functions: 60,
          branches: 50,
        },
        'src/components/Header.jsx': {
          statements: 65,
          lines: 65,
          functions: 30,
          branches: 55,
        },
        'src/components/anime/AnimeCard.jsx': {
          statements: 90,
          lines: 90,
          functions: 20,
          branches: 40,
        },
      },
    },
  },
});
