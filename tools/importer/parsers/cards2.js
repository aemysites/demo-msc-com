/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container that holds the cards
  let cardsContainer = element;
  if (!element.classList.contains('msc-solution__container')) {
    cardsContainer = element.querySelector('.msc-solution__container');
    if (!cardsContainer) {
      // fallback: find first child with right class
      const possible = element.querySelectorAll('[class*=msc-solution__container]');
      if (possible.length) cardsContainer = possible[0];
      else cardsContainer = element;
    }
  }

  // Find all card elements inside the container
  const cardElements = Array.from(cardsContainer.querySelectorAll('.msc-solution__card'));

  // Set up the table rows
  const rows = [['Cards (cards2)']]; // Header row matches the example

  cardElements.forEach(card => {
    // Find the first non-d-none img for the card
    const imgs = Array.from(card.querySelectorAll('img'));
    let img = null;
    for (const im of imgs) {
      if (!im.classList.contains('d-none')) {
        img = im;
        break;
      }
    }
    // If no visible img is found, set to null

    // Find card content
    const content = card.querySelector('.msc-solution__card-content');

    // Defensive: If content is missing, create an empty div
    let textContent = content;
    if (!content) {
      textContent = document.createElement('div');
    }
    // Defensive: If img is missing, just use null in cell (table cell will be empty)
    rows.push([img, textContent]);
  });

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
