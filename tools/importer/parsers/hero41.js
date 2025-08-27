/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header
  const headerRow = ['Hero (hero41)'];

  // 2. Background image row: get the best available background image element (desktop preferred)
  let imageEl = null;
  const imgDiv = element.querySelector('.msc-image-banner__image');
  if (imgDiv) {
    // Try to find a desktop image with src
    const desktopImg = imgDiv.querySelector('img.desktop[src]');
    if (desktopImg) {
      imageEl = desktopImg;
    } else {
      // Fallback to any img with src
      const anyImg = imgDiv.querySelector('img[src]');
      if (anyImg) imageEl = anyImg;
    }
  }
  const imageRow = [imageEl ? imageEl : ''];

  // 3. Content row: Title (as heading), and CTA (as button/link), all in a single cell
  const contentCell = [];
  // Title
  const contentDiv = element.querySelector('.msc-image-banner__content');
  if (contentDiv) {
    // Grab the highest-level heading in contentDiv
    const heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentCell.push(heading);
  }
  // CTA (button/link)
  const ctaDiv = element.querySelector('.msc-image-banner__cta');
  if (ctaDiv) {
    const ctaLink = ctaDiv.querySelector('a');
    if (ctaLink) {
      if (contentCell.length > 0) contentCell.push(document.createElement('br'));
      contentCell.push(ctaLink);
    }
  }
  const contentRow = [contentCell.length > 0 ? contentCell : ''];

  // 4. Compose table
  const tableCells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
