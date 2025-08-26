/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main content and image columns
  const contentInfo = element.querySelector('.msc-image-and-content__info');
  const imageSection = element.querySelector('.msc-image-and-content__image img');

  // Edge case: if .msc-image-and-content__info or imageSection is missing, fallback to mobile structure
  let leftCol, rightCol;
  if (contentInfo && imageSection) {
    leftCol = contentInfo;
    rightCol = imageSection;
  } else {
    // Mobile or fallback: content directly in .msc-image-and-content__content
    const mobileContent = element.querySelector('.msc-image-and-content__content');
    if (mobileContent) {
      // For leftCol: collect heading, description, and button
      const frag = document.createDocumentFragment();
      const heading = mobileContent.querySelector('.msc-section-title');
      if (heading) frag.appendChild(heading);
      const desc = mobileContent.querySelector('.msc-section-description');
      if (desc) frag.appendChild(desc);
      const btn = mobileContent.querySelector('.msc-cta');
      if (btn) frag.appendChild(btn);
      leftCol = frag;
      // For rightCol: find the first image
      const mobImg = mobileContent.querySelector('.msc-image-and-content__image img');
      if (mobImg) rightCol = mobImg;
    }
  }

  // Safety: ensure both columns are defined
  if (!leftCol) {
    leftCol = document.createElement('div');
    leftCol.textContent = '';
  }
  if (!rightCol) {
    rightCol = document.createElement('div');
    rightCol.textContent = '';
  }

  // 2. Build the columns block table
  const headerRow = ['Columns (columns56)'];
  const contentRow = [leftCol, rightCol];
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // 3. Replace original element
  element.replaceWith(table);
}
