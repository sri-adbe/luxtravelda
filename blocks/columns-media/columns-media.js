import { createOptimizedPicture } from '../../scripts/aem.js';

function isMediaCell(cell) {
  if (!cell.querySelector('picture')) return false;
  const clone = cell.cloneNode(true);
  clone.querySelectorAll('picture').forEach((pic) => pic.remove());
  return !clone.textContent.trim();
}

/**
 * columns-media: text column (eyebrow, heading, body) beside a large
 * rounded photo. One row, two cells; either cell order works. A cell
 * holding only an image becomes the media column, the other the text column.
 * A paragraph placed before the heading is the eyebrow.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  rows.forEach((row) => {
    row.classList.add('columns-media-row');
    const cells = [...row.children];
    cells.forEach((cell) => {
      if (!cell.textContent.trim() && !cell.querySelector('picture, img')) {
        cell.remove();
        return;
      }
      if (isMediaCell(cell)) {
        cell.classList.add('columns-media-media');
        return;
      }
      cell.classList.add('columns-media-text');
      const heading = cell.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');
      if (heading) {
        let prev = heading.previousElementSibling;
        while (prev) {
          if (prev.tagName === 'P' && !prev.querySelector('picture')) prev.classList.add('columns-media-eyebrow');
          prev = prev.previousElementSibling;
        }
      }
    });
    const remaining = row.children.length;
    row.classList.add(`columns-media-${remaining}-cols`);
    if (row.querySelector('.columns-media-media')) row.classList.add('columns-media-has-media');
  });

  block.querySelectorAll('.columns-media-media picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]));
  });
}
