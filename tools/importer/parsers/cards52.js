/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards52)'];
  const cardContainer = element.querySelector('.msc-solution__container');
  const cards = cardContainer ? cardContainer.querySelectorAll('.msc-solution__card') : [];

  const rows = [];

  cards.forEach(card => {
    // Image: first .msc-solution__card-image that's not .d-none, fallback to first if needed
    let img = card.querySelector('img.msc-solution__card-image:not(.d-none)');
    if (!img) {
      img = card.querySelector('img.msc-solution__card-image');
    }
    // Reference the existing img element
    // Content
    const content = card.querySelector('.msc-solution__card-content');
    // Title
    const titleEl = content ? content.querySelector('.msc-solution__card-content-title') : null;
    // Description and link
    const textEl = content ? content.querySelector('.msc-solution__card-content-text') : null;

    // Build the content cell
    const parts = [];
    if (titleEl && titleEl.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      parts.push(strong);
    }
    if (textEl) {
      const p = textEl.querySelector('p');
      if (p && p.textContent.trim()) {
        parts.push(document.createElement('br'));
        parts.push(p);
      }
      const link = textEl.querySelector('a');
      if (link) {
        parts.push(document.createElement('br'));
        parts.push(link);
      }
    }
    // If no title or description, add empty string for robustness
    if (parts.length === 0) parts.push('');
    rows.push([img, parts]);
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
