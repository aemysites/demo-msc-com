/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all card elements
  function getCards(container) {
    const gridX = container.querySelector('.grid-x.align-center');
    if (!gridX) return [];
    // Only direct children that look like cards
    return Array.from(gridX.children).filter(
      el => el.classList.contains('msc-direct-integrations__card')
    );
  }

  const headerRow = ['Cards (cards12)'];
  const rows = [];
  const cards = getCards(element);

  cards.forEach(card => {
    // Icon cell: get icon container (preserves icon/graphic)
    const iconContainer = card.querySelector('.msc-direct-integrations__card-image');
    const iconCell = iconContainer ? iconContainer : document.createElement('div');

    // Content cell: title + description
    const contentContainer = card.querySelector('.msc-direct-integrations__card-content');
    const cellContents = [];
    if (contentContainer) {
      // Title: usually a <p class="msc-direct-integrations__card-title">
      const titleEl = contentContainer.querySelector('.msc-direct-integrations__card-title');
      if (titleEl) cellContents.push(titleEl);
      // Description container
      const descContainer = contentContainer.querySelector('.msc-direct-integrations__card-description');
      if (descContainer) {
        // All <p> inside description
        const descParagraphs = Array.from(descContainer.querySelectorAll('p'));
        for (const p of descParagraphs) {
          cellContents.push(p);
        }
      }
    }
    // Fallback: if .msc-direct-integrations__card-content is missing (edge case)
    if (!cellContents.length && card.textContent.trim()) {
      const fallback = document.createElement('div');
      fallback.textContent = card.textContent.trim();
      cellContents.push(fallback);
    }
    // Ensure the text cell is always an array (for createTable API)
    rows.push([iconCell, cellContents]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
