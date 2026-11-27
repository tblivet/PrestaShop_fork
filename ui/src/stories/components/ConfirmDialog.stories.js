/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:ConfirmDialog> (src/PrestaShopBundle/Twig/Component/Ui/ConfirmDialog.php) renders this markup, keep both
// in sync. confirm-dialog.ts (run by the preview) opens it.
import confirmDialog, { CONFIRM_DIALOG_DEFAULTS } from '../confirm-dialog';
import { clusterClasses } from '../layouts/layout-classes';
import { modalButton } from '../modal';
import { joinNodes, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// A <twig:ui:Button> that submits its form and asks first
const confirmSubmit = ({ label, variant, ...attributes }) => {
  const extra = Object.entries(attributes).map(([name, value]) => ` ${name}="${escape(value)}"`).join('');

  return {
    html: `<button class="btn btn-${variant} ps-button" type="submit" data-ps-data-busy-label="Loading..."${extra}>${label}</button>`,
    twig: `<twig:ui:Button variant="${variant}" type="submit"${extra}>${label}</twig:ui:Button>`,
  };
};

// A <twig:ui:Button> link that asks first
const confirmLink = ({ label, href, ...attributes }) => {
  const extra = Object.entries(attributes).map(([name, value]) => ` ${name}="${escape(value)}"`).join('');

  return {
    html: `<a class="btn btn-secondary ps-button" href="${href}"${extra}>${label}</a>`,
    twig: `<twig:ui:Button variant="secondary" href="${href}"${extra}>${label}</twig:ui:Button>`,
  };
};

// Story chrome: the triggers in a form that "submits" to a fragment, and a line saying what happened
const page = (dialogId) => (html) => `<form id="${dialogId}-form" action="#submitted" class="${clusterClasses({})}">${html}</form>`
  + '<p class="small text-body-secondary">Confirm changes the address to #submitted or #regenerated; Cancel, Esc or a click outside change nothing.</p>';

const story = (dialogId, triggers) => {
  const dialog = confirmDialog({ id: dialogId });
  const buttons = joinNodes(triggers, page(dialogId));

  return {
    html: `${buttons.html}${dialog.html}`,
    twig: `${buttons.twig}\n\n{# Placed once by the kit layout #}\n${dialog.twig}`,
    rendered: `${buttons.rendered}${dialog.html}`,
  };
};

export default {
  title: 'Components/ConfirmDialog',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: the kit layout places one `<twig:ui:ConfirmDialog/>` per page. A button or a link asks through it:',
          '```twig\n<twig:ui:Button\n  variant="destructive"\n  type="submit"\n  formaction="{{ path(\'admin_orders_delete_bulk\') }}"\n  data-ps-confirm="{{ \'Delete the selected orders?\'|trans(…) }}"\n  data-ps-data-confirm-label="{{ \'Delete\'|trans({}, \'Admin.Actions\') }}"\n  data-ps-data-confirm-variant="danger"\n>…</twig:ui:Button>\n```',
          '**Props**: `id` (default `ps-confirm-dialog`: one per page, so it has no control here). Other attributes go on the dialog. **On the trigger**: `data-ps-confirm` (required: the question), `data-ps-data-confirm-title` (default "Are you sure?"), `data-ps-data-confirm-label` (default "Confirm": name it with the action\'s verb, "Delete"), `data-ps-data-confirm-variant` (`danger`: a red action and the focus starts on Cancel; default the primary action).',
          '**Behaviour** (`confirm-dialog.ts`): the click is held and the dialog asks. Confirm submits the button\'s form with the button (its `name`, `value` and `formaction` go with it), follows a link (in its `target`), or clicks a plain button again. Cancel, Esc or a click outside do nothing, and the focus goes back to the trigger (or to the toggle of the dropdown menu it was in, which closes). While it asks, other clicks on triggers are held: one Confirm, one action.',
          '**Do**: a question that names what happens to what ("Delete 3 orders?"), the action\'s verb on the button, `danger` for what cannot be undone. **Don\'t**: "Are you sure?" alone, an empty `data-ps-confirm` (it still asks, with no question), "Yes" or "OK", a confirmation for what can be undone, a dialog of its own for each row, a trigger inside another dialog (a dialog over a dialog: close the first, or confirm in it).',
          '**States**: a deletion (danger, a form submit with formaction), a primary action on a link with its own title and label, a plain button, a long question.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    id: { control: false, description: 'One per page' },
  }, CONFIRM_DIALOG_DEFAULTS),
};

// Story chrome: the form's submit stays in Storybook, its address showing the formaction that went with it
const keepInStorybook = (formId) => (render) => {
  requestAnimationFrame(() => document.getElementById(formId)?.addEventListener('submit', (event) => {
    event.preventDefault();
    window.location.hash = new URL(event.submitter?.formAction || event.target.action).hash;
  }));

  return render();
};

export const Default = {
  ...withTwig(() => story('story-confirm-dialog', [
    confirmSubmit({
      label: 'Delete selected orders', variant: 'destructive', formaction: '#submitted', name: 'order_bulk_action', value: 'delete',
      'data-ps-confirm': 'Delete the 3 selected orders? This cannot be undone.', 'data-ps-data-confirm-label': 'Delete', 'data-ps-data-confirm-variant': 'danger',
    }),
    confirmLink({
      label: 'Regenerate the key', href: '#regenerated',
      'data-ps-confirm': 'The current key stops working at once. Apps using it must be given the new one.', 'data-ps-data-confirm-title': 'Regenerate the API key?', 'data-ps-data-confirm-label': 'Regenerate',
    }),
    modalButton({ label: 'Clear the cache', variant: 'outline-secondary', 'data-ps-confirm': 'Clear the cache now? Pages are slower for a few minutes.' }),
  ])),
  decorators: [keepInStorybook('story-confirm-dialog-form')],
};

export const LongQuestion = {
  ...withTwig(() => story('story-confirm-dialog-long', [
    confirmSubmit({
      label: 'Delete the carrier', variant: 'destructive', formaction: '#submitted',
      'data-ps-confirm': 'Delete the carrier “Express delivery, next business day before noon”? It is removed from every zone and price range, carts that use it go back to the default carrier, and past orders keep its name.',
      'data-ps-data-confirm-title': 'Delete the carrier “Express delivery, next business day before noon”?',
      'data-ps-data-confirm-label': 'Delete', 'data-ps-data-confirm-variant': 'danger',
    }),
  ]), { docs: { description: { story: 'A long title and question in the dialog: they wrap, the buttons stay at the bottom.' } } }),
  decorators: [keepInStorybook('story-confirm-dialog-long-form')],
};
