/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// Story chrome of the stories that show a <twig:ui:Grid> (the Grid stories, the Orders playground page): the grid's
// links, row links and forms stay in Storybook, the address showing where they would go; an order's preview answered
// as the Orders page does.

// An order's preview as the Orders page answers it (JSON {preview}), after a short wait; order 1023's fails
const previewOf = (url) => `<div class="ps-grid__preview-sample"><p><strong>Order ${url.match(/orders\/(\d+)/)[1]}</strong>: 2 products, delivered by My carrier to 16, Main street, Paris.</p></div>`;
const fakePreviews = () => {
  if (window.fetch.isGridPreviewFake) {
    return;
  }
  const realFetch = window.fetch.bind(window);
  const fake = (input, init) => {
    const url = String(input);

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
