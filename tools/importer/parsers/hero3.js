/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (exact match)
  const headerRow = ['Hero (hero3)'];

  // Find the main grid container and cell
  const gridContainer = element.querySelector('.grid-container');
  if (!gridContainer) return;
  const cell = gridContainer.querySelector('.cell');
  if (!cell) return;

  // --- Row 2: Background image ---
  // Reference the desktop image if present, otherwise fallback to any image
  let bgImg = null;
  const imgContainer = cell.querySelector('.msc-image-banner__image');
  if (imgContainer) {
    // Prefer desktop image
    let img = imgContainer.querySelector('img.desktop');
    if (!img) {
      // fallback to first img within the container
      img = imgContainer.querySelector('img');
    }
    if (img && (img.src || img.getAttribute('data-src'))) {
      // Reference existing image element directly
      bgImg = img;
    }
  }

  // --- Row 3: Content (title, description, CTA) ---
  const contentElements = [];
  const contentBox = cell.querySelector('.msc-image-banner__content');
  if (contentBox) {
    // Reference heading directly
    const heading = contentBox.querySelector('.msc-section-title');
    if (heading) contentElements.push(heading);
    // Reference description directly
    const desc = contentBox.querySelector('.msc-section-description');
    if (desc) contentElements.push(desc);
  }
  // Reference CTA if present
  const ctaBox = cell.querySelector('.msc-image-banner__cta');
  if (ctaBox) {
    const ctaLink = ctaBox.querySelector('a');
    if (ctaLink) contentElements.push(ctaLink);
  }

  // Ensure at least an empty string if nothing found
  const imageRow = [bgImg ? bgImg : ''];
  const contentRow = [contentElements.length ? contentElements : ''];

  // Build the table, exactly as example (1 column, 3 rows)
  const rows = [
    headerRow,
    imageRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the element with the block table
  element.replaceWith(block);
}
