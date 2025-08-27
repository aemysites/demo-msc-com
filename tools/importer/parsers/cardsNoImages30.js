/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ['Cards (cardsNoImages30)'];
  const cells = [headerRow];

  // Find the main list of cards
  const ul = element.querySelector('ul.msc-press-room-releases__list');
  if (!ul) return;

  // Get all card li elements
  const lis = Array.from(ul.children).filter(
    child => child.classList.contains('msc-press-room-releases__card')
  );

  lis.forEach(li => {
    const a = li.querySelector('a');
    if (!a) return;
    const cardFragments = [];

    // Extract date paragraph (if present)
    const date = a.querySelector('p.date');
    if (date && date.textContent.trim()) cardFragments.push(date);
    // Extract title heading (if present)
    const title = a.querySelector('h3.title');
    if (title && title.textContent.trim()) cardFragments.push(title);
    // Extract type paragraph (if present)
    const type = a.querySelector('p.type');
    if (type && type.textContent.trim()) cardFragments.push(type);

    // Only add the row if at least one of the fields was found
    if (cardFragments.length > 0) {
      cells.push([cardFragments]); // single column per row
    }
  });

  // Create the block table and replace the source element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
