import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-landscape: frameless destination cards with a large rounded
 * landscape image, country eyebrow, title and one-line description.
 * One row per card: image cell, body cell. A link on the title is
 * extended to the image so the whole card reads as one destination link.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-landscape-card-image';
      } else if (!div.textContent.trim() && !div.querySelector('picture')) {
        div.remove();
      } else {
        div.className = 'cards-landscape-card-body';
      }
    });

    const body = li.querySelector('.cards-landscape-card-body');
    if (body) {
      const heading = body.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');
      if (heading) {
        let prev = heading.previousElementSibling;
        while (prev) {
          if (prev.tagName === 'P') prev.classList.add('cards-landscape-card-eyebrow');
          prev = prev.previousElementSibling;
        }
        const titleLink = heading.querySelector('a[href]');
        const image = li.querySelector('.cards-landscape-card-image');
        if (titleLink && image && !image.querySelector('a')) {
          const imageLink = document.createElement('a');
          imageLink.href = titleLink.href;
          imageLink.setAttribute('aria-hidden', 'true');
          imageLink.tabIndex = -1;
          imageLink.append(...image.childNodes);
          image.append(imageLink);
        }
      }
    }
    if (li.children.length) ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]));
  });
  block.replaceChildren(ul);
}
