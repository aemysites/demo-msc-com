/* global WebImporter */
export default function parse(element, { document }) {
  // Find the UL with the icons
  const ul = element.querySelector('.msc-icon-stats__list-icons');
  if (!ul) return;

  // Get all LI elements that are not separators
  const lis = Array.from(ul.children).filter(li => !li.classList.contains('dots-separator'));

  // For each li, create a cell containing both the icon and the text, stacked vertically
  const cellsRow = lis.map((li) => {
    const iconSpan = li.querySelector('.msc-icon-stats__list-icon');
    const textPara = li.querySelector('.msc-icon-stats__text');
    const div = document.createElement('div');
    if (iconSpan) div.appendChild(iconSpan);
    if (textPara) div.appendChild(textPara);
    return div;
  });

  // The header row must contain exactly one cell (block name), even if there are multiple columns in the content row
  const tableRows = [
    ['Columns (columns11)'],
    cellsRow
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
