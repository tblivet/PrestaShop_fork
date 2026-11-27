/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
import selectors from '../selectors';

// <div class="ps-scroll-fade ps-scroll-fade--x" data-ps-action="scroll-fade">: says in data-ps-state which ends of the box
// hide content ("more-before", "more-after"), for _scroll-fade.scss to fade them. Read on the axis that overflows,
// sideways first; kept up to date on scroll, on resize and when the content changes. A named region (role="region",
// the KPI row) is a tab stop only while it overflows, so the keyboard scrolls it; an item focused inside a box comes
// into view clear of the fade (its scroll-padding).

// Below a pixel is rounding, not content
const EDGE = 1;

const update = (box: Element): void => {
  const sideways = box.scrollWidth - box.clientWidth > EDGE;
  // Sideways in RTL, scrollLeft runs from 0 to negative values
  const position = sideways ? Math.abs(box.scrollLeft) : box.scrollTop;
  const hidden = sideways ? box.scrollWidth - box.clientWidth : box.scrollHeight - box.clientHeight;
  const states = (box.getAttribute('data-ps-state') ?? '')
    .split(' ')
    .filter((state) => state && !state.startsWith('more-'));

  if (position > EDGE) {
    states.push('more-before');
  }
  if (hidden - position > EDGE) {
    states.push('more-after');
  }

  if (box.getAttribute('role') === 'region') {
    if (hidden > EDGE) {
      box.setAttribute('tabindex', '0');
    } else {
      box.removeAttribute('tabindex');
    }
  }

  if (states.length > 0) {
    box.setAttribute('data-ps-state', states.join(' '));
  } else {
    box.removeAttribute('data-ps-state');
  }
};

export default function initScrollFade(): void {
  const watched = new WeakSet<Element>();
  const resized = new ResizeObserver((entries) => entries.forEach((entry) => update(entry.target)));
  const changed = new MutationObserver((records) =>
    records.forEach((record) => {
      const box = record.target instanceof Element ? record.target.closest(selectors.scrollFade) : null;

      if (box) {
        update(box);
      }
    })
  );

  const watch = (root: Node): void => {
    const boxes: Element[] = root instanceof Element && root.matches(selectors.scrollFade) ? [root] : [];

    boxes.push(
      ...(root instanceof Element || root instanceof Document || root instanceof DocumentFragment
        ? root.querySelectorAll(selectors.scrollFade)
        : [])
    );
    boxes
      .filter((box) => !watched.has(box))
      .forEach((box) => {
        watched.add(box);
        resized.observe(box);
        changed.observe(box, { childList: true, subtree: true });
        update(box);
      });
  };

  watch(document);
  // Boxes added later (a modal, a refreshed list, a story) are watched too
  new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach(watch))).observe(
    document.body,
    { childList: true, subtree: true }
  );

  document.addEventListener('focusin', (event) => {
    const box = event.target instanceof Element && event.target.parentElement?.closest(selectors.scrollFade);

    if (box) {
      event.target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  });

  // Scroll events do not bubble: caught on the way down
  document.addEventListener(
    'scroll',
    (event) => {
      if (event.target instanceof Element && event.target.matches(selectors.scrollFade)) {
        update(event.target);
      }
    },
    { capture: true, passive: true }
  );
}
