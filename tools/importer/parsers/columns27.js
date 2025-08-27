/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Columns (columns27)'];

  // Find the main content cell
  const cell = element.querySelector('.cell.small-12');
  if (!cell) return;

  // LEFT COLUMN: Only separator, heading, and description
  const leftCol = document.createElement('div');

  // Separator (if present)
  const separator = cell.querySelector('.msc-line-separator');
  if (separator) leftCol.appendChild(separator);

  // Heading and description must be added individually, not the whole section-top
  const sectionTop = cell.querySelector('.msc-section-top');
  if (sectionTop) {
    const heading = sectionTop.querySelector('.msc-section-title');
    if (heading) leftCol.appendChild(heading);
    const description = sectionTop.querySelector('.msc-section-desription');
    if (description) leftCol.appendChild(description);
  }

  if (!leftCol.hasChildNodes()) leftCol.appendChild(document.createElement('div'));

  // RIGHT COLUMN: Only CTAs (links and dropdown button)
  const rightCol = document.createElement('div');
  const ctaContainer = cell.querySelector('.msc-section-ctas');
  if (ctaContainer) {
    ctaContainer.querySelectorAll('a.msc-cta').forEach((a) => {
      rightCol.appendChild(a);
    });
    ctaContainer.querySelectorAll('.msc-cta-dropdown').forEach(dropdown => {
      const btn = dropdown.querySelector('button.msc-cta');
      if (btn) rightCol.appendChild(btn);
    });
  }
  if (!rightCol.hasChildNodes()) rightCol.appendChild(document.createElement('div'));

  // Compose table and replace
  const block = WebImporter.DOMUtils.createTable([headerRow, [leftCol, rightCol]], document);
  element.replaceWith(block);
}
