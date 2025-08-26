/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by class name
  function findDirectChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList && el.classList.contains(className));
  }

  // Get direct .cell.small-12 child
  const cell = findDirectChildByClass(element, 'cell');
  if (!cell) return;

  // Get the section top content (contains heading, description, ctas, dropdowns)
  const sectionTop = cell.querySelector('.msc-section-top');
  if (!sectionTop) return;

  // --- First column: Collect all relevant visible content from sectionTop in order ---
  const col1Block = document.createElement('div');
  // Copy heading (h2)
  const heading = sectionTop.querySelector('h2');
  if (heading) col1Block.appendChild(heading);

  // Copy description (msc-section-desription)
  const desc = sectionTop.querySelector('.msc-section-desription');
  if (desc) {
    Array.from(desc.childNodes).forEach((node) => {
      col1Block.appendChild(node);
    });
  }

  // Copy all direct CTA buttons (msc-section-ctas) except dropdowns
  const ctaContainer = sectionTop.querySelector('.msc-section-ctas');
  if (ctaContainer) {
    // Only direct <a> children
    Array.from(ctaContainer.children).forEach((cta) => {
      if (cta.tagName === 'A') {
        col1Block.appendChild(cta);
      }
    });
  }

  // --- Second column: Gather all dropdown links (msc-cta-dropdown__list ul > li > a) ---
  let col2Block = null;
  if (ctaContainer) {
    const dropdownLists = ctaContainer.querySelectorAll('.msc-cta-dropdown__list ul');
    const links = [];
    dropdownLists.forEach(ul => {
      ul.querySelectorAll('a').forEach(link => links.push(link));
    });
    if (links.length > 0) {
      col2Block = document.createElement('div');
      links.forEach((link, idx) => {
        col2Block.appendChild(link);
        if (idx < links.length - 1) {
          col2Block.appendChild(document.createElement('br'));
        }
      });
    }
  }

  // Table header row must exactly match the example: a single cell!
  const headerRow = ['Columns (columns27)'];
  // Content row: one array with as many columns as needed
  const contentRow = [col1Block];
  if (col2Block) contentRow.push(col2Block);

  // To ensure the header row is a single cell, but content row has multiple columns:
  // This is the key fix: headerRow is an array with one cell, contentRow can have multiple cells
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  element.replaceWith(table);
}
