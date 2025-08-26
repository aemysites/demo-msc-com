/* global WebImporter */
export default function parse(element, { document }) {
  // --- Step 1: Get all tab labels ---
  // Look for all .msc-filter__ctas buttons (tab choices)
  // Only use the visible/active filter buttons area (there are two in the HTML due to a template, but only one is rendered)
  // We'll take the last .msc-filter__ctas as the visible one (as in the screenshot)
  const ctas = element.querySelectorAll('.msc-filter__ctas');
  let tabButtons = [];
  if (ctas.length > 0) {
    // Use the last one, which is not in a template
    const lastCtas = ctas[ctas.length - 1];
    tabButtons = Array.from(lastCtas.querySelectorAll('button'));
  }

  // --- Step 2: Get the Result Count ---
  // Appears in .msc-press-room-releases__total
  let resultCount = '';
  const resultDiv = element.querySelector('.msc-press-room-releases__total');
  if (resultDiv) {
    resultCount = resultDiv.textContent.trim();
  }

  // --- Step 3: Build the content cell ---
  // The screenshot shows:
  // + tabs as tab labels
  // + below: result count and (optionally) filter UI
  // We'll put the result count and the (non-template) .msc-filter__filters and .msc-press-room-releases__filters__result-and-filter as the content cell.

  // Grab the visible filter controls (ignore <template> children)
  function isNotTemplateChild(el) {
    while (el) {
      if (el.tagName === 'TEMPLATE') return false;
      el = el.parentElement;
    }
    return true;
  }
  let filters = element.querySelector('.msc-filter__filters');
  if (filters && !isNotTemplateChild(filters)) filters = null;
  let resultFilter = element.querySelector('.msc-press-room-releases__filters__result-and-filter');
  if (resultFilter && !isNotTemplateChild(resultFilter)) resultFilter = null;

  // The tabs block expects:
  // - header row: ['Tabs (tabs1)']
  // - row: [tab label, tab content]
  // We'll combine the two tabs and content into the block.

  // --- Step 4: Compose header row ---
  const headerRow = ['Tabs (tabs1)'];

  // --- Step 5: Compose tab label row ---
  // Instead of placing the button elements (causes interactive JS), use their textContent as tab labels
  // The screenshot shows: 2 tabs, each with a label. The content cell is shared below the tabs.
  // To mimic this, create a single row with all tab labels in cell 1, and content in cell 2.

  // Compose an array of tab label <span>s for the first cell
  const tabLabelSpans = tabButtons.map(btn => {
    const span = document.createElement('span');
    span.textContent = btn.textContent.trim();
    span.style.marginRight = '1em';
    return span;
  });

  // Compose the content cell:
  // We'll use the result count text (if present), and also append the filter controls (if present)
  // The screenshot shows only the result count, but for generality, include both if present
  const contentCellElements = [];
  if (resultCount) {
    const p = document.createElement('p');
    p.textContent = resultCount;
    contentCellElements.push(p);
  }
  if (filters) {
    contentCellElements.push(filters);
  }
  if (resultFilter) {
    contentCellElements.push(resultFilter);
  }

  // Edge case: if contentCellElements is empty, add an empty string so the cell exists
  if (contentCellElements.length === 0) contentCellElements.push('');

  // --- Step 6: Build the table ---
  const cells = [
    headerRow,
    [tabLabelSpans, contentCellElements]
  ];

  // --- Step 7: Replace the element with the new block table ---
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
