/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per spec: single column with block name
  const headerRow = ['Columns (columns14)'];

  // Find the icon stats list
  const iconsList = element.querySelector('.msc-icon-stats__list-icons');
  if (!iconsList) {
    // If iconsList is missing, create a minimal block with header and empty row
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      ['']
    ], document);
    element.replaceWith(table);
    return;
  }

  // Get immediate children of the <ul> that are not separators
  const iconLis = Array.from(iconsList.children).filter(
    li => li.tagName === 'LI' && !li.classList.contains('dots-separator')
  );

  // For each column, combine icon + text
  const cols = iconLis.map(li => {
    const content = [];
    const iconSpan = li.querySelector('.msc-icon-stats__list-icon');
    const label = li.querySelector('.msc-icon-stats__text');
    if (iconSpan) content.push(iconSpan);
    if (label) content.push(label);
    if (content.length === 0) content.push(...li.childNodes);
    return content;
  });

  // The first row is a single column header, the second row is N columns
  const cells = [
    headerRow,
    cols
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
