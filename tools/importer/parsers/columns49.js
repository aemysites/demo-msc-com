/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main icon stats block within the element
  const iconStats = element.querySelector('.msc-icon-stats');
  if (!iconStats) return;

  // Find the icons list
  const list = iconStats.querySelector('.msc-icon-stats__list-icons');
  if (!list) return;

  // Get all <li> that are not separators
  const items = Array.from(list.querySelectorAll('li')).filter(li => !li.classList.contains('dots-separator'));

  // Build the columns (one column per icon/stat)
  const columns = items.map(li => {
    // Each li: get icon and text
    const iconSpan = li.querySelector('.msc-icon-stats__list-icon');
    const textP = li.querySelector('.msc-icon-stats__text');
    const cellContent = [];
    if (iconSpan) cellContent.push(iconSpan);
    if (textP) cellContent.push(textP);
    return cellContent;
  });

  // Table header must be exactly 'Columns (columns49)' as a single cell
  const headerRow = ['Columns (columns49)']; // SINGLE COLUMN HEADER
  const cells = [headerRow, columns]; // columns is an array of cells, so this is the 2nd row

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the element with the table
  element.replaceWith(table);
}
