/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Get the tab labels (all <a> in nav, ignore indicator)
  const nav = element.querySelector('.msc-tabs__nav');
  const tabLinks = Array.from(nav.querySelectorAll('a.msc-tabs__tab'));

  // 2. Get all tab panel elements, in order
  const panelsContainer = element.querySelector('.msc-tabs__panels');
  const panelEls = Array.from(panelsContainer.querySelectorAll(':scope > .msc-tabs__panel'));

  // 3. Build rows for block table
  //    Each row: [tab label text, tab content (reference to existing .msc-bodytext content)]
  const rows = tabLinks.map((tabLink, idx) => {
    // Get tab label (prefer <span>, fallback to textContent)
    let tabLabel = '';
    const span = tabLink.querySelector('span');
    if (span) {
      tabLabel = span.textContent.trim();
    } else {
      tabLabel = tabLink.textContent.trim();
    }

    // Get tab panel content matching this tab (same order)
    let tabContent = '';
    if (panelEls[idx]) {
      // Try to get .msc-bodytext, otherwise the panel itself
      const body = panelEls[idx].querySelector('.msc-bodytext');
      if (body) {
        tabContent = body;
      } else {
        tabContent = panelEls[idx];
      }
    } else {
      // Fallback: empty div
      tabContent = document.createElement('div');
    }

    return [tabLabel, tabContent];
  });

  // 4. Table header row
  const headerRow = ['Tabs (tabs5)'];

  // 5. Assemble table data
  const cells = [headerRow, ...rows];

  // 6. Create the block table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
