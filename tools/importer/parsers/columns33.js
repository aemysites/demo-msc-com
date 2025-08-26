/* global WebImporter */
export default function parse(element, { document }) {
  // Make sure we find the main wrapper for each column
  const wrapper = element.querySelector('.msc-footer__wrapper');
  if (!wrapper) return;

  // There are 3 columns in this block: agency, business, contact
  // Get the columns in order
  const agency = wrapper.querySelector('.msc-footer__agency');
  const business = wrapper.querySelector('.msc-footer__business');
  const contact = wrapper.querySelector('.msc-footer__contact');

  // The block header, as required
  const headerRow = ['Columns (columns33)'];

  // Compose the content row, referencing the actual elements (if present)
  const contentRow = [agency || '', business || '', contact || ''];

  // Assemble the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the source element with our new block table
  element.replaceWith(block);
}
