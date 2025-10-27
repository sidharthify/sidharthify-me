const logo = document.querySelector('.logo');

let targetX = 50;
let targetY = 50;
let currentX = 50;
let currentY = 50;
const easing = 1;

function animate() {
    currentX += (targetX - currentX) * easing;
    currentY += (targetY - currentY) * easing;

    logo.style.setProperty('--mouse-x', `${currentX}%`);
    logo.style.setProperty('--mouse-y', `${currentY}%`);

    requestAnimationFrame(animate);
}
animate();

logo.addEventListener('mousemove', function (e) {
    const rect = logo.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width) * 100;
    targetY = ((e.clientY - rect.top) / rect.height) * 100;

    logo.classList.add('hover-gradient');
    logo.style.setProperty('--start-color', 'var(--mauve)');
    logo.style.setProperty('--end-color', 'var(--lavender)');
});

logo.addEventListener('mouseleave', function () {
    // instantly revert colors to lavender before easing back, because if you don't, part of mauve stays within the text.
    logo.style.setProperty('--start-color', 'var(--lavender)');
    logo.style.setProperty('--end-color', 'var(--lavender)');

    targetX = 50;
    targetY = 50;
    logo.classList.remove('hover-gradient');
});