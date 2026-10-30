import { createOptimizedPicture } from '../../scripts/aem.js';

function optimizePictures(root) {
  root.querySelectorAll('picture > img').forEach((img) => {
    const url = new URL(img.src, window.location.href);
    if (url.origin !== window.location.origin || /\.svg$/i.test(url.pathname)) return;
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]));
  });
}

/**
 * hero-cta-banner: short closing banner with a pale-washed background photo
 * and centered eyebrow, H2, CTA and small note.
 * Row 1 (optional): background image. Row 2: text content.
 * @param {Element} block
 */
export default function decorate(block) {
  const media = document.createElement('div');
  media.className = 'hero-cta-banner-media';
  const content = document.createElement('div');
  content.className = 'hero-cta-banner-content';

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

  [...content.children].forEach((el) => {
    if (!el.textContent.trim() && !el.querySelector('img, picture, a')) el.remove();
  });

  const hasHeading = !!content.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');
  let headingSeen = false;
  let ctaFound = false;
  [...content.children].forEach((el) => {
    if (/^H[1-6]$/.test(el.tagName)) {
      headingSeen = true;
      return;
    }
    if (el.tagName !== 'P') return;
    const link = el.querySelector('a');
    const isLinkOnly = link && el.children.length === 1
      && el.textContent.trim() === link.textContent.trim();
    if (isLinkOnly) {
      el.classList.add('hero-cta-banner-cta');
      ctaFound = true;
    } else if (hasHeading && !headingSeen) {
      el.classList.add('hero-cta-banner-eyebrow');
    } else if (ctaFound) {
      el.classList.add('hero-cta-banner-note');
    }
  });

  block.replaceChildren();
  if (media.querySelector('picture')) {
    optimizePictures(media);
    block.append(media);
    block.classList.add('hero-cta-banner-has-media');
  }
  block.append(content);
}
