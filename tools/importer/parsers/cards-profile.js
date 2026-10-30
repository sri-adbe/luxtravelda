/* eslint-disable */
/* global WebImporter */

/**
 * cards-profile parser.
 * Source: div.curator-grid > article
 *   > img (portrait)
 *   > div > p.place, h3, p (bio), button ("Meet X →", no href)
 * Target: one row per card: [portrait image] | [eyebrow p, H3, bio p, CTA link].
 */
export default function parse(element, { document }) {
  const cells = [];

  [...element.children]
    .filter((el) => el.tagName === 'ARTICLE')
    .forEach((card) => {
      const srcImg = card.querySelector('img');
      let imageCell = '';
      if (srcImg) {
        const img = document.createElement('img');
        img.src = srcImg.getAttribute('src');
        img.alt = srcImg.getAttribute('alt') || '';
        imageCell = img;
      }

      const bodySrc = [...card.children].find((el) => el.tagName === 'DIV') || card;
      const body = [];

      const place = bodySrc.querySelector('p.place');
      if (place && place.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = place.textContent.trim();
        body.push(p);
      }

      const heading = bodySrc.querySelector('h1, h2, h3, h4');
      if (heading) {
        const h = document.createElement(heading.tagName.toLowerCase());
        h.textContent = heading.textContent.trim();
        body.push(h);
      }

      [...bodySrc.children]
        .filter((el) => el.tagName === 'P' && !el.classList.contains('place') && el.textContent.trim())
        .forEach((bio) => {
          const p = document.createElement('p');
          p.textContent = bio.textContent.trim();
          body.push(p);
        });

      // "Meet X →" is a <button> without href: convert to a contact link.
      const cta = bodySrc.querySelector('button, a');
      if (cta && cta.textContent.trim()) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = cta.getAttribute('href') || '#contact';
        // the block adds the arrow, so drop the source's trailing "→"
        a.textContent = cta.textContent.replace(/\s+/g, ' ').replace(/\s*→\s*$/, '').trim();
        p.append(a);
        body.push(p);
      }

      cells.push([imageCell, body]);
    });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-profile', cells });
  element.replaceWith(block);
}
