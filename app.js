// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const menuList = document.getElementById('menu-list');

hamburger.addEventListener('click', function() {
    menuList.classList.toggle('nascosto');
});

// Chiudi il menu quando clicchi su un link
const menuLinks = menuList.querySelectorAll('a');
menuLinks.forEach(link => {
    link.addEventListener('click', function() {
        menuList.classList.add('nascosto');
    });
});

// Chiudi il menu quando clicchi al di fuori
document.addEventListener('click', function(event) {
    const isClickInsideMenu = menuList.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);
    
    if (!isClickInsideMenu && !isClickOnHamburger && !menuList.classList.contains('nascosto')) {
        menuList.classList.add('nascosto');
    }
});

// Clock Icon Click Handler
const clockIcon = document.getElementById('clockIcon');

if (clockIcon) {
    clockIcon.addEventListener('click', function() {
        console.log('Clock icon clicked');
        // TODO: Add your function here when clock icon is clicked
    });
}
