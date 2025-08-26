/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get the first visible image in a card
  function getCardImage(card) {
    const imgs = card.querySelectorAll('img.msc-solution__card-image');
    // Prefer first non-d-none, fallback to first
    for (const img of imgs) {
      if (!img.classList.contains('d-none')) {
        return img;
      }
    }
    return imgs[0] || null;
  }

  // Helper: get card text content as array of elements (strong for title, others for desc/link)
  function getCardTextContent(card) {
    const result = [];
    const content = card.querySelector('.msc-solution__card-content');
    if (!content) return result;

    const titleDiv = content.querySelector('.msc-solution__card-content-title');
    if (titleDiv && titleDiv.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleDiv.textContent.trim();
      result.push(strong);
    }

    const textDiv = content.querySelector('.msc-solution__card-content-text');
    if (textDiv) {
      // Description(s)
      textDiv.querySelectorAll('p').forEach(p => {
        if (p.textContent && p.textContent.trim()) {
          result.push(p);
        }
      });
      // CTA link
      const link = textDiv.querySelector('a');
      if (link) {
        result.push(link);
      }
    }
    return result;
  }

  // Find cards
  const cards = element.querySelectorAll('.msc-solution__card');
  const rows = [['Cards (cards52)']];
  cards.forEach(card => {
    // image cell
    const img = getCardImage(card);
    // text/desc cell
    const textEls = getCardTextContent(card);
    rows.push([
      img || '',
      textEls.length === 1 ? textEls[0] : textEls
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
