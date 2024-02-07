const homePagePhotosphere = new PANOLENS.ImagePanorama("static/sphereapp/images/home-sphere.jpg");
const ImageContainer = document.querySelector(".image-container");

const viewer = new PANOLENS.Viewer({
    container: ImageContainer,
    autoRotate: true,
    autoRotateSpeed: 1,
    controlButtons: ['fullscreen'],
});

viewer.add(homePagePhotosphere);
viewer.OrbitControls.noZoom = true;
