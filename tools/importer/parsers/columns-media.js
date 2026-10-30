/* eslint-disable */
/* global WebImporter */

/**
 * columns-media parser.
 * Source: section.amalfi-intro
 *   > div.amalfi-intro-text > .amalfi-eyebrow (p after cleanup; div with
 *     img.amalfi-dash + span.amalfi-eyebrow-text before), h2, p.amalfi-body-text,
 *     .amalfi-rule-wrap (decorative, removed by cleanup / skipped here)
 *   > div.amalfi-intro-img-wrap > img.amalfi-intro-img
 * Target: one row, two columns: [eyebrow p, H2, body p...] | [image].
 */
export default function parse(element, { document }) {
  const imgSrc = element.querySelector('img.amalfi-intro-img')
    || element.querySelector('.amalfi-intro-img-wrap img');
  const textSrc = element.querySelector('.amalfi-intro-text')
    || [...element.children].find((el) => el.querySelector('h1, h2, h3')) || element;

  const text = [];
  const eyebrow = textSrc.querySelector('.amalfi-eyebrow');
  if (eyebrow) {
    const t = (eyebrow.querySelector('.amalfi-eyebrow-text') || eyebrow).textContent.replace(/\s+/g, ' ').trim();
    if (t) {
      const p = document.createElement('p');
      p.textContent = t;
      text.push(p);
    }
  }

  const heading = textSrc.querySelector('h1, h2, h3');
  if (heading) {
    const h = document.createElement(heading.tagName.toLowerCase());
    h.textContent = heading.textContent.replace(/\s+/g, ' ').trim();
    text.push(h);
  }

  [...textSrc.querySelectorAll('p')]
    .filter((p) => !p.classList.contains('amalfi-eyebrow') && !p.closest('.amalfi-eyebrow')
      && !p.closest('.amalfi-rule-wrap') && p.textContent.trim())
    .forEach((src) => {
      const p = document.createElement('p');
      p.textContent = src.textContent.replace(/\s+/g, ' ').trim();
      text.push(p);
    });

  let imageCell = '';
  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc.getAttribute('src');
    img.alt = imgSrc.getAttribute('alt') || '';
    imageCell = img;
  }

  const cells = [[text, imageCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
