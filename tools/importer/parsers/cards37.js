/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as in the example
  const headerRow = ['Cards (cards37)'];

  // Find the slider container
  const slider = element.querySelector('.msc-slider__slick-slider');
  if (!slider) return;

  // All direct slick-slide wrappers
  const slideWrappers = slider.querySelectorAll('.slick-slide');

  // Table rows: start with the header
  const rows = [headerRow];

  slideWrappers.forEach((slideWrapper) => {
    // Defensive: inner structure is: <div><div class="msc-slider__slide"> ... </div></div>
    const slide = slideWrapper.querySelector(':scope > div > .msc-slider__slide');
    if (!slide) return;

    // First cell: the image (mandatory)
    const img = slide.querySelector('img');
    // Defensive: skip card if no image
    if (!img) return;

    // Second cell: text content
    const contentDiv = slide.querySelector('.msc-slider__slide-content');
    const cellContent = [];
    if (contentDiv) {
      // Title (span), as <strong>
      const titleSpan = contentDiv.querySelector('.msc-slider__slide-title');
      if (titleSpan && titleSpan.textContent.trim()) {
        // Use a <strong> as in the requirements
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        cellContent.push(strong);
      }
      // CTA/link (optional)
      const cta = contentDiv.querySelector('a');
      if (cta) {
        if (cellContent.length) cellContent.push(document.createElement('br'));
        cellContent.push(cta);
      }
    }
    // If cellContent is empty, use blank
    rows.push([
      img,
      cellContent.length === 1 ? cellContent[0] : cellContent.length ? cellContent : ''
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
