document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".navbar-toggle");
  const links = document.querySelector(".navbar-links");

  // Mobile menu toggle
  toggle.addEventListener("click", () => {
    links.classList.toggle("show");
    toggle.classList.toggle("open");
  });

  // Animation when switching tabs
  document.querySelectorAll(".navbar-links a").forEach(link => {
    link.addEventListener("click", function(e) {
      // Don't animate if already on this page
      if (this.getAttribute('aria-current') === 'page') return;

      // Only animate internal links
      if (this.href && this.href.indexOf(location.hostname) !== -1) {
        e.preventDefault();
        const mainContent = document.querySelector(".container") || document.querySelector("main");
        if (mainContent) {
          mainContent.classList.add("fade-out");
          setTimeout(() => {
            window.location = this.href;
          }, 220); // match CSS transition
        } else {
          window.location = this.href;
        }
      }
    });
  });
});