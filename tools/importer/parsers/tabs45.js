/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct tab panel children
  const tabPanels = element.querySelectorAll(':scope > .msc-tabs__panel');

  // Header row must match the example exactly
  const headerRow = ['Tabs (tabs45)'];

  // Map tab keys (from x-show) to tab labels, using content as fallback
  // Turkish keys to meaningful tab names
  const tabLabelMap = {
    'DijitalKonteynerTasimacilikDernegiDcsa': 'DCSA',
    'Bmedifact': 'EDIFact',
    'AmericanNationalStandardsİnstituteAnsix12': 'ANSI X12',
    'Smdg': 'SMDG',
    'UluslararasiKonteynerBurosuBic': 'BIC',
  };

  // Compose table rows
  const rows = [headerRow];

  tabPanels.forEach(panel => {
    // Find tab key from x-show attr
    const xShow = panel.getAttribute('x-show') || '';
    let tabKey = '';
    const match = xShow.match(/tab\s*===\s*['"]([^'"]+)/);
    if (match) {
      tabKey = match[1];
    }
    // Attempt to get label from map, fallback to tabKey or fallback to generic label
    let tabLabel = tabLabelMap[tabKey] || tabKey || 'Tab';

    // Extract tab content: find .msc-bodytext, else take all panel children
    let tabContent = panel.querySelector('.msc-bodytext');
    if (!tabContent) {
      // If not found, use all children as an array
      tabContent = Array.from(panel.children);
      // If still empty, use empty string
      if (tabContent.length === 0) tabContent = '';
    }
    rows.push([tabLabel, tabContent]);
  });

  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
