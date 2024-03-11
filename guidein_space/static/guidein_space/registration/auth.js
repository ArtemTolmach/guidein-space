const pathname = location.pathname;
let page = ''

if (pathname === '/login/') {
    page = 'login'
} else if (pathname === '/register/') {
    page = 'register'
}

const photosphere = new PANOLENS.ImagePanorama('/static/guidein_space/images/' + page + '.jpg');
const ImageContainer = document.querySelector('.image-container');

const viewer = new PANOLENS.Viewer({
    container: ImageContainer,
    autoRotate: true,
    autoRotateSpeed: 1,
    controlButtons: ['fullscreen'],
});

viewer.add(photosphere);
