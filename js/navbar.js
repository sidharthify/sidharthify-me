document.addEventListener("DOMContentLoaded", function () {
  const container =
    document.querySelector("main.shell") ||
    document.querySelector("main.container") ||
    document.querySelector(".container") ||
    document.querySelector("main");

  function isInternal(href) {
    try {
      const u = new URL(href, location.href);
      return u.host === location.host;
    } catch {
      return false;
    }
  }

  document.querySelectorAll(".menu a, .navbar-links a").forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || this.getAttribute("aria-current") === "page") return;
      if (!isInternal(href)) return;

      e.preventDefault();

      if (container) {
        container.classList.add("is-fading");
        // Match the CSS transition duration
        setTimeout(() => {
          window.location.href = href;
        }, 180);
      } else {
        window.location.href = href;
      }
    });
  });
});