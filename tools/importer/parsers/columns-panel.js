/* eslint-disable */
/* global WebImporter */

/**
 * columns-panel parser.
 * Source: div.amalfi-flex-banner
 *   > div.amalfi-flex-col > h3, p   (x2)
 *   > img (decorative divider between the columns; removed by cleanup, ignored here)
 * Target: one row, one column per div.amalfi-flex-col: [H3, paragraph(s)].
 */
export default function parse(element, { document }) {
  let cols = [...element.querySelectorAll(':scope > .amalfi-flex-col')];
  if (!cols.length) {
    cols = [...element.children].filter((el) => el.tagName === 'DIV' && el.textContent.trim());
  }

  const row = cols.map((col) => {
    const content = [];
    [...col.querySelectorAll('h1, h2, h3, h4, h5, h6, p')].forEach((src) => {
      const t = src.textContent.replace(/\s+/g, ' ').trim();
      if (!t) return;
      const el = document.createElement(src.tagName.toLowerCase());
      el.textContent = t;
      content.push(el);
    });
    return content.length ? content : '';
  });

  const cells = [row.length ? row : ['']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-panel', cells });
  element.replaceWith(block);
}
