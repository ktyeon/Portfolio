// const toggleBtn = document.querySelector('.navbar__toggle');
// const menu = document.querySelector('.navbar__menu');
// const icons = document.querySelector('.navbar__icons');

// toggleBtn.addEventListener('click', () => {
//     menu.classList.toggle('active');
//     icons.classList.toggle('active');
// });


// document.addEventListener('DOMContentLoaded', function () {
//     console.log('DOMContentLoaded event fired');
//     const navbarToggle = document.querySelector('.navbar__toggle');
//     const navbarMenu = document.querySelector('.navbar__menu');

//     navbarToggle.addEventListener('click', function () {
//         console.log('Toggle button clicked!');
//         navbarMenu.classList.toggle('show');
//     });
// });

  
document.addEventListener('DOMContentLoaded', function () {
    const navbarToggle = document.querySelector('.navbar__toggle');
    const navbarMenu = document.querySelector('.navbar__menu');

    console.log('navbarToggle:', navbarToggle);
    console.log('navbarMenu:', navbarMenu);

    navbarToggle.addEventListener('click', function () {
        console.log('Toggle button clicked!');
        navbarMenu.classList.toggle('show');
    });
});
