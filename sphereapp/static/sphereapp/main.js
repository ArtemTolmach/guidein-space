let currentUser = null;

const fetchUserStatus = async () => {
    try {
        const response = await fetch('/api/current-user/');
        const userData = await response.json();
        const isSuperuser = userData.superuser;
        checkUserStatus(isSuperuser);
    } catch (error) {
        console.error('Ошибка при получении информации о роли пользователя:', error);
        checkUserStatus(false);
    }
};

const checkUserStatus = (isSuperuser) => {
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (isSuperuser && screenWidth >= 900) {
        showButtons();
    } else {
        hideButtons();
    }
};

const showButtons = () => {
     document.getElementById('addPointModeBtn1').style.display = 'block';
     document.getElementById('addPointModeBtn2').style.display = 'block';
};

const hideButtons = () => {
     document.getElementById('addPointModeBtn1').style.display = 'none';
     document.getElementById('addPointModeBtn2').style.display = 'none';
};

fetchUserStatus();

let addPointMode1, addPointMode2 = false;
let viewerClickHandler;
let submitMovePointClickHandler, submitInfoPointClickHandler;

const dropdowns = document.querySelectorAll('.dropdown');
const dropdownContainer = document.querySelector('.window_movepoint .menu');
const menuHamburger = document.querySelector(".menu-hamburger");
const navLinks = document.querySelector(".nav-links");
const submitMovePointBtn = document.querySelector('.createmovebtn');
const submitInfoPointBtn = document.querySelector('.createinfobtn');

menuHamburger.addEventListener('click', () => {
    menuHamburger.classList.toggle('active');
    navLinks.classList.toggle('mobile-menu');

    document.querySelector('.window_infopoint').style.display = 'none';
    addPointModeBtn1.innerText = 'Включить добавление точки информации';
    submitInfoPointBtn.removeEventListener('click', submitInfoPointClickHandler);
    submitInfoPointBtn.addEventListener('click', submitInfoPointClickHandler);
    addPointMode1 = false;

    document.querySelector('.window_movepoint').style.display = 'none';
    addPointModeBtn2.innerText = 'Включить добавление точки перемещения';
    submitMovePointBtn.removeEventListener('click', submitMovePointClickHandler)
    submitMovePointBtn.addEventListener('click', submitMovePointClickHandler);
    addPointMode2 = false;

    dropdownContainer.classList.remove('menu-open');

    viewer.renderer.domElement.addEventListener('click', viewerClickHandler);
});

const addPointModeBtn1 = document.getElementById('addPointModeBtn1');
addPointModeBtn1.addEventListener('click', () => {
    addPointMode1 = true;
    addPointModeBtn1.innerText = addPointModeBtn1.innerText ==='Включить добавление точки информации' ?
        'Включено добавление точки информации' : 'Включить добавление точки информации';
});

const addPointModeBtn2 = document.getElementById('addPointModeBtn2');
addPointModeBtn2.addEventListener('click', () => {
    addPointMode2 = true;
    addPointModeBtn2.innerText = addPointModeBtn2.innerText === 'Включить добавление точки перемещения' ?
        'Включено добавление точки перемещения' : 'Включить добавление точки перемещения';
});

dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const menu = dropdown.querySelector('.menu');
    const options = dropdown.querySelectorAll('.menu li');
    const selected = dropdown.querySelector('.selected');

    select.addEventListener('click', () => {
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('menu-open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            selected.innerText = option.innerText;

            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');

            options.forEach(option => {
                option.classList.remove('active');
            });
            option.classList.add('active');
        });
    });
});

function getActivePanoramaID() {
    const activePanorama = viewer.panorama;
    return activePanorama ? activePanorama.id - 23 : null;
}

function closeMovePointWindow() {
    document.querySelector('.window_movepoint').style.display = 'none';
    addPointModeBtn1.innerText = 'Включить добавление точки информации';
    submitMovePointBtn.removeEventListener('click', submitMovePointClickHandler)
    submitMovePointBtn.addEventListener('click', submitMovePointClickHandler);
    addPointMode2 = false;

    document.querySelector('.window_infopoint').style.display = 'none';
    addPointModeBtn2.innerText = 'Включить добавление точки перемещения';
    submitInfoPointBtn.removeEventListener('click', submitInfoPointClickHandler);
    submitInfoPointBtn.addEventListener('click', submitInfoPointClickHandler);
    addPointMode1 = false;

    viewer.renderer.domElement.addEventListener('click', viewerClickHandler);
}

const ImageContainer = document.querySelector('.image-container');

const viewer = new PANOLENS.Viewer({
    container: ImageContainer,
});

// Общий обработчик событий перехода
const switchToPanorama = (panorama) => {
    viewer.add(panorama);
    viewer.setPanorama(panorama);
};

