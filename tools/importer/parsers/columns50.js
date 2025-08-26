/* global WebImporter */
export default function parse(element, { document }) {
  // Get the icon-stat list
  const ul = element.querySelector('ul.msc-icon-stats__list-icons');
  if (!ul) return;
  // Gather all li's that are not separator dots
  const iconLis = Array.from(ul.children).filter(li => !li.classList.contains('dots-separator'));
  // How many columns in the row?
  const numCols = iconLis.length;
  // The header row should be a single cell followed by enough empty strings to pad it to numCols
  const headerRow = ['Columns (columns50)', ...Array(numCols - 1).fill('')];
  // Second row is the icon/text columns
  const columnsRow = iconLis;
  // Build the table structure
  const rows = [headerRow, columnsRow];
  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new block table
  element.replaceWith(block);
}
