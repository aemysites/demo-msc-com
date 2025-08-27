/* global WebImporter */
export default function parse(element, { document }) {
  // Find all slides
  const slides = Array.from(element.querySelectorAll('.msc-slider__slide'));

  // For each slide, prepare a column cell
  const columns = slides.map((slide) => {
    // Container for the slide
    const container = slide.querySelector('.msc-slider__container');
    if (!container) return '';

    // Get the two main areas: image and content
    const imageDiv = container.querySelector('.msc-slider__image');
    const contentDiv = container.querySelector('.msc-slider__content');

    // Image: prefer img.desktop, else mobile, else any img
    let imgEl = null;
    if (imageDiv) {
      imgEl = imageDiv.querySelector('img.desktop') || imageDiv.querySelector('img.mobile') || imageDiv.querySelector('img');
    }

    // Compose content: title, description, CTA (keep references)
    const contentNodes = [];
    if (contentDiv) {
      const titleEl = contentDiv.querySelector('.msc-section-title');
      if (titleEl) contentNodes.push(titleEl);
      const descEl = contentDiv.querySelector('.msc-description');
      if (descEl) contentNodes.push(descEl);
      const ctaEl = contentDiv.querySelector('.msc-image-banner__cta a');
      if (ctaEl) contentNodes.push(ctaEl);
    }

    // The column cell should contain the content (heading, desc, link) and the image, as separate blocks
    // Use an array so all elements appear in order in the cell
    const cell = [];
    if (contentNodes.length) {
      cell.push(...contentNodes);
    }
    if (imgEl) {
      cell.push(imgEl);
    }
    return cell;
  });

  // Table header (matches example exactly)
  const headerRow = ['Columns (columns17)'];

  // Build the table (header row, then content row with one cell per column)
  const cells = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
