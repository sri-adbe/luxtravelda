/**
 * columns-intro: section-head layout. Wide left column (eyebrow + heading),
 * narrow right column (intro text aligned to the bottom).
 * One row, two cells. A single-cell row renders as a heading-only head.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const cols = [...rows[0].children];
  block.classList.add(`columns-intro-${cols.length}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-intro-row');
    const cells = [...row.children];
    cells.forEach((cell, i) => {
      cell.classList.add(i === 0 ? 'columns-intro-main' : 'columns-intro-aside');
    });

    const main = cells[0];
    if (!main) return;
    // a short paragraph placed before the heading is the eyebrow
    const heading = main.querySelector(':scope > :is(h1, h2, h3, h4, h5, h6)');
    if (heading) {
      let prev = heading.previousElementSibling;
      while (prev) {
        if (prev.tagName === 'P') prev.classList.add('columns-intro-eyebrow');
        prev = prev.previousElementSibling;
      }
    }
  });
}
