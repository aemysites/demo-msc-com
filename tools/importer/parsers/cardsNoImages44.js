/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header - must match exactly
  const headerRow = ['Cards (cardsNoImages44)'];

  // 2. Collect all cards (each .msc-tabs__panel is a card)
  const panelEls = element.querySelectorAll(':scope > div.msc-tabs__panel');
  const rows = [headerRow];

  panelEls.forEach(panel => {
    // Each panel contains a .msc-bodytext with card text
    const bodytext = panel.querySelector('.msc-bodytext');
    if (bodytext) {
      // Reference the existing element directly for resilience
      rows.push([bodytext]);
    }
  });

  // 3. Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
