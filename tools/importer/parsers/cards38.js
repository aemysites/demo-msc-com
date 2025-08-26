/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare block header
  const headerRow = ['Cards (cards38)'];
  const rows = [headerRow];

  // Get all direct card elements
  const cardEls = element.querySelectorAll('.msc-press-room-news-list__item');

  cardEls.forEach((card) => {
    // First column: image (reference existing img element)
    let image = null;
    const imgWrap = card.querySelector('.msc-press-room-news-list__item-image');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) {
        image = img;
      }
    }

    // Second column: text content
    // We'll reference the pieces of the original DOM where possible
    const parts = [];

    // Category (optional, as a label at top if present)
    const cat = card.querySelector('.msc-press-room-news-list__item-category');
    if (cat && cat.textContent.trim()) {
      const catSpan = document.createElement('span');
      catSpan.textContent = cat.textContent.trim();
      catSpan.className = 'card-category';
      parts.push(catSpan);
      parts.push(document.createElement('br'));
    }
    // Date (optional)
    const date = card.querySelector('.msc-press-room-news-list__item-date');
    if (date && date.textContent.trim()) {
      const dateP = document.createElement('span');
      dateP.textContent = date.textContent.trim();
      dateP.className = 'card-date';
      parts.push(dateP);
      parts.push(document.createElement('br'));
    }
    // Title (mandatory, styled as heading)
    const title = card.querySelector('.msc-press-room-news-list__item-title');
    if (title && title.textContent.trim()) {
      const titleStrong = document.createElement('strong');
      titleStrong.textContent = title.textContent.trim();
      parts.push(titleStrong);
      parts.push(document.createElement('br'));
    }
    // CTA (Read more link, optional)
    const link = card.querySelector('a.msc-press-room-news-list__item-link');
    if (link) {
      // Use the existing link element, but ensure it's not removed from DOM yet
      parts.push(link);
    }

    // Add the row to the table
    rows.push([
      image,
      parts
    ]);
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
