/* global WebImporter */
export default function parse(element, { document }) {
  // Select main wrapper
  const wrapper = element.querySelector('.msc-footer__wrapper');
  if (!wrapper) return;

  // Find all main columns in order
  const business = wrapper.querySelector('.msc-footer__business');
  const logo = wrapper.querySelector('.msc-footer__logo');
  const contact = wrapper.querySelector('.msc-footer__contact');

  // Compose the columns array (3 columns)
  const columns = [business || document.createElement('div'), logo || document.createElement('div'), contact || document.createElement('div')];

  // Header row is a SINGLE cell spanning columns
  const headerRow = ['Columns (columns25)'];
  // Content row is one cell per visual column
  const cells = [headerRow, columns];
  
  // Create table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
