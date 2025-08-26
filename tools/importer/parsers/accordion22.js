/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the Accordion block table
  // The header row must be ['Accordion']
  const rows = [ ['Accordion'] ];

  // Select all accordion items (direct children with .msc-accordion__item)
  const accordionItems = element.querySelectorAll('.msc-accordion__item');

  accordionItems.forEach((item) => {
    // Title cell: the .msc-accordion__title element (keep the tag, e.g., h3)
    const title = item.querySelector('.msc-accordion__title');

    // Content cell: the .msc-accordion__body (may have paragraphs, downloads, or extra wrappers)
    const body = item.querySelector('.msc-accordion__body');
    let contentNodes = [];
    if (body) {
      // Collect all non-empty elements (except empty .msc-accordion__share)
      body.childNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // element
          if (
            node.classList.contains('msc-accordion__share') &&
            !node.querySelector('button,a')
          ) {
            // skip empty share bar
            return;
          }
          contentNodes.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          // non-empty text node
          contentNodes.push(node);
        }
      });
      // fallback: if contentNodes is empty, use all children (just in case)
      if (contentNodes.length === 0) {
        contentNodes = Array.from(body.childNodes);
      }
    }
    rows.push([title, contentNodes]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
