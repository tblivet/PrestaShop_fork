/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/toasts/
import toast, { TOAST_TYPES, toastStack } from '../toast';
import { joinNodes, markup, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';
import { stackClasses } from '../layouts/layout-classes';
// Twig: <twig:ui:Toast> (src/PrestaShopBundle/Twig/Component/Ui/Toast.php) renders this markup, keep both in sync.
// Twig: <twig:ui:ToastStack> (src/PrestaShopBundle/Twig/Component/Ui/ToastStack.php) renders the Stack story's markup.

// Toast.php defaults (TOAST_DEFAULTS in ../toast.js, which builds the markup)
const DEFAULTS = { type: 'success', autohide: true, delay: 5000 };

// Story chrome, laid out by the kit, no utilities (DECISIONS.md #38): the toasts one under the other, shown in place
// (a toast is hidden until toast.ts shows it)
const column = (html) => `<div class="${stackClasses({ gap: 'sm' })}">${html}</div>`;
const shown = (props) => toast({ ...props, class: 'show' });

// Story chrome: buttons that ask the page's stack for a toast, as a script does through the ps:toast event
const SAMPLES = {
  success: 'The status has been successfully updated.',
  info: 'The export starts in the background. You can leave this page.',
  warning: 'This product is saved, but it is not visible in your store yet.',
  danger: 'The change could not be saved. Try again.',
};
// (no document when story-markup.mjs reads the stories in Node)
globalThis.document?.addEventListener('click', (event) => {
  const button = event.target instanceof Element ? event.target.closest('[data-story-toast]') : null;

  if (button) {
    const type = button.getAttribute('data-story-toast');
    document.dispatchEvent(new CustomEvent('ps:toast', { detail: { type, message: SAMPLES[type] } }));
  }
});

export default {
  title: 'Components/Toast',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: none in a page. The kit layouts place `<twig:ui:ToastStack/>` once, and scripts show a toast in it: `showToast({type, message})` in the kit scripts (`ui/src/js/components/toast.ts`), `document.dispatchEvent(new CustomEvent(\'ps:toast\', {detail: {type, message}}))` from a script outside the kit bundle (a new-theme page, a module). The stack holds a `<twig:ui:Toast>` of each type as a template; the toast shown is a copy with the message in it, removed once hidden.',
          '**Props** of `<twig:ui:Toast>`: `type` (`success`, `info`, `warning`, `danger`; default `success`), `autohide` (default `true`), `delay` (milliseconds, default `5000`). A `danger` toast never hides by itself: an error waits to be read and closed. The content block is the message. Other attributes go on the toast. `<twig:ui:ToastStack>` has none.',
          '**Accessibility**: the message is said through the page\'s `<twig:ui:Announcer>` (politely, the focus stays where it is), so the toast is not a live region of its own. The type is never told by its color alone: the icon says it ("Success", "Error"…). The pointer or the focus on a toast keeps it shown; its close button is reachable with the keyboard.',
          '**Do**: say the result of an action that did not reload the page (a switch saved in a list, a copy, a background task started), in one short sentence. **Don\'t**: use a toast after a reload (a flash message, `<twig:ui:Alert>`, says it), for a question or a choice (a modal), for an error the user must fix in a form (the field\'s error), or for a message that must stay on the page.',
          '**States**: each type, a long message wrapping, several toasts stacked (the newest last), and the stack at the bottom end of the screen, the screen\'s width on a phone.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    type: { control: 'select', options: TOAST_TYPES, description: 'Status of the result' },
    autohide: { control: 'boolean', description: 'Hidden after the delay; never for danger' },
    delay: { control: 'number', description: 'Milliseconds before it hides' },
    content: { control: 'text', description: 'The content block: the message' },
  }, DEFAULTS),
  args: {
    ...DEFAULTS,
    content: 'The status has been successfully updated.',
  },
};

export const Default = withTwig((args) => shown(args));

export const AllTypes = withTwig(() => joinNodes(
  TOAST_TYPES.map((type) => shown({ type, content: SAMPLES[type] })),
  column,
), { docs: { description: { story: 'Each type with its icon in its color; `danger` stays until it is closed.' } } });

export const LongMessage = withTwig(() => shown({
  type: 'warning',
  content: 'This product is saved, but it is not visible in your store yet: it has no price, no image and no category. Add them, then turn it on. A long word breaks inside the toast: https://example.com/admin482k3j9x2qv8mzt0wplq7rhs5ndy6/index.php',
}), { docs: { description: { story: 'A long message wraps; the icon and the close button stay on its first line.' } } });

export const InThePage = withTwig(() => markup(`<div class="${stackClasses({ gap: 'sm' })}">${TOAST_TYPES.map((type) => `<button type="button" class="btn btn-outline-secondary ps-button" data-story-toast="${type}"><span class="ps-button__label">Show a ${type} toast</span></button>`).join('')}</div>`), {
  docs: { description: { story: 'The page\'s stack, as the kit layouts place it: each button asks it for a toast (`ps:toast`). They pile up at the bottom end of the screen, the newest last, and hide after 5 seconds, except `danger`; on a phone they take the screen\'s width.' } },
});

export const Stack = withTwig(() => toastStack(), {
  docs: { description: { story: '`<twig:ui:ToastStack/>`, placed once by the kit layouts: empty on screen, a template of each type for toast.ts.' } },
});
