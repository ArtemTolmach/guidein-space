let currentUser = null;
const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

function checkAccess() {
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (window.isSuperuser && screenWidth >= 900) {
        document.getElementById('addPointModeBtn1').style.display = 'block';
        document.getElementById('addPointModeBtn2').style.display = 'block';
    } else {
        document.getElementById('addPointModeBtn1').style.display = 'none';
        document.getElementById('addPointModeBtn2').style.display = 'none';
    }
}

checkAccess()

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

fetch('/api/photospheres/' + window.project)
    .then(response => response.json())
    .then(data => {
        const navLinks = document.querySelector('.nav-links ul');

        data.forEach((photoSphere, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = photoSphere.id;
            a.innerText = photoSphere.title;

            li.appendChild(a);
            navLinks.appendChild(li);
        });
    });

fetch(('/api/photosphere/' + window.imageID))
    .then(response => response.json())
    .then(photosphere_data => {
        const panorama = new PANOLENS.ImagePanorama(photosphere_data.image_path);

        viewer.add(panorama);
        viewer.setPanorama(panorama);

        // Создание точек перемещения
        photosphere_data.move_points.forEach((point, index) => {
            const teleportationPoint = new PANOLENS.Infospot(350, '/static/sphereapp/images/move.png?' + index);
            teleportationPoint.position.set(point.x, point.y, point.z);

            teleportationPoint.addEventListener('click', () => {
                window.location.href = point.target_photo_sphere;
            });

            panorama.add(teleportationPoint);
        });
        // Создание точек информации
        photosphere_data.info_points.forEach((point, index) => {
            const InformationPoint = new PANOLENS.Infospot(350, '/static/sphereapp/images/info.png?' + index);
            InformationPoint.position.set(point.x, point.y, point.z);

            InformationPoint.addEventListener('click', () => {
                Swal.fire({
                    title: point.title,
                    html: point.description,
                    icon: 'info',
                    confirmButtonText: 'OK'
                });
            });
            panorama.add(InformationPoint);
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
    const description = document.getElementById('description_input').value;
    const title = document.getElementById('title_input').value;

    await fetch(`/api/photospheres/information-points/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            photo_sphere: window.imageID,
            x: outputPosition.x,
            y: outputPosition.y,
            z: outputPosition.z,
            title: title,
            description: description,
        }),
    });
};

const createMovePoint = async (outputPosition) => {
   const targetSphereId = document.querySelector('.selected').getAttribute('data-sphere-id');

    await fetch(`/api/photospheres/move-points/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            photo_sphere: window.imageID,
            x: outputPosition.x,
            y: outputPosition.y,
            z: outputPosition.z,
            target_photo_sphere: targetSphereId,
        }),
    });
};

fetch('/api/photospheres/'+ window.project)
    .then(response => response.json())
    .then(data => {
        for (let dropdownItem of data) {
            if (dropdownItem.id === parseInt(window.imageID)) {
                continue;
            }
            const dropdownText = document.createElement('li');
            dropdownText.setAttribute('data-sphere-id', dropdownItem.id);
            dropdownText.innerText = dropdownItem.title;

            dropdownContainer.appendChild(dropdownText);

            dropdownText.addEventListener('click', (event) => {
                const selectedText = event.target.innerText;
                const selectedSphereId = event.target.getAttribute('data-sphere-id');
                const selectElement = document.querySelector('.window_movepoint .selected');
                selectElement.setAttribute('data-sphere-id', selectedSphereId);
                selectElement.innerText = selectedText;
                dropdownContainer.classList.remove('menu-open');
            });
        }
    })
    .catch(error => {
        console.error('Error fetching dropdown items:', error);
    });

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
            for (let input of inputs) {
                input.value = '';
            }

            submitInfoPointBtn.removeEventListener('click', submitInfoPointClickHandler);
            viewer.renderer.domElement.addEventListener('click', viewerClickHandler);
        };
        submitInfoPointBtn.addEventListener('click', submitInfoPointClickHandler);
    }
    else if (addPointMode2) {
        const outputPosition = viewer.outputInfospotPosition(event);
        const dropdownContainer = document.querySelector('.window_movepoint .menu');
        viewer.renderer.domElement.removeEventListener('click', viewerClickHandler);

        document.querySelector('.window_movepoint').style.display = 'block';

        submitMovePointClickHandler = () => {
            createMovePoint(outputPosition);
            document.querySelector('.window_movepoint').style.display = 'none';
            dropdownContainer.classList.remove('menu-open');
            addPointModeBtn2.innerText = 'Включить добавление точки перемещения';
            addPointMode2 = false;

            submitMovePointBtn.removeEventListener('click', submitMovePointClickHandler)
            viewer.renderer.domElement.addEventListener('click', viewerClickHandler);
        };
        submitMovePointBtn.addEventListener('click', submitMovePointClickHandler);
    }
});
