const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

document.addEventListener("DOMContentLoaded", function() {
    const subBtns = document.querySelectorAll(".sub-btn");
    subBtns.forEach(function(subBtn) {
        subBtn.addEventListener("click", function() {
            const subMenu = this.nextElementSibling;
            toggleSubMenu(subMenu);
        });
    });

    var closeWindows = document.querySelectorAll('.close_menu_form');
    closeWindows.forEach(function(closeWindow) {
        closeWindow.addEventListener('click', function() {
            closeMovePointWindow();
        });
    });
    function closeMovePointWindow() {
        document.querySelector('.window_movepoint').style.display = 'none';
        addPointModeBtn1.innerText = 'Включить добавление точки информации';
        addPointMode2 = false;
        submitMovePointBtn.removeEventListener('click', submitMovePointClickHandler);

        document.querySelector('.window_infopoint').style.display = 'none';
        addPointModeBtn2.innerText = 'Включить добавление точки перемещения';
        addPointMode1 = false;
        submitInfoPointBtn.removeEventListener('click', submitInfoPointClickHandler);

        viewer.addEventListener('click', clickHandler);
    }

    function toggleSubMenu(clickedSubMenu) {
        const allSubMenus = document.querySelectorAll(".sub-menu");
        allSubMenus.forEach(function(subMenu) {
            if (subMenu !== clickedSubMenu) {
                subMenu.style.display = 'none';
            }
        });

        const style = window.getComputedStyle(clickedSubMenu);
        if (style.display === 'none') {
            clickedSubMenu.style.display = 'block';
        } else {
            clickedSubMenu.style.display = 'none';
        }
    }
});

let addPointMode1, addPointMode2, addPolygonMode3, addVideoMode4, addImageMode5, addPolyLineMode6 = false;
let viewerClickHandler;
let submitMovePointClickHandler, submitInfoPointClickHandler;

const dropdowns = document.querySelectorAll('.dropdown');
const dropdownContainer = document.querySelector('.window_movepoint .menu');
const menuHamburger = document.querySelector(".menu-hamburger");
const navigation = document.querySelector(".navigation");
const submitMovePointBtn = document.querySelector('.createmovebtn');
const submitInfoPointBtn = document.querySelector('.createinfobtn');

