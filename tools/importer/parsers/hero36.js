/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches the example exactly
  const headerRow = ['Hero (hero36)'];

  // Image row: no background image in this HTML
  const imageRow = [''];

  // Content row: must include ALL visible text/content for semantic meaning
  // The form contains: heading, input, button, and error spans
  const form = element.querySelector('form');
  let contentCell;
  if (form) {
    // We want to preserve semantic structure, so we'll reference all form children as they are
    // That way, heading and button are retained, and any visible text is captured
    const children = Array.from(form.children);
    contentCell = children.length > 0 ? children : [''];
  } else {
    contentCell = [''];
  }

  // Compose cells array, matching the example: 1 column, 3 rows
  const cells = [headerRow, imageRow, [contentCell]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
