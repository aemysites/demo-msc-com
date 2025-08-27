/* global WebImporter */
export default function parse(element, { document }) {
  // Get the left (image) and right (content) columns
  // Each should be used as a single cell, preserving all children
  const imageDiv = element.querySelector('.msc-landing-blocks__item-image');
  const infoDiv = element.querySelector('.msc-landing-blocks__item-info');
  // Defensive: fallback to empty divs if not found
  const leftCell = imageDiv || document.createElement('div');
  const rightCell = infoDiv || document.createElement('div');
  // Build the table structure
  const cells = [
    ['Columns (columns31)'],
    [leftCell, rightCell]
  ];
  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
