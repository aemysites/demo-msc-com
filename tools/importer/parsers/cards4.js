/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified in the requirements and example
  const headerRow = ['Cards (cards4)'];
  const cells = [headerRow];

  const grid = element.querySelector('.grid-x.align-center');
  if (!grid) return;

  // Get all direct card elements
  const cardEls = Array.from(grid.children);
  cardEls.forEach((card) => {
    // First cell: image
    let imgEl = card.querySelector('img') || '';

    // Second cell: text content (title, description, CTA)
    const contentDiv = card.querySelector('.msc-press-room-nav-elements__card-content');
    const textCell = [];
    let labelEl = null;
    if (contentDiv) {
      // Title
      labelEl = contentDiv.querySelector('.msc-press-room-nav-elements__card-label');
      if (labelEl) {
        const strong = document.createElement('strong');
        strong.textContent = labelEl.textContent.trim();
        textCell.push(strong);
      }
      // Description (all <p> after label that are NOT the label)
      let foundLabel = false;
      Array.from(contentDiv.children).forEach((child) => {
        if (child === labelEl) {
          foundLabel = true;
          return;
        }
        if (foundLabel && child.tagName.toLowerCase() === 'p' && child.className !== 'msc-press-room-nav-elements__card-label') {
          // Only push non-empty descriptions
          if (child.textContent.trim()) {
            textCell.push(document.createElement('br'));
            textCell.push(child);
          }
        }
      });
      // CTA link (the <a> present in the content div)
      const cta = contentDiv.querySelector('a.msc-press-room-nav-elements__card-cta');
      if (cta && cta.href) {
        const link = document.createElement('a');
        link.href = cta.href;
        link.textContent = cta.getAttribute('title') || (labelEl ? labelEl.textContent.trim() : cta.href);
        if (cta.hasAttribute('target')) link.setAttribute('target', cta.getAttribute('target'));
        if (cta.hasAttribute('rel')) link.setAttribute('rel', cta.getAttribute('rel'));
        textCell.push(document.createElement('br'));
        textCell.push(link);
      }
    }
    cells.push([
      imgEl,
      textCell.length > 0 ? textCell : ''
    ]);
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
