/* global WebImporter */
export default function parse(element, { document }) {
  // Get main image (right column)
  let imageDiv = element.querySelector('.msc-about-us__image');
  let imageEl = null;
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img.desktop[src]') || imageDiv.querySelector('img[src]');
  }

  // Get left column (title, description, CTA)
  let wrapper = element.querySelector('.msc-about-us__wrapper');
  let gridContainer = wrapper ? wrapper.querySelector('.grid-container') : null;
  let gridCell = gridContainer ? gridContainer.querySelector('.cell.small-12') : null;
  let title = gridCell ? gridCell.querySelector('h2') : null;
  let desc = gridCell ? gridCell.querySelector('.msc-section-description') : null;
  let cta = null;
  if (gridCell) {
    let ctaDivs = Array.from(gridCell.querySelectorAll('.msc-about-us__cta'));
    for (let ctaDiv of ctaDivs) {
      if (ctaDiv.closest('template')) continue;
      let a = ctaDiv.querySelector('a');
      if (a) {
        cta = ctaDiv;
        break;
      }
    }
  }
  const leftColFrag = document.createDocumentFragment();
  if (title) leftColFrag.appendChild(title);
  if (desc) leftColFrag.appendChild(desc);
  if (cta && !leftColFrag.contains(cta)) leftColFrag.appendChild(cta);

  // Stats row (icon stats block, first column only)
  let statsDiv = wrapper ? wrapper.querySelector('.msc-icon-stats') : null;

  // Create table: header is one column only, content rows are two columns
  const cells = [
    ['Columns (columns20)'], // Header row: exactly one column
    [leftColFrag, imageEl ? imageEl : ''], // Content row: two columns
    [statsDiv ? statsDiv : '', ''] // Two columns, stats only in first
  ];

  // Custom table creation to ensure header row is one column, rest are two
  const table = document.createElement('table');
  // Header row: one cell spanning columns
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = cells[0][0];
  headerTh.colSpan = '2';
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);
  // Content rows: each row has two columns
  for (let i = 1; i < cells.length; i++) {
    const tr = document.createElement('tr');
    for (let j = 0; j < 2; j++) {
      const td = document.createElement('td');
      const cell = cells[i][j];
      if (cell instanceof HTMLElement || cell instanceof DocumentFragment) {
        td.appendChild(cell);
      } else if (typeof cell === 'string' && cell) {
        td.innerHTML = cell;
      }
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  element.replaceWith(table);
}
