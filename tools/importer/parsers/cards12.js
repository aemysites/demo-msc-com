/* global WebImporter */
export default function parse(element, { document }) {
  // Block header, as per requirement
  const headerRow = ['Cards (cards12)'];
  const cells = [headerRow];

  // Get all cards (direct children with .msc-direct-integrations__card)
  const cards = element.querySelectorAll('.msc-direct-integrations__card');

  cards.forEach(card => {
    // First cell: Icon/Image
    const iconCell = card.querySelector('.msc-direct-integrations__card-image') || null;

    // Second cell: Text content
    const content = card.querySelector('.msc-direct-integrations__card-content');
    let textCellContent = [];
    if (content) {
      // Title (if present)
      const titleEl = content.querySelector('.msc-direct-integrations__card-title');
      if (titleEl && titleEl.textContent.trim()) {
        // Use strong for heading, preserve line breaks
        const heading = document.createElement('strong');
        heading.innerHTML = titleEl.innerHTML;
        textCellContent.push(heading);
      }
      // Description block (may contain multiple <p>s)
      const desc = content.querySelector('.msc-direct-integrations__card-description');
      if (desc) {
        Array.from(desc.children).forEach(p => {
          // Reference existing <p> elements instead of cloning
          textCellContent.push(p);
        });
      }
    }
    // If no content was found, leave cell empty
    cells.push([iconCell, textCellContent.length ? textCellContent : '']);
  });

  // Replace the original element with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
