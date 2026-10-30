/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import { fileURLToPath } from 'node:url';

/** @type {import('@storybook/html-vite').StorybookConfig} */
const config = {
  stories: ['../src/stories/**/*.stories.@(js|mjs)', '../src/playground/**/*.stories.@(js|mjs)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-links', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  // Static files in public/ are served at / in both dev and built Storybook.
  // src/playground/assets/ is served at /playground/ — for playground-only images (not part of dist).
  staticDirs: ['../public', { from: '../src/playground/assets', to: '/playground' }],
  core: {
    disableTelemetry: true,
  },
  // vite.config.js describes the dist build; Storybook only reuses its font aliases and Sass options.
  viteFinal: (viteConfig) => {
    delete viteConfig.build;

    return {
      ...viteConfig,
      root: fileURLToPath(new URL('..', import.meta.url)),
      base: '/',
    };
  },
};

export default config;
