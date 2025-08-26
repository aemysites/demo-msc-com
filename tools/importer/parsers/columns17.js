/* global WebImporter */
export default function parse(element, { document }) {
  // Find all slick slides (each is a column-row pair)
  const slides = element.querySelectorAll('.slick-slide');

  // Header row as per block name
  const rows = [['Columns (columns17)']];

  slides.forEach((slide) => {
    // Each slide contains .msc-slider__slide > .msc-slider__container
    const slideWrap = slide.querySelector('.msc-slider__slide');
    if (!slideWrap) return;
    const container = slideWrap.querySelector('.msc-slider__container');
    if (!container) return;

    // Usually two cells: one with image(s), one with content
    // .msc-slider__image.msc-image-banner__image (image cell)
    // .msc-image-banner__content.msc-slider__content.bg-primary (content cell)

    // Get image cell
    let img = null;
    const imgCell = container.querySelector('.msc-slider__image, .msc-image-banner__image');
    if (imgCell) {
      // Try to find a desktop image with src, otherwise mobile, otherwise any img
      img = imgCell.querySelector('img.desktop[src], img.desktop[data-src], img.mobile[src], img.mobile[data-src], img');
      if (img) {
        // Normalize lazy images: set src if only data-src is present
        if (!img.src && img.getAttribute('data-src')) {
          img.src = img.getAttribute('data-src');
        }
      }
    }

    // Get content cell
    const contentCell = container.querySelector('.msc-image-banner__content, .msc-slider__content');
    let contentArr = [];
    if (contentCell) {
      // Grab heading(s)
      const heading = contentCell.querySelector('h2, h1, h3, h4, h5, h6');
      if (heading) contentArr.push(heading);
      // Grab description text
      const desc = contentCell.querySelector('.msc-description');
      if (desc) contentArr.push(desc);
      // Grab CTA
      const cta = contentCell.querySelector('.msc-image-banner__cta a, .msc-slider__cta a');
      if (cta) contentArr.push(cta);
    }
    // If no content, create an empty div so the cell isn't empty
    if (contentArr.length === 0) contentArr.push(document.createElement('div'));

    // Compose row: column 1 is content, column 2 is image (text-left, image-right)
    rows.push([
      contentArr.length === 1 ? contentArr[0] : contentArr, // preserve as HTML element or array
      img
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
