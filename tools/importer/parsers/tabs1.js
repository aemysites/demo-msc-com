/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches the example block name and variant
  const headerRow = ['Tabs (tabs1)'];

  // Extract immediate tab elements by their structure
  // Look for div.cell children that represent each tab
  const tabCells = Array.from(element.querySelectorAll(':scope > .cell'));

  // Tab labels and tab contents
  // Try to dynamically extract tab labels from filter buttons if present
  let tabLabels = [];
  let tabContents = [];

  // Find filter buttons
  const filterCtas = element.querySelectorAll('.msc-filter__ctas');
  // If two sets are present due to templates, use the first non-template one
  let realFilterCtas = null;
  for (const cta of filterCtas) {
    if (!cta.closest('template')) {
      realFilterCtas = cta;
      break;
    }
  }

  if (realFilterCtas) {
    const buttons = Array.from(realFilterCtas.querySelectorAll('button'));
    tabLabels = buttons.map(btn => btn.textContent.trim());
    // For each tab, compose its content:
    // We'll use the corresponding button as the label, and relevant surrounding content for tab content
    for (let i = 0; i < buttons.length; i++) {
      // Compose tab content for each tab. Include content from the related sections for full fidelity.
      // Pick up the filter buttons and result/filter area for each tab
      const tabContent = document.createElement('div');
      tabContent.appendChild(buttons[i]); // Reference the actual button from the page
      // Add the results count if present
      const resultSection = element.querySelector('.msc-press-room-releases__filters__result-and-filter__result');
      if (resultSection) tabContent.appendChild(resultSection);
      // Add the filter controls area if present
      const filterArea = element.querySelector('.msc-press-room-releases__filters__result-and-filter__filter');
      if (filterArea) tabContent.appendChild(filterArea);
      tabContents.push(tabContent);
    }
  } else {
    // If no buttons found, fallback: Look for cells with filter titles
    for (const cell of tabCells) {
      // If there's a filter button, use its label, otherwise fallback to text
      const btn = cell.querySelector('button');
      if (btn) {
        tabLabels.push(btn.textContent.trim());
      } else {
        // Fallback: use first text, label, or heading inside
        const text = cell.textContent.trim();
        tabLabels.push(text.split('\n')[0] || 'Tab');
      }
      tabContents.push(cell);
    }
  }

  // Edge case: If no tab labels or content found, abort and don't replace
  if (!tabLabels.length || !tabContents.length) return;

  // Compose table rows: header, labels, contents
  // Table is: [headerRow, tabLabelRow, tabContentRow]
  const tabLabelRow = tabLabels;
  const tabContentRow = tabContents;

  const tableRows = [headerRow, tabLabelRow, tabContentRow];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the element with the constructed block
  element.replaceWith(block);
}
