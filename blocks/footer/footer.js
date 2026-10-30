// anchor the header's "Journal" link (/#journal) points at, as on the source footer
const FOOTER_ANCHOR = 'journal';

/**
 * Fetches the footer fragment as plain HTML.
 * Metadata-independent: /content first (local preview), then the site root (DA/EDS).
 * @returns {Promise<HTMLElement|null>} container holding the fragment sections
 */
async function fetchFooter() {
  let resp = { ok: false };
  // a page template (e.g. "destination") can have its own footer: footer-<template>.plain.html
  const template = document.querySelector('meta[name="template"]')?.content.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  if (template) {
    resp = await fetch(`/content/footer-${template}.plain.html`);
    if (!resp.ok) resp = await fetch(`/footer-${template}.plain.html`);
  }
  if (!resp.ok) resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  const container = document.createElement('div');
  container.innerHTML = await resp.text();
  return container;
}

/**
 * Scrolls to the top instead of reloading when a link targets the current page.
 * @param {HTMLAnchorElement} a link
 */
function decorateSamePageLink(a) {
  // local preview serves pages under /content, production at the root
  const normalize = (path) => path.replace(/^\/content(?=\/|$)/, '').replace(/(\/index)?(\.html)?$/, '').replace(/\/$/, '') || '/';
  a.addEventListener('click', (e) => {
    const url = new URL(a.href, window.location.href);
    if (url.origin !== window.location.origin || url.hash) return;
    if (normalize(url.pathname) !== normalize(window.location.pathname)) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Builds one column of the top row from a fragment section.
 * A paragraph holding only bold text is the column label.
 * @param {Element} section fragment section
 */
function buildColumn(section, isFirst) {
  const col = document.createElement('div');
  col.className = 'footer-col';
  [...section.children].forEach((el, i) => {
    const link = el.querySelector('a');
    const bold = el.querySelector('strong, b');
    if (el.tagName === 'P' && link && el.textContent.trim() === link.textContent.trim()) {
      el.className = 'footer-brand';
      link.className = 'footer-brand-link';
      decorateSamePageLink(link);
    } else if (el.tagName === 'P' && isFirst && i === 0 && !bold && section.children.length > 1) {
      // plain-text logo line opening the first column
      el.className = 'footer-brand footer-brand-text';
    } else if (el.tagName === 'P' && bold && el.textContent.trim() === bold.textContent.trim()) {
      el.className = 'footer-label';
    } else if (el.tagName === 'P') {
      el.className = 'footer-text';
    }
    // keep the paragraph's own line box around inline-only lines, as on the source
    // (without real text the line collapses to the inline element in quirks mode)
    if (el.matches('.footer-brand, .footer-label')) el.prepend('​');
    col.append(el);
  });
  return col;
}

/**
 * Builds the bottom row (legal / social line) from the last fragment section.
 * @param {Element} section fragment section
 */
function buildBottom(section) {
  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  [...section.children].forEach((el) => {
    const item = document.createElement('span');
    item.className = 'footer-bottom-item';
    item.append(...el.childNodes);
    bottom.append(item);
  });
  return bottom;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooter();
  block.textContent = '';
  if (!fragment) return;

  const sections = [...fragment.querySelectorAll(':scope > div')];
  const bottomSection = sections.length > 1 ? sections.pop() : null;

  const top = document.createElement('div');
  top.className = 'footer-top';
  sections.forEach((section, i) => top.append(buildColumn(section, i === 0)));
  block.append(top);
  if (bottomSection) block.append(buildBottom(bottomSection));

  const footer = block.closest('footer');
  if (footer && !footer.id) footer.id = FOOTER_ANCHOR;
}
