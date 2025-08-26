/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero41)'];

  // 2. Find the background image: prefer desktop, fallback to mobile
  let bgImg = '';
  const imgDiv = element.querySelector('.msc-image-banner__image');
  if (imgDiv) {
    // Prefer desktop image
    const desktopImg = imgDiv.querySelector('img.desktop');
    const mobileImg = imgDiv.querySelector('img.mobile');
    let imgEl = null;
    if (desktopImg && (desktopImg.getAttribute('src') || desktopImg.getAttribute('data-src'))) {
      imgEl = desktopImg;
    } else if (mobileImg && (mobileImg.getAttribute('src') || mobileImg.getAttribute('data-src'))) {
      imgEl = mobileImg;
    }
    if (imgEl) {
      // If data-src is filled but src is empty, set src
      if (!imgEl.getAttribute('src') && imgEl.getAttribute('data-src')) {
        imgEl.setAttribute('src', imgEl.getAttribute('data-src'));
      }
      bgImg = imgEl;
    }
  }

  // 3. Find the content: heading and CTA
  const contentEls = [];

  // Heading (optional)
  const contentDiv = element.querySelector('.msc-image-banner__content');
  if (contentDiv) {
    const heading = contentDiv.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      contentEls.push(heading);
    }
  }

  // CTA (optional)
  const ctaDiv = element.querySelector('.msc-image-banner__cta');
  if (ctaDiv) {
    ctaDiv.querySelectorAll('a').forEach(a => {
      contentEls.push(a);
    });
  }

  // Compose cells for the block table
  const cells = [
    headerRow, // Header
    [bgImg || ''], // Background image row (may be empty)
    [contentEls.length ? contentEls : ''] // Content row (may be empty)
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
