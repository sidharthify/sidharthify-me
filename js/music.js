document.querySelectorAll('.music-row').forEach(row => {
    const btn = row.querySelector('.play-btn');
    const audio = row.querySelector('audio');
  
    btn.addEventListener('click', function() {
      document.querySelectorAll('audio').forEach(a => {
        if (a !== audio) a.pause();
      });
      document.querySelectorAll('.play-btn').forEach(b => {
        if (b !== btn) b.classList.remove('paused');
      });

      if (audio.paused) {
        audio.play();
        btn.classList.add('paused');
      } else {
        audio.pause();
        btn.classList.remove('paused');
      }
    });

    audio.addEventListener('ended', function() {
      btn.classList.remove('paused');
    });
  });