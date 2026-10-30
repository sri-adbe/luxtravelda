/* eslint-disable */
/* global WebImporter */

/**
 * cards-gallery parser.
 * Source: div.amalfi-gallery-grid > div.amalfi-gallery-img-wrap > img.amalfi-gallery-img
 * Target: one row per tile, one cell: [image] (src + alt kept).
 */
export default function parse(element, { document }) {
  const cells = [];

  let wraps = [...element.querySelectorAll(':scope > .amalfi-gallery-img-wrap')];
  if (!wraps.length) wraps = [...element.children];

  wraps.forEach((wrap) => {
    const srcImg = wrap.tagName === 'IMG' ? wrap : wrap.querySelector('img');
    if (!srcImg || !srcImg.getAttribute('src')) return;
    const img = document.createElement('img');
    img.src = srcImg.getAttribute('src');
    img.alt = srcImg.getAttribute('alt') || '';
    cells.push([img]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
