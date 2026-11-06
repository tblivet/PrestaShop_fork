/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Twig: <twig:ui:Layout:Cluster> (src/PrestaShopBundle/Twig/Component/Ui/Layout/Cluster.php) renders this markup, keep both in sync.
import { GAPS, clusterClasses } from './layout-classes';
import { markup, twigCall, withTwig } from '../twig-snippet';
import { withDefaults } from '../story-defaults';

const button = (label, variant = 'outline-secondary') => `<button type="button" class="btn btn-${variant}">${label}</button>`;
const badge = (label) => `<span class="badge text-bg-secondary">${label}</span>`;

// Cluster.php defaults
const DEFAULTS = { gap: 'sm', justify: 'start', align: 'center', wrap: true, stackBelow: 'none', as: 'div' };

export default {
  title: 'Layouts/Cluster',
  parameters: {
    docs: {
      description: {
        component: [
          '**Twig usage**: `<twig:ui:Layout:Cluster justify="end">…items…</twig:ui:Layout:Cluster>`. Places items side by side, wrapping onto the next line when there is no room.',
          '**Props**: `gap` (`none`, `xs`, `sm`, `md`, `lg`, `xl`: Bootstrap spacers 0 to 5, the same scale as every layout; default `sm`), `justify` (`start`, `end`, `between`, `center`; default `start`), `align` (`center`, `start`, `baseline`, `end`; default `center`), `wrap` (default `true`; `false` keeps one line), `stackBelow` (`none`, `sm`, `md`; default `none`: below that breakpoint the items stack full width, in reading order), `as` (`div`, `ul`, `ol`; default `div`). Other attributes (`id`, `class`, `data-ps-*`, `aria-*`) go on the cluster.',
          '**Compose clusters for groups**: a cluster has no slots. When a row splits into groups, each group is a cluster and an outer cluster places the groups: `justify="between"` pushes them to both ends, and its `gap` separates the groups while each inner `gap` spaces their items. A modal or form footer with Delete on the left and Cancel, Save on the right:',
          '```twig\n<twig:ui:Layout:Cluster justify="between">\n  <twig:ui:Layout:Cluster>\n    <button type="button" class="btn btn-outline-danger">Delete</button>\n  </twig:ui:Layout:Cluster>\n  <twig:ui:Layout:Cluster>\n    <button type="button" class="btn btn-outline-secondary">Cancel</button>\n    <button type="submit" class="btn btn-primary">Save</button>\n  </twig:ui:Layout:Cluster>\n</twig:ui:Layout:Cluster>\n```',
          'When the row is too narrow, a whole group moves to the next line and keeps its buttons together. The same pattern builds a grid toolbar (tools on the left, the main action on the right) or a header (title and badges on the left, actions on the right).',
          '**Do**: card and modal footers (Cancel, Save), toolbars, filters, a row of badges or links; keep the DOM order the reading order, the main action last. **Don\'t**: reverse the order on small screens (focus would no longer follow what is seen), use floats or `ms-auto` on a child (use `justify`, or nest clusters), or stack page blocks with it (that is `ui:Layout:Stack`).',
          '**States**: each justify, footer actions stacking on mobile, nested clusters in a modal footer (also stacking on mobile) and a toolbar, wrapping with long labels, inline badges aligned on the baseline, as a list.',
        ].join('\n\n'),
      },
    },
  },
  argTypes: withDefaults({
    gap: { control: 'select', options: Object.keys(GAPS), description: 'Space between items' },
    justify: { control: 'select', options: ['start', 'end', 'between', 'center'], description: 'Where the items sit on the line' },
    align: { control: 'select', options: ['center', 'start', 'baseline', 'end'], description: 'Vertical alignment of the items' },
    wrap: { control: 'boolean', description: 'Wrap onto the next line when there is no room' },
    stackBelow: { control: 'select', options: ['none', 'sm', 'md'], description: 'Below this breakpoint, one full-width item per line' },
    as: { control: 'select', options: ['div', 'ul', 'ol'], description: 'Element of the cluster' },
  }, DEFAULTS),
  args: DEFAULTS,
};

