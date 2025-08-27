/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Cards (cards37)'];
  const rows = [headerRow];

  // Find the slider block that contains the slides
  const slider = element.querySelector('.msc-slider__slick-slider');
  if (!slider) return;

  // Find all cards/slides (each contains image, title, CTA)
  const slideDivs = slider.querySelectorAll('.msc-slider__slide');
  slideDivs.forEach((slide) => {
    // First cell: the image
    const img = slide.querySelector('img');
    let imgElem = null;
    if (img) {
      imgElem = img;
    }

    // Second cell: Title, CTA link (no description text in this HTML)
    const content = slide.querySelector('.msc-slider__slide-content');
    const cellContent = [];
    if (content) {
      // Title: always bold (strong)
      const title = content.querySelector('.msc-slider__slide-title');
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        cellContent.push(strong);
      }
      // CTA link (placed below title)
      const link = content.querySelector('a');
      if (link) {
        // Add a <br> if there's a title and a link to visually separate them
        if (cellContent.length > 0) {
          cellContent.push(document.createElement('br'));
        }
        cellContent.push(link);
      }
    }
    // Use array for second cell if there are multiple elements; else, use single element
    rows.push([imgElem, cellContent.length === 1 ? cellContent[0] : cellContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
