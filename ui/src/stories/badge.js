/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:Badge> renders (badge.html.twig) and its Twig call, for the Badge story and the stories that show
// a badge. icons maps an icon name to its SVG file, imported with ?raw from ui/icons.
import uiIcon from './ui-icon';
import { markup, twigCall } from './twig-snippet';

// Badge.php defaults
export const BADGE_DEFAULTS = { variant: 'primary', icon: null, pill: false, counter: false };

export default function badge({ label, variant = 'primary', icon = null, pill = false, counter = false, ...attributes }, icons = {}) {
  const classes = ['badge', 'ps-badge', `ps-badge--${variant}`, pill && 'ps-badge--pill', counter && 'ps-badge--counter', attributes.class].filter(Boolean).join(' ');
  const extra = Object.entries(attributes).filter(([name]) => name !== 'class').map(([name, value]) => ` ${name}="${value}"`).join('');
  const iconHtml = icon ? uiIcon(icons[icon], { class: 'ps-badge__icon' }) : '';

  return {
    html: `<span class="${classes}"${extra}>${iconHtml}${label}</span>`,
    twig: twigCall('ui:Badge', { variant, icon, pill, counter, ...attributes }, BADGE_DEFAULTS, [markup(label)]),
  };
}
