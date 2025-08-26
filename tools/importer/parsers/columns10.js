/* global WebImporter */
export default function parse(element, { document }) {
  // Get the container for all block items
  const gridX = element.querySelector('.grid-x');
  if (!gridX) return;

  // Find all .msc-landing-blocks__item elements inside .grid-x
  const items = Array.from(gridX.children).filter(child =>
    child.classList.contains('msc-landing-blocks__item')
  );
  if (items.length === 0) return;

  // Group items by twos (two columns per row)
  function chunk(arr, size) {
    const rows = [];
    for (let i = 0; i < arr.length; i += size) {
      rows.push(arr.slice(i, i + size));
    }
    return rows;
  }

  const rows = chunk(items, 2);

  // Build the table: HEADER must be a single cell spanning all columns (as per requirements)
  const cells = [];
  cells.push(['Columns (columns10)']);

  rows.forEach(group => {
    // For each pair, build a row. If only one in group, fill with empty string
    const row = [];
    group.forEach(blockItem => {
      // Each blockItem may contain both image and info
      const img = blockItem.querySelector('.msc-landing-blocks__item-image');
      const info = blockItem.querySelector('.msc-landing-blocks__item-info');
      let colContent = [];
      if (img) colContent.push(img);
      if (info) colContent.push(info);
      if (colContent.length === 0) colContent = [blockItem];
      row.push(colContent.length === 1 ? colContent[0] : colContent);
    });
    // Pad with empty cell if needed to ensure 2 columns per row
    while (row.length < 2) row.push('');
    cells.push(row);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
