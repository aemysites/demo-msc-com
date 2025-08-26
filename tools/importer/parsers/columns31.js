/* global WebImporter */
export default function parse(element, { document }) {
  // The table must have a header row with exactly one column, followed by a row with multiple columns.
  const headerRow = ['Columns (columns31)'];

  // Find the image column
  const imageWrap = element.querySelector('.msc-landing-blocks__item-image');
  let imageCell = '';
  if (imageWrap) {
    const img = imageWrap.querySelector('img');
    if (img) {
      imageCell = img;
    }
  }

  // Find the text column
  const infoWrap = element.querySelector('.msc-landing-blocks__item-info');
  let textCell = '';
  if (infoWrap) {
    // Use the full block of content for resilience
    const content = infoWrap.querySelector('.msc-landing-blocks__item-content');
    if (content) {
      textCell = content;
    }
  }

  // Table array: header row (one cell), content row (two cells)
  const cells = [
    headerRow,
    [imageCell, textCell]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
