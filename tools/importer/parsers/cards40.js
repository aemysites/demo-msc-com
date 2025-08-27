/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the slider wrapper
  const slider = element.querySelector('.msc-slider__slider');
  if (!slider) return;
  // Find all slides
  const slides = slider.querySelectorAll('.msc-slider__slide');
  if (!slides.length) return;

  // Table header matches exactly the block name from the example
  const rows = [['Cards (cards40)']];

  slides.forEach((slide) => {
    // Get the first image within the slide
    const img = slide.querySelector('img');
    // Compose text cell
    const content = slide.querySelector('.msc-slider__slide-content');
    const textContent = [];
    if (content) {
      // Category (if present), as a label (not required by example, but present in source)
      const category = content.querySelector('.msc-slider__slide-category');
      if (category && category.textContent.trim()) {
        const cat = document.createElement('div');
        cat.textContent = category.textContent;
        cat.style.fontSize = '12px';
        cat.style.fontWeight = 'bold';
        textContent.push(cat);
      }
      // Date (if present)
      const date = content.querySelector('.msc-slider__slide-date');
      if (date && date.textContent.trim()) {
        const d = document.createElement('div');
        d.textContent = date.textContent;
        d.style.fontSize = '11px';
        textContent.push(d);
      }
      // Title (required)
      const title = content.querySelector('.msc-slider__slide-title');
      if (title && title.textContent.trim()) {
        const heading = document.createElement('strong');
        heading.textContent = title.textContent;
        textContent.push(heading);
      }
      // CTA Link (if any)
      const cta = content.querySelector('a.msc-slider__slide-link');
      if (cta) {
        // Add a break for spacing if there is already text
        if (textContent.length > 0) {
          textContent.push(document.createElement('br'));
        }
        textContent.push(cta);
      }
    }
    // Only add rows with an image and some text content
    if (img && textContent.length > 0) {
      rows.push([img, textContent]);
    }
  });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