//Динамическое создание фотосферы
fetch('/api/photospheres/')
    .then(response => response.json())
    .then(data => {
        const navLinks = document.querySelector('.nav-links ul');

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
                const navLinks = document.querySelector('.nav-links');
                const menuHamburger = document.querySelector('.menu-hamburger');

                navLinks.classList.toggle('mobile-menu')
                menuHamburger.classList.remove('active');

                const activePanorama = getActivePanoramaID();
                console.log('Active Panorama ID:', activePanorama);

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

        data.forEach((photoSphere, index) => {
            const textdropdown = document.createElement('li');
            textdropdown.setAttribute('data-sphere-id', photoSphere.id)
            textdropdown.innerText = photoSphere.title;

            dropdownContainer.appendChild(textdropdown);

            textdropdown.addEventListener('click', (event) => {
                const selectedText = event.target.innerText;
                const selectElement = document.querySelector('.window_movepoint .selected');
                selectElement.innerText = selectedText;
                dropdownContainer.classList.remove('menu-open');
            });
        });
    });

// Метод получения и вывода координат при клике
PANOLENS.Viewer.prototype.outputInfospotPosition = function (event) {
    var intersects, point, panoramaWorldPosition, outputPosition;

    intersects = this.raycaster.intersectObject(this.panorama, true);

    if (intersects.length > 0) {
        point = intersects[0].point;
        panoramaWorldPosition = this.panorama.getWorldPosition();

        outputPosition = new THREE.Vector3(
            -(point.x - panoramaWorldPosition.x).toFixed(2),
            (point.y - panoramaWorldPosition.y).toFixed(2),
            (point.z - panoramaWorldPosition.z).toFixed(2)
        );
        return outputPosition;
    }
    return null;
};

const createInfoPoint = async (outputPosition) => {
    try {
        const description = document.getElementById('description_input').value;
        const title = document.getElementById('title_input').value;
        const activePanorama = getActivePanoramaID();

        const response = await fetch(`/api/photospheres/information-points/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                photo_sphere: activePanorama,
                x: outputPosition.x,
                y: outputPosition.y,
                z: outputPosition.z,
                title: title,
                description: description,
            }),
        });

        const data = await response.json();
        console.log('data', data);

        if (data.success) {
            console.log('Информационная точка успешно добавлена.');
        } else {
            console.error('Не удалось создать информационную точку.');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
};

const createMovePoint = async (outputPosition) => {
    try {
        const selectedTitle = document.querySelector('.selected').innerText;
        const activePanorama = getActivePanoramaID();

        const response = await fetch(`/api/photospheres/move-points/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                photo_sphere: activePanorama,
                x: outputPosition.x,
                y: outputPosition.y,
                z: outputPosition.z,
                title: selectedTitle,
            }),
        });

        const data = await response.json();
        console.log('data', data);

        if (data.success) {
            console.log('Точка перемещения успешно добавлена.');
        } else {
            console.error('Не удалось создать точку перемещения.');
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
};

viewer.renderer.domElement.addEventListener('click',viewerClickHandler = async (event) => {
    if (addPointMode1) {
        const outputPosition = viewer.outputInfospotPosition(event);
        viewer.renderer.domElement.removeEventListener('click', viewerClickHandler);

        document.querySelector('.window_infopoint').style.display = 'block';

        submitInfoPointClickHandler = () => {
            createInfoPoint(outputPosition);
            document.querySelector('.window_infopoint').style.display = 'none';
            addPointModeBtn1.innerText = 'Включить добавление точки информации';
            addPointMode1 = false;

            const inputs = document.querySelectorAll('#title_input,#description_input');
            inputs.forEach(input => {
                input.value = '';
            });

            submitInfoPointBtn.removeEventListener('click', submitInfoPointClickHandler);
            viewer.renderer.domElement.addEventListener('click', viewerClickHandler);
        };
        submitInfoPointBtn.addEventListener('click', submitInfoPointClickHandler);
    }
    else if (addPointMode2) {
        const outputPosition = viewer.outputInfospotPosition(event);
        const dropdownContainer = document.querySelector('.window_movepoint .menu');
        const dropdownItems = dropdownContainer.querySelectorAll('li');
        const activePanoramaID = getActivePanoramaID();
        viewer.renderer.domElement.removeEventListener('click', viewerClickHandler);

        document.querySelector('.window_movepoint').style.display = 'block';

        dropdownItems.forEach((item) => {
            const sphereID = item.getAttribute('data-sphere-id');
            if (sphereID && parseInt(sphereID) === activePanoramaID) {
                item.classList.add('invisible');
            } else {
                item.classList.remove('invisible');
            }
        });

        submitMovePointClickHandler = () => {
            createMovePoint(outputPosition);
            document.querySelector('.window_movepoint').style.display = 'none';
            dropdownContainer.classList.remove('menu-open');
            addPointModeBtn2.innerText = 'Включить добавление точки перемещения';
            addPointMode2 = false;

            dropdownItems.forEach((item) => {
                item.classList.remove('invisible');
            });

            submitMovePointBtn.removeEventListener('click', submitMovePointClickHandler)
            viewer.renderer.domElement.addEventListener('click', viewerClickHandler);
        };
        submitMovePointBtn.addEventListener('click', submitMovePointClickHandler);
    }
});
