/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per requirement
  const headerRow = ['Cards (cards57)'];

  // Find all card nodes
  const cardNodes = element.querySelectorAll('.msc-press-room-nav-elements__card');
  const rows = [];

  cardNodes.forEach(card => {
    // Card image (mandatory)
    const imageContainer = card.querySelector('.msc-press-room-nav-elements__card-image');
    let imageEl = imageContainer && imageContainer.querySelector('img');
    
    // Card content (mandatory)
    // Use the existing content block as is to preserve formatting
    const contentContainer = card.querySelector('.msc-press-room-nav-elements__card-content');
    let textEl = contentContainer;

    // Fallbacks for robustness (if element missing, use empty string)
    if (!imageEl) imageEl = '';
    if (!textEl) textEl = '';

    rows.push([imageEl, textEl]);
  });

  const tableArr = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableArr, document);
  element.replaceWith(block);
}
