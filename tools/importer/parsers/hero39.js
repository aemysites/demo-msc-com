/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row, exact match with example
  const headerRow = ['Hero (hero39)'];

  // 2. Background image row: prefer desktop > mobile > any img
  let imgEl = null;
  const imgContainer = element.querySelector('.msc-hero-immersive__image');
  if (imgContainer) {
    imgEl = imgContainer.querySelector('img.desktop') || imgContainer.querySelector('img.mobile') || imgContainer.querySelector('img');
  }

  // 3. Content row: All visible content below the image (headings, subheadings, paragraph, etc)
  // Find the wrapper that holds the text content
  // Use .msc-hero-immersive__inner-wrapper. If not found, fallback to main element
  let contentSource = element.querySelector('.msc-hero-immersive__inner-wrapper') || element;
  // Gather all direct children with meaningful text (headings, paragraphs, etc)
  // In this HTML, the actual heading is inside .msc-hero-immersive__title
  // We'll also grab any other direct children with text
  const contentItems = [];
  // Extract all content from .msc-hero-immersive__title (should contain heading, strong, br, etc)
  const titleBlock = contentSource.querySelector('.msc-hero-immersive__title');
  if (titleBlock) {
    Array.from(titleBlock.childNodes).forEach((node) => {
      if (node.nodeType === 1) {
        contentItems.push(node);
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        contentItems.push(span);
      }
    });
  }

  // Look for any extra description or ctas as siblings under the wrapper
  // We ignore quicktool and overlays, only visually relevant text elements
  // If any other direct children are a heading, p, or div with visible text, add them
  Array.from(contentSource.children).forEach((child) => {
    // Already processed title block
    if (child === titleBlock) return;
    // Ignore tool, overlays, etc (by class)
    if (
      child.classList.contains('msc-quicktool') ||
      child.classList.contains('msc-overlay')
    ) return;
    // If heading, paragraph, or div/span with text, include
    if (/^H[1-6]$/i.test(child.tagName) || child.tagName === 'P') {
      if (child.textContent.trim().length) contentItems.push(child);
    } else if ((child.tagName === 'DIV' || child.tagName === 'SPAN') && child.textContent.trim().length) {
      contentItems.push(child);
    }
  });

  // Compose the rows for the block table
  const cells = [
    headerRow,
    [imgEl || ''],
    [contentItems.length ? contentItems : '']
  ];

  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
