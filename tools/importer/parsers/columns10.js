/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all direct column items from the block
  function getColumns(el) {
    // .grid-x > .msc-landing-blocks__item
    const gridX = el.querySelector('.grid-x');
    if (!gridX) return [];
    return Array.from(gridX.children).filter(child => child.classList.contains('msc-landing-blocks__item'));
  }

  // For each column, combine image and info into a single array (for the cell)
  function getColumnContent(colEl) {
    // Get image (may be missing)
    let image = null;
    const imgWrap = colEl.querySelector('.msc-landing-blocks__item-image');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) image = img;
    }
    // Get info/content (may be missing)
    let info = null;
    const infoWrap = colEl.querySelector('.msc-landing-blocks__item-info');
    if (infoWrap) {
      const content = infoWrap.querySelector('.msc-landing-blocks__item-content');
      if (content) info = content;
    }
    // Compose array: prefer image then info (if both exist)
    const arr = [];
    if (image) arr.push(image);
    if (info) arr.push(info);
    // If neither, fallback to empty string as a cell (should not occur)
    return arr.length > 0 ? arr : '';
  }

  // Get the columns
  const columns = getColumns(element);
  if (!columns.length) return; // nothing to do

  // Table header row: exactly as required
  const headerRow = ['Columns (columns10)'];

  // Build the columns row
  const contentRow = columns.map(getColumnContent);

  // Build cells for createTable
  const cells = [headerRow, contentRow];

  // Create the table using the block helper
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
