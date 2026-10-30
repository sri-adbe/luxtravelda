import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-profile: padded card with inset portrait image, eyebrow (location),
 * name, short bio and an arrow link. One row per card: image cell, body cell.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-profile-card-image';
      } else if (!div.textContent.trim() && !div.querySelector('picture')) {
        div.remove();
      } else {
        div.className = 'cards-profile-card-body';
      }
    });

    const body = li.querySelector('.cards-profile-card-body');
    if (body) {
      let headingSeen = false;
      [...body.children].forEach((el) => {
        if (/^H[1-6]$/.test(el.tagName)) {
          headingSeen = true;
          return;
        }
        if (el.tagName !== 'P') return;
        const link = el.querySelector('a');
        if (link && el.children.length === 1 && el.textContent.trim() === link.textContent.trim()) {
          el.classList.add('cards-profile-card-cta');
          // the arrow is added by CSS; drop one typed by the author
          link.textContent = link.textContent.replace(/\s*[→>]+\s*$/, '');
        } else if (!headingSeen && body.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)')) {
          el.classList.add('cards-profile-card-eyebrow');
        }
      });
    }
    if (li.children.length) ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
  block.replaceChildren(ul);

  // scroll reveal, as the source .sr cards: fade up once 12% is in view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    [...ul.children].forEach((li) => {
      li.classList.add('cards-profile-reveal');
      observer.observe(li);
    });
  }
}
