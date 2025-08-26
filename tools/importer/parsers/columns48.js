/* global WebImporter */
export default function parse(element, { document }) {
  // Get the list of icon stats
  const listIcons = element.querySelector('.msc-icon-stats__list-icons');
  if (!listIcons) return;

  // Get all <li> that are not the dots-separator (these are the content columns)
  const iconItems = Array.from(listIcons.children).filter(li => !li.classList.contains('dots-separator'));
  if (iconItems.length === 0) return;

  // Each <li> is a column, use as-is for maximum semantic preservation
  // Fix: header row must be a SINGLE column, not one per content column
  const cells = [
    ['Columns (columns48)'], // header row: single column only
    iconItems // content row: one cell per column
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
