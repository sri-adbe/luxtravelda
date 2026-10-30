/* eslint-disable */
/* global WebImporter */

/**
 * hero-cta-banner parser.
 * Home source: section#contact.closing
 *   > img (background, sibling of the content)
 *   > div > div.eyebrow (empty <i> + text), h2, button.button, p (note)
 * Destination source: section.amalfi-cta-section
 *   > img.amalfi-cta-bg, div.amalfi-cta-overlay (empty)
 *   > div.amalfi-cta-content > .amalfi-eyebrow (p after cleanup; div with
 *     img.amalfi-dash + span.amalfi-eyebrow-text before), h2,
 *     div > button.amalfi-cta, p (note)
 * Target: row 1 background image (optional);
 *         row 2 eyebrow paragraph, H2, CTA link, note paragraph.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Background: an <img> sibling (scraped/cleaned DOM) or, on the live page,
  // an inline background-image (last url() after the wash gradient).
  const bg = [...element.children].find((el) => el.tagName === 'IMG')
    || element.querySelector('img.amalfi-cta-bg');
  let bgSrc = bg ? bg.getAttribute('src') : null;
  if (!bgSrc) {
    const style = element.getAttribute('style') || '';
    const urls = [...style.matchAll(/url\(\s*(?:&quot;|["'])?([^"')&]+)(?:&quot;|["'])?\s*\)/g)];
    if (urls.length) bgSrc = urls[urls.length - 1][1];
  }
  if (bgSrc) {
    const img = document.createElement('img');
    img.src = bgSrc;
    img.alt = (bg && bg.getAttribute('alt')) || '';
    cells.push([img]);
  }

  const root = [...element.children].find((el) => el.tagName === 'DIV' && el.querySelector('h1, h2, h3'))
    || element;
  const content = [];

  // Eyebrow: div.eyebrow with a decorative empty <i>; emit plain text paragraph.
  const eyebrow = root.querySelector('.eyebrow, .amalfi-eyebrow');
  const eyebrowText = eyebrow
    ? (eyebrow.querySelector('.amalfi-eyebrow-text') || eyebrow).textContent.replace(/\s+/g, ' ').trim()
    : '';
  if (eyebrowText) {
    const p = document.createElement('p');
    p.textContent = eyebrowText;
    content.push(p);
  }

  const heading = root.querySelector('h1, h2, h3');
  if (heading) {
    const h = document.createElement(heading.tagName.toLowerCase());
    h.textContent = heading.textContent.trim();
    content.push(h);
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

  // Note: paragraphs in the content wrapper (direct on home, nested beside the
  // button on destinations), excluding the eyebrow paragraph.
  [...root.querySelectorAll('p')]
    .filter((el) => el !== eyebrow && !el.closest('.eyebrow, .amalfi-eyebrow') && el.textContent.trim())
    .forEach((note) => {
      const p = document.createElement('p');
      p.textContent = note.textContent.trim();
      content.push(p);
    });

  cells.push([content]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-cta-banner', cells });
  element.replaceWith(block);
}
