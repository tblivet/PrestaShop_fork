/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// The markup <twig:ui:Icon> renders (icon.html.twig), for stories that show an icon: pass the SVG file (imported with
// ?raw from ui/icons) and the same props as in Twig.
// Usage: uiIcon(arrowBack, { size: 'lg', flipRtl: true })
import uxIcon from './ux-icon';

export default function uiIcon(svg, { label = null, size = 'md', flipRtl = false, class: extra = '', ...attributes } = {}) {
  const classes = ['ps-icon', size !== 'md' && `ps-icon--${size}`, flipRtl && 'ps-icon--flip-rtl', extra].filter(Boolean).join(' ');
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' };

  return uxIcon(svg, { width: '1em', height: '1em', ...attributes, class: classes, ...a11y });
}
