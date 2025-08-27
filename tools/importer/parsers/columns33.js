/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main wrapper that contains the three sections
  const wrapper = element.querySelector('.msc-footer__wrapper');
  if (!wrapper) return;

  // Find the three columns inside the wrapper
  const agency = wrapper.querySelector('.msc-footer__agency');
  const business = wrapper.querySelector('.msc-footer__business');
  const contact = wrapper.querySelector('.msc-footer__contact');

  // Helper function to collect block content
  function collectContent(root, selectors) {
    const arr = [];
    selectors.forEach(sel => {
      const el = root && root.querySelector(sel);
      if (el) arr.push(el);
    });
    return arr;
  }

  // Agency column: subtitle, agency picker, agency links
  let agencyContent = [];
  if (agency) {
    agencyContent = collectContent(
      agency,
      [
        'p.subtitle',
        '.msc-footer-agency__wrapper',
        '.msc-footer__agency-links'
      ]
    );
  }

  // Business column: just one nav
  let businessContent = [];
  if (business) {
    businessContent = collectContent(
      business,
      ['nav.msc-footer__links']
    );
  }

  // Contact column: menu and social
  let contactContent = [];
  if (contact) {
    contactContent = collectContent(
      contact,
      ['.msc-footer__menu', '.msc-footer__social']
    );
  }

  // Table header must match example: exactly one cell, not three
  const headerRow = ['Columns (columns33)'];
  const columnsRow = [agencyContent, businessContent, contactContent];
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
