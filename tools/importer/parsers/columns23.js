/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we process only the correct block
  const slideRoot = element.querySelector('.msc-slider__slide');
  if (!slideRoot) return;

  // Find two main columns: image and content
  const imageCol = slideRoot.querySelector('.msc-slider__image, .msc-image-banner__image');
  const contentCol = slideRoot.querySelector('.msc-image-banner__content, .msc-slider__content');

  // Image column: use the desktop image if present, else the first image
  let imgEl = null;
  if (imageCol) {
    imgEl = imageCol.querySelector('img.desktop') || imageCol.querySelector('img');
    if (imgEl && !imgEl.src && imgEl.dataset && imgEl.dataset.src) {
      imgEl.src = imgEl.dataset.src;
    }
  }

  // Content column: preserve full structure and reference the actual element
  // Instead of cloning, just reference the existing contentCol element
  // (reference is more resilient and matches requirements)
  // If contentCol is missing, fall back to an empty div
  const contentCell = contentCol || document.createElement('div');

  // Table setup from spec: header then row with two columns
  const cells = [
    ['Columns (columns23)'],
    [contentCell, imgEl].filter(Boolean),
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
