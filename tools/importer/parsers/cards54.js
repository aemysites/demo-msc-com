/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header: only one column in the header row
  const headerRow = ['Cards (cards54)'];
  const rows = [headerRow];

  // Get slider track containing all cards
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;
  // Each slide is a card
  const slides = slickTrack.querySelectorAll(':scope > .slick-slide');

  slides.forEach((slide) => {
    // Get card root
    const card = slide.querySelector('.msc-direct-integrations__slider-card');
    if (!card) return;
    // Get image: reference <img> element directly
    const imageWrapper = card.querySelector('.msc-direct-integrations__card-image');
    let imageEl = imageWrapper ? imageWrapper.querySelector('img') : null;
    // Get text content block
    const contentWrapper = card.querySelector('.msc-direct-integrations__card-content');
    const cellContent = [];
    if (contentWrapper) {
      // Title as <strong>
      const title = contentWrapper.querySelector('.msc-direct-integrations__card-title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        cellContent.push(strong);
      }
      // Description: ensure a paragraph is present even if empty in source (to match example density)
      const descWrapper = contentWrapper.querySelector('.msc-direct-integrations__card-description');
      let foundNonEmptyPara = false;
      if (descWrapper) {
        const descParas = Array.from(descWrapper.querySelectorAll('p'));
        for (const p of descParas) {
          if (p.textContent.trim()) {
            cellContent.push(p);
            foundNonEmptyPara = true;
            break;
          }
        }
      }
      // If no non-empty <p> found, add an empty <p> for description to match the example's required density
      if (!foundNonEmptyPara) {
        const emptyPara = document.createElement('p');
        cellContent.push(emptyPara);
      }
      // CTA link (use existing <a> element)
      const cta = contentWrapper.querySelector('a.msc-link-arrow-simple');
      if (cta) {
        cellContent.push(cta);
      }
    }
    // Add row: [image, text content array]
    rows.push([
      imageEl || '',
      cellContent.length > 0 ? cellContent : ''
    ]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
