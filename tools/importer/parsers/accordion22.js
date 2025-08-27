/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion container (element) and the inner .grid-container > .grid-x > .cell > children
  let container = element;
  // The accordion items are direct children of .cell.small-12
  let cell = container.querySelector('.cell.small-12');
  let items;
  if (cell) {
    items = Array.from(cell.querySelectorAll(':scope > .msc-accordion__item'));
  } else {
    items = Array.from(container.querySelectorAll('.msc-accordion__item'));
  }
  const rows = [['Accordion']];
  items.forEach((item) => {
    // Title cell
    let header = item.querySelector('.msc-accordion__header');
    let titleEl = header ? header.querySelector('.msc-accordion__title') : null;
    let titleCell;
    if (titleEl) {
      titleCell = titleEl;
    } else if (header) {
      titleCell = document.createTextNode(header.textContent.trim());
    } else {
      titleCell = '';
    }
    // Content cell
    let body = item.querySelector('.msc-accordion__body');
    let contentElements = [];
    if (body) {
      // Only include visible/meaningful children (avoid empty .msc-accordion__share etc)
      Array.from(body.childNodes).forEach((child) => {
        if (child.nodeType === 1) {
          if (child.classList && child.classList.contains('msc-accordion__share')) {
            if (child.children.length > 0) {
              contentElements.push(child);
            }
          } else {
            contentElements.push(child);
          }
        } else if (child.nodeType === 3 && child.textContent.trim()) {
          contentElements.push(document.createTextNode(child.textContent));
        }
      });
      if (contentElements.length === 1) {
        contentElements = contentElements[0];
      } else if (contentElements.length === 0) {
        contentElements = '';
      }
    } else {
      contentElements = '';
    }
    rows.push([titleCell, contentElements]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
