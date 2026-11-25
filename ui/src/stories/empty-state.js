/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:EmptyState> renders (empty_state.html.twig) and its Twig call, for the EmptyState story and the
// stories that show a list with nothing in it (the grid). icons maps an icon name to its SVG file (?raw from ui/icons).
import uiIcon from './ui-icon';
import { clusterClasses } from './layouts/layout-classes';
import { markup, twigCall } from './twig-snippet';

// EmptyState.php defaults; title is required
export const EMPTY_STATE_DEFAULTS = { icon: null, size: 'md', headingLevel: 2 };

export const EMPTY_STATE_SIZES = ['md', 'sm'];

const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// A <twig:ui:Button> in the actions block: a link when it has an href
export const emptyStateButton = ({ label, variant = 'primary', href = null }) => {
  const html = href
    ? `<a class="btn btn-${variant} ps-button" href="${href}">${label}</a>`
    : `<button class="btn btn-${variant} ps-button" type="button" data-ps-data-busy-label="Loading...">${label}</button>`;
  const props = `${variant === 'primary' ? '' : ` variant="${variant}"`}${href ? ` href="${href}"` : ''}`;

  return { html, twig: `<twig:ui:Button${props}>${label}</twig:ui:Button>` };
};

/**
 * @param {object} props the props and attributes as in Twig: title, icon, size, headingLevel; message is the content
 *   block (HTML), actions the nodes of the actions block
 */
export default function emptyState({
  title, icon = null, size = 'md', headingLevel = 2, message = '', actions = [], ...attributes
}, icons = {}) {
  const classes = ['ps-empty-state', size !== 'md' && `ps-empty-state--${size}`, attributes.class].filter(Boolean).join(' ');
  const extra = Object.entries(attributes).filter(([name]) => name !== 'class').map(([name, value]) => ` ${name}="${escape(value)}"`).join('');
  const iconHtml = icon ? uiIcon(icons[icon], { size: size === 'sm' ? 'lg' : 'xxl', class: 'ps-empty-state__icon' }) : '';
  // As Twig: a message of only spaces is no message
  const hasMessage = message.trim() !== '';
  const messageHtml = hasMessage ? `<div class="ps-empty-state__message">${message}</div>` : '';
  const actionsHtml = actions.length ? `<div class="${clusterClasses({ justify: 'center' })}">${actions.map((node) => node.html).join('')}</div>` : '';
  const children = [];

  if (hasMessage) {
    children.push(markup(message));
  }
  if (actions.length) {
    children.push({ twig: `<twig:block name="actions">\n${actions.map((node) => `  ${node.twig}`).join('\n')}\n</twig:block>` });
  }

  return {
    html: `<div class="${classes}"${extra}>${iconHtml}<h${headingLevel} class="ps-empty-state__title">${escape(title)}</h${headingLevel}>${messageHtml}${actionsHtml}</div>`,
    twig: twigCall('ui:EmptyState', { title, icon, size, headingLevel, ...attributes }, EMPTY_STATE_DEFAULTS, children),
  };
}
