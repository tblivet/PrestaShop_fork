/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import '../src/scss/main.scss';
import * as bootstrap from 'bootstrap';
import initPasswordToggle from '../src/js/components/password-toggle';
import initHeaderSearch from '../src/js/components/header-search';
import initQuickAccess from '../src/js/components/quick-access';
import initTooltips from '../src/js/components/tooltips';
import { addons } from '@storybook/preview-api';
import { format } from 'prettier/standalone';
import * as htmlPlugin from 'prettier/plugins/html';

const SNIPPET_RENDERED = 'storybook/docs/snippet-rendered';

initPasswordToggle();
initHeaderSearch();
initQuickAccess(bootstrap.Modal);
initTooltips(bootstrap.Tooltip);

/** @type {import('@storybook/html').Preview} */
const preview = {
  tags: ['autodocs'],

  globalTypes: {
    colorMode: {
      description: 'Bootstrap color mode',
      toolbar: {
        icon: 'contrast',
        title: 'Color mode',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    colorMode: 'light',
  },

  decorators: [
    (story, context) => {
      // Dispose existing Bootstrap instances before the story re-renders.
      // Without this, Popper's resize listener fires on the stale instance after
      // Storybook swaps the DOM, causing "Cannot read properties of undefined (reading 'x')".
      const prevRoot = document.getElementById('storybook-root') ?? document.body;
      prevRoot
        .querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach((node) => bootstrap.Tooltip.getInstance(node)?.dispose());
      prevRoot
        .querySelectorAll('[data-bs-toggle="popover"]')
        .forEach((node) => bootstrap.Popover.getInstance(node)?.dispose());

      // Apply Bootstrap's color mode to the preview <html> element so all CSS
      // custom property overrides (--bs-body-bg, --bs-border-color, etc.) take
      // effect across the entire canvas, not just the component root.
      const colorMode = context.globals.colorMode ?? 'light';
      document.documentElement.setAttribute('data-bs-theme', colorMode);

      const result = story();
      const html = typeof result === 'string' ? result : result.outerHTML;

      // Format the rendered HTML and push it to the source panel; stories with a Twig call (parameters.twig, see
      // src/stories/twig-snippet.js) show it under the HTML, for the current args.
      const twig = typeof context.parameters.twig === 'function' ? context.parameters.twig(context.args) : '';
      const emitSource = (htmlSource) => addons.getChannel().emit(SNIPPET_RENDERED, {
        id: context.id,
        args: context.args,
        source: twig ? `${htmlSource}\n\n<!-- ---------- Twig ---------- -->\n\n${twig}` : htmlSource,
      });

      format(html.trim(), { parser: 'html', plugins: [htmlPlugin], printWidth: 80, tabWidth: 2 })
        .then((formatted) => emitSource(formatted.trim()))
        .catch(() => emitSource(html.trim()));

      // Auto-init Bootstrap JS components (data-api fires on DOMContentLoaded
      // which has already passed by the time Storybook injects story HTML).
      requestAnimationFrame(() => {
        const root = document.getElementById('storybook-root') ?? document.body;
        root
          .querySelectorAll('[data-bs-toggle="tooltip"]')
          .forEach((node) => bootstrap.Tooltip.getOrCreateInstance(node));
        root
          .querySelectorAll('[data-bs-toggle="popover"]')
          .forEach((node) => bootstrap.Popover.getOrCreateInstance(node));
        root.querySelectorAll('.toast:not(.hide)').forEach((node) => bootstrap.Toast.getOrCreateInstance(node));
        root.querySelectorAll('.carousel').forEach((node) => bootstrap.Carousel.getOrCreateInstance(node));
      });

      // A story may return an element with its listeners (Content/Icons search): hand it back as it is
      return result;
    },
  ],
  parameters: {
    backgrounds: { disable: true },
    docs: {
      source: { language: 'html' },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date/i,
      },
    },
  },
};

export default preview;
