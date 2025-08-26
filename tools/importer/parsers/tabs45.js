/* global WebImporter */
export default function parse(element, { document }) {
  // Block name for header
  const headerRow = ['Tabs (tabs45)'];
  // Collect all tab panels
  const panels = Array.from(element.querySelectorAll(':scope > div'));
  // Each panel should produce a row: [Tab Label, Tab Content]
  const rows = panels.map((panel, idx) => {
    // Try to deduce a tab label from x-show attribute or inner content
    let tabLabel = '';
    const xShow = panel.getAttribute('x-show');
    if (xShow) {
      // Typical format: tab === 'DijitalKonteynerTasimacilikDernegiDcsa'
      const match = xShow.match(/tab\s*===\s*['"]([^'"]+)['"]/);
      tabLabel = match ? match[1] : '';
      // Try to prettify label (use heuristics)
      // For specific known values, convert to public-facing labels
      if (/DijitalKonteynerTasimacilikDernegiDcsa/i.test(tabLabel)) tabLabel = 'DCSA';
      else if (/Bmedifact/i.test(tabLabel)) tabLabel = 'BM/EDIFact';
      else if (/AmericanNationalStandardsİnstituteAnsix12/i.test(tabLabel)) tabLabel = 'ANSI X12';
      else if (/Smdg/i.test(tabLabel)) tabLabel = 'SMDG';
      else if (/UluslararasiKonteynerBurosuBic/i.test(tabLabel)) tabLabel = 'BIC';
      else if (tabLabel) {
        // For camel case, try to split for readability
        tabLabel = tabLabel.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
      }
    }
    // If failed, fallback to first link text within content
    if (!tabLabel) {
      const firstLink = panel.querySelector('a');
      if (firstLink && firstLink.textContent.trim()) {
        tabLabel = firstLink.textContent.trim();
      }
    }
    // Still no label? Fallback to index
    if (!tabLabel) {
      tabLabel = 'Tab ' + (idx + 1);
    }
    // Tab content: use the .msc-bodytext container or fallback to all content
    let contentEl = panel.querySelector('.msc-bodytext');
    if (!contentEl) {
      // Fallback: use all children except script elements
      const frag = document.createDocumentFragment();
      Array.from(panel.children).forEach(child => {
        if (child.tagName !== 'SCRIPT') frag.appendChild(child);
      });
      contentEl = frag;
    }
    // Return row: label, content element or fragment
    return [tabLabel, contentEl];
  });
  // Prepend header
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
