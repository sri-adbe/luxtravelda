import { loadSection } from '../../scripts/aem.js';
import { decorateMain } from '../../scripts/scripts.js';

/**
 * Creates an element with attributes and children (strings become text, never HTML).
 * @param {string} tag element name
 * @param {Object} attrs attributes
 * @param {...(Node|string|null)} children child nodes
 */
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== undefined && v !== null) el.setAttribute(k, v);
  });
  children.flat().filter((c) => c !== null && c !== undefined && c !== '').forEach((c) => el.append(c));
  return el;
}

const safeHref = (href) => (href && !/^\s*javascript:/i.test(href) ? href : null);
const p = (text) => (text ? h('p', {}, text) : null);
const picture = (image) => (image && image.src ? h('picture', {}, h('img', { src: image.src, alt: image.alt || '' })) : null);
const imageP = (image) => (image && image.src ? h('p', {}, picture(image)) : null);
const ctaP = (cta) => (cta && safeHref(cta.href) ? h('p', {}, h('a', { href: safeHref(cta.href) }, cta.label || '')) : null);
const heading = (level, text) => (text ? h(`h${level}`, {}, text) : null);

/**
 * Builds authored block markup: one div per row, one div per cell.
 * @param {string} name block class
 * @param {Array<Array>} rows rows of cells; a cell is a node or an array of nodes
 */
function blockTable(name, rows) {
  return h('div', { class: name }, ...rows.map((cells) => h('div', {}, ...cells.map((cell) => h('div', {}, cell)))));
}

/**
 * Builds a section with its Section Metadata (style, id) as authors would write it.
 * @param {Array<Node>} children section content
 * @param {Object} meta section metadata values
 */
function section(children, meta) {
  const rows = Object.entries(meta).filter(([, v]) => v).map(([k, v]) => h('div', {}, h('div', {}, k), h('div', {}, v)));
  return h('div', {}, ...children, rows.length ? h('div', { class: 'section-metadata' }, ...rows) : null);
}

const sectionHead = (s) => blockTable('columns-intro', [[[p(s.eyebrow), heading(2, s.title)], p(s.intro)]]);

// one renderer per section type; each returns the section's content in authored form
const RENDERERS = {
  hero: (s) => [blockTable('hero-overlay', [[picture(s.image)], [[p(s.eyebrow), heading(1, s.title), p(s.subtitle), ctaP(s.cta)]]])],
  intro: (s) => [blockTable('columns-media', [[[p(s.eyebrow), heading(2, s.title), p(s.text)], picture(s.image)]])],
  experiences: (s) => [
    sectionHead(s),
    blockTable('cards-numbered', (s.items || []).map((i) => [[imageP(i.icon), heading(3, i.title), p(i.text)]])),
  ],
  stays: (s) => [
    sectionHead(s),
    blockTable('cards-landscape', (s.items || []).map((i) => [picture(i.image), [heading(3, i.title), p(i.text)]])),
  ],
  feature: (s) => [imageP(s.image), p(s.eyebrow), heading(2, s.title), p(s.text)],
  panel: (s) => [
    p(s.eyebrow), heading(2, s.title), p(s.text),
    blockTable('columns-panel', [(s.columns || []).map((c) => [heading(3, c.title), p(c.text)])]),
  ],
  gallery: (s) => [blockTable('cards-gallery', (s.images || []).map((i) => [picture(i)])), p(s.caption)],
  closing: (s) => [blockTable('hero-cta-banner', [[picture(s.image)], [[p(s.eyebrow), heading(2, s.title), ctaP(s.cta), p(s.note)]]])],
};

/**
 * Loads one data file; a missing or broken part is skipped so the rest still renders.
 * @param {string} src data file URL
 * @returns {Promise<Array>} its sections
 */
async function loadPart(src) {
  try {
    const resp = await fetch(src);
    if (!resp.ok) throw new Error(`${resp.status} ${src}`);
    const data = await resp.json();
    return data.sections || [];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('destination-page: could not load data', e);
    return [];
  }
}

/**
 * destination-page: renders a destination from structured JSON (one or more links to data
 * files, rendered in link order) into the site's regular blocks, so it looks exactly like
 * an authored destination page.
 * @param {Element} block
 */
export default async function decorate(block) {
  const links = [...block.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
  const sources = links.length ? links : [block.textContent.trim()].filter(Boolean);
  const host = block.closest('.section');
  if (!sources.length || !host) return;

  // fetch all parts at once, keep their order
  const parts = await Promise.all(sources.map(loadPart));
  const all = parts.flat();
  if (!all.length) return;

  const container = document.createElement('div');
  all.forEach((s) => {
    const render = RENDERERS[s.type];
    if (render) container.append(section(render(s).filter(Boolean), { style: s.style, id: s.id }));
  });
  decorateMain(container);

  // the generated sections take the place of this one; the first carries the LCP hero
  const sections = [...container.children];
  host.replaceWith(...sections);
  if (sections[0]) await loadSection(sections[0]);
}
