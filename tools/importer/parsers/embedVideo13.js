/* global WebImporter */
export default function parse(element, { document }) {
  // Find the section containing the media/embed
  let mediaContent = [];
  const mediaSection = element.querySelector('.msc-section-media');
  if (mediaSection) {
    // Gather all direct children: iframes and text (preserve all content)
    mediaContent = Array.from(mediaSection.childNodes)
      .filter(node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim()))
      .map(node => {
        if (node.nodeType === 3) {
          // Text node
          return document.createTextNode(node.textContent);
        }
        if (node.tagName === 'IFRAME' && node.src) {
          // Convert iframe to a link as per instructions
          const link = document.createElement('a');
          link.href = node.src;
          link.textContent = node.src;
          return link;
        }
        // Preserve other elements directly
        return node;
      });
  } else {
    // If no .msc-section-media found, fallback to all children
    mediaContent = Array.from(element.childNodes)
      .filter(node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim()))
      .map(node => {
        if (node.nodeType === 3) {
          return document.createTextNode(node.textContent);
        }
        if (node.tagName === 'IFRAME' && node.src) {
          const link = document.createElement('a');
          link.href = node.src;
          link.textContent = node.src;
          return link;
        }
        return node;
      });
  }

  // Ensure all content is preserved and combined in a single cell
  const cells = [
    ['Embed'],
    [mediaContent.length === 1 ? mediaContent[0] : mediaContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
