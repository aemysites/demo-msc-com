/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Prepare header row (must match exactly)
  const headerRow = ['Hero (hero8)'];

  // 2. Find the background image (first <img> with data-src or src)
  let imgEl = element.querySelector('img[data-src], img[src]');
  if (imgEl && imgEl.hasAttribute('data-src')) {
    imgEl.setAttribute('src', imgEl.getAttribute('data-src'));
    imgEl.removeAttribute('data-src');
  }
  if (imgEl) {
    imgEl.removeAttribute('class');
  }

  // 3. Find the text content
  // Prefer the desktop .msc-image-and-content__info if present, else fallback to .msc-section-description (mobile) or just element
  let infoEl = element.querySelector('.msc-image-and-content__info');
  if (!infoEl) {
    // fallback, mobile: find .msc-section-description or element
    infoEl = element.querySelector('.msc-section-description') || element;
  }

  // The main heading is typically .msc-section-title
  let titleEl = infoEl.querySelector('.msc-section-title') || element.querySelector('.msc-section-title');
  // Subheading is not present in this HTML, but in other cases could be another heading tag
  // All <p> inside .text-container, or if not found, inside infoEl
  let descContainer = infoEl.querySelector('.text-container') || infoEl;
  let paragraphs = Array.from(descContainer.querySelectorAll('p')).filter(p => p.textContent.trim().length > 0);
  // Compose content cell
  const textCell = [];
  if (titleEl) textCell.push(titleEl);
  textCell.push(...paragraphs);

  // 4. Build the final cells array (3 rows, single column)
  const cells = [
    headerRow,
    [imgEl || ''],
    [textCell]
  ];

  // 5. Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
