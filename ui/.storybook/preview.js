/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import '../src/scss/main.scss';
import * as bootstrap from 'bootstrap';
import initDropdownInsideClick from '../src/js/components/dropdown-inside-click';
import initDropdownTopLayer from '../src/js/components/dropdown-top-layer';
import initAlertDismissFocus from '../src/js/components/alert-dismiss-focus';
import initAnnouncer from '../src/js/components/announcer';
import initBusyButtons from '../src/js/components/busy-button';
import initConfirmDialog from '../src/js/components/confirm-dialog';
import initGridBulk from '../src/js/components/grid-bulk';
import initGridFilters from '../src/js/components/grid-filters';
import initGridPosition from '../src/js/components/grid-position';
import initGridPreview from '../src/js/components/grid-preview';
import initGridRowLink from '../src/js/components/grid-row-link';
import initGridSelection from '../src/js/components/grid-selection';
import initGridToggle from '../src/js/components/grid-toggle';
import initPasswordToggle from '../src/js/components/password-toggle';
import initHeaderSearch from '../src/js/components/header-search';
import initKpis from '../src/js/components/kpi';
import initModalReturnFocus from '../src/js/components/modal-return-focus';
import initPaginationJump from '../src/js/components/pagination-jump';
import initQuickAccess from '../src/js/components/quick-access';
import initScrollFade from '../src/js/components/scroll-fade';
import initTooltips from '../src/js/components/tooltips';
import { addons } from '@storybook/preview-api';
import { Controls, Description, Primary, Stories, Subtitle, Title } from '@storybook/blocks';
import { createElement, Fragment } from 'react';
import { format } from 'prettier/standalone';
import * as htmlPlugin from 'prettier/plugins/html';
import announcer from '../src/stories/announcer';

const SNIPPET_RENDERED = 'storybook/docs/snippet-rendered';

// As main.js does in the back office: one Bootstrap the stories' play functions reach too
window.bootstrap = bootstrap;

// The page's live region, outside the story root so it stays across stories, as the kit layouts place it
document.body.insertAdjacentHTML('beforeend', announcer().html);
initAnnouncer();
initAlertDismissFocus();
initBusyButtons();
initPasswordToggle();
initHeaderSearch();
initQuickAccess(bootstrap.Modal);
initModalReturnFocus();
initPaginationJump();
initConfirmDialog(bootstrap.Modal, bootstrap.Dropdown);
initDropdownTopLayer(bootstrap.Dropdown);
initDropdownInsideClick();
initGridBulk();
initGridFilters();
initGridPosition();
initGridPreview();
initGridRowLink();
initGridToggle();
initGridSelection();
initTooltips(bootstrap.Tooltip);
initScrollFade();

// Docs pages put each story in a transformed box that clips: a modal opened there would stay in it. It goes to <body>
// while open, as in the back office, and back to its place once closed.
document.addEventListener('show.bs.modal', ({ target }) => {
  if (target.parentElement === document.body) {
    return;
  }
  const placeholder = document.createComment('modal');

  target.before(placeholder);
  document.body.append(target);
  target.addEventListener('hidden.bs.modal', () => placeholder.replaceWith(target), { once: true });
});

/** @type {import('@storybook/html').Preview} */
const preview = {
  tags: ['autodocs'],

  globalTypes: {
    // Only what the kit writes with logical properties flips (DECISIONS.md #4): ui.css is Bootstrap's left-to-right
    // build, so its physical utilities (ms-*, dropdown-menu-end…) do not
    direction: {
      description: 'Reading direction of the page (dir on <html>)',
      toolbar: {
        icon: 'transfer',
        title: 'Direction',
        items: [
          { value: 'ltr', title: 'Left to right', right: 'LTR' },
          { value: 'rtl', title: 'Right to left', right: 'RTL' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    direction: 'ltr',
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

      document.documentElement.setAttribute('dir', context.globals.direction ?? 'ltr');

      const result = story();
      // The source panel shows what the component renders, without the story's frame (twig-snippet.js "rendered")
      const parity = typeof context.parameters.twigParity === 'function' ? context.parameters.twigParity(context.args) : null;
      const html = parity?.html ?? (typeof result === 'string' ? result : result.outerHTML);

      // Format the rendered HTML and push it to the source panel; stories with a Twig call (parameters.twig, see
      // src/stories/twig-snippet.js) show it under the HTML, for the current args.
      const twig = typeof context.parameters.twig === 'function' ? context.parameters.twig(context.args) : '';
      const emitSource = (htmlSource) => addons.getChannel().emit(SNIPPET_RENDERED, {
        id: context.id,
        // The docs source block matches a snippet to the story by its control values, before mapping ("none", not null)
        args: context.unmappedArgs ?? context.args,
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
        // As main.js on DOMContentLoaded: the out-of-date KPIs fetch their value
        initKpis(root);
      });

      // A story may return an element with its listeners (Content/Icons search): hand it back as it is
      return result;
    },
  ],
  parameters: {
    backgrounds: { disable: true },
    docs: {
      source: { language: 'html' },
      // Storybook's docs page, without the first story twice (at the top, then in the list): an id in it would clash
      page: () => createElement(
        Fragment,
        null,
        createElement(Title),
        createElement(Subtitle),
        createElement(Description),
        createElement(Primary),
        createElement(Controls),
        createElement(Stories, { includePrimary: false }),
      ),
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
