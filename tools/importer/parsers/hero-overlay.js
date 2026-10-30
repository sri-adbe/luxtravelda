/* eslint-disable */
/* global WebImporter */

/**
 * hero-overlay parser.
 * Home source: section#top.hero-video
 *   > img.hero-video-bg (background, sibling of the content)
 *   > div.hero-video-content > h1, p.hero-video-sub, button.hero-video-cta
 * Destination source: section.amalfi-hero
 *   > img.amalfi-hero-bg
 *   > div.amalfi-hero-content > .amalfi-eyebrow (p after cleanup; div with
 *     img.amalfi-dash + span.amalfi-eyebrow-text before), h1.amalfi-hero-h1,
 *     p.amalfi-hero-sub, div > button.amalfi-cta
 * Target: row 1 background image (optional);
 *         row 2 [eyebrow p (optional)], H1, subline, CTA link.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Background image is a direct <img> child of the section.
  const bg = [...element.children].find((el) => el.tagName === 'IMG')
    || element.querySelector('img.hero-video-bg, img.amalfi-hero-bg');
  if (bg) {
    const img = document.createElement('img');
    img.src = bg.getAttribute('src');
    img.alt = bg.getAttribute('alt') || '';
    cells.push([img]);
  }

  const root = element.querySelector('.hero-video-content, .amalfi-hero-content') || element;
  const content = [];

  // Eyebrow (destination only): paragraph before the H1.
  const eyebrow = root.querySelector('.amalfi-eyebrow');
  if (eyebrow) {
    const t = (eyebrow.querySelector('.amalfi-eyebrow-text') || eyebrow).textContent.replace(/\s+/g, ' ').trim();
    if (t) {
      const p = document.createElement('p');
      p.textContent = t;
      content.push(p);
    }
  }

  const heading = root.querySelector('h1, h2');
  if (heading) {
    const h = document.createElement(heading.tagName.toLowerCase());
    h.textContent = heading.textContent.trim();
    content.push(h);
  }

  const sub = root.querySelector('p.hero-video-sub, p.amalfi-hero-sub')
    || [...root.querySelectorAll('p')].find((p) => !p.closest('.amalfi-eyebrow') && p.textContent.trim());
  if (sub && sub.textContent.trim()) {
    const p = document.createElement('p');
    p.textContent = sub.textContent.trim();
    content.push(p);
  }

  // CTA is a <button> without href: convert to a link to the contact section.
  const cta = root.querySelector('button, a');
  if (cta && cta.textContent.trim()) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.getAttribute('href') || '#contact';
    a.textContent = cta.textContent.replace(/\s+/g, ' ').trim();
    p.append(a);
    content.push(p);
  }

  cells.push([content]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
