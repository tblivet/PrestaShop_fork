/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */

// Renders an icon file from ui/icons the way <twig:ux:icon> does in the back office, so stories show the same markup.
// Usage: uxIcon(xCircleFill, { width: 16, height: 16, class: 'flex-shrink-0', 'aria-hidden': 'true' })
export default function uxIcon(svg, attributes = {}) {
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  const content = svg.replace(/^[\s\S]*?<svg[^>]*>|<\/svg>\s*$/g, '');
  const attrs = Object.entries({ width: attributes.width, height: attributes.height, viewBox, fill: 'currentColor' })
    .concat(Object.entries(attributes).filter(([name]) => !['width', 'height'].includes(name)))
    .filter(([, value]) => value !== undefined)
    .map(([name, value]) => `${name}="${value}"`)
    .join(' ');

  return `<svg ${attrs}>${content}</svg>`;
}
