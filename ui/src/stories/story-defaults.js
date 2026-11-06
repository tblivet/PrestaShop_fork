/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// A Twig component story declares its component's defaults once (DEFAULTS, same values as the PHP props, checked by
// ui/.ai/bin/story-parity.mjs): they fill the "Default" column of the controls table and the story args.
const summary = (value) => (typeof value === 'string' ? value : JSON.stringify(value));

export const withDefaults = (argTypes, defaults) => Object.fromEntries(Object.entries(argTypes).map(([name, argType]) => [
  name,
  name in defaults && defaults[name] !== null
    ? { ...argType, table: { ...argType.table, defaultValue: { summary: summary(defaults[name]) } } }
    : argType,
]));
