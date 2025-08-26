/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by block spec
  const headerRow = ['Tabs (tabs5)'];

  // Get the nav with tab labels
  const nav = element.querySelector('.msc-tabs__nav');
  const tabLinks = nav.querySelectorAll('a.msc-tabs__tab');

  // Get all tab panels
  const panelsContainer = element.querySelector('.msc-tabs__panels');
  const panelEls = Array.from(panelsContainer.querySelectorAll('.msc-tabs__panel'));

  // Gather tab info: label and tabId
  const tabs = [];
  tabLinks.forEach((tabLink) => {
    const labelEl = tabLink.querySelector('span');
    const label = labelEl ? labelEl.textContent.trim() : tabLink.textContent.trim();
    const tabId = tabLink.getAttribute('x-ref');
    tabs.push({ tabId, label });
  });

  // Assemble rows: header, then one row per tab
  const rows = [headerRow];

  tabs.forEach((tab) => {
    // Find the panel that corresponds to this tabId
    // x-show = tab === 'TABID'
    let panel = panelEls.find(panelEl => {
      const xShow = panelEl.getAttribute('x-show') || '';
      return xShow.includes(`'${tab.tabId}'`);
    });
    if (!panel) return;
    // The panel's main content is inside .msc-bodytext or .msc-title .msc-bodytext
    let contentEl = null;
    contentEl = panel.querySelector('.msc-title .msc-bodytext, .msc-bodytext');
    // If none found, fallback to panel's main content
    if (!contentEl) contentEl = panel;
    rows.push([
      tab.label,
      contentEl
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
