/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// A Twig component story declares its component's defaults once (DEFAULTS, same values as the PHP props, checked by
// ui/.ai/bin/story-parity.mjs): they fill the "Default" column of the controls table and the story args. A null default
// (not set) leaves the column at "-", whatever the control, so every optional prop reads the same.
const summary = (value) => (typeof value === 'string' ? value : JSON.stringify(value));

export const withDefaults = (argTypes, defaults) => Object.fromEntries(Object.entries(argTypes).map(([name, argType]) => [
  name,
  name in defaults && defaults[name] !== null
    ? { ...argType, table: { ...argType.table, defaultValue: { summary: summary(defaults[name]) } } }
    : argType,
]));

// A prop whose PHP default is null (not set): the select shows "none", Storybook hands the story null (mapping), so
// the story renders and prints exactly what Twig gets. Its arg is NONE, the control's own value. Options are labels:
// pass a { label: value } object for values that are not strings (numbers would be listed before "none").
export const NONE = 'none';

export const nullableSelect = (options, description) => {
  const mapping = Array.isArray(options) ? {} : options;

  return {
    control: 'select',
    options: [NONE, ...(Array.isArray(options) ? options : Object.keys(options))],
    mapping: { [NONE]: null, ...mapping },
    description,
  };
};
