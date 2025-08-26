/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block requirement
  const headerRow = ['Cards (cardsNoImages30)'];

  // Find the list of cards
  const ul = element.querySelector('ul.msc-press-room-releases__list');
  if (!ul) return;

  // Filter out <template> and only keep <li>s
  // Reference original elements, not clones
  const cardLis = Array.from(ul.children).filter(li => li.tagName === 'LI');

  const rows = cardLis.map(li => {
    const a = li.querySelector('a');
    if (!a) return [''];
    // We'll build the content for the card by referencing original children
    const cellContents = [];
    // Date (paragraph)
    const dateP = a.querySelector('.date');
    if (dateP && dateP.textContent.trim()) {
      cellContents.push(dateP);
    }
    // Title (h3, but we want it bold like example)
    const titleH = a.querySelector('.title');
    if (titleH && titleH.textContent.trim()) {
      // Use <strong> with text for consistency with example rendering
      const strong = document.createElement('strong');
      strong.textContent = titleH.textContent;
      cellContents.push(strong);
    }
    // Type (paragraph)
    const typeP = a.querySelector('.type');
    if (typeP && typeP.textContent.trim()) {
      // Place type on a new line
      cellContents.push(document.createElement('br'));
      cellContents.push(typeP);
    }
    // The card's link: The whole card is clickable, so we use the title as CTA
    // Example does NOT show a CTA at the bottom, so we don't add a separate CTA
    // The block consuming this may use the <strong> text and link
    // Optionally, wrap the strong in a link if desired (but match example -- here, not wrapping)
    // All referenced elements are originals
    return [cellContents];
  });

  // Compose the final table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
