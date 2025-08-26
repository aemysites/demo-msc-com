/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards18)'];
  const rows = [headerRow];

  // Find all card nodes in the carousel/slider
  const slides = element.querySelectorAll('.slick-track > .slick-slide');
  slides.forEach((slide) => {
    const card = slide.querySelector('.msc-direct-integrations__slider-card');
    if (!card) return;

    // First cell: image/icon
    let imageCell = null;
    const imageWrapper = card.querySelector('.msc-direct-integrations__card-image');
    if (imageWrapper) {
      const img = imageWrapper.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // Second cell: text block (title, description, CTA)
    const content = card.querySelector('.msc-direct-integrations__card-content');
    const textCellContent = [];

    // Title (as heading/strong)
    const title = content ? content.querySelector('.msc-direct-integrations__card-title') : null;
    if (title) {
      // Use a <strong> for semantic heading inside a card cell
      const strong = document.createElement('strong');
      // Use innerHTML to preserve potential formatting
      strong.innerHTML = title.innerHTML;
      textCellContent.push(strong);
    }

    // Description
    const descWrapper = content ? content.querySelector('.msc-direct-integrations__card-description') : null;
    if (descWrapper) {
      // Grab all <p> inside description
      const ps = descWrapper.querySelectorAll('p');
      ps.forEach((p) => {
        textCellContent.push(p);
      });
    }

    // CTA link
    const cta = content ? content.querySelector('a.msc-link-arrow-simple') : null;
    if (cta) {
      textCellContent.push(cta);
    }

    // Only create row if at least image and some text exists
    if (imageCell && textCellContent.length) {
      rows.push([
        imageCell,
        textCellContent
      ]);
    }
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
