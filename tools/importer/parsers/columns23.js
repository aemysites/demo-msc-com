/* global WebImporter */
export default function parse(element, { document }) {
  // Find the slick-slider block
  const slickSlider = element.querySelector('.msc-slider__slick-slider');
  if (!slickSlider) return;

  // Find the current slide
  const slide = slickSlider.querySelector('.msc-slider__slide');
  if (!slide) return;

  // Get the content column
  const contentCell = slide.querySelector('.msc-image-banner__content, .msc-slider__content');
  if (contentCell) {
    Array.from(contentCell.querySelectorAll('script, style')).forEach(el => el.remove());
  }

  // Get the image column (prefer desktop image)
  let imgCell = null;
  const imgWrapper = slide.querySelector('.msc-slider__image, .msc-image-banner__image');
  if (imgWrapper) {
    imgCell = imgWrapper.querySelector('img.desktop[src]');
    if (!imgCell) {
      imgCell = imgWrapper.querySelector('img.mobile[data-src], img.mobile[src], img');
    }
  }

  // Ensure the header row is a single-cell array
  const headerRow = ['Columns (columns23)'];
  // The content row may have two cells (columns)
  const contentRow = [contentCell, imgCell];
  const cells = [headerRow, contentRow];

  // Build the table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}