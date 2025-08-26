/* global WebImporter */
export default function parse(element, { document }) {
  // Find the icon list
  const iconList = element.querySelector('.msc-icon-stats__list-icons');
  if (!iconList) return;
  const iconItems = Array.from(iconList.children).filter(li => !li.classList.contains('dots-separator'));
  const numColumns = iconItems.length;

  // Build the header row with exactly the same number of columns as content row
  const headerRow = ['Columns (columns53)'];
  while (headerRow.length < numColumns) {
    headerRow.push('');
  }

  // Build the content row
  const contentRow = iconItems.map(li => {
    const cellDiv = document.createElement('div');
    const iconSpan = li.querySelector('.msc-icon-stats__list-icon');
    const text = li.querySelector('.msc-icon-stats__text');
    if (iconSpan) cellDiv.appendChild(iconSpan);
    if (text) cellDiv.appendChild(text);
    return cellDiv;
  });

  const tableRows = [headerRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}
