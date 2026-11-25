/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Story chrome of the stories that show a <twig:ui:Grid> (the Grid stories, the Orders playground page): the grid's
// links, row links and forms stay in Storybook, the address showing where they would go; an order's preview answered
// as the Orders page does.

// An order's preview as the Orders page answers it (JSON {preview}), after a short wait, order 1023's failing; a toggle's
// JSON answer
const previewOf = (url) => `<div class="ps-grid__preview-sample"><p><strong>Order ${url.match(/orders\/(\d+)/)[1]}</strong>: 2 products, delivered by My carrier to 16, Main street, Paris.</p></div>`;
const fakePreviews = () => {
  if (window.fetch.isGridPreviewFake) {
    return;
  }
  const realFetch = window.fetch.bind(window);
  const fake = (input, init) => {
    const url = String(input);

    // A toggle: Carrier 3's free shipping fails, the others are saved
    if (/\/toggle-/.test(url)) {
      return Promise.resolve(url.includes('/3/toggle-is-free')
        ? new Response(JSON.stringify({ status: false, message: 'Free shipping could not be changed for this carrier.' }), { headers: { 'Content-Type': 'application/json' } })
        : new Response(JSON.stringify({ status: true, message: 'The status has been successfully updated.' }), { headers: { 'Content-Type': 'application/json' } }));
    }
    if (!/\/sell\/orders\/\d+\/preview/.test(url)) {
      return realFetch(input, init);
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve(url.includes('1023')
        ? new Response('{}', { status: 500 })
        : new Response(JSON.stringify({ preview: previewOf(url) }), { headers: { 'Content-Type': 'application/json' } })), 600);
    });
  };
  fake.isGridPreviewFake = true;
  window.fetch = fake;
};

// The links, the row links and the forms stay in Storybook, the address showing where they would go
export default function keepInStorybook(render) {
  fakePreviews();
  requestAnimationFrame(() => document.querySelectorAll('[data-ps-ref="grid"]').forEach((section) => {
    // A move sends the action form without a submit event: the address shows the positions instead
    section.querySelectorAll('[data-ps-ref="grid-action-form"]').forEach((form) => {
      Object.defineProperty(form, 'submit', {
        value: () => {
          window.location.hash = new URLSearchParams(new FormData(form)).toString();
          delete section.dataset.psState;
        },
      });
    });
    section.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest('a[href^="?"], a[href^="/"]');
      const row = target?.closest('.ps-grid__cell--clickable') && !target.closest('a, button, input, label') ? target.closest('[data-ps-data-href]') : null;

      if (link) {
        event.preventDefault();
        window.location.hash = link.getAttribute('href').split('#')[0];
      } else if (row) {
        event.stopPropagation();
        window.location.hash = row.dataset.psDataHref;
      }
    });
    section.addEventListener('submit', (event) => {
      event.preventDefault();
      const submitter = event.submitter?.getAttribute('formaction') ?? event.target.getAttribute('action') ?? '';
      window.location.hash = event.submitter?.name ? `${submitter} ${event.submitter.name}=${event.submitter.value}` : submitter;
    });
  }));

  return render();
}
