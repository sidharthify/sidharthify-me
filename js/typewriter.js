document.addEventListener("DOMContentLoaded", function () {
    const text = "sidharthify";
    const logo = document.getElementById("typewriter-logo");
    let i = 0;

    function typeWriter() {
      if (i <= text.length) {
        logo.textContent = text.slice(0, i);
        i++;
        setTimeout(typeWriter, 90);
      }
    }
    typeWriter();
});