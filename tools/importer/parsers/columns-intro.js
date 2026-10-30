/* eslint-disable */
/* global WebImporter */

/**
 * columns-intro parser.
 * Home source: div.section-head
 *   > div > div.eyebrow (empty <i> + text), h2
 *   > p (intro)
 * Destination source: div.amalfi-section-head
 *   > div > .amalfi-eyebrow (p after cleanup; div with img.amalfi-dash +
 *     span.amalfi-eyebrow-text before), h2.amalfi-section-h2
 *   > p.amalfi-section-sub
 * Target: one row, two cells: [eyebrow paragraph, H2] | [intro paragraph].
 */
export default function parse(element, { document }) {
  const children = [...element.children];
  const mainSrc = children.find((el) => el.tagName === 'DIV' && el.querySelector('h1, h2, h3'));
  const asideSrc = children.filter((el) => el !== mainSrc && el.textContent.trim());

  const main = [];
  if (mainSrc) {
    const eyebrow = mainSrc.querySelector('.eyebrow, .amalfi-eyebrow');
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.replace(/\s+/g, ' ').trim();
      main.push(p);
    }
    const heading = mainSrc.querySelector('h1, h2, h3');
    if (heading) {
      const h = document.createElement(heading.tagName.toLowerCase());
      h.textContent = heading.textContent.trim();
      main.push(h);
    }
  }

  const aside = [];
  asideSrc.forEach((el) => {
    const p = document.createElement('p');
    p.textContent = el.textContent.replace(/\s+/g, ' ').trim();
    aside.push(p);
  });

  const cells = [[main, aside.length ? aside : '']];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-intro', cells });
  element.replaceWith(block);
}
