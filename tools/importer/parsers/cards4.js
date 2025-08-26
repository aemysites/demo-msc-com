/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row that matches the example
  const rows = [['Cards (cards4)']];

  // Select all card elements directly under the block
  const cardNodes = element.querySelectorAll('.msc-press-room-nav-elements__card');

  cardNodes.forEach(card => {
    // IMAGE: always present in each card
    const img = card.querySelector('img');

    // TEXT/CTA: build the content block for the second cell
    const contentDiv = card.querySelector('.msc-press-room-nav-elements__card-content');
    const cellContent = [];

    // Title (label) as bold
    const label = contentDiv && contentDiv.querySelector('.msc-press-room-nav-elements__card-label');
    if (label) {
      // Reference the original label element, but wrap in <strong> for semantic meaning
      const strong = document.createElement('strong');
      strong.textContent = label.textContent.trim();
      cellContent.push(strong);
    }

    // There is no separate description, but if there is any other text, include it
    // (for flexibility, include all non-empty text nodes in contentDiv that are not the label)
    Array.from(contentDiv.childNodes).forEach(node => {
      if (
        node.nodeType === Node.TEXT_NODE &&
        node.textContent.trim() &&
        (!label || node.textContent.trim() !== label.textContent.trim())
      ) {
        cellContent.push(document.createTextNode(node.textContent.trim()));
      }
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.tagName !== 'P' &&
        node !== label &&
        node.tagName !== 'A'
      ) {
        cellContent.push(node);
      }
    });

    // CTA link, use original element, but provide a visible name
    const cta = contentDiv && contentDiv.querySelector('a[href]');
    if (cta) {
      // Add a <br> if there's already a title above
      if (cellContent.length) cellContent.push(document.createElement('br'));
      // Use CTA's title attribute, otherwise fallback to label or href
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.getAttribute('title') || (label ? label.textContent.trim() : cta.href);
      cellContent.push(a);
    }

    // Construct row: [img, cellContent]
    rows.push([
      img,
      cellContent
    ]);
  });

  // Create and replace the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
