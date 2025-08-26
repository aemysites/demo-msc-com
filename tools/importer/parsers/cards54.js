/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example
  const headerRow = ['Cards (cards54)'];

  // Find the slider wrapper in the given element
  const slider = element.querySelector('.msc-slider__slick-slider');
  if (!slider) return;

  // Find all card containers
  const cards = slider.querySelectorAll('.msc-direct-integrations__slider-card');
  const rows = [];

  cards.forEach(card => {
    // First column: image (mandatory)
    let img = null;
    const imgWrap = card.querySelector('.msc-direct-integrations__card-image');
    if (imgWrap) {
      img = imgWrap.querySelector('img');
    }

    // Second column: content (title, description, cta)
    const content = [];
    const contentWrap = card.querySelector('.msc-direct-integrations__card-content');
    if (contentWrap) {
      // Title as <strong>
      const title = contentWrap.querySelector('.msc-direct-integrations__card-title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        content.push(strong);
      }
      // Description (optional)
      const descWrap = contentWrap.querySelector('.msc-direct-integrations__card-description');
      if (descWrap) {
        // Only add the <p> if it actually has text
        const descP = descWrap.querySelector('p');
        if (descP && descP.textContent.trim()) {
          content.push(descP);
        }
      }
      // CTA link (optional)
      const link = contentWrap.querySelector('a');
      if (link && link.textContent.trim()) {
        content.push(link);
      }
    }

    // Add the row only if we have at least an image and some content
    if (img || content.length) {
      rows.push([
        img,
        content
      ]);
    }
  });

  // Only create the table if there are cards found
  if (rows.length) {
    const cells = [headerRow, ...rows];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
