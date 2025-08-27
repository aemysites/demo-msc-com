/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER: Must match example exactly
  const headerRow = ['Cards (cards51)'];
  const rows = [headerRow];

  // Find the UL containing icon cards
  const ul = element.querySelector('.msc-icon-stats__list-icons');
  if (ul) {
    // Get direct LI children (skip separators)
    const lis = Array.from(ul.children).filter(li => 
      li.tagName === 'LI' && !li.classList.contains('dots-separator')
    );
    lis.forEach(li => {
      // ICON CELL: Reference existing icon element
      const icon = li.querySelector('.msc-icon-stats__list-icon');
      // TEXT CELL: Reference existing text element
      const text = li.querySelector('.msc-icon-stats__text');
      // If either is missing, fallback to empty span
      rows.push([
        icon ? icon : document.createElement('span'),
        text ? text : document.createElement('span'),
      ]);
    });
  }
  // TABLE: Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