menuHamburger.addEventListener('click', () => {
    menuHamburger.classList.toggle('active');
    navigation.classList.toggle('active');

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
const addPointModeBtn2 = document.getElementById('addPointModeBtn2');
const addPolygonModeBtn3 = document.getElementById('addPolygonModeBtn3');
const addVideoModeBtn4 = document.getElementById('addVideoModeBtn4');
const addImageModeBtn5 = document.getElementById('addImageModeBtn5');

const addPolygonSendBtn = document.getElementById('addDataSend');

if (addPointModeBtn1 && addPointModeBtn2 && addPolygonModeBtn3 && addVideoModeBtn4 && addImageModeBtn5){
    addPointModeBtn1.addEventListener('click', () => {
        addPointMode1 = true;
        addPointModeBtn1.innerText = addPointModeBtn1.innerText === 'Включить добавление точки информации' ?
            'Включено добавление точки информации' : 'Включить добавление точки информации';
    });

    addPointModeBtn2.addEventListener('click', () => {
        addPointMode2 = true;
        addPointModeBtn2.innerText = addPointModeBtn2.innerText === 'Включить добавление точки перемещения' ?
            'Включено добавление точки перемещения' : 'Включить добавление точки перемещения';
    });

    addPolygonModeBtn3.addEventListener('click', () => {
        addPolygonMode3 = true;
        addPolygonModeBtn3.innerText = addPolygonModeBtn3.innerText === 'Включить добавление точки полигона' ?
            'Включено добавление точки полигона' : 'Включить добавление точки полигона';
    });

    addVideoModeBtn4.addEventListener('click', () => {
        addVideoMode4 = true;
        addVideoModeBtn4.innerText = addVideoModeBtn4.innerText === 'Включить добавление точки видео' ?
            'Включено добавление точки видео' : 'Включить добавление точки видео';
    });

    addImageModeBtn5.addEventListener('click', () => {
        addImageMode5 = true;
        addImageModeBtn5.innerText = addImageModeBtn5.innerText === 'Включить добавление точки изоюражения' ?
            'Включено добавление точки изображения' : 'Включить добавление точки изображения';
    });

    addPolyLineModeBtn6.addEventListener('click', () => {
        addPolyLineMode6 = true;
        addPolyLineModeBtn6.innerText = addPolyLineModeBtn6.innerText === 'Включить добавление линии' ?
            'Включено добавление точки линии' : 'Включить добавление линии';
    });
}

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

import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';

const ImageContainer = document.querySelector('.image-container');

const viewer = new Viewer({
    container: ImageContainer,
    plugins: [
        [MarkersPlugin, {
            defaultHoverScale: true,
        }],
    ],
});

fetch('/api/locations/' + window.project)
    .then(response => response.json())
    .then(data => {
        const navLinks = document.querySelector('#sub-menu-locations');

        data.forEach((location) => {
            const li = document.createElement('li');
            li.classList.add('sub-item');
            const a = document.createElement('a');
            a.href = '/' + window.project + '/' + location.id + '/' + location.main_sphere + '/';
            a.innerText = location.name;

            li.appendChild(a);
            navLinks.appendChild(li);
        });
    });

const markersPlugin = viewer.getPlugin(MarkersPlugin);

fetch('/api/photospheres/' + window.locationID)
    .then(response => response.json())
    .then(data => {
        const navLinks = document.querySelector('#sub-menu-photospheres');

        data.forEach((photoSphere) => {
            const li = document.createElement('li');
            li.classList.add('sub-item');
            const a = document.createElement('a');
            a.href = '/' + window.project + '/' + window.locationID + '/' + photoSphere.id + '/';
            a.innerText = photoSphere.name;

            li.appendChild(a);
            navLinks.appendChild(li);
        });
    });

fetch(('/api/photosphere/' + window.imageID))
    .then(response => response.json())
    .then(photosphere_data => {
        const panorama = photosphere_data.image_path;

        viewer.setPanorama(panorama).then(() => {
            markersPlugin.clearMarkers();
            photosphere_data.move_points.forEach(point => {
                markersPlugin.addMarker({
                    id: point.id.toString(),
                    position: { pitch: point.pitch, yaw: point.yaw },
                    image: '/static/sphereapp/images/move.png',
                    size: { width: 102, height: 102 },
                    anchor: 'bottom center',
                    hoverScale: false,
                    className: 'move-point'
                });
                markersPlugin.markers[point.id.toString()].element.addEventListener('click', markerClickHandler);
                markersPlugin.markers[point.id.toString()].element.addEventListener('touchstart', markerClickHandler);

                function markerClickHandler() {
                    window.location.href = point.target_photo_sphere;
                    console.log("КЛИК");
                }
            });
            console.log(markersPlugin)

            photosphere_data.info_points.forEach(point => {
                markersPlugin.addMarker({
                    id: point.id.toString(),
                    position: { pitch: point.pitch, yaw: point.yaw },
                    image: '/static/sphereapp/images/info.png',
                    size: { width: 30, height: 30 },
                    anchor: 'bottom center',
                    hoverScale: false,
                });
                markersPlugin.markers[point.id.toString()].element.addEventListener('click', markerClickHandler);
                markersPlugin.markers[point.id.toString()].element.addEventListener('touchstart', markerClickHandler);

                function markerClickHandler() {
                    Swal.fire({
                        title: point.title,
                        html: point.description,
                        icon: 'info',
                        confirmButtonText: 'OK'
                    });
                }
            });

            photosphere_data.polygon_points.forEach(point => {
                markersPlugin.addMarker({
                    id: point.id.toString(),
                    tooltip: false,
                    anchor: 'bottom',
                    hoverScale: true,
                    polygon: point.coordinates,
                    style: {
                        fill: point.fill,
                        strokeColor: point.stroke,
                        strokeWidth: point.stroke_width,
                    },
                });
            });

            photosphere_data.video_points.forEach(point => {
                markersPlugin.addMarker({
                    id: point.id.toString(),
                    videoLayer: point.video,
                    position: point.coordinates,
                    style: {
                        cursor: 'pointer',
                    },
                    tooltip: 'Play / Pause',
                    chromaKey: {
                        enabled: point.enable_chroma_key,
                        color: '#04F405',
                        similarity: 0.3,
                    },
                });
            });

            photosphere_data.image_points.forEach(point => {
                markersPlugin.addMarker({
                    id: point.id.toString(),
                    imageLayer: point.image,
                    position: point.coordinates,
                    anchor: 'bottom center',
                });
            });

            photosphere_data.polyline_points.forEach(point => {
                markersPlugin.addMarker({
                    id: point.id.toString(),
                    polyline: point.coordinates,
                    svgStyle: {
                        stroke: point.stroke,
                        strokeLinecap: point.stroke_linecap,
                        strokeLinejoin: point.stroke_linejoin,
                        strokeWidth: point.stroke_width,
                    },
                });
            });
        });
    });

let arrayPolygon = [];
let arrayVideo = [];
let arrayImage = [];
let arrayPolyLine = [];

function clickHandler({ data }) {
    var outputPosition = {
        yaw: data.yaw,
        pitch: data.pitch,
    };

    console.log(outputPosition)

    if (addPointMode1) {
        handleAddInfoPoint(outputPosition);
    } else if (addPointMode2) {
        handleMovePoint(outputPosition);
    } else if (addPolygonMode3) {
        addPolygonSendBtn.style.display = 'block';
        addPolygonSendBtn.addEventListener('click', handlePolygonPoint)
        let coordinateClick = [data.yaw, data.pitch];
        arrayPolygon.push(coordinateClick);
        console.log(arrayPolygon);
        if (arrayPolygon.length === 1){
            markersPlugin.addMarker({
              id: 'svg-circle-marker',
              position: { yaw: arrayPolygon[0][0], pitch: arrayPolygon[0][1] },
              svgStyle: {
                fill: 'rgba(255, 0, 0, 0.6)',
                stroke: 'rgba(255, 0, 0, 1)',
                strokeWidth: '2px',
              },
              circle: 1,
              tooltip: 'SVG круглый маркер',
            });
        } else if (arrayPolygon.length === 2){
            markersPlugin.removeMarker('svg-circle-marker');
            markersPlugin.addMarker({
              id: 'polyline',
              polyline: arrayPolygon,
              svgStyle: {
                stroke: 'rgba(255, 0, 0, 1)',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: '2px',
              },
            });
        } else if (arrayPolygon.length > 2){
            var polygon = document.getElementById('psv-marker-dynamic-polygon-marker');
            var polyline = document.getElementById('psv-marker-polyline');

            if (polygon) {
                markersPlugin.removeMarker('dynamic-polygon-marker');
            }

            if (polyline) {
                markersPlugin.removeMarker('polyline');
            }
            markersPlugin.addMarker({
                id: 'dynamic-polygon-marker',
                polygon: arrayPolygon,
                tooltip: 'Динамический маркер полигона',
                anchor: 'bottom',
                hoverScale: true,
                style: {
                    fill: 'rgba(255, 0, 0, 0.6)',
                    stroke: 'rgba(255, 0, 0, 1)',
                    strokeWidth: 2,
                    pointerEvents: 'none',
                }
            });
        }
    } else if (addVideoMode4) {
        addPolygonSendBtn.style.display = 'block';
        addPolygonSendBtn.addEventListener('click', handleVideoPoint)
        let coordinateClick = {"yaw":data.yaw,"pitch": data.pitch};
        arrayVideo.push(coordinateClick);
        console.log(arrayVideo);
    } else if (addImageMode5) {
        addPolygonSendBtn.style.display = 'block';
        addPolygonSendBtn.addEventListener('click', handleImagePoint)
        let coordinateClick = {"yaw":data.yaw,"pitch": data.pitch};
        arrayImage.push(coordinateClick);
        console.log(arrayImage);
    } else if (addPolyLineMode6) {
        addPolygonSendBtn.style.display = 'block';
        addPolygonSendBtn.addEventListener('click', handlePolyLinePoint)
        let coordinateClick = [data.yaw, data.pitch];
        arrayPolyLine.push(coordinateClick);
        console.log(arrayPolyLine);
    }
}

viewer.addEventListener('click', clickHandler);

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
            yaw: outputPosition.yaw,
            pitch: outputPosition.pitch,
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
            yaw: outputPosition.yaw,
            pitch: outputPosition.pitch,
            target_photo_sphere: targetSphereId,
        }),
    });
};

