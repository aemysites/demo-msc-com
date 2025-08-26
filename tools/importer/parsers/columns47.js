/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match exactly as required
  const headerRow = ['Columns (columns47)'];

  // Locate the main .grid-container and .cell
  const gridContainer = element.querySelector('.grid-container');
  let rowCells = [];

  if (gridContainer) {
    const cell = gridContainer.querySelector('.cell');
    if (cell) {
      // Find all direct children .msc-image-and-content__content
      const contentBlocks = Array.from(cell.querySelectorAll('.msc-image-and-content__content'));
      // Find the first .msc-image-and-content__image outside of a <template>
      // and the first .msc-image-and-content__info
      let imageCell = null;
      let infoCell = null;
      for (const content of contentBlocks) {
        if (!imageCell) {
          const imgDiv = content.querySelector('.msc-image-and-content__image');
          if (imgDiv && imgDiv.querySelector('img')) {
            imageCell = imgDiv;
          }
        }
        if (!infoCell) {
          const infoDiv = content.querySelector('.msc-image-and-content__info');
          if (infoDiv) {
            infoCell = infoDiv;
          }
        }
      }
      // Fallback if infoCell not found, try to get heading/description/link (mobile layout)
      if (!infoCell && contentBlocks.length) {
        // Find in the first contentBlock
        const content = contentBlocks[0];
        const infoParts = [];
        const heading = content.querySelector('.msc-section-title');
        if (heading) infoParts.push(heading);
        const desc = content.querySelector('.msc-section-description');
        if (desc) infoParts.push(desc);
        // Sometimes description is direct .msc-section-description, sometimes inside .text-container
        const button = content.querySelector('a.msc-cta');
        if (button) infoParts.push(button);
        if (infoParts.length) {
          infoCell = document.createElement('div');
          infoParts.forEach(part => infoCell.appendChild(part));
        }
      }
      // Both columns found, add as one row with 2 cells
      if (imageCell && infoCell) {
        rowCells = [imageCell, infoCell];
      } else if (imageCell) {
        rowCells = [imageCell];
      } else if (infoCell) {
        rowCells = [infoCell];
      }
    }
  }

  // Fallback: place whole element if we couldn't find columns
  if (rowCells.length === 0) {
    rowCells = [element];
  }

  const cells = [headerRow, rowCells];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
