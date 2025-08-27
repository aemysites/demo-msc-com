/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header EXACTLY as specified
  const headerRow = ['Hero (hero24)'];

  // 2. Find the best candidate for the hero image (background image)
  // Only one image in the block - the logo in msc-news-tt__print-logo
  let imageEl = null;
  const logoDiv = element.querySelector('.msc-news-tt__print-logo');
  if (logoDiv) {
    const img = logoDiv.querySelector('img');
    if (img) {
      // Fix lazy image if necessary
      if (img.hasAttribute('data-src')) {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      }
      imageEl = img;
    }
  }

  // 3. Collect all hero content: headline, categories, date, supporting info
  // We'll include everything in the .msc-section-top and .msc-section-title, plus any print header text for context
  const contentEls = [];

  // Add the headline and supporting info from .msc-section-top
  const article = element.querySelector('.msc-news-tt__article');
  if (article) {
    // Gather .msc-section-top (contains category links, h1, date)
    const sectionTop = article.querySelector('.msc-section-top');
    if (sectionTop) {
      // Categories (as a block)
      const categories = sectionTop.querySelector('.msc-section-top__categories');
      if (categories) contentEls.push(categories);
      // Headline (h1)
      const h1 = sectionTop.querySelector('h1');
      if (h1) contentEls.push(h1);
      // Date (paragraph)
      const date = sectionTop.querySelector('.msc-news-tt__date');
      if (date) contentEls.push(date);
    } else {
      // Fallback: add all h1, h2, h3, and p under article
      article.querySelectorAll('h1, h2, h3, p').forEach((el) => {
        if (el.textContent.trim()) contentEls.push(el);
      });
    }
  }

  // Add print header text (for URL or supporting info)
  const printHeader = element.querySelector('.msc-news-tt__print-header');
  if (printHeader) {
    // Exclude the logo already extracted above
    Array.from(printHeader.childNodes).forEach(node => {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.tagName !== 'DIV' &&
        node.textContent.trim()
      ) {
        contentEls.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        contentEls.push(p);
      }
    });
  }

  // 4. Build the block table: 1 column, 3 rows (header, image, content)
  const rows = [
    headerRow,
    [imageEl || ''],
    [contentEls.length ? contentEls : '']
  ];

  // 5. Replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
