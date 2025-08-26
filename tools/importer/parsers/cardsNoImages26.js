/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cardsNoImages26)'];

  // Find the slider structure (defensive: handle where selectors might be missing)
  const slider = element.querySelector('.msc-slider__slider');
  if (!slider) return;
  const slickList = slider.querySelector('.slick-list');
  if (!slickList) return;
  const slickTrack = slickList.querySelector('.slick-track');
  if (!slickTrack) return;
  const slides = slickTrack.querySelectorAll('.slick-slide');

  const rows = [headerRow];

  slides.forEach((slide) => {
    // Each slide may be hidden, but we want all for completeness (as in screenshots)
    // Get the .msc-slider__slide inside this .slick-slide
    const slideWrap = slide.querySelector('.msc-slider__slide');
    if (!slideWrap) return;
    const slideLink = slideWrap.querySelector('a');
    if (!slideLink) return;
    const dateP = slideLink.querySelector('.msc-slider__slide-date');
    const titleP = slideLink.querySelector('.msc-slider__slide-title');
    const categoryP = slideLink.querySelector('.msc-slider__slide-category');

    // Build the card content, referencing existing nodes when possible
    // Use <strong> for title as visually bold, but keep link semantics and reference source node's text
    const frag = document.createDocumentFragment();

    if (dateP) {
      // Reference the existing <p> element directly (preserves original styling/structure)
      frag.appendChild(dateP);
    }

    if (titleP) {
      // Create a <div> with the title text as a link
      const titleDiv = document.createElement('div');
      const titleLink = document.createElement('a');
      titleLink.href = slideLink.getAttribute('href') || '#';
      // Use <strong> for semantic emphasis as in example
      const strong = document.createElement('strong');
      strong.textContent = titleP.textContent;
      titleLink.appendChild(strong);
      titleDiv.appendChild(titleLink);
      frag.appendChild(titleDiv);
    }

    if (categoryP) {
      // Reference the existing <p> element directly
      frag.appendChild(categoryP);
    }

    rows.push([frag]);
  });

  // Create and replace block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
