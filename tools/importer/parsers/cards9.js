/* global WebImporter */
export default function parse(element, { document }) {
  // Table header from example
  const headerRow = ['Cards (cards9)'];
  const cells = [headerRow];

  // Find all card blocks (direct children that are cards)
  const cardNodes = element.querySelectorAll('.msc-landing-blocks__item');

  cardNodes.forEach(card => {
    // 1st column: The image (mandatory)
    const img = card.querySelector('.msc-landing-blocks__item-image img');
    // 2nd column: Text content
    const textContent = [];
    // Heading (optional)
    const heading = card.querySelector('.msc-section-title');
    if (heading) textContent.push(heading);

    // Description (can be p, ul, etc)
    const desc = card.querySelector('.msc-section-description');
    if (desc) {
      // Only include non-empty child nodes
      Array.from(desc.childNodes).forEach(node => {
        // Skip empty paragraphs
        if (node.nodeType === 1 && node.tagName === 'P' && node.textContent.trim() === '') return;
        textContent.push(node);
      });
    }

    // CTA (optional)
    const cta = card.querySelector('a.msc-cta');
    if (cta) textContent.push(cta);

    // Add the card row: always two columns, as per example
    cells.push([
      img,
      textContent
    ]);
  });

  // Create the block table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
