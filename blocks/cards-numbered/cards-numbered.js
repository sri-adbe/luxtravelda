/**
 * cards-numbered: image-less cards with an accent number (top left),
 * arrow link (top right), title and short text. One row per card,
 * one cell: number paragraph, heading, text, link paragraph.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const body = document.createElement('div');
    body.className = 'cards-numbered-card-body';
    [...row.children].forEach((cell) => {
      while (cell.firstChild) body.append(cell.firstChild);
    });
    if (!body.textContent.trim() && !body.querySelector('a')) return;

    const hasHeading = !!body.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');
    let headingSeen = false;
    [...body.children].forEach((el) => {
      if (/^H[1-6]$/.test(el.tagName)) {
        headingSeen = true;
        return;
      }
      if (el.tagName !== 'P') return;
      // decorative icon paragraph (image only) is not the number
      if (el.querySelector('picture, img') && !el.textContent.trim()) {
        el.classList.add('cards-numbered-card-icon');
        return;
      }
      const link = el.querySelector('a');
      if (link && el.children.length === 1 && el.textContent.trim() === link.textContent.trim()) {
        el.classList.add('cards-numbered-card-link');
        if (!link.getAttribute('aria-label') && !/[\p{L}\p{N}]/u.test(link.textContent)) {
          const title = body.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');
          if (title) link.setAttribute('aria-label', title.textContent.trim());
        }
      } else if (hasHeading && !headingSeen) {
        el.classList.add('cards-numbered-card-number');
      }
    });

    // an icon beside the title: group both into a header row
    const icon = body.querySelector(':scope > .cards-numbered-card-icon');
    const title = body.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');
    if (icon && title) {
      const header = document.createElement('div');
      header.className = 'cards-numbered-card-header';
      title.before(header);
      header.append(title, icon);
    }

    li.append(body);
    ul.append(li);
  });
  block.replaceChildren(ul);
}
