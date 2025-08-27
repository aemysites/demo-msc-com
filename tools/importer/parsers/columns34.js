/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should be a single column as per specification
  const headerRow = ['Columns (columns34)'];

  // Find all the columns (li items with card content)
  const items = element.querySelectorAll('ul.msc-industry__list > li.msc-industry__item');

  // Gather each card element for the columns
  const columns = Array.from(items).map((item) => {
    const card = item.querySelector('.msc-industry__item-card');
    return card ? card : document.createElement('div');
  });

  // Build table: header row is a single cell, content row is as many cells as columns
  if (columns.length) {
    const cells = [
      headerRow,        // <-- One column only in header row
      columns           // <-- N columns in the content row
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
