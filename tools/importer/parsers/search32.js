/* global WebImporter */
export default function parse(element, { document }) {
  // Header matches the block name exactly per example
  const headerRow = ['Search'];

  // Try to select and reference the full visible content block for maximum flexibility
  // Usually this is the first .cell inside the structure, but fallback to the element itself
  let contentDiv = element.querySelector('.cell, form, div');
  if (!contentDiv) contentDiv = element;

  // Per requirements, always add the query index link as the second row content
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.live/block-collection/sample-search-data/query-index.json';
  const link = document.createElement('a');
  link.href = queryIndexUrl;
  link.textContent = queryIndexUrl;
  link.target = '_blank';

  // Combine all content elements into a single cell as required
  const cells = [
    headerRow,
    [[contentDiv, link]]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
