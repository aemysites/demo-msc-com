/* global WebImporter */
export default function parse(element, { document }) {
  // Define block header row as in the example
  const headerRow = ['Cards (cards6)'];
  const cells = [headerRow];

  // Get the slick-track containing the slides
  const slickTrack = element.querySelector('.slick-track');
  if (!slickTrack) return;

  // Get all slick-slide elements (cards) in order
  const slides = slickTrack.querySelectorAll('.slick-slide');
  slides.forEach((slide) => {
    // Find the card container inside each slide
    const card = slide.querySelector('.msc-direct-integrations__slider-card');
    if (!card) return;

    // --- IMAGE (first cell) ---
    const imgContainer = card.querySelector('.msc-direct-integrations__card-image');
    let imgEl = imgContainer && imgContainer.querySelector('img');
    if (imgEl) {
      // Ensure that src is set, using data-src if needed
      if (!imgEl.src && imgEl.getAttribute('data-src')) {
        imgEl.src = imgEl.getAttribute('data-src');
      }
    }

    // --- TEXT CONTENT (second cell) ---
    const cardContent = card.querySelector('.msc-direct-integrations__card-content');
    const textContent = [];

    // Title: Use <strong> for semantic meaning (match example)
    let titleEl = cardContent && cardContent.querySelector('.msc-direct-integrations__card-title');
    if (titleEl) {
      // Reference the element, but wrap in <strong> for bold
      const strong = document.createElement('strong');
      strong.innerHTML = titleEl.innerHTML.trim();
      textContent.push(strong);
    }

    // Description (may be empty, skip if so)
    let descEl;
    if (cardContent) {
      const descDiv = cardContent.querySelector('.msc-direct-integrations__card-description');
      if (descDiv) {
        // Grab first non-empty <p>
        descEl = Array.from(descDiv.querySelectorAll('p')).find(p => p.textContent.trim().length > 0);
        if (descEl) textContent.push(descEl);
      }
    }

    // CTA link (optional)
    let linkEl;
    if (cardContent) {
      linkEl = cardContent.querySelector('a[href]');
      if (linkEl) {
        // Add a <br> before the CTA if there is other content
        if (textContent.length > 0) {
          textContent.push(document.createElement('br'));
        }
        textContent.push(linkEl);
      }
    }

    // Add row only if we have at least image and some text content
    if (imgEl && textContent.length > 0) {
      cells.push([imgEl, textContent]);
    } else if (imgEl) {
      // Fallback: just image if no text
      cells.push([imgEl, '']);
    } else if (textContent.length > 0) {
      // Fallback: just text if no image
      cells.push(['', textContent]);
    } // If both missing, skip row
  });

  // Create table using WebImporter helper and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
