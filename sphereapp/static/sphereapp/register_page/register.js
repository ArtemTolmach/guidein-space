const homePagePhotosphere = new PANOLENS.ImagePanorama("/static/sphereapp/images/register.jpg");
const ImageContainer = document.querySelector(".image-container");

const viewer = new PANOLENS.Viewer({
    container: ImageContainer,
    autoRotate: true,
    autoRotateSpeed: 1,
    controlButtons: ['fullscreen'],
});

viewer.add(homePagePhotosphere);
