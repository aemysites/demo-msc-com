/* global WebImporter */
export default function parse(element, { document }) {
  // The table header must be a single cell/column, exactly as in the example
  const headerRow = ['Columns (columns53)'];

  // Find the icon list that represents the columns
  const iconsList = element.querySelector('.msc-icon-stats__list-icons');
  let columns = [];
  if (iconsList) {
    // For each non-separator <li>, gather its icon and text as a cell
    columns = Array.from(iconsList.children)
      .filter(li => !li.classList.contains('dots-separator'))
      .map(li => {
        const icon = li.querySelector('.msc-icon-stats__list-icon');
        const text = li.querySelector('.msc-icon-stats__text');
        const cellDiv = document.createElement('div');
        if (icon) cellDiv.appendChild(icon);
        if (text) cellDiv.appendChild(text);
        // If only one child, don't wrap in div
        return cellDiv.childNodes.length === 1 ? cellDiv.firstChild : cellDiv;
      });
  }
  // The block table: header is a single cell, second row has as many columns as there are items
  const cells = [headerRow, columns.length ? columns : ['']];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
