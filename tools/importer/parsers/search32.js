/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by the block example
  const headerRow = ['Search'];

  // Extract the main search form area: look for the first <form> descendant
  let mainForm = element.querySelector('form');
  // If not found, fallback to the element itself
  if (!mainForm) mainForm = element;

  // Place the existing form (including all text, input, and error messages) in the content row
  const contentRow = [mainForm];

  // Assemble the block table
  const rows = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
