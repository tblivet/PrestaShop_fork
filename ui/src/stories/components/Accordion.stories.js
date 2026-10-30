/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/accordion/

export default {
  title: 'Components/Accordion',
};

export const Default = {
  render: () => `
    <div class="accordion" id="accordionDefault">
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button" type="button"
            data-bs-toggle="collapse" data-bs-target="#collapseOne"
            aria-expanded="true" aria-controls="collapseOne">
            Accordion Item #1
          </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse show"
          data-bs-parent="#accordionDefault">
          <div class="accordion-body">
            <strong>This is the first item's accordion body.</strong> It is shown by default.
            You can modify any of this with custom CSS or override default variables.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button"
            data-bs-toggle="collapse" data-bs-target="#collapseTwo"
            aria-expanded="false" aria-controls="collapseTwo">
            Accordion Item #2
          </button>
        </h2>
        <div id="collapseTwo" class="accordion-collapse collapse"
          data-bs-parent="#accordionDefault">
          <div class="accordion-body">
            <strong>This is the second item's accordion body.</strong> It is hidden by default.
            You can also swap out the icons.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button"
            data-bs-toggle="collapse" data-bs-target="#collapseThree"
            aria-expanded="false" aria-controls="collapseThree">
            Accordion Item #3
          </button>
        </h2>
        <div id="collapseThree" class="accordion-collapse collapse"
          data-bs-parent="#accordionDefault">
          <div class="accordion-body">
            <strong>This is the third item's accordion body.</strong> It is hidden by default.
            You can combine it with other components.
          </div>
        </div>
      </div>
    </div>
  `,
};

export const Flush = {
  render: () => `
    <div class="accordion accordion-flush" id="accordionFlush">
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button"
            data-bs-toggle="collapse" data-bs-target="#flushCollapseOne"
            aria-expanded="false" aria-controls="flushCollapseOne">
            Accordion Item #1
          </button>
        </h2>
        <div id="flushCollapseOne" class="accordion-collapse collapse"
          data-bs-parent="#accordionFlush">
          <div class="accordion-body">
            Placeholder content for this accordion, which is intended to demonstrate the
            <code>.accordion-flush</code> class. This is the first item's accordion body.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button"
            data-bs-toggle="collapse" data-bs-target="#flushCollapseTwo"
            aria-expanded="false" aria-controls="flushCollapseTwo">
            Accordion Item #2
          </button>
        </h2>
        <div id="flushCollapseTwo" class="accordion-collapse collapse"
          data-bs-parent="#accordionFlush">
          <div class="accordion-body">
            Placeholder content for this accordion. This is the second item's accordion body.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button"
            data-bs-toggle="collapse" data-bs-target="#flushCollapseThree"
            aria-expanded="false" aria-controls="flushCollapseThree">
            Accordion Item #3
          </button>
        </h2>
        <div id="flushCollapseThree" class="accordion-collapse collapse"
          data-bs-parent="#accordionFlush">
          <div class="accordion-body">
            Placeholder content for this accordion. This is the third item's accordion body.
          </div>
        </div>
      </div>
    </div>
  `,
};

export const AlwaysOpen = {
  render: () => `
    <div class="accordion" id="accordionAlwaysOpen">
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button" type="button"
            data-bs-toggle="collapse" data-bs-target="#alwaysOpenCollapseOne"
            aria-expanded="true" aria-controls="alwaysOpenCollapseOne">
            Accordion Item #1
          </button>
        </h2>
        <div id="alwaysOpenCollapseOne" class="accordion-collapse collapse show">
          <div class="accordion-body">
            <strong>This is the first item's accordion body.</strong> It is shown by default.
            Without <code>data-bs-parent</code>, multiple items can be open at the same time.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button" type="button"
            data-bs-toggle="collapse" data-bs-target="#alwaysOpenCollapseTwo"
            aria-expanded="true" aria-controls="alwaysOpenCollapseTwo">
            Accordion Item #2
          </button>
        </h2>
        <div id="alwaysOpenCollapseTwo" class="accordion-collapse collapse show">
          <div class="accordion-body">
            <strong>This is the second item's accordion body.</strong> It is also shown by default.
            This demonstrates the always-open behaviour.
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button"
            data-bs-toggle="collapse" data-bs-target="#alwaysOpenCollapseThree"
            aria-expanded="false" aria-controls="alwaysOpenCollapseThree">
            Accordion Item #3
          </button>
        </h2>
        <div id="alwaysOpenCollapseThree" class="accordion-collapse collapse">
          <div class="accordion-body">
            <strong>This is the third item's accordion body.</strong> It is hidden by default.
          </div>
        </div>
      </div>
    </div>
  `,
};
