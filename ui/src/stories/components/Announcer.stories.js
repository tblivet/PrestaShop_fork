/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:Announcer> (src/PrestaShopBundle/Twig/Component/Ui/Announcer.php) renders this markup, keep both in sync.
import { announce } from '../../js/components/announcer';
import announcer from '../announcer';
import { withTwig } from '../twig-snippet';
import { stackClasses } from '../layouts/layout-classes';

// Story chrome: buttons that call announce(), and what the region last said, since it is hidden. The page's own region
// is the one the preview keeps (.storybook/preview.js), as the layouts do: the story shows its markup, not a second one.
const demo = (messages) => {
  const root = document.createElement('div');
  const heard = document.createElement('p');

  root.className = stackClasses({ align: 'start' });
  heard.className = 'text-body-secondary';
  heard.textContent = 'Screen readers hear: (nothing yet)';
  root.append(...messages.map((message) => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'btn btn-outline-primary';
    button.textContent = `Announce "${message}"`;
    button.addEventListener('click', () => {
      announce(message);
      heard.textContent = `Screen readers hear: ${message}`;
    });

    return button;
  }), heard);

  return root;
};

export default {
  title: 'Components/Announcer',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:Announcer/>`, placed once by the kit layouts (the back office shell and the sign-in pages), never by a page or a component. It is the page\'s polite live region (`role="status"`), hidden, empty until a script writes in it, and in the page from the start, so screen readers announce what is written in it.',
          '**JS**: `import { announce } from \'./announcer\'` then `announce(message)` in the kit scripts (`ui/src/js/components/announcer.ts`); from a script outside the kit bundle (a new-theme page, a module): `document.dispatchEvent(new CustomEvent(\'ps:announce\', {detail: {message}}))`. The message is translated text, said once; the same message twice in a row is said again.',
          '**Props**: none. Other attributes (`id`, `data-*`) go on the `<div>`.',
          '**Do**: say the result of an action that changes the page without moving the focus ("This page is now in your quick access."), a progress ("Loading..." when a script makes a button busy, `busy-button.ts`), a count after filtering. **Don\'t**: a second live region for the same purpose, a blocking error (show a danger `<twig:ui:Alert>`, `role="alert"`), a message that is also shown and read where the focus goes, a stream of messages while typing (debounce).',
          '**States**: the region, empty; the demo writes in the region of the page, the one Storybook keeps like the layouts do.',
        ].join('\n\n'),
      },
    },
  },
};

export const Default = withTwig(() => announcer(), {
  docs: { description: { story: 'The markup: hidden, so the canvas is empty. Turn on a screen reader and use the Announce story to hear it.' } },
});

// "Show code" gives the region the buttons write in; the canvas, the demo
export const Announce = {
  ...withTwig(() => announcer(), {
    docs: { description: { story: 'Each button calls `announce()`; the line below repeats, visibly, what screen readers hear. Pressing the same button twice says it twice.' } },
  }),
  render: () => demo(['This page is now in your quick access.', 'Loading...']),
};
