/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cardsNoImages43)'];
  // Find all immediate cards (tabs panels)
  const panelDivs = Array.from(element.querySelectorAll(':scope > .msc-tabs__panel'));
  const rows = [headerRow];
  panelDivs.forEach(panel => {
    // Get card content: .msc-bodytext (contains p, links, etc)
    const bodyText = panel.querySelector('.msc-bodytext');
    if (bodyText && bodyText.textContent.trim()) {
      // Reference the existing .msc-bodytext element directly
      rows.push([bodyText]);
    }
  });
  // Only replace if there's at least one card
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
