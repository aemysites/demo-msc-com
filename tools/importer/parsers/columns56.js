/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid container and the main content cell
  const gridContainer = element.querySelector('.grid-container');
  if (!gridContainer) return;
  const cell = gridContainer.querySelector('.cell');
  if (!cell) return;

  // Find both .msc-image-and-content__content blocks (text and image)
  const contentBlocks = Array.from(cell.querySelectorAll('.msc-image-and-content__content'));
  // Defensive: if there is only one, we'll still process

  let leftCol = null;
  let rightCol = null;

  // Try to find image block and text block
  for (const content of contentBlocks) {
    // Right column: image block (must contain an img)
    const imageDiv = content.querySelector('.msc-image-and-content__image img');
    if (!rightCol && imageDiv) {
      // Use whole .msc-image-and-content__image block for rightCol
      rightCol = content.querySelector('.msc-image-and-content__image');
    }
    // Left column: must contain .msc-image-and-content__info (text block)
    if (!leftCol && content.querySelector('.msc-image-and-content__info')) {
      leftCol = content.querySelector('.msc-image-and-content__info');
    }
  }

  // Fallbacks if not found
  if (!leftCol) {
    leftCol = cell.querySelector('.msc-image-and-content__info');
  }
  if (!rightCol) {
    // Use any .msc-image-and-content__image block with <img>
    const imageDiv = cell.querySelector('.msc-image-and-content__image img');
    if (imageDiv) {
      rightCol = imageDiv.parentElement;
    }
  }

  // If for any reason still missing, fallback to empty elements
  if (!leftCol) {
    leftCol = document.createElement('div');
  }
  if (!rightCol) {
    rightCol = document.createElement('div');
  }

  // Block header row: must match exactly
  const headerRow = ['Columns (columns56)'];

  // Compose the table rows
  const cells = [
    headerRow,
    [leftCol, rightCol]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
