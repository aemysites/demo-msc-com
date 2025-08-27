/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell with the block name
  const headerRow = ['Columns (columns48)'];

  // Find the list with icons
  const list = element.querySelector('.msc-icon-stats__list-icons');
  let contentRow = [];
  if (list) {
    // Select all <li> elements that are not separator
    const items = Array.from(list.children).filter(
      li => li.tagName === 'LI' && !li.classList.contains('dots-separator')
    );
    // Each item becomes a column cell in the content row
    contentRow = items;
  }

  // Only create the block if we have columns
  if (contentRow.length > 0) {
    const table = WebImporter.DOMUtils.createTable([
      headerRow,     // single cell header
      contentRow     // N cells, one for each column
    ], document);
    element.replaceWith(table);
  }
}
