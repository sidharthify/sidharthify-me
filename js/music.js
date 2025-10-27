document.querySelectorAll('.music-row').forEach(row => {
  const btn = row.querySelector('.play-btn');
  const audio = row.querySelector('audio');
  if (!btn || !audio) return;

  function pauseOthers() {
    document.querySelectorAll('.music-row').forEach(r => {
      const b = r.querySelector('.play-btn');
      const a = r.querySelector('audio');
      if (a && a !== audio) a.pause();
      if (b && b !== btn) b.classList.remove('paused');
    });
  }

  function toggle() {
    if (audio.paused) {
      pauseOthers();
      audio.play();
      btn.classList.add('paused');
      btn.setAttribute('aria-label', 'Pause');
      btn.title = 'Pause';
    } else {
      audio.pause();
      btn.classList.remove('paused');
      btn.setAttribute('aria-label', 'Play');
      btn.title = 'Play';
    }
  }

  btn.addEventListener('click', toggle);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });

  audio.addEventListener('ended', () => {
    btn.classList.remove('paused');
    btn.setAttribute('aria-label', 'Play');
    btn.title = 'Play';
  });
});