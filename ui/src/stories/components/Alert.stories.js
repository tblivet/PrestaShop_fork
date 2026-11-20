/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/alerts/
import alert, { ALERT_ICONS, ALERT_TYPES } from '../alert';
import { framedNodes, joinNodes, withTwig } from '../twig-snippet';
import { NONE, nullableSelect, withDefaults } from '../story-defaults';
import { stackClasses } from '../layouts/layout-classes';
// Twig: <twig:ui:Alert> (src/PrestaShopBundle/Twig/Component/Ui/Alert.php) renders this markup, keep both in sync.

// Alert.php defaults (ALERT_DEFAULTS in ../alert.js, which builds the markup)
const DEFAULTS = { type: 'info', icon: null, dismissible: false, borderless: false };

// Story chrome, laid out by the kit like a page would be, no utilities (DECISIONS.md #38): the alerts one under the other
const column = (html) => `<div class="${stackClasses({ gap: 'sm' })}">${html}</div>`;
// Story chrome: a narrow box, so a case shows how the alert wraps; the alert itself takes no width
const narrow = (html) => `<div style="max-width: 18rem">${html}</div>`;

export default {
  title: 'Components/Alert',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:Alert type="danger" dismissible>…message…</twig:ui:Alert>`. The content block is the message: text, paragraphs, a list, links; there is no title prop, emphasise a first sentence with `<strong>` in the message. Its paragraphs and lists keep their space between them, none after the last one: no `mb-0`.',
          '**Props**: `type` (`primary`, `secondary`, `success`, `danger`, `warning`, `info`; default `info`), `icon` (a `<twig:ui:Icon>` name, shown filled; default: the status icon of the type, `cancel` for `danger`, `warning`, `check_circle` for `success`, `info`, none for `primary` and `secondary`), `dismissible` (default `false`), `borderless` (default `false`: no border, only the tinted background; for an alert inside a card or a panel that already frames it). Other attributes (`id`, `data-ps-*`, `aria-*`) go on the alert.',
          '**Accessibility**: a status type is never told by its color alone: it shows its icon, and the icon says the type to screen readers ("Error", "Warning", "Success", "Information"), read before the message. `danger` interrupts them (`role="alert"`), the others are read politely (`role="status"`). Closing a dismissible alert moves the focus to the next focusable element (`alert-dismiss-focus.js`).',
          '**Do**: let a layout or `<twig:ui:FlashMessages>` space alerts (the alert has no outer margin); use `danger` only for errors, it is the only type announced at once; a hidden `danger` alert as an error slot a script fills and shows. **Don\'t**: add margins, a width or `.alert-link` by hand: links in the message take the alert link color, the layout around sets the width.',
          '**States**: each type, the default icon and another one, with and without border, dismissible, long text wrapping with its icon on the first line, a long unbreakable word (path, token) breaking inside the box, a link and `<code>` in the message, several paragraphs and a list, a first sentence in `<strong>`.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    type: { control: 'select', options: ALERT_TYPES, description: 'Status or tone of the message' },
    icon: nullableSelect(Object.keys(ALERT_ICONS), '`<twig:ui:Icon>` name, shown filled; none: the status icon of the type'),
    dismissible: { control: 'boolean', description: 'Close button' },
    borderless: { control: 'boolean', description: 'No border, only the background' },
    content: { control: 'text', description: 'The content block (HTML)' },
  }, DEFAULTS),
  args: {
    ...DEFAULTS,
    icon: NONE,
    content: 'Your changes will show on your shop after the cache is cleared.',
  },
};

export const Default = withTwig((args) => alert(args));

export const AllVariants = withTwig(() => joinNodes(
  ALERT_TYPES.map((type) => alert({ type, content: `A <strong>${type}</strong> alert.` })),
  column,
), { docs: { description: { story: 'The four status types show their icon; `primary` and `secondary`, a tone rather than a status, show none unless given one.' } } });

export const Borderless = withTwig(() => joinNodes(
  ['info', 'success', 'warning', 'danger'].map((type) => alert({ type, borderless: true, content: `A borderless <strong>${type}</strong> alert: only its background frames it.` })),
  column,
), { docs: { description: { story: '`borderless`: the same size and colors, without the border, for an alert inside a card or a panel that already frames it.' } } });

// The framed cases one under the other, the frames kept out of the Twig code
const framedColumn = (nodes, frame) => {
  const framed = framedNodes(nodes, frame);

  return { ...framed, html: column(framed.html) };
};

export const WithIcon = withTwig(() => framedColumn(
  [
    alert({ type: 'info', icon: 'check_circle', content: 'Another icon than the type\'s: it still says "Information" to screen readers.' }),
    alert({ type: 'primary', icon: 'info', content: 'A tone, not a status, with an icon: decorative, screen readers hear only the message.' }),
    alert({ type: 'warning', content: 'A long warning that wraps on several lines keeps its icon on the first line.' }),
    alert({ type: 'warning', content: 'Rename the /admin folder, for example to <code>admin482k3j9x2qv8mzt0wplq7rhs5ndy6/</code>. A long word breaks inside the box. <a href="#">A link</a> takes the alert color.' }),
  ],
  (html, index) => (index < 2 ? html : narrow(html)),
), { docs: { description: { story: 'Any icon in place of the status one; in a narrow place, the icon stays on the first line and a long word breaks.' } } });

export const Content = withTwig(() => alert({
  type: 'warning',
  content: '<p>For security reasons, do the following before you sign in:</p><ul><li>Rename the /admin folder.</li><li>Delete the /install folder.</li></ul>',
}), { docs: { description: { story: 'Paragraphs and lists keep their space between them and none after the last one, without `mb-0`.' } } });

export const Dismissible = withTwig(() => joinNodes([
  alert({ type: 'warning', dismissible: true, content: '<strong>Check these fields.</strong> Some of them are not filled in.' }),
  alert({ type: 'success', dismissible: true, content: '<strong>Saved.</strong> Your settings are up to date.' }),
  alert({ type: 'danger', dismissible: true, content: '<strong>We couldn\'t save.</strong> Change the fields in red and try again.' }),
], column), { docs: { description: { story: 'Closing an alert moves the focus to the next close button, or to the previous focusable element after the last one.' } } });

// A flash message whose first sentence is its point, in <strong> (LoginController's "Check your inbox.")
export const StrongFirstSentence = withTwig(() => alert({
  type: 'info',
  dismissible: true,
  content: '<p><strong>Check your inbox.</strong><br/>If an account exists for this email address, you\'ll receive a link to reset your password. You can request a new link every 6 hours.</p>',
}));

export const HiddenErrorSlot = withTwig(() => alert({
  type: 'danger',
  hidden: true,
  'data-ps-ref': 'example-error',
  content: '<span data-ps-ref="example-error-message"></span>',
}), { docs: { description: { story: 'Hidden, so the canvas is empty: an error slot a script fills and shows (`hidden = false`, then the message), as the quick access dialogs do. Shown, it is announced at once (`role="alert"`).' } } });
