/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Design tokens: the colour palettes, the theme colours built on them, the surface and text tokens, the subtle trios,
// each shown where the kit uses it. Values are read from the page (CSS variables, prefix psk-), so they follow
// _variables.scss, _maps.scss and _custom.scss.
import alert from '../alert';
import badge from '../badge';
import kpi from '../kpi';
import { contrast, hex, inkOn, rating, token } from './color-swatch';

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

// Each palette, its base step (the $name in _variables.scss) and what the kit does with it
const PALETTES = [
  { name: 'gray', base: null, use: 'Borders (400), placeholders (400), surfaces (50–200), muted text (600), body text (800).' },
  { name: 'primary', base: 500, use: 'The brand ($gray-800), near black: primary buttons, links, focus rings at 50%; its own steps around it.' },
  { name: 'secondary', base: 500, use: '$gray-600: secondary buttons and muted text; its own steps around it.' },
  { name: 'red', base: 500, use: 'Danger and destructive: errors, delete buttons.' },
  { name: 'yellow', base: 500, use: 'Warning.' },
  { name: 'green', base: 500, use: 'Success; the fourth KPI colour.' },
  { name: 'blue', base: 500, use: 'Info.' },
  { name: 'oceanblue', base: 500, use: 'Category colour: badges, the first KPI colour.' },
  { name: 'purple', base: 500, use: 'Category colour: badges, the second KPI colour.' },
  { name: 'amber', base: 500, use: 'Category colour: badges, the third KPI colour.' },
];

const swatch = (name, step, base) => {
  const variable = `${name}-${step}`;
  const background = `var(${token(variable)})`;
  const ink = inkOn(background);

  return `
    <div style="background:${background};color:${ink};padding:.5rem;min-height:5.5rem;display:flex;flex-direction:column;justify-content:space-between;${step === base ? 'box-shadow:inset 0 0 0 2px currentColor;' : ''}" title="var(${token(variable)})">
      <strong style="font-size:.875rem">${step}${step === base ? ' · base' : ''}</strong>
      <span style="font-family:var(${token('font-monospace')});font-size:.6875rem;line-height:1.4">${hex(variable)}<br>Aa ${rating(contrast(background, ink))}</span>
    </div>`;
};

const intro = (text) => `<p class="text-body-secondary small" style="max-width:48rem">${text}</p>`;

export default {
  title: 'Design Tokens/Colors',
  parameters: {
    docs: {
      description: {
        component: 'The back office colours (no dark mode, DECISIONS.md #5). Use the theme colours and the tokens in components; a palette step only for what has no token (a category colour, a line). In SCSS `$oceanblue-600`, in CSS `var(--psk-oceanblue-600)`. Each swatch gives its value and the contrast of text on it (WCAG: 4.5:1 for text, 3:1 for large text and shapes).',
      },
    },
  },
};

export const Palettes = {
  render: () => `
    ${intro('Ten steps a palette, 50 the lightest. The framed step is the base colour (<code>$red</code>, <code>$oceanblue</code>…). Text on each swatch is the colour that reads best on it, white or the body text, with its contrast.')}
    ${PALETTES.map(({ name, base, use }) => `
      <section style="margin-block-end:1.5rem">
        <h3 class="h6" style="margin-block-end:.25rem;text-transform:capitalize">${name}</h3>
        <p class="small text-body-secondary" style="margin-block-end:.5rem">${use}</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(5.5rem,1fr))">
          ${STEPS.map((step) => swatch(name, step, base)).join('')}
        </div>
      </section>`).join('')}
  `,
};

// The theme colours and the components they drive
const THEME = [
  { name: 'primary', source: '$gray-800, the brand', button: 'primary' },
  { name: 'secondary', source: '$gray-600', button: 'secondary' },
  { name: 'success', source: '$green' },
  { name: 'danger', source: '$red' },
  { name: 'warning', source: '$yellow' },
  { name: 'info', source: '$blue' },
  { name: 'destructive', source: '$red (_maps.scss)', button: 'destructive' },
];

export const ThemeColors = {
  render: () => `
    ${intro('Bootstrap\'s theme colours, from the palettes. They drive the variants of the components: <code>.btn-primary</code>, <code>&lt;twig:ui:Badge variant="success"&gt;</code>, <code>&lt;twig:ui:Alert type="danger"&gt;</code>. On each, the text that reads best (white, or dark on warning) and its contrast.')}
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(14rem,1fr));gap:1rem">
      ${THEME.map(({ name, source, button }) => `
        <div class="card">
          <div style="background:var(${token(name)});color:${inkOn(`var(${token(name)})`)};padding:1rem;min-height:5rem">
            <strong>${name}</strong><br>
            <span style="font-family:var(${token('font-monospace')});font-size:.75rem">${hex(name)} · ${inkOn(`var(${token(name)})`) === '#fff' ? 'white' : 'dark'} text ${rating(contrast(`var(${token(name)})`, inkOn(`var(${token(name)})`)))}</span>
          </div>
          <div class="card-body">
            <p class="small text-body-secondary" style="margin-block-end:.75rem"><code>var(${token(name)})</code> · ${source}</p>
            <div style="display:flex;flex-wrap:wrap;gap:.5rem;align-items:center">
              ${button ? `<button type="button" class="btn btn-${button} btn-sm">Button</button>` : ''}
              ${name === 'destructive' ? '' : badge({ label: 'Badge', variant: name }).html}
              <span style="color:var(${token(`${name}-text-emphasis`)})">Text</span>
            </div>
          </div>
        </div>`).join('')}
    </div>
  `,
};

