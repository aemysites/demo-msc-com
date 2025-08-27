/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row: block name, exactly as in the example
  const headerRow = ['Hero (hero35)'];

  // Second row: background image (none in this HTML)
  const imageRow = [''];

  // Third row: all textual and interactive content from the block
  // Find the content container
  let infoContent = element.querySelector('.msc-file-banner__info-content');
  let content = [];

  if (infoContent) {
    // Include all children in order (headings, paragraphs, dropdown/buttons, etc)
    for (const child of infoContent.children) {
      // If this is the previous/download area, include all its children (dropdown, buttons, etc)
      if (child.classList.contains('msc-file-banner__previous')) {
        for (const prevChild of child.children) {
          content.push(prevChild);
        }
      } else {
        content.push(child);
      }
    }
  }

  // If somehow nothing was found, fallback to all children
  if (content.length === 0) {
    for (const child of element.children) {
      content.push(child);
    }
  }

  // Only add empty string if content really is empty
  const contentRow = [content.length ? content : ''];

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