// The markup of cluster.html.twig and the Twig call that renders it; extraClass is a class passed through the attributes
const cluster = ({ as = 'div', extraClass = '', ...props }, items) => {
  const list = as === 'ul' || as === 'ol';
  const nodes = items
    .map((item) => (typeof item === 'string' ? markup(item) : item))
    .map((node) => (list ? { html: `<li>${node.html}</li>`, twig: `<li>${node.twig}</li>` } : node));

  return {
    html: `<${as} class="${clusterClasses(props)}${list ? ' list-unstyled mb-0' : ''}${extraClass ? ` ${extraClass}` : ''}">${nodes.map((node) => node.html).join('')}</${as}>`,
    twig: twigCall('ui:Layout:Cluster', { ...props, as, class: extraClass }, DEFAULTS, nodes),
  };
};

const modal = (footer) => ({
  html: `
    <div class="modal position-static d-block" tabindex="-1">
      <div class="modal-dialog m-0">
        <div class="modal-content">
          <div class="modal-header"><h2 class="modal-title h5">Edit address</h2></div>
          <div class="modal-body"><p class="mb-0">The address is used by 3 orders.</p></div>
          <div class="modal-footer">${footer.html}</div>
        </div>
      </div>
    </div>`,
  twig: `<div class="modal-footer">\n  ${footer.twig.split('\n').join('\n  ')}\n</div>`,
  rendered: `<div class="modal-footer">${footer.html}</div>`,
});

export const Default = withTwig((args) => cluster(args, [button('Cancel'), button('Save draft'), button('Save', 'primary')]));

export const Justify = withTwig(() => {
  const clusters = ['start', 'end', 'between', 'center'].map((justify) => ({ justify, node: cluster({ justify }, [button('Cancel'), button('Save', 'primary')]) }));

  return {
    html: clusters.map(({ justify, node }) => `
      <p class="small text-body-secondary mb-1">justify="${justify}"</p>
      <div class="border p-2">${node.html}</div>`).join(''),
    twig: clusters.map(({ node }) => node.twig).join('\n\n'),
    rendered: clusters.map(({ node }) => node.html).join(''),
  };
});

export const FooterStackingOnMobile = {
  args: { justify: 'end', stackBelow: 'sm' },
  ...withTwig((args) => {
    const node = cluster(args, [button('Cancel'), button('Send reset link', 'primary')]);

    return {
      html: `<p class="small text-body-secondary">Narrow the viewport under 576 px: the buttons stack full width, Cancel first, like the focus order.</p>${node.html}`,
      twig: node.twig,
      rendered: node.html,
    };
  }),
};

export const ModalFooter = withTwig(() => modal(cluster({ justify: 'between', extraClass: 'flex-grow-1' }, [
  cluster({}, [button('Delete', 'outline-danger')]),
  cluster({}, [button('Cancel'), button('Save', 'primary')]),
])), { docs: { description: { story: 'Nested clusters: the outer one (`justify="between"`, `flex-grow-1` to fill the footer) places two groups. Narrow the canvas: Cancel and Save move to the next line together.' } } });

export const ModalFooterStackingOnMobile = withTwig(() => modal(cluster({ justify: 'between', stackBelow: 'sm', extraClass: 'flex-grow-1' }, [
  cluster({ stackBelow: 'sm' }, [button('Delete', 'outline-danger')]),
  cluster({ stackBelow: 'sm' }, [button('Cancel'), button('Save', 'primary')]),
])), { docs: { description: { story: '`stackBelow="sm"` on the outer cluster and on each group: under 576 px every button takes a full line, in reading order (Delete, Cancel, Save); from 576 px the row comes back. Both levels are needed, otherwise Cancel and Save stay side by side.' } } });

export const Toolbar = withTwig(() => cluster({ justify: 'between', gap: 'md' }, [
  cluster({}, [button('Bulk actions'), button('Export')]),
  cluster({}, [button('Add new customer', 'primary')]),
]), { docs: { description: { story: 'Tools on the left, the main action on the right: the same nesting, with a larger gap between the groups than inside them.' } } });

export const Wrapping = withTwig(() => {
  const node = cluster({}, [button('Annuler'), button('Enregistrer et rester'), button('Envoyer un lien de réinitialisation', 'primary')]);

  return { html: `<div style="max-width: 20rem" class="border p-2">${node.html}</div>`, twig: node.twig, rendered: node.html };
});

export const BaselineBadges = {
  args: { align: 'baseline', gap: 'xs' },
  ...withTwig((args) => cluster(args, ['<h2 class="h5 mb-0">Order #42</h2>', badge('Paid'), badge('Shipped')])),
};

export const AsList = {
  args: { as: 'ul', gap: 'md' },
  ...withTwig((args) => cluster(args, ['<a href="#">Documentation</a>', '<a href="#">Forum</a>', '<a href="#">Training</a>'])),
};
