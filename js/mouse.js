const logo = document.querySelector('.logo');

logo.addEventListener('mousemove', function(e) {
    const rect = logo.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    logo.style.setProperty('--mouse-x', `${x}%`);
    logo.style.setProperty('--mouse-y', `${y}%`);
    logo.classList.add('hover-gradient');
});

// set properties when da mouse leaves
logo.addEventListener('mouseleave', function() {
    logo.style.setProperty('--mouse-x', `50%`);
    logo.style.setProperty('--mouse-y', `50%`);
});

logo.addEventListener('transitionend', function(e) {
    if (e.propertyName === 'background-image') {
        logo.classList.remove('hover-gradient');
        logo.style.removeProperty('--mouse-x');
        logo.style.removeProperty('--mouse-y');
    }
});