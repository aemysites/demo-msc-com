/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cardsNoImages43)'];
  const cells = [headerRow];
  // Each card is a .msc-tabs__panel
  const panels = element.querySelectorAll(':scope > .msc-tabs__panel');
  panels.forEach((panel) => {
    // Find the main bodytext area
    const bodytext = panel.querySelector('.msc-bodytext');
    if (!bodytext) return; // edge-case: skip if missing
    // Some panels may have empty <a> tags before the <p>
    // We'll collect all non-empty children, excluding empty anchors
    const cardNodes = Array.from(bodytext.childNodes).filter(node => {
      // Ignore empty anchors (present in BIC card)
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A' && !node.textContent.trim()) return false;
      // Ignore whitespace-only text nodes
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return false;
      return true;
    });
    // If only one <p>, use it directly; else, combine all into a div for resilience
    let cellContent;
    if (cardNodes.length === 1 && cardNodes[0].nodeType === Node.ELEMENT_NODE && cardNodes[0].tagName === 'P') {
      cellContent = cardNodes[0];
    } else {
      const div = document.createElement('div');
      cardNodes.forEach(node => div.appendChild(node));
      cellContent = div;
    }
    cells.push([cellContent]);
  });
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original element
  element.replaceWith(block);
}
