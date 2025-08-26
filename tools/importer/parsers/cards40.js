/* global WebImporter */
export default function parse(element, { document }) {
  // Find the slider containing the cards
  const slider = element.querySelector('.msc-slider__slider');
  if (!slider) return;

  // Find all card slides
  const slideContainers = slider.querySelectorAll('.slick-slide .msc-slider__slide');

  // Prepare the table rows
  const rows = [];
  rows.push(['Cards (cards40)']); // Header row

  slideContainers.forEach(slide => {
    // Image: Use the image element directly if present
    let img = slide.querySelector('img');

    // Text cell composition
    const content = slide.querySelector('.msc-slider__slide-content');
    const textCell = document.createElement('div');

    if (content) {
      // Category
      const category = content.querySelector('.msc-slider__slide-category');
      if (category && category.textContent.trim()) {
        const catStrong = document.createElement('strong');
        catStrong.textContent = category.textContent.trim();
        textCell.appendChild(catStrong);
        textCell.appendChild(document.createElement('br'));
      }
      // Date
      const date = content.querySelector('.msc-slider__slide-date');
      if (date && date.textContent.trim()) {
        const dateSpan = document.createElement('span');
        dateSpan.textContent = date.textContent.trim();
        dateSpan.style.fontSize = '90%';
        textCell.appendChild(dateSpan);
        textCell.appendChild(document.createElement('br'));
      }
      // Title
      const title = content.querySelector('.msc-slider__slide-title');
      if (title && title.textContent.trim()) {
        const titleDiv = document.createElement('div');
        titleDiv.style.fontWeight = 'bold';
        titleDiv.textContent = title.textContent.trim();
        textCell.appendChild(titleDiv);
      }
      // Link (CTA)
      const cta = content.querySelector('a');
      if (cta) {
        textCell.appendChild(document.createElement('br'));
        textCell.appendChild(cta);
      }
    }
    rows.push([img, textCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
