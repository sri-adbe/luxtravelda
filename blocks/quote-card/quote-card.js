/**
 * quote-card: bordered box with a quotation and an optional attribution.
 * Row 1: quotation. Row 2 (optional): attribution.
 * Option class: `featured` (filled background).
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  const [quotationRow, attributionRow] = rows;

  const blockquote = document.createElement('blockquote');

  if (quotationRow) {
    const quotation = document.createElement('div');
    quotation.className = 'quote-card-quotation';
    [...quotationRow.children].forEach((cell) => {
      while (cell.firstChild) quotation.append(cell.firstChild);
    });
    // plain text cell: wrap in a paragraph
    if (!quotation.querySelector('p') && quotation.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...quotation.childNodes);
      quotation.append(p);
    }
    blockquote.append(quotation);
  }

  if (attributionRow && attributionRow.textContent.trim()) {
    const attribution = document.createElement('div');
    attribution.className = 'quote-card-attribution';
    [...attributionRow.children].forEach((cell) => {
      while (cell.firstChild) attribution.append(cell.firstChild);
    });
    // strip a leading dash authored by hand; CSS adds it
    const first = attribution.querySelector('p') || attribution;
    const textNode = [...first.childNodes]
      .find((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
    if (textNode) textNode.textContent = textNode.textContent.replace(/^\s*[-–—]\s*/, '');
    // <cite> holds phrasing content only: wrap inside the paragraph
    let p = attribution.querySelector('p');
    if (!p) {
      p = document.createElement('p');
      p.append(...attribution.childNodes);
      attribution.append(p);
    }
    const cite = document.createElement('cite');
    cite.append(...p.childNodes);
    p.append(cite);
    blockquote.append(attribution);
  }

  block.replaceChildren(blockquote);
}
