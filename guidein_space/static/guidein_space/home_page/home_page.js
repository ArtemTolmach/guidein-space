const homePagePhotosphere = new PANOLENS.ImagePanorama("static/guidein_space/images/home-sphere.jpg");
const ImageContainer = document.querySelector(".image-container");

const viewer = new PANOLENS.Viewer({
    container: ImageContainer,
    autoRotate: true,
    autoRotateSpeed: 1,
    controlButtons: ['fullscreen'],
});

viewer.add(homePagePhotosphere);
viewer.OrbitControls.noZoom = true;

if (window.innerWidth < 900) {
    ImageContainer.style.pointerEvents = 'none';
}

const menuHamburger = document.querySelector(".menu-hamburger");
const menuBar = document.querySelector(".menu-bar");
const html = document.querySelector("html");
const menuItem = document.querySelector(".menu-item")

menuHamburger.addEventListener('click', () => {
    menuHamburger.classList.toggle('active');
    menuBar.classList.toggle('active');
    html.classList.toggle('no-scroll');

    menuItem.addEventListener('click', () => {
        menuHamburger.classList.remove('active');
        menuBar.classList.remove('active');
        html.classList.remove('no-scroll');
    });
});

const projects = document.querySelectorAll('.suggestion-item');
const suggestions = document.querySelector('.suggestions');
const searchInput = document.querySelector('.search-input');

searchInput.oninput = () => {
    let inputValue = searchInput.value.toLowerCase();

    for (const project of projects) {
        if (project.innerText.toLowerCase().search(inputValue) === -1 || inputValue === '') {
            project.classList.add('hide');
        } else {
            project.classList.remove('hide');
        }
    }
};
