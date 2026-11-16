/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Playground HTML marks icons as <!-- ui:Icon name prop=value flag … -->, rendered like <twig:ui:Icon> in the back office.
// icons maps each name used to its SVG file, imported with ?raw from ui/icons.
import uiIcon from '../stories/ui-icon';

export const expandIcons = (html, icons) => html.replace(/<!-- ui:Icon (\S+)((?: [\w-]+(?:="[^"]*")?)*) -->/g, (_, name, props) => uiIcon(
  icons[name],
  Object.fromEntries([...props.matchAll(/ ([\w-]+)(?:="([^"]*)")?/g)].map(([, prop, value]) => [prop, value ?? true])),
));
