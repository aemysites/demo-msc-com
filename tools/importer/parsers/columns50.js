/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one column, matching the required text
  const headerRow = ['Columns (columns50)'];

  // Extract icon items (ignore separator)
  const iconsList = element.querySelector('.msc-icon-stats__list-icons');
  let columns = [];
  if (iconsList) {
    columns = Array.from(iconsList.children)
      .filter(li => !li.classList.contains('dots-separator'))
      .map(li => {
        // Reference the icon and text elements for each column
        const iconSpan = li.querySelector('.msc-icon-stats__list-icon');
        const textPara = li.querySelector('.msc-icon-stats__text');
        const colDiv = document.createElement('div');
        if (iconSpan) colDiv.appendChild(iconSpan);
        if (textPara) colDiv.appendChild(textPara);
        return colDiv;
      });
  }
  if (columns.length === 0) {
    columns = [''];
  }
  // Structure: [[header], [columns...]]
  const cells = [
    headerRow, // single-cell header row
    columns    // multi-cell content row
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
