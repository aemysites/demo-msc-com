/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as specified
  const headerRow = ['Cards (cards57)'];
  const rows = [headerRow];

  // Get all card elements (each .cell inside .grid-x)
  const gridX = element.querySelector('.grid-x');
  if (!gridX) return;
  const cards = gridX.querySelectorAll(':scope > .cell');

  cards.forEach(card => {
    // Card image (img inside card image container)
    let img = null;
    const imgContainer = card.querySelector('.msc-press-room-nav-elements__card-image');
    if (imgContainer) img = imgContainer.querySelector('img');

    // Card text (all block content from card content container)
    let textBlock = null;
    const contentContainer = card.querySelector('.msc-press-room-nav-elements__card-content');
    if (contentContainer) textBlock = contentContainer;

    // Only include row if both img and textBlock have some content
    if (img || textBlock) {
      rows.push([img, textBlock]);
    }
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
