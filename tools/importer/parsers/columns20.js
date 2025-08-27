/* global WebImporter */
export default function parse(element, { document }) {
  // Table header for block type and variant
  const header = ['Columns (columns20)'];

  // --- Left column content: Title, description, CTA, stats ---
  const wrapper = element.querySelector('.msc-about-us__wrapper');
  let leftContentItems = [];
  if (wrapper) {
    const cell = wrapper.querySelector('.cell.small-12');
    if (cell) {
      // Title
      const h2 = cell.querySelector('h2');
      if (h2) leftContentItems.push(h2);
      // Description
      const desc = cell.querySelector('.msc-section-description');
      if (desc) leftContentItems.push(desc);
      // Only the first visible CTA (there seem to be duplicates due to mobile/desktop logic)
      let cta = cell.querySelector('.msc-about-us__cta a');
      if (cta) leftContentItems.push(cta);
    }
    // Stats icons block (optional, if present)
    const statsBlock = wrapper.querySelector('.msc-icon-stats');
    if (statsBlock) leftContentItems.push(statsBlock);
  }

  // --- Right column content: Main background image ---
  const imageContainer = element.querySelector('.msc-about-us__image');
  let rightContentItem = null;
  if (imageContainer) {
    // Prefer desktop image if present with src
    let img = imageContainer.querySelector('img.desktop[src]');
    if (!img) {
      img = imageContainer.querySelector('img.mobile[src]');
    }
    if (!img) {
      // fallback to any img
      img = imageContainer.querySelector('img');
    }
    if (img) rightContentItem = img;
  }

  // Build table cells: two columns in the content row
  const cells = [
    header, // Header row
    [leftContentItems, rightContentItem ? [rightContentItem] : []]
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
