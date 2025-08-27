/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per requirement
  const headerRow = ['Hero (hero42)'];

  // --- IMAGE ROW ---
  // Find the image container
  const imgContainer = element.querySelector('.msc-image-banner__image');
  let imageEl = null;
  if (imgContainer) {
    // Prefer desktop image with src, else mobile image with data-src
    imageEl = imgContainer.querySelector('img.desktop[src]');
    if (!imageEl) {
      imageEl = imgContainer.querySelector('img.mobile[data-src]');
      // If found, set .src so image is referenced properly
      if (imageEl && imageEl.dataset && imageEl.dataset.src) {
        imageEl.src = imageEl.dataset.src;
      }
    }
  }

  // --- CONTENT ROW ---
  // Content: Heading and CTA
  const contentContainer = document.createElement('div');

  // Heading (h2)
  const heading = element.querySelector('.msc-image-banner__content h2');
  if (heading) {
    contentContainer.appendChild(heading);
  }

  // CTA (if present)
  const cta = element.querySelector('.msc-image-banner__cta a');
  if (cta) {
    contentContainer.appendChild(cta);
  }

  // Compose table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentContainer]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
