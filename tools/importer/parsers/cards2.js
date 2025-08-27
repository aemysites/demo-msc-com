/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get visible image
  function getVisibleImg(card) {
    const imgs = Array.from(card.querySelectorAll('img'));
    for (let img of imgs) {
      if (!img.classList.contains('d-none')) {
        return img;
      }
    }
    return imgs[0] || null;
  }

  let container = element.querySelector('.msc-solution__container');
  if (!container) container = element;
  const cards = Array.from(container.querySelectorAll('.msc-solution__card'));

  const cells = [['Cards (cards2)']];

  cards.forEach(card => {
    const img = getVisibleImg(card);
    const content = card.querySelector('.msc-solution__card-content');
    const textCell = [];
    if (content) {
      // Title
      const title = content.querySelector('.msc-solution__card-content-title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textCell.push(strong);
      }
      // Description: all <p> in .msc-solution__card-content-text (include even if empty)
      const descContainer = content.querySelector('.msc-solution__card-content-text');
      if (descContainer) {
        const ps = Array.from(descContainer.querySelectorAll('p'));
        ps.forEach((p) => {
          // Always add <br> before a new paragraph if there is already something
          if (textCell.length > 0) {
            textCell.push(document.createElement('br'));
          }
          textCell.push(p);
        });
        // CTA: any <a> inside descContainer or directly under content
        let ctaLink = descContainer.querySelector('a');
        if (!ctaLink) {
          ctaLink = content.querySelector('a');
        }
        if (ctaLink) {
          textCell.push(document.createElement('br'));
          textCell.push(ctaLink);
        }
      } else {
        // If no description container, check for link directly under content
        const ctaLink = content.querySelector('a');
        if (ctaLink) {
          if (textCell.length > 0) {
            textCell.push(document.createElement('br'));
          }
          textCell.push(ctaLink);
        }
      }
    }
    if (textCell.length === 0) {
      textCell.push('');
    }
    cells.push([
      img || '',
      textCell.length === 1 ? textCell[0] : textCell
    ]);
  });
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
