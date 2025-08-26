/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches the example
  const headerRow = ['Hero (hero24)'];

  // 2. Background Image (Row 2)
  let imageCell = '';
  const logoContainer = element.querySelector('.msc-news-tt__print-logo');
  if (logoContainer) {
    const img = logoContainer.querySelector('img');
    if (img) {
      const src = img.getAttribute('data-src') || img.getAttribute('src');
      if (src) {
        img.src = src;
        imageCell = img;
      }
    }
  }

  // 3. Content cell: Title, categories, date, and ALL text
  let contentCell;
  // Try to find the main article block that contains all hero content
  const articleBlock = element.querySelector('.msc-news-tt__article');
  if (articleBlock) {
    // Select top section containing categories, headings, and date
    const topSection = articleBlock.querySelector('.msc-section-top');
    if (topSection) {
      // Collect all nodes (elements and text) in correct order
      // This ensures headings, categories, date, and text are preserved
      const fullContent = Array.from(topSection.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim() !== '';
        }
        return true;
      });
      // If any content found, use it; else fallback to articleBlock itself
      contentCell = fullContent.length ? fullContent : articleBlock;
    } else {
      contentCell = articleBlock;
    }
  } else {
    // fallback: use header block if no article block present
    const headerBlock = element.querySelector('.msc-news-tt__print-header');
    if (headerBlock) {
      const headerContent = Array.from(headerBlock.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim() !== '';
        }
        return true;
      });
      contentCell = headerContent.length ? headerContent : headerBlock;
    } else {
      // fallback: use all content from element (should not happen)
      const directContent = Array.from(element.childNodes).filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim() !== '';
        }
        return true;
      });
      contentCell = directContent.length ? directContent : element;
    }
  }

  // 4. Compose table rows (always 1 column per row)
  const cells = [
    headerRow,
    [imageCell],
    [contentCell]
  ];

  // 5. Create the table and replace the original element
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