const createPolygonPoint = async (arrayPolygon) => {
    console.log(arrayPolygon)

    await fetch(`/api/photospheres/polygon-points/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            photo_sphere: window.imageID,
            coordinates: arrayPolygon,
            fill: 'rgba(255, 0, 0, 0.5)',
            stroke: 'rgba(255, 0, 0, 0.5)',
            stroke_width: '2px'
        }),
    });
};

const createVideoPoint = async (arrayVideo) => {
    const videoInput = document.getElementById('file');
    const file = videoInput.files[0];

    const formData = new FormData();
    formData.append('photo_sphere', window.imageID);
    formData.append('video', file);
    formData.append('coordinates', JSON.stringify(arrayVideo));
    formData.append('enable_chroma_key', true);

        const response = await fetch(`/api/photospheres/video-points/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            body: formData,
        });
};

const createImagePoint = async (arrayVideo) => {
    const imageInput = document.getElementById('file');
    const file = imageInput.files[0];

    const formData = new FormData();
    formData.append('photo_sphere', window.imageID);
    formData.append('image', file);
    formData.append('coordinates', JSON.stringify(arrayImage));

        const response = await fetch(`/api/photospheres/image-points/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            body: formData,
        });
};

const createPolyLinePoint = async (arrayPolyLine) => {

    await fetch(`/api/photospheres/polyline-points/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
            photo_sphere: window.imageID,
            coordinates: arrayPolyLine,
            stroke: 'rgba(255, 0, 0, 0.5)',
            stroke_linecap: 'round',
            stroke_linejoin: 'round',
            stroke_width: '2px'
        }),
    });
};

