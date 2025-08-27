/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards18) block header, as per example
  const cells = [['Cards (cards18)']];

  // Get all card elements within the slick-track
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;
  const cardWrappers = slickTrack.querySelectorAll('.msc-direct-integrations__slider-card');
  
  cardWrappers.forEach(card => {
    // Image cell
    let img = card.querySelector('.msc-direct-integrations__card-image img');
    if (img && !img.src && img.getAttribute('data-src')) {
      img.src = img.getAttribute('data-src');
    }

    // Text cell
    const contentDiv = card.querySelector('.msc-direct-integrations__card-content');
    const cellContent = [];

    // Title (as <strong>, matching example's heading style)
    const titleElem = contentDiv.querySelector('.msc-direct-integrations__card-title');
    if (titleElem) {
      const strong = document.createElement('strong');
      strong.textContent = titleElem.textContent.trim();
      cellContent.push(strong);
    }
    // Description (use all <p> inside .msc-direct-integrations__card-description)
    const descDiv = contentDiv.querySelector('.msc-direct-integrations__card-description');
    if (descDiv) {
      descDiv.querySelectorAll('p').forEach(p => {
        cellContent.push(p);
      });
    }
    // CTA link (optional)
    const cta = contentDiv.querySelector('a.msc-link-arrow-simple');
    if (cta) {
      cellContent.push(cta);
    }

    cells.push([
      img,
      cellContent
    ]);
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
