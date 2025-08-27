/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns47)'];

  // Find the grid container that holds columns
  const gridContainer = element.querySelector('.grid-container');
  if (!gridContainer) return;
  const cell = gridContainer.querySelector('.cell');
  if (!cell) return;

  // Find all .msc-image-and-content__content elements that are direct children and not inside <template>
  let mainContent = null;
  const directChildren = Array.from(cell.children);
  for (const child of directChildren) {
    if (child.classList && child.classList.contains('msc-image-and-content__content') && !child.closest('template')) {
      mainContent = child;
      break;
    }
  }
  // Fallback: pick the first .msc-image-and-content__content not in <template>
  if (!mainContent) {
    const allContents = cell.querySelectorAll('.msc-image-and-content__content');
    for (const c of allContents) {
      if (!c.closest('template')) {
        mainContent = c;
        break;
      }
    }
  }
  if (!mainContent) return;

  // Now, extract left column (image) and right column (info)
  // Left column: find first .msc-image-and-content__image with <img>
  let leftCell = '';
  const images = mainContent.querySelectorAll('.msc-image-and-content__image');
  for (const imgDiv of images) {
    const img = imgDiv.querySelector('img');
    if (img) {
      leftCell = img;
      break;
    }
  }

  // Right column: the .msc-image-and-content__info div
  let rightCell = '';
  const info = mainContent.querySelector('.msc-image-and-content__info');
  if (info) {
    rightCell = info;
  } else {
    // Fallback: mobile layout - gather heading, description, and button
    const frag = document.createElement('div');
    const h3 = mainContent.querySelector('h3');
    if (h3) frag.appendChild(h3);
    const desc = mainContent.querySelector('.msc-section-description');
    if (desc) frag.appendChild(desc);
    const btn = mainContent.querySelector('.msc-cta');
    if (btn) frag.appendChild(btn);
    rightCell = frag;
  }

  // Build cells for the block table
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
