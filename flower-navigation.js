(() => {
  const menu = document.querySelector('.flower-nav');
  if (!menu) return;
  const button = menu.querySelector('.flower-nav__button');
  const panel = menu.querySelector('.flower-nav__reveal');
  let hovered = false;
  let focused = false;
  let pinned = false;
  function render() {
    const open = hovered || focused || pinned;
    menu.dataset.open = String(open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    panel.inert = !open;
  }
  menu.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') { hovered = true; render(); }
  });
  menu.addEventListener('pointerleave', () => { hovered = false; render(); });
  menu.addEventListener('focusin', (event) => {
    if (event.target !== button || button.matches(':focus-visible')) { focused = true; render(); }
  });
  menu.addEventListener('focusout', (event) => {
    if (!menu.contains(event.relatedTarget)) { focused = false; pinned = false; render(); }
  });
  button.addEventListener('click', () => { pinned = !pinned; render(); });
  document.addEventListener('pointerdown', (event) => {
    if (!menu.contains(event.target)) { pinned = false; focused = false; hovered = false; render(); }
  });
  menu.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    button.focus();
    hovered = focused = pinned = false;
    render();
  });
  render();
})();
