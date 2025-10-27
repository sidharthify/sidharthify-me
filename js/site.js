function wireNavFade() {
  const container = document.querySelector('.shell');
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || /^https?:\/\//.test(href)) return;
    a.addEventListener('click', (e) => {
      if (a.hasAttribute('aria-current')) return;
      e.preventDefault();
      if (container) container.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 160);
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  tickAge();
  wireNavFade();
});