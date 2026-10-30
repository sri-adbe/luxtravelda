import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizePictures(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, true, [{ width: '2000' }]));
  });
}

/**
 * hero-overlay: full-bleed background photo with a dark overlay and
 * centered headline, subline and CTA.
 * Row 1 (optional): background image. Row 2: text content.
 * Authors may merge both into one cell; the picture is pulled out either way.
 * @param {Element} block
 */
export default function decorate(block) {
  const media = document.createElement('div');
  media.className = 'hero-overlay-media';
  const content = document.createElement('div');
  content.className = 'hero-overlay-content';

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      cell.querySelectorAll('picture').forEach((pic) => {
        const parent = pic.parentElement;
        media.append(pic);
        if (parent && parent !== cell && parent.tagName === 'P' && !parent.textContent.trim() && !parent.children.length) parent.remove();
      });
      while (cell.firstChild) content.append(cell.firstChild);
    });
  });

  // drop empty leftovers
  [...content.children].forEach((el) => {
    if (!el.textContent.trim() && !el.querySelector('img, picture, a')) el.remove();
  });

  // single linked paragraph becomes a CTA
  content.querySelectorAll('p').forEach((p) => {
    const link = p.querySelector('a');
    if (link && p.children.length === 1 && p.textContent.trim() === link.textContent.trim()) {
      p.classList.add('hero-overlay-cta');
    }
  });

  // a paragraph placed before the heading is the eyebrow
  const heading = content.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');
  let prev = heading ? heading.previousElementSibling : null;
  while (prev) {
    if (prev.tagName === 'P' && !prev.classList.contains('hero-overlay-cta')) prev.classList.add('hero-overlay-eyebrow');
    prev = prev.previousElementSibling;
  }

  block.replaceChildren();
  if (media.querySelector('picture')) {
    optimizePictures(media);
    // a hero in the first section holds the LCP image: load it first
    const section = block.closest('.section');
    if (section && !section.previousElementSibling) {
      const img = media.querySelector('img');
      img.loading = 'eager';
      img.fetchPriority = 'high';
    }
    block.append(media);
    block.classList.add('hero-overlay-has-media');
  }
  block.append(content);
}
