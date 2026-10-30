/* eslint-disable */
/* global WebImporter */

/**
 * Cleanup transformer for Lux Traveler (speak-salsa-30519598.figma.site).
 * Removes non-authorable chrome: global header (header.nav), global footer
 * (footer#journal / .footer), scripts/styles, and tracking attributes.
 *
 * Destination pages (template "destinations", .amalfi-* markup):
 * - Removes decorative images: img.amalfi-dash (eyebrow dashes),
 *   .amalfi-rule-wrap (accent rules), the divider <img> directly inside
 *   .amalfi-flex-banner, the icon <img> inside .amalfi-card-header and the
 *   standalone decorative <img> directly inside article.amalfi-card.
 * - Converts every div.amalfi-eyebrow into <p class="amalfi-eyebrow">text</p>
 *   (in place, so parsers can still select `.amalfi-eyebrow`).
 * All destination rules are scoped to .amalfi-* selectors, so the home
 * template (div.eyebrow etc.) is unaffected.
 */
export default function transform(hookName, element, payload) {
  if (hookName === 'beforeTransform') {
    // Global header and footer are migrated separately (nav / footer fragments).
    WebImporter.DOMUtils.remove(element, [
      'header.nav',
      'footer#journal',
      'footer.footer',
      'script',
      'style',
      'noscript',
      'iframe',
      'link',
    ]);

    // Destination template: decorative images (not authorable content).
    WebImporter.DOMUtils.remove(element, [
      'img.amalfi-dash',
      '.amalfi-rule-wrap',
      '.amalfi-flex-banner > img',
      '.amalfi-card-header img',
      'article.amalfi-card > img',
    ]);

    // Destination template: eyebrow div > span.amalfi-eyebrow-text -> <p>.
    const doc = element.ownerDocument || document;
    element.querySelectorAll('div.amalfi-eyebrow').forEach((eyebrow) => {
      const textEl = eyebrow.querySelector('.amalfi-eyebrow-text') || eyebrow;
      const text = textEl.textContent.replace(/\s+/g, ' ').trim();
      if (!text) {
        eyebrow.remove();
        return;
      }
      const p = doc.createElement('p');
      p.className = 'amalfi-eyebrow';
      p.textContent = text;
      eyebrow.replaceWith(p);
    });
  }

  if (hookName === 'afterTransform') {
    // Final sweep for any residual chrome or non-content elements.
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      'script',
      'style',
      'noscript',
      'iframe',
      'link',
      'source',
    ]);

    // Strip tracking / framework attributes.
    element.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        const n = attr.name;
        // Keep data-excat-* markers: the sections transformer consumes them.
        if (n.startsWith('data-excat-')) return;
        if (n.startsWith('data-') || n.startsWith('on') || n === 'tabindex' || n === 'aria-hidden') {
          el.removeAttribute(n);
        }
      });
    });
  }
}
