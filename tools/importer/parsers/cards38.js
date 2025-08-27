/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards38)'];
  const rows = [headerRow];

  // Get all direct card items
  const items = Array.from(element.querySelectorAll(':scope > .msc-press-room-news-list__item'));

  items.forEach((item) => {
    // IMAGE: always present
    const imgSpan = item.querySelector('.msc-press-room-news-list__item-image');
    let imageEl = imgSpan ? imgSpan.querySelector('img') : null;

    // RIGHT CELL: text content
    const infoDiv = item.querySelector('.msc-press-room-news-list__item-info');
    const categoryP = imgSpan ? imgSpan.querySelector('.msc-press-room-news-list__item-category') : null;
    const dateP = infoDiv ? infoDiv.querySelector('.msc-press-room-news-list__item-date') : null;
    const titleP = infoDiv ? infoDiv.querySelector('.msc-press-room-news-list__item-title') : null;
    const readMoreA = infoDiv ? infoDiv.querySelector('a.msc-press-room-news-list__item-link') : null;

    const textElements = [];

    // Category as label (optional)
    if (categoryP && categoryP.textContent.trim()) {
      const label = document.createElement('div');
      label.textContent = categoryP.textContent.trim();
      label.style.fontWeight = 'bold';
      label.style.fontSize = '0.9em';
      textElements.push(label);
    }
    // Date (optional)
    if (dateP && dateP.textContent.trim()) {
      const date = document.createElement('div');
      date.textContent = dateP.textContent.trim();
      date.style.fontSize = 'smaller';
      textElements.push(date);
    }
    // Title (required)
    if (titleP && titleP.textContent.trim()) {
      const heading = document.createElement('strong');
      heading.textContent = titleP.textContent.trim();
      textElements.push(heading);
    }
    // Call to Action (optional)
    if (readMoreA) {
      // Reference the existing anchor, but strip any classes for cleanliness
      const link = readMoreA;
      link.removeAttribute('class');
      textElements.push(document.createElement('br'));
      textElements.push(link);
    }

    rows.push([
      imageEl,
      textElements
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
