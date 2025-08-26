/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .msc-icon-stats__list-icons element
  const iconsList = element.querySelector('.msc-icon-stats__list-icons');
  if (!iconsList) return; // nothing to do

  // Extract all icon+text list items, excluding dots-separator
  const columns = [];
  iconsList.querySelectorAll('li').forEach(li => {
    if (li.classList.contains('dots-separator')) return;
    // Collect the icon (img) and the text <p> as they appear
    const cellContent = [];
    const iconSpan = li.querySelector('.msc-icon-stats__list-icon');
    if (iconSpan) {
      const img = iconSpan.querySelector('img');
      if (img) cellContent.push(img);
    }
    const text = li.querySelector('.msc-icon-stats__text');
    if (text) cellContent.push(text);
    if (cellContent.length === 1) {
      columns.push(cellContent[0]);
    } else if (cellContent.length > 1) {
      const div = document.createElement('div');
      cellContent.forEach(n => div.appendChild(n));
      columns.push(div);
    }
  });

  // According to the block guidance, header row is always the block name
  const headerRow = ['Columns (columns49)'];
  // Second row: as many columns as found
  const cells = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