fetch('/api/photospheres/'+ window.locationID)
    .then(response => response.json())
    .then(data => {
        for (let dropdownItem of data) {
            if (dropdownItem.id === parseInt(window.imageID)) {
                continue;
            }
            const dropdownText = document.createElement('li');
            dropdownText.setAttribute('data-sphere-id', dropdownItem.id);
            dropdownText.innerText = dropdownItem.name;

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

function handleAddInfoPoint(outputPosition) {
    viewer.removeEventListener('click', clickHandler);

    const windowInfo = document.querySelector('.window_infopoint');
    windowInfo.style.display = 'block';

    submitInfoPointClickHandler = () => {
        createInfoPoint(outputPosition);
        windowInfo.style.display = 'none';
        addPointModeBtn1.innerText = 'Включить добавление точки информации';
        addPointMode1 = false;

        const inputs = document.querySelectorAll('#title_input, #description_input');
        inputs.forEach(input => input.value = '');

        submitInfoPointBtn.removeEventListener('click', submitInfoPointClickHandler);

        viewer.addEventListener('click', clickHandler);
    };
    submitInfoPointBtn.addEventListener('click', submitInfoPointClickHandler);
}

function handleMovePoint(outputPosition) {
    viewer.removeEventListener('click', clickHandler);

    const windowMove = document.querySelector('.window_movepoint');
    windowMove.style.display = 'block';

    submitMovePointClickHandler = () => {
        createMovePoint(outputPosition);
        windowMove.style.display = 'none';
        addPointModeBtn2.innerText = 'Включить добавление точки перемещения';
        addPointMode2 = false;

        submitMovePointBtn.removeEventListener('click', submitMovePointClickHandler);

        viewer.addEventListener('click', clickHandler);
    };
    submitMovePointBtn.addEventListener('click', submitMovePointClickHandler);
}

function handlePolygonPoint() {
    viewer.removeEventListener('click', clickHandler);

    var polygon = document.getElementById('psv-marker-dynamic-polygon-marker');

    if (polygon) {
        markersPlugin.removeMarker('dynamic-polygon-marker');
    }

    createPolygonPoint(arrayPolygon);
    addPolygonSendBtn.style.display = 'none';
    console.log(arrayPolygon)
    arrayPolygon = []
    viewer.addEventListener('click', clickHandler);
}

function handleVideoPoint() {
    viewer.removeEventListener('click', clickHandler);
    createVideoPoint(arrayVideo);
    addPolygonSendBtn.style.display = 'none';
    console.log(arrayVideo)

    viewer.addEventListener('click', clickHandler);
}

function handleImagePoint() {
    viewer.removeEventListener('click', clickHandler);
    createImagePoint(arrayVideo);
    addPolygonSendBtn.style.display = 'none';
    console.log(arrayVideo)

    viewer.addEventListener('click', clickHandler);
}

function handlePolyLinePoint() {
    viewer.removeEventListener('click', clickHandler);
    createPolyLinePoint(arrayPolyLine);
    addPolygonSendBtn.style.display = 'none';
    console.log(arrayPolyLine)

    viewer.addEventListener('click', clickHandler);
}
