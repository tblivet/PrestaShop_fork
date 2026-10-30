/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

// Shared with Storybook (.storybook/vite.config.js), which has its own build.
export const shared = {
  resolve: {
    // Fonts are served straight from their npm packages, in dev and in the build.
    alias: {
      '@fonts/ibm-plex-sans': resolve(root, 'node_modules/@fontsource/ibm-plex-sans/files'),
      '@fonts/material-symbols': resolve(root, 'node_modules/material-symbols'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "$font-path: '@fonts';",
        loadPaths: [resolve(root, 'node_modules')],
        // Bootstrap 5.3 SCSS predates the Sass module system.
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
      },
    },
  },
};

export default defineConfig(({ mode }) => ({
  ...shared,
  root: resolve(root, 'src'),
  // Relative URLs, so the CSS finds its fonts wherever dist/ is served from.
  base: './',
  // Brand images (prestashop.svg…), copied to dist/ and shared with Storybook.
  publicDir: resolve(root, 'public'),
  build: {
    outDir: resolve(root, 'dist'),
    // Not in watch mode (--mode development): Vite copies public/ on the first build only.
    emptyOutDir: mode !== 'development',
    sourcemap: true,
    // One stylesheet, kept out of the IIFE bundle.
    cssCodeSplit: false,
    // Stable file names: the back-office links them directly.
    rollupOptions: {
      input: resolve(root, 'src/js/main.js'),
      output: {
        // Classic script exposing window.bootstrap, loaded before the back-office bundles.
        format: 'iife',
        entryFileNames: 'js/ui.js',
        assetFileNames: ({ names }) => (names[0]?.endsWith('.css') ? 'css/ui.css' : 'fonts/[name][extname]'),
      },
    },
  },
  server: {
    port: 5173,
  },
}));
