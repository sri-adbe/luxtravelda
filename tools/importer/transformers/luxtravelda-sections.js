/* eslint-disable */
/* global WebImporter */

/**
 * Sections transformer for Lux Traveler.
 * Uses payload.template.sections to insert section breaks (<hr>) and
 * Section Metadata blocks for styled sections.
 *
 * A section may span several sibling elements (e.g. rc2 Curators =
 * section.curators + div.tagline). The section starts at the first selector
 * that matches (selectors tried in order) and ends at the last matching
 * element in document order.
 *
 * Shared by the "home" and "destinations" templates. Destination selectors
 * use :has()/:not(); queries are wrapped so an engine without :has() support
 * skips to the next (fallback) selector instead of throwing.
 */

const SECTION_ATTR = 'data-excat-section-id';
const END_ATTR = 'data-excat-section-end';

function safeQuery(root, sel) {
  try {
    return root.querySelector(sel);
  } catch (e) {
    return null;
  }
}

function findStart(root, selectors) {
  for (const sel of selectors) {
    const el = safeQuery(root, sel);
    if (el) return el;
  }
  return null;
}

function findEnd(root, selectors, start) {
  let end = start;
  selectors.forEach((sel) => {
    const el = safeQuery(root, sel);
    if (!el || el === end || el.contains(end) || end.contains(el)) return;
    // eslint-disable-next-line no-bitwise
    if (end.compareDocumentPosition(el) & 4 /* FOLLOWING */) end = el;
  });
  return end;
}

// source section ids (e.g. #destinations), captured before parsers replace the elements
const anchorIds = new Map();

export default function transform(hookName, element, payload) {
  const template = payload && payload.template;
  const sections = (template && template.sections) || [];
  if (sections.length < 2) return;
  const doc = element.ownerDocument || document;

  if (hookName === 'beforeTransform') {
    anchorIds.clear();
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const selectors = [].concat(section.selector || []);
      const start = findStart(element, selectors);
      if (!start) continue;
      if (start.id) anchorIds.set(section.id, start.id);
      const needsMeta = section.style || anchorIds.has(section.id);

      if (needsMeta) {
        // End marker so metadata lands at the end of the section even if
        // parsers replace the section element.
        const end = findEnd(element, selectors, start);
        const endMarker = doc.createElement('div');
        endMarker.setAttribute(END_ATTR, section.id);
        end.after(endMarker);
      }

      if (i > 0 || needsMeta) {
        const hr = doc.createElement('hr');
        if (needsMeta) hr.setAttribute(SECTION_ATTR, section.id);
        start.before(hr);
      }
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const anchorId = anchorIds.get(section.id);
      if (!section.style && !anchorId) continue;

      const hr = element.querySelector(`hr[${SECTION_ATTR}="${section.id}"]`);
      const endMarker = element.querySelector(`[${END_ATTR}="${section.id}"]`);
      const cells = {};
      if (section.style) cells.style = section.style;
      if (anchorId) cells.id = anchorId;
      const metadata = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells,
      });

      if (endMarker) {
        endMarker.before(metadata);
      } else if (hr) {
        hr.after(metadata);
      } else {
        const fallback = findStart(element, [].concat(section.selector || []));
        if (fallback) fallback.after(metadata);
      }

      if (endMarker) endMarker.remove();
      if (hr) {
        if (i === 0) hr.remove();
        else hr.removeAttribute(SECTION_ATTR);
      }
    }
  }
}
