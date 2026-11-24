/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Generic BO page shell — full-width header, sidebar menu, scrollable content section.
// Compose a page story with: boLayout(contentHtml, { fluid: false })
// fluid: true stretches the content zone full width instead of the centered design canvas.
import headerHtml from './header/header.js';
import sidebarHtml from './sidebar/sidebar.js';

export const boLayout = (content, { fluid = false } = {}) => `
  <a class="btn btn-primary visually-hidden-focusable ps-layout__skip-link" href="#main-content">Skip to main content</a>
  <div class="ps-layout">
    <div class="ps-layout__header">${headerHtml}</div>
    <div class="ps-layout__sidebar">${sidebarHtml}</div>
    <main id="main-content" class="ps-layout__content" tabindex="-1">
      <div class="ps-layout__container${fluid ? ' ps-layout__container--fluid' : ''}">${content}</div>
    </main>
  </div>
`;
