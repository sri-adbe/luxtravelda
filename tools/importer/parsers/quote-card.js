/* eslint-disable */
/* global WebImporter */

/**
 * quote-card parser.
 * Source: .quotes > blockquote (optionally .featured)
 *   > text node (quotation) + cite (attribution, with leading dash)
 * Target: row 1 quotation paragraph; row 2 attribution paragraph
 * (leading dash stripped; the block adds it). blockquote.featured maps to the
 * `featured` variant option.
 */
export default function parse(element, { document }) {
  const cells = [];

  const cite = element.querySelector('cite');
  const quoteText = [...element.childNodes]
    .filter((n) => n !== cite && !(n.nodeType === 1 && n.tagName === 'CITE'))
    .map((n) => n.textContent)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (quoteText) {
    const p = document.createElement('p');
    p.textContent = quoteText;
    cells.push([p]);
  }

  const attribution = cite ? cite.textContent.replace(/\s+/g, ' ').trim().replace(/^[-–—]\s*/, '') : '';
  if (attribution) {
    const p = document.createElement('p');
    p.textContent = attribution;
    cells.push([p]);
  }

  const name = element.classList.contains('featured') ? 'quote-card (featured)' : 'quote-card';
  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
