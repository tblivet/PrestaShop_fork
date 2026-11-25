/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Story chrome for the colour stories: the kit's CSS variables ($prefix psk-, _variables.scss), their resolved value
// and the contrast of text on them (WCAG), read from the page so they follow the SCSS.

export const token = (name) => `--psk-${name}`;

// The colour a CSS value resolves to, as [r, g, b] (any syntax: hex, rgb(), var())
const rgb = (value) => {
  const probe = document.createElement('span');

  probe.style.color = value;
  document.body.append(probe);
  const channels = getComputedStyle(probe).color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [0, 0, 0];
  probe.remove();

  return channels;
};

const luminance = ([r, g, b]) => {
  const linear = (channel) => {
    const value = channel / 255;

    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
};

export const contrast = (a, b) => {
  const [light, dark] = [luminance(rgb(a)), luminance(rgb(b))].sort((x, y) => y - x);

  return (light + 0.05) / (dark + 0.05);
};

export const hex = (name) => `#${rgb(`var(${token(name)})`).map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;

// The text colour that reads best on a background: white or the body text
export const inkOn = (background) => (contrast(background, '#fff') >= contrast(background, `var(${token('body-color')})`) ? '#fff' : `var(${token('body-color')})`);

// "4.8:1 AA": the contrast and the WCAG level it reaches for normal text
export const rating = (ratio) => {
  let level = 'fails';

  if (ratio >= 7) {
    level = 'AAA';
  } else if (ratio >= 4.5) {
    level = 'AA';
  } else if (ratio >= 3) {
    level = 'AA large';
  }

  return `${ratio.toFixed(1)}:1 ${level}`;
};
