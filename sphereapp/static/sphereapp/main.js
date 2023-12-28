const panoramaImage = new PANOLENS.ImagePanorama("static/sphereapp/images/vlad.jpg");
const panoramaImage2 = new PANOLENS.ImagePanorama("static/sphereapp/images/vlad2.jpg");
const ImageContainer = document.querySelector(".image-container");

const viewer = new PANOLENS.Viewer({
    container: ImageContainer,
});

viewer.add(panoramaImage);
viewer.add(panoramaImage2);

// Элементы ПЕРВОЙ фотосферы
const point = new PANOLENS.Infospot(350, 'static/sphereapp/images/info.png');
point.position.set(7000, -300, 1550);

point.addEventListener('click', () => {
    Swal.fire({
        title: 'ЭТО ВОДОПОЙ',
        html: 'ПОПЕЙ',
        icon: 'info',
        confirmButtonText: 'OK'
    });
});

const point2 = new PANOLENS.Infospot(350, "static/sphereapp/images/info2.png");
point2.position.set( 9400 , -300, -2000);

point2.addEventListener('click', () => {
    Swal.fire({
        title: 'ВАС ЗАМЕТИЛИ',
        html: 'Это Артём',
        icon: 'info',
        confirmButtonText: 'OK'
    });
});

// Точку для перемещения (С 1 на 2)
const movePoint = new PANOLENS.Infospot(350, 'static/sphereapp/images/move.png');

movePoint.position.set(2200, -450, -100);

movePoint.addEventListener('click', () => {
    viewer.setPanorama(panoramaImage2);
});

panoramaImage.add(point, point2, movePoint);

// Элементы ВТОРОЙ фотосферы
const point3 = new PANOLENS.Infospot(350, 'static/sphereapp/images/info3.png');
point3.position.set(100, 0, -1000);

point3.addEventListener('click', () => {
    Swal.fire({
        title: 'ЭТО ПОЧТИ КРОВАТЬ',
        html: 'КРОВАТЬ (НЕ КРОВАТЬ)',
        icon: 'info',
        confirmButtonText: 'OK'
    });
});

// Точка для перемещения (с 2 на 1)
const returnPoint = new PANOLENS.Infospot(350, 'static/sphereapp/images/move2.png');
returnPoint.position.set(-2400, -1000, -3000);

returnPoint.addEventListener('click', () => {
    viewer.setPanorama(panoramaImage);
});

panoramaImage2.add(point3, returnPoint)

// Общий обработчик событий перехода
const switchToPanorama = (panorama) => {
    viewer.add(panorama);
    viewer.setPanorama(panorama);
};

const firstSphereBtn = document.getElementById('FirstPhotoSphereLink');
firstSphereBtn.addEventListener('click', () => {
    switchToPanorama(panoramaImage);
    const navLinks = document.querySelector(".nav-links")
    const menuHamburger = document.querySelector(".menu-hamburger");

    navLinks.classList.toggle('mobile-menu')
    menuHamburger.classList.remove('active');
});

const secondSphereBtn = document.getElementById('SecondPhotoSphereLink');
secondSphereBtn.addEventListener('click', () => {
    switchToPanorama(panoramaImage2);
    const navLinks = document.querySelector(".nav-links")
    const menuHamburger = document.querySelector(".menu-hamburger");

    navLinks.classList.toggle('mobile-menu')
    menuHamburger.classList.remove('active');
});

// Динамическое создание фотосфер и точек перемещения
fetch('/api/photospheres/')
    .then(response => response.json())
    .then(data => {
        const navLinks = document.querySelector(".nav-links ul");

        data.forEach((photoSphere, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.innerText = photoSphere.title;

            const mediaBaseUrl = '/media/';
            const imagePath = photoSphere.image_path;
            const fullImagePath = mediaBaseUrl + imagePath;
            const addpanorama = new PANOLENS.ImagePanorama(fullImagePath);

            a.addEventListener('click', () => {
                switchToPanorama(addpanorama);
                const navLinks = document.querySelector(".nav-links");
                const menuHamburger = document.querySelector(".menu-hamburger");

                navLinks.classList.toggle('mobile-menu')
                menuHamburger.classList.remove('active');

                // Создание точек перемещения
                photoSphere.teleportation_points.forEach(point => {
                    const teleportationPoint = new PANOLENS.Infospot(350, 'static/sphereapp/images/move3.png');
                    teleportationPoint.position.set(point.x, point.y, point.z);

                    teleportationPoint.addEventListener('click', () => {
                        // Находим целевую фотосферу по её названию
                        const targetPanorama = data.find(pano => pano.title === point.target_photo_sphere);

                        const target_sphere = new PANOLENS.ImagePanorama(mediaBaseUrl + targetPanorama.image_path)
                        viewer.add(target_sphere)
                        viewer.setPanorama(target_sphere);
                    });

                    addpanorama.add(teleportationPoint);
                });

                // Создание точек информации
                photoSphere.information_points.forEach(point => {
                const InformationPoint = new PANOLENS.Infospot(350, 'static/sphereapp/images/info4.png');
                InformationPoint.position.set(point.x, point.y, point.z);

                    InformationPoint.addEventListener('click', () => {
                        Swal.fire({
                            title: point.title,
                            html: point.description,
                            icon: 'info',
                            confirmButtonText: 'OK'
                        });
                    });
                    addpanorama.add(InformationPoint);
                });
            });

            li.appendChild(a);
            navLinks.appendChild(li);
        });
    });

