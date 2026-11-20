/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:Announcer> renders (announcer.html.twig) and its Twig call, for the Announcer story and the
// region the Storybook preview keeps in every story, as the kit layouts do in every page
import { twigCall } from './twig-snippet';

export const ANNOUNCER_DEFAULTS = {};

export default function announcer(attributes = {}) {
  const { class: extraClass, ...rest } = attributes;
  const classes = ['visually-hidden', extraClass].filter(Boolean).join(' ');
  const extra = Object.entries(rest).map(([name, value]) => ` ${name}="${value}"`).join('');

  return {
    html: `<div class="${classes}" role="status" aria-atomic="true" data-ps-target="announcer"${extra}></div>`,
    twig: twigCall('ui:Announcer', attributes, ANNOUNCER_DEFAULTS),
  };
}
