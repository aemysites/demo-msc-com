/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards6)'];
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;
  const slides = slickTrack.querySelectorAll('.slick-slide');
  const rows = [];
  slides.forEach((slide) => {
    const card = slide.querySelector('.msc-direct-integrations__slider-card');
    if (!card) return;
    // Get image
    let imgCell = '';
    const imgWrap = card.querySelector('.msc-direct-integrations__card-image');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img && (img.src || img.getAttribute('data-src'))) {
        imgCell = img;
      }
    }
    // Get title, description, CTA
    const textContent = [];
    const cardContent = card.querySelector('.msc-direct-integrations__card-content');
    if (cardContent) {
      const title = cardContent.querySelector('.msc-direct-integrations__card-title');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textContent.push(strong);
      }
      // Description (even if empty <p>)
      const descDiv = cardContent.querySelector('.msc-direct-integrations__card-description');
      if (descDiv) {
        // If there are <p> tags, include them, even if empty (to match example)
        const descPs = descDiv.querySelectorAll('p');
        if (descPs.length > 0) {
          descPs.forEach((p) => {
            // Always include the <p> for semantic structure, even if it's empty
            textContent.push(p);
          });
        } else {
          // If no <p> present, add an empty <p> for structural consistency
          const emptyP = document.createElement('p');
          textContent.push(emptyP);
        }
      } else {
        // If no descDiv at all, add an empty <p> for structural consistency
        const emptyP = document.createElement('p');
        textContent.push(emptyP);
      }
      // CTA link
      const link = cardContent.querySelector('a[href]');
      if (link && link.textContent && link.href) {
        // Clone the link to not move it from the DOM
        const linkClone = link.cloneNode(true);
        const linkP = document.createElement('p');
        linkP.appendChild(linkClone);
        textContent.push(linkP);
      }
    }
    rows.push([
      imgCell,
      textContent
    ]);
  });
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
