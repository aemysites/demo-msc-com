/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cardsNoImages44) block
  const headerRow = ['Cards (cardsNoImages44)'];
  // Each panel is a card
  const panels = Array.from(element.querySelectorAll(':scope > .msc-tabs__panel'));
  const cardRows = panels.map((panel) => {
    // Some panels might have stray <a> tags not inside <p> (as seen in BIC)
    // We'll gather all .msc-bodytext children, or fallback to .msc-bodytext's parent if missing
    let cellContent;
    const body = panel.querySelector('.msc-bodytext');
    if (body) {
      // If there are <a> as direct children of .msc-bodytext (not wrapped in <p>), include them too
      const children = Array.from(body.childNodes).filter(node => {
        // Only element nodes and text nodes
        return node.nodeType === 1 || node.nodeType === 3;
      });
      // Remove empty text nodes
      const nonEmpty = children.filter(n => !(n.nodeType === 3 && !n.textContent.trim()));
      cellContent = nonEmpty.length > 1 ? nonEmpty : nonEmpty[0] || body;
    } else {
      // fallback: use everything inside panel
      cellContent = Array.from(panel.childNodes).filter(node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim()));
      if (cellContent.length === 1) cellContent = cellContent[0];
    }
    return [cellContent];
  });
  const tableArray = [headerRow, ...cardRows];
  const blockTable = WebImporter.DOMUtils.createTable(tableArray, document);
  element.replaceWith(blockTable);
}
