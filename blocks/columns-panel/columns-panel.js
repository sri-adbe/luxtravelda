/**
 * columns-panel: two (or more) text columns, each heading + paragraph,
 * set inside one rounded panel with a thin divider between columns.
 * One row, one cell per column. Empty cells are dropped; a single
 * remaining cell renders as a one-column panel.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  rows.forEach((row) => {
    row.classList.add('columns-panel-row');
    [...row.children].forEach((cell) => {
      if (!cell.textContent.trim() && !cell.querySelector('picture, img')) {
        cell.remove();
        return;
      }
      cell.classList.add('columns-panel-col');
    });
    if (!row.children.length) row.remove();
  });

  const first = block.querySelector('.columns-panel-row');
  const count = first ? first.children.length : 0;
  block.classList.add(`columns-panel-${count}-cols`);
}
