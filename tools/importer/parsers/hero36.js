/* global WebImporter */
export default function parse(element, { document }) {
  // Header row (block name, as required by the spec)
  const cells = [['Hero (hero36)']];

  // Background image row (not present in the provided HTML)
  cells.push(['']);

  // Content row: capture all visible text and semantic structure
  // The only content is inside the form element in the HTML
  const form = element.querySelector('form');
  let contentParts = [];
  if (form) {
    // 1. Heading (title)
    const heading = form.querySelector('.msc-newsletter-subscription__title, h1, h2, h3, h4, h5, h6');
    if (heading) contentParts.push(heading);
    // 2. Input placeholder as paragraph
    const input = form.querySelector('input[type="email"]');
    if (input && input.placeholder) {
      const placeholderP = document.createElement('p');
      placeholderP.textContent = input.placeholder;
      contentParts.push(placeholderP);
    }
    // 3. Call to action button as link with redirect URL
    const button = form.querySelector('button');
    if (button) {
      const href = element.getAttribute('data-redirect-url') || '#';
      const link = document.createElement('a');
      link.href = href;
      link.textContent = button.textContent.trim();
      contentParts.push(link);
    }
  } else {
    // Fallback: get all text and interactive elements at top level
    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) contentParts.push(heading);
    const input = element.querySelector('input[type="email"]');
    if (input && input.placeholder) {
      const placeholderP = document.createElement('p');
      placeholderP.textContent = input.placeholder;
      contentParts.push(placeholderP);
    }
    const button = element.querySelector('button');
    if (button) {
      const href = element.getAttribute('data-redirect-url') || '#';
      const link = document.createElement('a');
      link.href = href;
      link.textContent = button.textContent.trim();
      contentParts.push(link);
    }
  }

  // Add all referenced elements in a single cell (single column)
  cells.push([contentParts]);

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
