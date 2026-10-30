/* eslint-disable */
/* global WebImporter */

/**
 * cards-landscape parser.
 * Home source: div.destination-grid > .destination
 *   (either <a class="destination" href> wrapping the card, or <article class="destination">)
 *   > img, p.place, h3, p (description)
 * Destination source: div.amalfi-acc-grid > article.amalfi-acc-card
 *   > div.amalfi-acc-img-wrap > img.amalfi-acc-img, h3.amalfi-acc-name, p.amalfi-acc-desc
 *   (no eyebrow, no link)
 * Target: one row per card: [landscape image] | [eyebrow p, H3 (linked when the
 * source card is a link), description p].
 */
export default function parse(element, { document }) {
  const cells = [];

  [...element.children]
    .filter((el) => el.classList.contains('destination') || el.classList.contains('amalfi-acc-card')
      || el.tagName === 'ARTICLE')
    .forEach((card) => {
      const srcImg = card.querySelector('img');
      let imageCell = '';
      if (srcImg) {
        const img = document.createElement('img');
        img.src = srcImg.getAttribute('src');
        img.alt = srcImg.getAttribute('alt') || '';
        imageCell = img;
      }

      // Card link: the wrapper itself (<a href>) on linked cards.
      const href = card.tagName === 'A' ? card.getAttribute('href') : null;

      const body = [];
      const place = card.querySelector('p.place');
      if (place && place.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = place.textContent.trim();
        body.push(p);
      }

      const heading = card.querySelector('h1, h2, h3, h4');
      if (heading) {
        const h = document.createElement(heading.tagName.toLowerCase());
        const title = heading.textContent.trim();
        if (href) {
          const a = document.createElement('a');
          a.href = href;
          a.textContent = title;
          h.append(a);
        } else {
          h.textContent = title;
        }
        body.push(h);
      }

      [...card.children]
        .filter((el) => el.tagName === 'P' && !el.classList.contains('place') && el.textContent.trim())
        .forEach((desc) => {
          const p = document.createElement('p');
          p.textContent = desc.textContent.trim();
          body.push(p);
        });

      cells.push([imageCell, body]);
    });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-landscape', cells });
  element.replaceWith(block);
}
