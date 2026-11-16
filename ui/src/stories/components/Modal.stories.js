/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/modal/
// Twig: <twig:ui:Modal> (src/PrestaShopBundle/Twig/Component/Ui/Modal.php) renders this markup, keep both in sync.
import modal, { modalButton } from '../modal';
import { framedNodes, markup, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

// Modal.php defaults; id and title are required
const DEFAULTS = { headingLevel: 2, size: 'md', centered: true, scrollable: false, static: false, closable: true };

const FIELD = markup('<label class="form-label" for="story-shortcut-name">Shortcut name</label><input type="text" class="form-control" id="story-shortcut-name" value="Customers">');
const CANCEL_SAVE = [modalButton({ label: 'Cancel', 'data-bs-dismiss': 'modal' }), modalButton({ label: 'Save', variant: 'primary' })];
const LONG_TEXT = markup(Array(10).fill('<p>Every product of the catalog is checked against the file, then its price, stock and categories are updated. Products that are not in the file stay as they are.</p>').join(''));

// Story chrome: shown in place, as an open dialog, instead of waiting for a button
const open = (html) => `<div class="bg-body-tertiary p-3">${html.replace('class="modal fade ps-modal', 'class="modal fade ps-modal show d-block position-static')}</div>`;
const shown = (node) => framedNodes([node], open);

export default {
  title: 'Components/Modal',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:Modal id="quick-access-add" title="{{ \'Add to quick access\'|trans({}, \'Admin.Navigation.Header\') }}" static>…<twig:block name="footer"><twig:ui:Button data-bs-dismiss="modal">…</twig:ui:Button><twig:ui:Button variant="primary">…</twig:ui:Button></twig:block></twig:ui:Modal>`. A button with `data-bs-toggle="modal" data-bs-target="#quick-access-add"` opens it (Bootstrap modal: focus moves in and stays in, Esc closes it, focus goes back to the button).',
          '**Props**: `id` (required: what opens it, and the title is `{id}-title`, its name for screen readers), `title` (required), `headingLevel` (2 to 6; default 2), `size` (`sm`, `md`, `lg`, `xl`, `fullscreen`; default `md`), `centered` (default `true`), `scrollable` (default `false`: a long body scrolls inside, the title and the footer stay), `static` (default `false`: a click outside does not close it, so typed input is not lost; Esc and the close button still do), `closable` (default `true`; `false`: no close button, no Esc, no click outside, only for a step that must finish, like a progress). Content: the body. Block `footer`: the buttons, Cancel first, the action last. Other attributes (`class`, `data-ps-*`) go on the root.',
          '**Do**: a short task or a confirmation that needs an answer before going on; a title naming the task ("Add to quick access"); the main button named by its action ("Save", "Remove"), never "OK" or "Yes"; `static` around a form. **Don\'t**: a modal for information a page section can show, a modal opening another modal, `closable: false` for a form (the user must always be able to leave), one hidden modal per row of a list (render one, fill it when it opens).',
          '**States**: a form with its buttons, the sizes, a long body that scrolls, not closable, a long title. Shown open in place here; "Opened by a button" shows the real behaviour.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    id: { control: 'text', description: 'What opens it (data-bs-target) and names it (required)' },
    title: { control: 'text', description: 'Title, the name of the dialog (required)' },
    headingLevel: { control: 'select', options: [2, 3, 4, 5, 6], description: 'Heading level of the title' },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'fullscreen'], description: 'Width' },
    centered: { control: 'boolean', description: 'Vertically centred' },
    scrollable: { control: 'boolean', description: 'The body scrolls, the title and the footer stay' },
    static: { control: 'boolean', description: 'A click outside does not close it' },
    closable: { control: 'boolean', description: 'Close button, Esc and click outside' },
  }, DEFAULTS),
  args: { id: 'story-modal', title: 'Add to quick access', ...DEFAULTS, static: true },
};

export const Default = withTwig((args) => shown(modal({
  ...args, size: args.size === 'fullscreen' ? 'md' : args.size, body: FIELD, footer: CANCEL_SAVE,
})));

export const Sizes = withTwig(() => framedNodes(
  ['sm', 'lg', 'xl'].map((size) => modal({
    id: `story-modal-${size}`, title: `Size ${size}`, size, body: markup(`<p>The ${size} dialog.</p>`),
  })),
  open,
), { docs: { description: { story: '`sm` for a short confirmation, `md` (default) for a small form, `lg` and `xl` for a table or a long form. `fullscreen` (not shown) takes the whole screen.' } } });

export const Scrollable = withTwig(() => shown(modal({
  id: 'story-modal-scrollable', title: 'Import products', scrollable: true, body: LONG_TEXT, footer: CANCEL_SAVE,
})), { docs: { description: { story: 'The body scrolls; the title and the buttons stay in view.' } } });

export const NotClosable = withTwig(() => shown(modal({
  id: 'story-modal-progress', title: 'Importing products', closable: false, body: markup('<p>1,240 of 3,000 products imported. Keep this page open.</p>'),
})), { docs: { description: { story: 'For a step that must finish: no close button, Esc and a click outside do nothing. Never around a form.' } } });

export const LongTitle = withTwig(() => shown(modal({
  id: 'story-modal-long', title: 'Diese Seite zum Schnellzugriff hinzufügen und in einem neuen Fenster öffnen', static: true, body: FIELD, footer: CANCEL_SAVE,
})), { docs: { description: { story: 'A long title (here in German) wraps; the close button stays centred beside it.' } } });

const opener = (html) => `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#story-modal-live">Add to quick access</button>${html}`;

export const OpenedByAButton = withTwig(() => framedNodes([modal({
  id: 'story-modal-live', title: 'Add to quick access', static: true, body: FIELD, footer: CANCEL_SAVE,
})], opener), { docs: { description: { story: 'The real behaviour: the button opens it, focus moves to the dialog and stays in it, Esc or Cancel closes it and focus goes back to the button.' } } });
