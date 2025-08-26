/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Prepare the single-cell header row
  const headerRow = ['Columns (columns34)'];

  // 2. Find all the industry items (columns)
  const list = element.querySelector('.msc-industry__list');
  if (!list) return; // edge case: no list
  const items = Array.from(list.children);
  if (!items.length) return; // edge case: empty

  // 3. For each item, assemble its content as a single cell for the columns
  const columns = items.map((li) => {
    // Image (visuallyhidden, but relevant)
    const img = li.querySelector('img');

    // Card holds all relevant content
    const card = li.querySelector('.msc-industry__item-card');
    if (!card) return [];

    // Icon
    const icon = card.querySelector('.msc-industry__icon');
    // Title
    const title = card.querySelector('.msc-industry__title');
    // Sub-links (if any)
    let subLinks = [];
    const navList = card.querySelector('.msc-industry__nav-list');
    if (navList && navList.children.length) {
      subLinks = Array.from(navList.children).map((navItem) => {
        const link = navItem.querySelector('a');
        return link;
      }).filter(Boolean);
    }

    // Compose cell content as an array
    const cellContent = [];
    if (img && img.getAttribute('src')) cellContent.push(img);
    if (icon) cellContent.push(icon);
    if (title) cellContent.push(title);
    if (subLinks.length) cellContent.push(...subLinks);
    return cellContent.length === 1 ? cellContent[0] : cellContent;
  });

  // 4. Structure: first row is header (1 cell), second row is all columns (N cells)
  const tableData = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
