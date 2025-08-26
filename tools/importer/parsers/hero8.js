/* global WebImporter */
export default function parse(element, { document }) {
  // Find the background image: first .msc-image-and-content__image img[data-src]
  let bgImg = null;
  const imageContainers = element.querySelectorAll('.msc-image-and-content__image');
  for (const container of imageContainers) {
    const img = container.querySelector('img');
    if (img && (img.getAttribute('data-src') || img.getAttribute('src'))) {
      bgImg = img;
      break;
    }
  }

  // Find the first .msc-image-and-content__info block for the title and description
  let contentBlock = null;
  const infoBlocks = element.querySelectorAll('.msc-image-and-content__info');
  if (infoBlocks.length > 0) {
    contentBlock = infoBlocks[0];
  } else {
    // Fallback: look for title + description directly
    const frag = document.createElement('div');
    const title = element.querySelector('.msc-section-title');
    if (title) frag.appendChild(title);
    const desc = element.querySelector('.msc-section-description');
    if (desc) frag.appendChild(desc);
    contentBlock = frag.childNodes.length > 0 ? frag : '';
  }

  // If missing image or content, fill with '' accordingly
  const cells = [
    ['Hero (hero8)'],
    [bgImg ? bgImg : ''],
    [contentBlock ? contentBlock : '']
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}