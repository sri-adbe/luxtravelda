/* eslint-disable */
/* global WebImporter */

/**
 * cards-numbered parser.
 * Home source: div.services-grid > article
 *   > b (number, e.g. 01), h3, p (description), a[href] (arrow link)
 * Destination source: div.amalfi-cards-grid > article.amalfi-card
 *   > div.amalfi-card-header > span.amalfi-card-title (+ decorative img)
 *   > img (decorative), p.amalfi-card-body
 *   (no number, no link; decorative images are removed by cleanup)
 * Target: one row per card, one cell: [number p, H3, description p, link p]
 * (number and link only when present in the source).
 */
export default function parse(element, { document }) {
  const cells = [];

  [...element.children]
    .filter((el) => el.tagName === 'ARTICLE')
    .forEach((card) => {
      const content = [];

      // Number stays a plain paragraph (not a heading).
      const num = card.querySelector('b, strong');
      if (num && num.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = num.textContent.trim();
        content.push(p);
      }

      // Destination cards carry a small icon beside the title: emit it as an image-only paragraph.
      const icon = card.querySelector('.amalfi-card-header img');
      if (icon && icon.getAttribute('src')) {
        const p = document.createElement('p');
        const img = document.createElement('img');
        img.src = icon.getAttribute('src');
        img.alt = icon.getAttribute('alt') || '';
        p.append(img);
        content.push(p);
      }

      // Destination cards use span.amalfi-card-title as the title: emit as H3.
      const heading = card.querySelector('h1, h2, h3, h4') || card.querySelector('.amalfi-card-title');
      if (heading && heading.textContent.trim()) {
        const tag = /^H[1-4]$/.test(heading.tagName) ? heading.tagName.toLowerCase() : 'h3';
        const h = document.createElement(tag);
        h.textContent = heading.textContent.trim();
        content.push(h);
      }

      [...card.children]
        .filter((el) => el.tagName === 'P' && el.textContent.trim())
        .forEach((desc) => {
          const p = document.createElement('p');
          p.textContent = desc.textContent.trim();
          content.push(p);
        });

      const link = card.querySelector('a[href], button');
      if (link) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.getAttribute('href') || '#contact';
        a.textContent = link.textContent.trim() || '↗';
        p.append(a);
        content.push(p);
      }

      cells.push([content]);
    });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-numbered', cells });
  element.replaceWith(block);
}
