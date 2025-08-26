/* global WebImporter */
export default function parse(element, { document }) {
  // Header row with the exact block name
  const headerRow = ['Cards (cards51)'];

  // Locate the list of cards
  const ul = element.querySelector('.msc-icon-stats__list-icons');
  if (!ul) return;

  // Get all <li>s that are not separators
  const liCards = Array.from(ul.children).filter(
    li => li.tagName === 'LI' && !li.classList.contains('dots-separator')
  );

  // For each card, build a row [icon, text] referencing the existing elements
  const rows = liCards.map(li => {
    // Icon is the span.msc-icon-stats__list-icon (may contain an inner icon span)
    const icon = li.querySelector('.msc-icon-stats__list-icon');
    // Text is the p.msc-icon-stats__text (should retain any span formatting)
    const text = li.querySelector('.msc-icon-stats__text');
    // If icon or text is missing, fallback to empty div
    return [icon || document.createElement('div'), text || document.createElement('div')];
  });

  // Combine header and card rows
  const tableData = [headerRow, ...rows];

  // Build the table block
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
