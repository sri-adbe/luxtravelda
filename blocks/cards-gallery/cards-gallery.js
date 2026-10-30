import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-gallery: image-only 3-up gallery of equal rounded tiles.
 * One row per tile; the image may sit in any cell. Text cells, if an
 * author adds them, are kept as a small caption under the tile; empty
 * cells are dropped, and rows without content are skipped.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      const hasPicture = !!div.querySelector('picture');
      if (hasPicture && !div.textContent.trim()) {
        div.className = 'cards-gallery-card-image';
      } else if (!div.textContent.trim()) {
        div.remove();
      } else {
        div.className = 'cards-gallery-card-body';
      }
    });
    if (li.children.length) ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
  block.replaceChildren(ul);
}
