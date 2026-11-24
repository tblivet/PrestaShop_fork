/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:ShowcaseModal> renders (showcase_modal.html.twig) and its Twig call, for the ShowcaseModal story
// and the playground pages. text is the content block (HTML); actions, a node {html, twig}, the actions block.
import openInNew from '../../icons/material-symbols/open-in-new.svg?raw';
import modal, { modalButton } from './modal';
import uiIcon from './ui-icon';
import { markup, twigCall } from './twig-snippet';

// ShowcaseModal.php defaults; name, title and image are required
export const SHOWCASE_MODAL_DEFAULTS = { learnMore: null };

// path('admin_close_showcase_card'), as the tests render it
const CLOSE_URL = '/configure/showcase-card/close';

export default function showcaseModal({ name, title, image, learnMore = null, text, actions = null }) {
  const link = learnMore
    ? `<a href="${learnMore}" class="icon-link icon-link-hover" target="_blank" rel="noopener noreferrer">Learn more<span class="visually-hidden"> (opens in a new tab)</span>${uiIcon(openInNew, { size: 'lg' })}</a>`
    : '';
  const node = modal({
    id: `ps-showcase-${name.replace(/_/g, '-')}`,
    title,
    headingLevel: 2,
    static: true,
    'data-ps-ref': 'showcase-modal',
    'data-ps-data-name': name,
    'data-ps-data-close-url': CLOSE_URL,
    body: markup(`<div class="ps-showcase"><img class="ps-showcase__image" src="${image}" alt=""><div class="ps-showcase__text">${text}${link}</div></div>`),
    footer: [...(actions ? [actions] : []), modalButton({ label: 'Got it', variant: 'primary', 'data-bs-dismiss': 'modal' })],
  });

  return {
    html: node.html,
    twig: twigCall('ui:ShowcaseModal', { name, title, image, learnMore }, SHOWCASE_MODAL_DEFAULTS, [
      markup(text),
      ...(actions ? [markup(`<twig:block name="actions">\n  ${actions.twig}\n</twig:block>`)] : []),
    ]),
  };
}
