/**
 * For the full copyright and license information, please view the
 * docs/licenses/LICENSE.txt file that was distributed with this source code.
 */
// https://getbootstrap.com/docs/5.3/components/carousel/

export default {
  title: 'Components/Carousel',
};

const slides = [
  {
    bg: 'bg-primary',
    label: 'First slide',
    caption: 'Some representative placeholder content for the first slide.',
  },
  {
    bg: 'bg-success',
    label: 'Second slide',
    caption: 'Some representative placeholder content for the second slide.',
  },
  {
    bg: 'bg-danger',
    label: 'Third slide',
    caption: 'Some representative placeholder content for the third slide.',
  },
];

const slideItem = (slide, index, active = false, showCaptions = false) => `
  <div class="carousel-item${active ? ' active' : ''}">
    <div class="${slide.bg} d-flex align-items-center justify-content-center text-white" style="height: 320px;">
      <span class="fs-4 fw-semibold">${slide.label}</span>
    </div>
    ${
      showCaptions
        ? `
    <div class="carousel-caption d-none d-md-block">
      <h5>${slide.label}</h5>
      <p>${slide.caption}</p>
    </div>`
        : ''
    }
  </div>
`;

export const Default = {
  render: () => `
    <div id="carouselDefault" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
      <div class="carousel-inner">
        ${slides.map((s, i) => slideItem(s, i, i === 0)).join('')}
      </div>
    </div>
  `,
};

export const WithControls = {
  render: () => `
    <div id="carouselWithControls" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
      <div class="carousel-inner">
        ${slides.map((s, i) => slideItem(s, i, i === 0)).join('')}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselWithControls" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselWithControls" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  `,
};

export const WithIndicators = {
  render: () => `
    <div id="carouselWithIndicators" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
      <div class="carousel-indicators">
        ${slides
          .map(
            (_, i) => `
          <button type="button" data-bs-target="#carouselWithIndicators" data-bs-slide-to="${i}"
            ${i === 0 ? 'class="active" aria-current="true"' : ''}
            aria-label="Slide ${i + 1}"></button>
        `
          )
          .join('')}
      </div>
      <div class="carousel-inner">
        ${slides.map((s, i) => slideItem(s, i, i === 0, true)).join('')}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselWithIndicators" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselWithIndicators" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  `,
};

export const Crossfade = {
  render: () => `
    <div id="carouselCrossfade" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="2500">
      <div class="carousel-indicators">
        ${slides
          .map(
            (_, i) => `
          <button type="button" data-bs-target="#carouselCrossfade" data-bs-slide-to="${i}"
            ${i === 0 ? 'class="active" aria-current="true"' : ''}
            aria-label="Slide ${i + 1}"></button>
        `
          )
          .join('')}
      </div>
      <div class="carousel-inner">
        ${slides.map((s, i) => slideItem(s, i, i === 0)).join('')}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselCrossfade" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselCrossfade" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  `,
};
