/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the header row
  const headerRow = ['Hero (hero42)'];

  // --- IMAGE ROW ---
  // Find the image container within the banner
  let imageElem = null;
  const imgBannerImageDiv = element.querySelector('.msc-image-banner__image');
  if (imgBannerImageDiv) {
    // If there's a desktop image with src, use it. Else, fallback to mobile or first image
    const desktopImg = imgBannerImageDiv.querySelector('img.desktop[src]');
    if (desktopImg) {
      imageElem = desktopImg;
    } else {
      const mobileImg = imgBannerImageDiv.querySelector('img.mobile');
      imageElem = mobileImg || imgBannerImageDiv.querySelector('img');
    }
  }
  const imageRow = [imageElem ? imageElem : ''];

  // --- CONTENT ROW ---
  // Gather headline and CTA
  const contentParts = [];

  // Headline (h2)
  const titleDiv = element.querySelector('.msc-image-banner__content');
  if (titleDiv) {
    const h2 = titleDiv.querySelector('h2');
    if (h2) contentParts.push(h2);
  }

  // CTA button (link)
  const ctaDiv = element.querySelector('.msc-image-banner__cta');
  if (ctaDiv) {
    const ctaLink = ctaDiv.querySelector('a');
    if (ctaLink) contentParts.push(ctaLink);
  }

  const contentRow = [contentParts.length > 0 ? contentParts : ''];

  // Compose the block table
  const cells = [
    headerRow, // Header
    imageRow,  // Row with background image
    contentRow // Row with title and CTA
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
