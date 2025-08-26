/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row exactly as in the example
  const headerRow = ['Hero (hero35)'];

  // Background image row (none found in the provided HTML)
  const backgroundRow = [''];

  // Find the info-content area (content block)
  const infoContent = element.querySelector('.msc-file-banner__info-content');

  // Defensive: If infoContent is missing, fall back to empty cell
  let contentCell;
  if (infoContent) {
    // Title (h3)
    const title = infoContent.querySelector('.title');
    // Dropdown group (select and download button)
    const dropdownGroup = infoContent.querySelector('.msc-form-group');
    // Compose array of present elements only, in correct order
    const cellContent = [];
    if (title) cellContent.push(title);
    if (dropdownGroup) cellContent.push(dropdownGroup);
    contentCell = cellContent.length ? cellContent : [''];
  } else {
    contentCell = [''];
  }

  // Compose the table rows array
  const rows = [
    headerRow,
    backgroundRow,
    [contentCell],
  ];

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
