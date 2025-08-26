/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the .msc-icon-stats block (the actual columns block)
  const iconStats = element.querySelector('.msc-icon-stats');
  if (!iconStats) return;
  const list = iconStats.querySelector('.msc-icon-stats__list-icons');
  if (!list) return;

  // Gather all .li items that are not separators
  const items = Array.from(list.children).filter(li => !li.classList.contains('dots-separator'));
  if (items.length === 0) return;

  // Compose column content for each item
  const columns = items.map(li => {
    const content = [];
    const icon = li.querySelector('.msc-icon-stats__list-icon');
    if (icon) content.push(icon); // reference
    const text = li.querySelector('.msc-icon-stats__text');
    if (text) content.push(text); // reference
    return content;
  });

  // Header row must be single cell, matching the example
  const cells = [
    ['Columns (columns14)'],
    columns
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // To ensure the header visually spans all columns, set colspan (if possible in this context)
  // WebImporter.DOMUtils.createTable does not automatically set colspan, so we set it manually
  const headerRow = table.querySelector('tr:first-child');
  if (headerRow && headerRow.children.length === 1) {
    headerRow.children[0].setAttribute('colspan', columns.length);
  }

  element.replaceWith(table);
}
