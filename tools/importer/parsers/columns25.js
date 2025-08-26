/* global WebImporter */
export default function parse(element, { document }) {
  // Locate main footer wrapper
  const wrapper = element.querySelector('.msc-footer__wrapper');
  if (!wrapper) return;

  // Helper to extract content for the business column
  function getBusinessCell() {
    const business = wrapper.querySelector('.msc-footer__business');
    if (!business) return document.createElement('div');
    const nav = business.querySelector('nav.msc-footer__links');
    if (!nav) return document.createElement('div');
    const cellDiv = document.createElement('div');
    // Subtitle
    const subtitle = nav.querySelector('.subtitle');
    if (subtitle) {
      const strong = document.createElement('strong');
      strong.textContent = subtitle.textContent.trim();
      cellDiv.appendChild(strong);
      cellDiv.appendChild(document.createElement('br'));
    }
    // Links
    const ul = nav.querySelector('ul');
    if (ul && ul.children.length) {
      const links = [];
      Array.from(ul.children).forEach((li, idx, arr) => {
        const a = li.querySelector('a');
        if (a) {
          links.push(a);
          if (idx < arr.length - 1) {
            links.push(document.createTextNode(' / '));
          }
        }
      });
      // Inline links
      links.forEach(l => cellDiv.appendChild(l));
    }
    return cellDiv;
  }

  // Helper to extract logo
  function getLogoCell() {
    const logo = wrapper.querySelector('.msc-footer__logo');
    if (!logo) return document.createElement('div');
    const logoLink = logo.querySelector('a');
    return logoLink ? logoLink : document.createElement('div');
  }

  // Helper to extract contact/social column
  function getContactCell() {
    const contact = wrapper.querySelector('.msc-footer__contact');
    if (!contact) return document.createElement('div');
    const cellDiv = document.createElement('div');
    // Subtitle
    const subtitleNav = contact.querySelector('nav[aria-labelledby="footer-menu-contact"] .subtitle');
    if (subtitleNav) {
      const strong = document.createElement('strong');
      strong.textContent = subtitleNav.textContent.trim();
      cellDiv.appendChild(strong);
      cellDiv.appendChild(document.createElement('br'));
    }
    // Social links
    const socialsNav = contact.querySelector('nav.msc-footer__social-links');
    if (socialsNav) {
      const ul = socialsNav.querySelector('ul');
      if (ul) {
        const socialSpan = document.createElement('span');
        Array.from(ul.children).forEach((li, idx, arr) => {
          const a = li.querySelector('a');
          if (a) {
            socialSpan.appendChild(a);
            if (idx < arr.length - 1) socialSpan.appendChild(document.createTextNode(' '));
          }
        });
        cellDiv.appendChild(socialSpan);
      }
    }
    return cellDiv;
  }

  // Compose table as per example: One header row, one data row, three columns
  const headerRow = ['Columns (columns25)'];
  const contentRow = [getBusinessCell(), getLogoCell(), getContactCell()];

  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
