/* global WebImporter */
export default function parse(element, { document }) {
  // Find the actual media section, or use the element itself if not present
  const mediaSection = element.querySelector('.msc-section-media') || element;

  // Gather all relevant content (text nodes and elements)
  const content = [];
  mediaSection.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'IFRAME') {
      // Convert iframes to links
      const a = document.createElement('a');
      a.href = node.src;
      a.textContent = node.src;
      content.push(a);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      content.push(node);
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      content.push(document.createTextNode(node.textContent));
    }
  });
  // The table must have the header row exactly as in the requirements
  const table = WebImporter.DOMUtils.createTable([
    ['Embed'],
    [content]
  ], document);
  element.replaceWith(table);
}
