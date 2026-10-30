/**
 * Fetches the nav fragment as plain HTML.
 * Metadata-independent: /content first (local preview), then the site root (DA/EDS).
 * @returns {Promise<HTMLElement|null>} container holding the fragment sections
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const container = document.createElement('div');
  container.innerHTML = await resp.text();
  return container;
}

/**
 * Returns true when a link points at the page currently shown.
 * @param {HTMLAnchorElement} a link
 */
function isSamePage(a) {
  // local preview serves pages under /content, production at the root
  const normalize = (path) => path.replace(/^\/content(?=\/|$)/, '').replace(/(\/index)?(\.html)?$/, '').replace(/\/$/, '') || '/';
  const url = new URL(a.href, window.location.href);
  return url.origin === window.location.origin
    && normalize(url.pathname) === normalize(window.location.pathname);
}

/**
 * Scrolls in-page for nav links that target the current page (keeps source #hash behaviour).
 * @param {HTMLAnchorElement} a link
 */
function decorateInPageLink(a) {
  a.addEventListener('click', (e) => {
    if (!isSamePage(a)) return;
    const { hash } = new URL(a.href, window.location.href);
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (hash && !target) return;
    e.preventDefault();
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', hash);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

/**
 * Builds the brand section: a single text logo link.
 * @param {Element} section fragment section
 */
function buildBrand(section) {
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const link = section.querySelector('a');
  if (link) {
    link.className = 'nav-brand-link';
    decorateInPageLink(link);
    brand.append(link);
  } else {
    brand.append(...section.childNodes);
  }
  return brand;
}

/**
 * Builds the primary links section from the fragment list.
 * @param {Element} section fragment section
 */
function buildSections(section) {
  const sections = document.createElement('nav');
  sections.className = 'nav-sections';
  sections.setAttribute('aria-label', 'Main');
  const list = section.querySelector('ul');
  if (list) {
    list.className = 'nav-list';
    list.querySelectorAll(':scope > li').forEach((li) => {
      li.className = 'nav-item';
      li.querySelectorAll('a').forEach(decorateInPageLink);
    });
    sections.append(list);
  }
  return sections;
}

/**
 * Builds the tools section: optional label paragraphs plus a CTA link.
 * @param {Element} section fragment section
 */
function buildTools(section) {
  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  [...section.querySelectorAll(':scope > p')].forEach((p) => {
    const link = p.querySelector('a');
    if (link && p.textContent.trim() === link.textContent.trim()) {
      link.className = 'nav-cta';
      tools.append(link);
    } else if (p.textContent.trim()) {
      const label = document.createElement('span');
      label.className = 'nav-label';
      label.textContent = p.textContent.trim();
      tools.append(label);
    }
  });
  return tools;
}

/**
 * Builds a modal dialog from a fragment section and wires every link that
 * targets the CTA's anchor (e.g. #contact) to open it.
 * @param {Element} section fragment section (eyebrow, heading, text, CTA link)
 * @param {string} anchor hash that opens the dialog
 */
function buildDialog(section, anchor) {
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-dialog-backdrop';
  backdrop.setAttribute('role', 'presentation');
  backdrop.hidden = true;

  const dialog = document.createElement('div');
  dialog.className = 'nav-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'nav-dialog-close';
  close.setAttribute('aria-label', 'Close');
  close.textContent = '×';
  dialog.append(close);

  const heading = section.querySelector('h1, h2, h3');
  if (heading) {
    heading.id = heading.id || 'nav-dialog-title';
    dialog.setAttribute('aria-labelledby', heading.id);
  }
  [...section.children].forEach((el) => {
    if (el.tagName === 'P' && el.nextElementSibling === heading) el.className = 'nav-dialog-eyebrow';
    const link = el.querySelector('a');
    if (el.tagName === 'P' && link && el.textContent.trim() === link.textContent.trim()) {
      link.className = 'nav-dialog-cta';
      dialog.append(link);
      return;
    }
    dialog.append(el);
  });
  backdrop.append(dialog);

  let opener = null;
  // modal: keep keyboard and screen-reader focus inside the dialog while it is open
  const setPageInert = (inert) => {
    document.querySelectorAll('body > header, body > main, body > footer').forEach((el) => {
      el.inert = inert;
    });
  };
  const hide = () => {
    backdrop.hidden = true;
    setPageInert(false);
    if (opener) opener.focus();
    opener = null;
  };
  const show = (trigger) => {
    opener = trigger;
    setPageInert(true);
    backdrop.hidden = false;
    close.focus();
  };

  close.addEventListener('click', hide);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) hide();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !backdrop.hidden) hide();
  });
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link || backdrop.contains(link)) return;
    const url = new URL(link.href, window.location.href);
    if (url.hash !== anchor || !isSamePage(link)) return;
    e.preventDefault();
    show(link);
  });

  return backdrop;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';
  if (!fragment) return;

  const [brandSection, linksSection, toolsSection, dialogSection] = fragment.querySelectorAll(':scope > div');

  const nav = document.createElement('div');
  nav.id = 'nav';
  nav.className = 'nav-bar';
  if (brandSection) nav.append(buildBrand(brandSection));
  if (linksSection) nav.append(buildSections(linksSection));
  if (toolsSection) nav.append(buildTools(toolsSection));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  const cta = nav.querySelector('.nav-cta');
  const anchor = cta ? new URL(cta.href, window.location.href).hash : '';
  if (dialogSection && anchor) {
    // the dialog sits outside the sticky header so its fixed backdrop covers the page
    document.body.append(buildDialog(dialogSection, anchor));
  }
}
