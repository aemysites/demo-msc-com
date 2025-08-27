/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: must be exact
  const headerRow = ['Hero (hero39)'];

  // --- Image Row ---
  let imageRow = [''];
  // Prefer desktop image if available, else any image inside the .msc-hero-immersive__image
  const imageDiv = element.querySelector('.msc-hero-immersive__image');
  if (imageDiv) {
    let img = imageDiv.querySelector('img.desktop') || imageDiv.querySelector('img');
    if (img) imageRow = [img];
  }

  // --- Content Row ---
  // Collect all content relevant to the hero: title, description, CTAs, and quicktool
  const contentItems = [];

  // Title (h1, possibly with <strong>)
  const titleDiv = element.querySelector('.msc-hero-immersive__title');
  if (titleDiv) contentItems.push(titleDiv);

  // Quicktool: contains substantial text and form fields (optional)
  const quicktoolDiv = element.querySelector('.msc-quicktool');
  if (quicktoolDiv) contentItems.push(quicktoolDiv);

  // Description (optional)
  const descDiv = element.querySelector('.msc-hero-immersive__description');
  if (descDiv && descDiv.textContent.trim()) contentItems.push(descDiv);

  // CTAs (optional)
  const ctasDiv = element.querySelector('.msc-hero-immersive__ctas');
  if (ctasDiv && ctasDiv.textContent.trim()) contentItems.push(ctasDiv);

  // Edge case: If all above are missing, fallback to headings and paragraphs
  if (contentItems.length === 0) {
    const headings = Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const paragraphs = Array.from(element.querySelectorAll('p'));
    if (headings.length || paragraphs.length) {
      contentItems.push(...headings, ...paragraphs);
    }
  }
  // Compose content row: always single cell
  const contentRow = [contentItems.length > 0 ? contentItems : ''];

  // Compose and replace table
  const cells = [
    headerRow,         // Row 1: block name
    imageRow,          // Row 2: image
    contentRow         // Row 3: main content
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
