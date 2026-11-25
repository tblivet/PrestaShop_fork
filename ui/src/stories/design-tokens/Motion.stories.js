/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Design tokens — transition / motion variables
// Source: src/scss/_custom.scss · src/scss/_variables.scss
// ⚠ Keep in sync with _variables.scss whenever $transition-duration or $transition-easing change.

const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '—';

export default {
  title: 'Design Tokens/Motion',
};

export const TransitionTokens = {
  name: 'Transition Tokens',
  render: () => `
    <p class="text-body-secondary small mb-4">
      Custom transition variables exposed at <code>:root</code> in
      <code>src/scss/_custom.scss</code>. Defined in
      <code>src/scss/_variables.scss</code> as
      <code>$transition-duration</code> and <code>$transition-easing</code>.
      Combine them for consistent motion across all custom components.
    </p>

    <table class="table table-bordered table-sm align-middle mb-5">
      <thead class="table-light">
        <tr>
          <th>CSS variable</th>
          <th>Resolved value</th>
          <th>SCSS source</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code class="small">var(--psk-transition-duration)</code></td>
          <td><code class="small">${cssVar('--psk-transition-duration')}</code></td>
          <td><code class="small text-body-secondary">$transition-duration</code></td>
          <td class="small text-body-secondary">Standard interaction duration — fast enough to feel responsive</td>
        </tr>
        <tr>
          <td><code class="small">var(--psk-transition-easing)</code></td>
          <td><code class="small">${cssVar('--psk-transition-easing')}</code></td>
          <td><code class="small text-body-secondary">$transition-easing</code></td>
          <td class="small text-body-secondary">Material Design standard easing — natural deceleration</td>
        </tr>
      </tbody>
    </table>

    <h6 class="mb-1">Live demo</h6>
    <p class="text-body-secondary small mb-3">
      Hover over the boxes. The <strong>left box</strong> uses the design system
      tokens; the <strong>right box</strong> uses a hardcoded slower easing for
      comparison. Changing <code>$transition-duration</code> updates all
      token-driven transitions at once.
    </p>
    <div class="d-flex gap-4 flex-wrap">
      <div>
        <p class="small fw-semibold mb-2">Design system tokens</p>
        <div
          style="
            width:140px;height:88px;
            background:var(--psk-primary);
            cursor:pointer;
            transition:
              background-color var(--psk-transition-duration) var(--psk-transition-easing),
              transform var(--psk-transition-duration) var(--psk-transition-easing);
          "
          onmouseover="this.style.background='var(--psk-blue-400)';this.style.transform='scale(1.06)'"
          onmouseout="this.style.background='var(--psk-primary)';this.style.transform=''"
        ></div>
        <code style="font-size:.6rem;display:block;margin-top:.5rem;line-height:1.5;max-width:200px">
          transition-duration: var(--psk-transition-duration)<br>
          transition-timing: var(--psk-transition-easing)
        </code>
      </div>
      <div>
        <p class="small fw-semibold mb-2">Hardcoded (for comparison)</p>
        <div
          style="
            width:140px;height:88px;
            background:var(--psk-primary);
            cursor:pointer;
            transition: background-color 0.4s ease-in, transform 0.4s ease-in;
          "
          onmouseover="this.style.background='var(--psk-blue-400)';this.style.transform='scale(1.06)'"
          onmouseout="this.style.background='var(--psk-primary)';this.style.transform=''"
        ></div>
        <code style="font-size:.6rem;display:block;margin-top:.5rem;line-height:1.5;max-width:200px">
          transition: 0.4s ease-in<br>
          (slower, inconsistent)
        </code>
      </div>
    </div>

    <h6 class="mt-5 mb-3">Bootstrap component transition variables</h6>
    <p class="text-body-secondary small mb-3">
      Bootstrap also compiles <code>$transition-base</code>,
      <code>$transition-fade</code>, and <code>$transition-collapse</code> into
      component rules. These are <strong>not</strong> CSS custom properties —
      they are compile-time Sass variables only. Override them in
      <code>src/scss/_variables.scss</code> before Bootstrap is imported.
    </p>
    <table class="table table-bordered table-sm">
      <thead class="table-light">
        <tr>
          <th>Sass variable</th>
          <th>Bootstrap default</th>
          <th>Used in</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code class="small">$transition-base</code></td>
          <td><code class="small">all .2s ease-in-out</code></td>
          <td class="small text-body-secondary">Buttons, form controls, most interactive elements</td>
        </tr>
        <tr>
          <td><code class="small">$transition-fade</code></td>
          <td><code class="small">opacity .15s linear</code></td>
          <td class="small text-body-secondary">Modal backdrop, fade utilities</td>
        </tr>
        <tr>
          <td><code class="small">$transition-collapse</code></td>
          <td><code class="small">height .35s ease</code></td>
          <td class="small text-body-secondary">Accordion, Collapse component</td>
        </tr>
      </tbody>
    </table>
  `,
};
