/* global WebImporter */
export default function parse(element, { document }) {
  // Find the icons list
  const iconsList = element.querySelector('ul.msc-icon-stats__list-icons');
  if (!iconsList) return;
  // Get all <li> elements that are not separators
  const iconItems = Array.from(iconsList.children).filter(li => !li.classList.contains('dots-separator'));
  if (iconItems.length === 0) return;
  // Each cell is the content in the icon + text for that column
  const rowCells = iconItems.map(li => {
    const cellContent = [];
    // Direct children of <li> are the icon span and the text p
    for (let child of li.children) {
      cellContent.push(child);
    }
    return cellContent;
  });
  // Compose the table
  const cells = [
    ['Columns (columns11)'],
    rowCells
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
