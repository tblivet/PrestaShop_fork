/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/content/typography/

export default {
  title: 'Content/Typography',
};

export const Headings = {
  render: () => `
    <div>
      <h1>h1. Bootstrap heading</h1>
      <h2>h2. Bootstrap heading</h2>
      <h3>h3. Bootstrap heading</h3>
      <h4>h4. Bootstrap heading</h4>
      <h5>h5. Bootstrap heading</h5>
      <h6>h6. Bootstrap heading</h6>

      <hr>

      <p class="display-1">Display 1</p>
      <p class="display-2">Display 2</p>
      <p class="display-3">Display 3</p>
      <p class="display-4">Display 4</p>
      <p class="display-5">Display 5</p>
      <p class="display-6">Display 6</p>
    </div>
  `,
};

export const LeadAndBody = {
  render: () => `
    <div>
      <p class="lead">
        This is a lead paragraph. It stands out from regular paragraphs.
      </p>
      <p>
        This is a regular paragraph. You can use the <code>.lead</code> class to make a paragraph
        stand out. Bootstrap's global default <code>font-size</code> is <strong>1rem</strong>
        (typically 16px) with a <code>line-height</code> of 1.5.
      </p>
      <p class="fw-bold">Bold text.</p>
      <p class="fw-bolder">Bolder weight text (relative to the parent element).</p>
      <p class="fw-semibold">Semibold weight text.</p>
      <p class="fw-medium">Medium weight text.</p>
      <p class="fw-normal">Normal weight text.</p>
      <p class="fw-light">Light weight text.</p>
      <p class="fw-lighter">Lighter weight text (relative to the parent element).</p>
      <p class="fst-italic">Italic text.</p>
      <p class="fst-normal">Text with normal font style.</p>
    </div>
  `,
};

export const InlineElements = {
  render: () => `
    <div>
      <p>You can use the mark tag to <mark>highlight</mark> text.</p>
      <p><del>This line of text is meant to be treated as deleted text.</del></p>
      <p><s>This line of text is meant to be treated as no longer accurate.</s></p>
      <p><ins>This line of text is meant to be treated as an addition to the document.</ins></p>
      <p><u>This line of text will render as underlined.</u></p>
      <p><small>This line of text is meant to be treated as fine print.</small></p>
      <p><strong>This line rendered as bold text.</strong></p>
      <p><em>This line rendered as italicized text.</em></p>
      <p>
        <span class="text-decoration-underline">Underlined text</span> ·
        <span class="text-decoration-line-through">Strikethrough text</span> ·
        <abbr title="attribute">attr</abbr> ·
        <abbr title="HyperText Markup Language" class="initialism">HTML</abbr>
      </p>
    </div>
  `,
};

export const Blockquote = {
  render: () => `
    <div>
      <figure>
        <blockquote class="blockquote">
          <p>A well-known quote, contained in a blockquote element.</p>
        </blockquote>
        <figcaption class="blockquote-footer">
          Someone famous in <cite title="Source Title">Source Title</cite>
        </figcaption>
      </figure>

      <figure class="text-center">
        <blockquote class="blockquote">
          <p>A well-known quote, centered.</p>
        </blockquote>
        <figcaption class="blockquote-footer">
          Someone famous in <cite title="Source Title">Source Title</cite>
        </figcaption>
      </figure>

      <figure class="text-end">
        <blockquote class="blockquote">
          <p>A well-known quote, aligned to the end.</p>
        </blockquote>
        <figcaption class="blockquote-footer">
          Someone famous in <cite title="Source Title">Source Title</cite>
        </figcaption>
      </figure>
    </div>
  `,
};

export const Lists = {
  render: () => `
    <div class="row g-4">
      <div class="col-md-3">
        <h6>Unordered</h6>
        <ul>
          <li>Lorem ipsum dolor sit amet</li>
          <li>Consectetur adipiscing elit</li>
          <li>Integer molestie lorem at massa</li>
          <li>Facilisis in pretium nisl aliquet</li>
          <li>Nulla volutpat aliquam velit
            <ul>
              <li>Phasellus iaculis neque</li>
              <li>Purus sodales ultricies</li>
            </ul>
          </li>
          <li>Faucibus porta lacus fringilla vel</li>
        </ul>
      </div>
      <div class="col-md-3">
        <h6>Ordered</h6>
        <ol>
          <li>Lorem ipsum dolor sit amet</li>
          <li>Consectetur adipiscing elit</li>
          <li>Integer molestie lorem at massa</li>
          <li>Facilisis in pretium nisl aliquet</li>
          <li>Nulla volutpat aliquam velit</li>
          <li>Faucibus porta lacus fringilla vel</li>
        </ol>
      </div>
      <div class="col-md-3">
        <h6>Unstyled</h6>
        <ul class="list-unstyled">
          <li>Lorem ipsum dolor sit amet</li>
          <li>Consectetur adipiscing elit</li>
          <li>Integer molestie lorem at massa</li>
          <li>Facilisis in pretium nisl aliquet</li>
          <li>Nulla volutpat aliquam velit
            <ul>
              <li>Phasellus iaculis neque</li>
              <li>Purus sodales ultricies</li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="col-md-3">
        <h6>Inline</h6>
        <ul class="list-inline">
          <li class="list-inline-item">Lorem ipsum</li>
          <li class="list-inline-item">Phasellus iaculis</li>
          <li class="list-inline-item">Nulla volutpat</li>
        </ul>
      </div>
    </div>
  `,
};

export const ResponsiveFontSizes = {
  render: () => `
    <div>
      <p class="fs-1">.fs-1 text (2.5rem)</p>
      <p class="fs-2">.fs-2 text (2rem)</p>
      <p class="fs-3">.fs-3 text (1.75rem)</p>
      <p class="fs-4">.fs-4 text (1.5rem)</p>
      <p class="fs-5">.fs-5 text (1.25rem)</p>
      <p class="fs-6">.fs-6 text (1rem)</p>
    </div>
  `,
};
