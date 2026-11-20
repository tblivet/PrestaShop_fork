/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:Modal> renders (modal.html.twig) and its Twig call, for the Modal story and the stories that show a
// modal. body and footer are nodes ({html, twig}); the footer goes in <twig:block name="footer">.
import uiIcon from './ui-icon';
import { markup, twigCall } from './twig-snippet';

// Modal.php defaults; id and title are required
export const MODAL_DEFAULTS = { headingLevel: null, icon: null, variant: null, size: 'md', scrollable: true, static: false, closable: true };

const indent = (text) => text.split('\n').map((line) => (line ? `  ${line}` : line)).join('\n');

// A <twig:ui:Button>: the footer buttons of the stories
export const modalButton = ({ label, variant = 'secondary', ...attributes }) => {
  const extra = Object.entries(attributes).map(([name, value]) => ` ${name}="${value}"`).join('');

  return {
    html: `<button class="btn btn-${variant} ps-button" type="button" data-ps-data-busy-label="Loading..."${extra}>${label}</button>`,
    twig: `<twig:ui:Button${variant === 'primary' ? '' : ` variant="${variant}"`}${extra}>${label}</twig:ui:Button>`,
  };
};

// icons maps an icon name to its SVG file, imported with ?raw from ui/icons
export default function modal({
  id, title, headingLevel = null, icon = null, variant = null, size = 'md', scrollable = true, static: isStatic = false, closable = true, body, footer = [], ...attributes
}, icons = {}) {
  const dialog = ['modal-dialog'];
  if (size !== 'md') dialog.push(size === 'fullscreen' ? 'modal-fullscreen' : `modal-${size}`);
  dialog.push('modal-dialog-centered');
  if (scrollable) dialog.push('modal-dialog-scrollable');
  const classes = ['modal', 'fade', 'ps-modal', attributes.class].filter(Boolean).join(' ');
  const state = `${isStatic || !closable ? ' data-bs-backdrop="static"' : ''}${closable ? '' : ' data-bs-keyboard="false"'}`;
  const extra = Object.entries(attributes).filter(([name]) => name !== 'class').map(([name, value]) => ` ${name}="${value}"`).join('');
  const titleTag = headingLevel === null ? 'p' : `h${headingLevel}`;
  const close = closable ? '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' : '';
  const footerHtml = footer.length ? `<div class="modal-footer">${footer.map((node) => node.html).join('')}</div>` : '';
  const children = [body];
  if (footer.length) {
    children.push(markup(`<twig:block name="footer">\n${indent(footer.map((node) => node.twig).join('\n'))}\n</twig:block>`));
  }

  return {
    html: `<div id="${id}" class="${classes}" tabindex="-1" aria-labelledby="${id}-title" aria-hidden="true"${state}${extra}>`
      + `<div class="${dialog.join(' ')}"><div class="modal-content">`
      + `<div class="modal-header">${icon ? `<span class="ps-modal__icon ps-modal__icon--${variant ?? 'info'}">${uiIcon(icons[icon], { size: 'lg' })}</span>` : ''}`
      + `<${titleTag} class="modal-title ps-modal__title" id="${id}-title">${title}</${titleTag}>${close}</div>`
      + `<div class="modal-body">${body.html}</div>${footerHtml}`
      + '</div></div></div>',
    twig: twigCall('ui:Modal', {
      id, title, headingLevel, icon, variant, size, scrollable, static: isStatic, closable, ...attributes,
    }, MODAL_DEFAULTS, children),
  };
}
