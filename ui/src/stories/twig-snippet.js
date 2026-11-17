/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Builds a story's HTML and the <twig:ui:*> call that renders it from the same content, so both always match.
// A node is { html, twig }; plain markup (a button, a paragraph) is the same in both. A story's build may add:
// - rendered: the HTML the Twig code renders, when html adds story labels or a frame around it (default: html)
// - session: what the render reads from the session, e.g. { flashes: { success: ['Saved'] } }
// ui/.ai/bin/story-markup.mjs snapshots them; StoryMarkupTest renders each Twig call and compares it with the HTML.

const indent = (text) => text.split('\n').map((line) => (line ? `  ${line}` : line)).join('\n');

export const markup = (html) => ({ html, twig: html });

// A JS value as a Twig literal, as a developer writes it in a bound prop: [a, b], {key: value}, 'text'
const twigLiteral = (value) => {
  if (Array.isArray(value)) {
    return `[${value.map(twigLiteral).join(', ')}]`;
  }

  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value).filter(([, item]) => item !== undefined);

    return `{${entries.map(([key, item]) => `${/^[A-Za-z_]\w*$/.test(key) ? key : twigLiteral(key)}: ${twigLiteral(item)}`).join(', ')}}`;
  }

  if (typeof value === 'string') {
    return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  }

  return String(value);
};

// Props equal to their default are left out, like a developer would write the call; true booleans are bare, false ones,
// numbers, arrays and objects are bound (:name="…")
const twigAttributes = (props, defaults) => Object.entries(props)
  .filter(([name, value]) => value !== undefined && value !== '' && JSON.stringify(value) !== JSON.stringify(defaults[name]))
  .map(([name, value]) => {
    if (typeof value === 'boolean') {
      return value ? ` ${name}` : ` :${name}="false"`;
    }

    if (typeof value === 'number' || (value !== null && typeof value === 'object')) {
      return ` :${name}="${twigLiteral(value)}"`;
    }

    return ` ${name}="${value}"`;
  })
  .join('');

/**
 * The Twig call of a component around its children.
 * @param {string} name component name, e.g. 'ui:Layout:Cluster'
 * @param {object} props props and attributes as passed in Twig (class, id, aria-*…)
 * @param {object} defaults the component's default props
 * @param {Array<{twig: string}>} children none: a self-closing call
 */
export const twigCall = (name, props, defaults, children = []) => {
  const tag = `twig:${name}`;

  if (children.length === 0) {
    return `<${tag}${twigAttributes(props, defaults)}/>`;
  }

  const content = children.map((child) => child.twig).join('\n');

  return `<${tag}${twigAttributes(props, defaults)}>\n${indent(content)}\n</${tag}>`;
};

// Several calls shown one after the other (a story with several alerts)
export const joinNodes = (nodes, htmlWrapper = (html) => html) => ({
  html: htmlWrapper(nodes.map((node) => node.html).join('')),
  twig: nodes.map((node) => node.twig).join('\n\n'),
  rendered: nodes.map((node) => node.rendered ?? node.html).join(''),
});

// Story chrome: labels or a frame around each node, kept out of what the Twig code is compared with
export const framedNodes = (nodes, frame) => ({
  html: nodes.map((node, index) => frame(node.html, index)).join(''),
  twig: nodes.map((node) => node.twig).join('\n\n'),
  rendered: nodes.map((node) => node.html).join(''),
});

// Story fields from one builder: render gives the HTML, parameters.twig the Twig call shown under it in "Show code",
// parameters.twigParity what the markup parity test compares
export const withTwig = (build, parameters = {}) => ({
  render: (args) => build(args).html,
  parameters: {
    ...parameters,
    twig: (args) => build(args).twig,
    twigParity: (args) => {
      const { html, twig, rendered, session } = build(args);

      return { twig, html: rendered ?? html, session: session ?? {} };
    },
  },
});
