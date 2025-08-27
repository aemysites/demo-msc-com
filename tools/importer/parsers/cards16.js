/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the example
  const headerRow = ['Cards (cards16)'];

  // Find all slide elements representing cards
  const slides = element.querySelectorAll('.msc-slider__slide');
  const rows = [];

  slides.forEach((slide) => {
    // First cell: image (reference the <img> element directly)
    const img = slide.querySelector('.msc-slider__slide-image img');
    // Second cell: text content: date, title (bold), and CTA link
    const content = slide.querySelector('.msc-slider__slide-content');
    const cellContent = [];

    // Date
    const dateEl = content?.querySelector('p.msc-slider__slide-date');
    if (dateEl && dateEl.textContent.trim()) {
      cellContent.push(dateEl);
    }

    // Title: styled as heading or strong
    const titleEl = content?.querySelector('.msc-slider__slide-title');
    if (titleEl && titleEl.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent;
      cellContent.push(document.createElement('br'));
      cellContent.push(strong);
    }

    // CTA link
    const linkEl = content?.querySelector('a');
    if (linkEl) {
      cellContent.push(document.createElement('br'));
      cellContent.push(linkEl);
    }

    rows.push([
      img,
      cellContent
    ]);
  });

  // Compose the final cells array
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
