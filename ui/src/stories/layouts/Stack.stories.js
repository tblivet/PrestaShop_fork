/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:Layout:Stack> (src/PrestaShopBundle/Twig/Component/Ui/Layout/Stack.php) renders this markup, keep both in sync.
import { GAPS, stackClasses } from './layout-classes';
import { markup, twigCall, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

const box = (text) => `<div class="p-3 border bg-body-tertiary">${text}</div>`;

// Stack.php defaults
const DEFAULTS = { gap: 'md', align: 'stretch', as: 'div' };

export default {
  title: 'Layouts/Stack',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:Layout:Stack gap="lg">…blocks…</twig:ui:Layout:Stack>`. Places blocks one under the other with one gap; the blocks keep their own look. Renders its own BEM classes (`layout/_stack.scss`): the block, then one modifier per prop away from its default (`ps-stack--gap-lg`); its direct children lose their block margins, so a `p` or a heading needs no `mb-0`.',
          '**Props**: `gap` (`none`, `xs`, `sm`, `md`, `lg`, `xl`: Bootstrap spacers 0 to 5, the same scale as every layout; default `md`), `align` (`stretch`, `start`, `center`, `end`; default `stretch`: every block takes the full width), `as` (`div`, `section`, `ul`, `ol`; default `div`; a list when the blocks are a list, then each block is an `<li>`). Other attributes (`id`, `data-ps-*`, `aria-*`) go on the stack.',
          '**Do**: wrap page blocks, card bodies and form groups in a stack instead of putting `mb-3` or `mt-3` on them; nest stacks for a different gap inside a block. **Don\'t**: style the children through the stack, give a child its own outer margin, or use it for a row of buttons (that is `ui:Layout:Cluster`).',
          '**States**: each gap, each alignment, as a list, a long unbreakable word (the stack never grows wider than its parent), nested stacks.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    gap: { control: 'select', options: Object.keys(GAPS), description: 'Space between blocks' },
    align: { control: 'select', options: ['stretch', 'start', 'center', 'end'], description: 'Horizontal alignment of the blocks' },
    as: { control: 'select', options: ['div', 'section', 'ul', 'ol'], description: 'Element of the stack' },
  }, DEFAULTS),
  args: DEFAULTS,
};

// The markup of stack.html.twig; in Twig the caller writes the <li> of a list
const stack = ({ as = 'div', ...props }, items) => {
  const list = as === 'ul' || as === 'ol';
  const nodes = items
    .map((item) => (typeof item === 'string' ? markup(item) : item))
    .map((node) => (list ? { html: `<li>${node.html}</li>`, twig: `<li>${node.twig}</li>` } : node));

  return {
    html: `<${as} class="${stackClasses({ ...props, as })}">${nodes.map((node) => node.html).join('')}</${as}>`,
    twig: twigCall('ui:Layout:Stack', { ...props, as }, DEFAULTS, nodes),
  };
};

export const Default = withTwig((args) => stack(args, [box('First block'), box('Second block'), box('Third block')]));

export const Gaps = withTwig(() => {
  const stacks = Object.keys(GAPS).map((gap) => ({ gap, node: stack({ gap }, [box('Block'), box('Block')]) }));

  return {
    html: stacks.map(({ gap, node }) => `
      <p class="small text-body-secondary mb-1">gap="${gap}"</p>
      ${node.html}`).join('<hr>'),
    twig: stacks.map(({ node }) => node.twig).join('\n\n'),
    rendered: stacks.map(({ node }) => node.html).join(''),
  };
});

export const AsList = {
  args: { as: 'ul', gap: 'sm' },
  ...withTwig((args) => stack(args, [box('Delete the /install folder.'), box('Rename the /admin folder.')])),
};

export const LongContent = withTwig(() => {
  const node = stack({}, [
    box('Rename the /admin folder, for example to <code>admin482k3j9x2qv8mzt0wpl/</code>.'),
    '<button type="button" class="btn btn-primary">Check again</button>',
  ]);

  return { html: `<div style="max-width: 16rem">${node.html}</div>`, twig: node.twig, rendered: node.html };
});

export const Nested = withTwig(() => stack({ gap: 'xl', as: 'section' }, [
  stack({ gap: 'sm' }, [box('Group 1, block 1'), box('Group 1, block 2')]),
  stack({ gap: 'sm' }, [box('Group 2, block 1'), box('Group 2, block 2')]),
]));
