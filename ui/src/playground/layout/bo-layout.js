/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Generic BO page shell — full-width header, sidebar menu, scrollable content section.
// Compose a page story with: boLayout(contentHtml, { fluid: false })
// fluid: true stretches the content zone full width instead of the centered design canvas.
import headerHtml from './header/header.html?raw';
import sidebarHtml from './sidebar/sidebar.html?raw';

export const boLayout = (content, { fluid = false } = {}) => `
  <div class="ps-layout">
    <div class="ps-layout__header">${headerHtml}</div>
    <div class="ps-layout__sidebar">${sidebarHtml}</div>
    <main class="ps-layout__content">
      <div class="ps-layout__container${fluid ? ' ps-layout__container--fluid' : ''}">${content}</div>
    </main>
  </div>
`;
