/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example (must match exactly)
  const headerRow = ['Cards (cards9)'];
  const rows = [headerRow];

  // Find all card items (each .msc-landing-blocks__item is one card)
  const cardEls = element.querySelectorAll('.msc-landing-blocks__item');
  cardEls.forEach(cardEl => {
    // First column: image/icon (mandatory)
    let imgCell;
    // Prefer the actual <span class="ima-ar"> if present, otherwise the image
    const imgSpan = cardEl.querySelector('.msc-landing-blocks__item-image .ima-ar');
    if (imgSpan) {
      imgCell = imgSpan;
    } else {
      const imgEl = cardEl.querySelector('.msc-landing-blocks__item-image img');
      imgCell = imgEl ? imgEl : document.createTextNode('');
    }

    // Second column: text/heading/desc/cta
    const textCell = document.createElement('div');
    // Heading: use the h2 title, keep as heading for semantics
    const title = cardEl.querySelector('.msc-section-title');
    if (title) {
      const h = document.createElement('h2');
      // Move all children (preserve inline markup)
      while (title.childNodes.length > 0) {
        h.appendChild(title.childNodes[0]);
      }
      textCell.appendChild(h);
    }
    // Description (may contain <p>, <ul>, etc). Include all child nodes from msc-section-description
    const desc = cardEl.querySelector('.msc-section-description');
    if (desc) {
      desc.childNodes.forEach((node) => {
        // append only non-empty text, <p>, <ul>, <ol>, etc, but skip empty/whitespace nodes
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'P' && !node.textContent.trim()) return;
          textCell.appendChild(node.cloneNode(true));
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textCell.appendChild(document.createTextNode(node.textContent));
        }
      });
    }
    // CTA (link or button)
    const cta = cardEl.querySelector('.msc-cta');
    if (cta) {
      textCell.appendChild(cta);
    }
    rows.push([imgCell, textCell]);
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
