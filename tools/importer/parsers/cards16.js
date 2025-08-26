/* global WebImporter */
export default function parse(element, { document }) {
  // Find the slider block containing cards
  const slider = element.querySelector('.msc-slider__slider');
  if (!slider) return;

  // Find all slides for the cards
  const slides = slider.querySelectorAll('.msc-slider__slide');
  if (!slides.length) return;

  // Build cards block table
  const rows = [['Cards (cards16)']];

  slides.forEach(slide => {
    // --- Image cell ---
    let imageCell = '';
    const imageContainer = slide.querySelector('.msc-slider__slide-image img');
    if (imageContainer) {
      imageCell = imageContainer;
    }

    // --- Text cell ---
    const textCellContent = [];
    const slideContent = slide.querySelector('.msc-slider__slide-content');
    if (slideContent) {
      // Date (as paragraph)
      const date = slideContent.querySelector('.msc-slider__slide-date');
      if (date && date.textContent.trim()) {
        const dateP = document.createElement('p');
        dateP.textContent = date.textContent.trim();
        textCellContent.push(dateP);
      }
      // Title (as <strong>)
      const title = slideContent.querySelector('.msc-slider__slide-title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textCellContent.push(strong);
      }
      // CTA (as link in a paragraph)
      const link = slideContent.querySelector('a');
      if (link) {
        const linkP = document.createElement('p');
        linkP.appendChild(link);
        textCellContent.push(linkP);
      }
    }
    rows.push([imageCell, textCellContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