export const SurfaceAndText = {
  name: 'Surface & Text',
  render: () => {
    const rows = [
      ['body-bg', 'Page and component background'],
      ['secondary-bg', 'Muted surface: disabled inputs'],
      ['tertiary-bg', 'Subtle surface: table stripes, page background'],
      ['body-color', 'Body text'],
      ['emphasis-color', 'Headings, strong text'],
      ['secondary-color', 'Muted text: help, subtitles'],
      ['tertiary-color', 'Placeholders'],
      ['border-color', 'Borders and dividers ($gray-400)'],
      ['link-color', 'Links'],
    ];

    return `
    ${intro('The tokens a component takes its background, text and borders from: prefer them to a palette step.')}
    <div class="card" style="max-width:32rem;margin-block-end:1.5rem">
      <div class="card-body">
        <h3 class="h5" style="color:var(${token('emphasis-color')})">A card on the page</h3>
        <p style="color:var(${token('body-color')})">Body text in <code>--psk-body-color</code>, with a <a href="#colors">link</a>.</p>
        <p class="small" style="color:var(${token('secondary-color')});margin-block-end:.75rem">Help text in <code>--psk-secondary-color</code>.</p>
        <input class="form-control" placeholder="Placeholder in --psk-tertiary-color" aria-label="Example">
      </div>
    </div>
    <table class="table table-bordered table-sm align-middle">
      <thead><tr><th scope="col">Token</th><th scope="col" style="width:4rem">Colour</th><th scope="col">Value</th><th scope="col">Text on white</th><th scope="col">Use</th></tr></thead>
      <tbody>
        ${rows.map(([name, use]) => `
          <tr>
            <td><code class="small">var(${token(name)})</code></td>
            <td><div style="background:var(${token(name)});height:2rem;border:1px solid var(${token('border-color')})"></div></td>
            <td><code class="small">${hex(name)}</code></td>
            <td class="small">${name.endsWith('bg') ? '—' : rating(contrast(`var(${token(name)})`, '#fff'))}</td>
            <td class="small text-body-secondary">${use}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
  },
};

const SUBTLE = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];

export const SubtleVariants = {
  name: 'Subtle Variants',
  render: () => `
    ${intro('Each theme colour has a trio used together: <code>-bg-subtle</code> for the surface, <code>-border-subtle</code> for its edge, <code>-text-emphasis</code> for the text on it. Alerts are built on it; the contrast is the text\'s on its surface.')}
    <div style="display:grid;gap:.75rem;max-width:48rem;margin-block-end:1.5rem">
      ${SUBTLE.map((name) => alert({ type: name, content: `<strong>${name}</strong> · text ${rating(contrast(`var(${token(`${name}-text-emphasis`)})`, `var(${token(`${name}-bg-subtle`)})`))} on its surface` }).html).join('')}
    </div>
    <table class="table table-bordered table-sm align-middle">
      <thead><tr><th scope="col">Colour</th><th scope="col">-bg-subtle</th><th scope="col">-border-subtle</th><th scope="col">-text-emphasis</th></tr></thead>
      <tbody>
        ${SUBTLE.map((name) => `
          <tr>
            <th scope="row" class="small">${name}</th>
            ${['bg-subtle', 'border-subtle', 'text-emphasis'].map((part) => `
              <td><span style="display:inline-block;width:1rem;height:1rem;vertical-align:middle;background:var(${token(`${name}-${part}`)});border:1px solid var(${token('border-color')})"></span> <code class="small">${hex(`${name}-${part}`)}</code></td>`).join('')}
          </tr>`).join('')}
      </tbody>
    </table>
  `,
};

export const CategoryColors = {
  name: 'Category Colours',
  render: () => `
    ${intro('Oceanblue, purple, amber and green tell items of the same kind apart, without meaning a status: a KPI from the others of its row (its 600 line, or green 300, its 100 tint, its 800 icon), a badge. Their <code>-bg-subtle</code> is the 100 step.')}
    <div class="ps-kpi-row ps-kpi-row--4" style="margin-block-end:1.5rem">
      ${[['oceanblue', 'Conversion Rate', '1.8%', 'monitoring'], ['purple', 'Abandoned Carts', '12', 'remove_shopping_cart'], ['amber', 'Average Order Value', '€45.20', 'account_balance_wallet'], ['green', 'Net Profit per Visit', '€3.10', 'account_box']]
    .map(([color, title, value, icon]) => kpi({ title, value, subtitle: '30 days', icon, color }).html).join('')}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:.5rem">
      ${['oceanblue', 'purple', 'amber'].map((variant) => badge({ label: variant, variant }).html).join('')}
    </div>
  `,
};
