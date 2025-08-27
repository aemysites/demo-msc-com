/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header
  const headerRow = ['Cards (cardsNoImages26)'];
  const rows = [headerRow];

  // Find the slider track containing the slides
  const track = element.querySelector('.slick-track');
  if (!track) return;

  // Each .slick-slide contains a card
  const slides = track.querySelectorAll('.slick-slide');
  slides.forEach((slide) => {
    const slideContent = slide.querySelector('.msc-slider__slide');
    if (!slideContent) return;
    const link = slideContent.querySelector('a');
    if (!link) return;

    // Prepare card content as a fragment
    const cardParts = [];
    // Extract date, title, category as actual elements
    const date = link.querySelector('.msc-slider__slide-date');
    if (date) cardParts.push(date);
    const title = link.querySelector('.msc-slider__slide-title');
    if (title) cardParts.push(title);
    const category = link.querySelector('.msc-slider__slide-category');
    if (category) cardParts.push(category);

    // Reference the existing <a> element, but clean up its children so only the three parts are present
    // Remove any extraneous content
    Array.from(link.childNodes).forEach((child) => {
      if (!cardParts.includes(child)) link.removeChild(child);
    });
    cardParts.forEach((part) => {
      if (!link.contains(part)) link.appendChild(part);
    });
    rows.push([link]); // One card per row
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
