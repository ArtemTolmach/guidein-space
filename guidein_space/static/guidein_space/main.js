import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';

const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

document.addEventListener('DOMContentLoaded', function() {
    const subBtns = document.querySelectorAll('.sub-btn');
    subBtns.forEach(function(subBtn) {
        subBtn.addEventListener('click', function() {
            const subMenu = this.nextElementSibling;
            toggleSubMenu(subMenu);
        });
    });

    function toggleSubMenu(clickedSubMenu) {
        const allSubMenus = document.querySelectorAll('.sub-menu');
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

/* Создание вьювера */
const imageContainer = document.querySelector('.image-container');

const viewer = new Viewer({
    container: imageContainer,
    plugins: [
        [MarkersPlugin, {
            defaultHoverScale: true,
        }],
    ],
});

viewer.addEventListener('ready', () => {
  viewer.navbar.getButton('download').hide();
}, { once: true });

/* Элементы хедера */
const menuHamburger = document.querySelector('.menu-hamburger');
const navigation = document.querySelector('.navigation');

menuHamburger.addEventListener('click', () => {
    menuHamburger.classList.toggle('active');
    navigation.classList.toggle('active');
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

window.renderMarkers = function renderMarkers() {
    fetch(('/api/photosphere/' + window.imageID))
        .then(response => response.json())
        .then(data => {
            const panorama = data.image_path;

            viewer.setPanorama(panorama).then(() => {
                markersPlugin.clearMarkers();
                data.move_points.forEach(point => {
                    markersPlugin.addMarker({
                        id: point.id.toString(),
                        position: { pitch: point.pitch, yaw: point.yaw },
                        image: '/static/guidein_space/images/move.png',
                        size: { width: 60, height: 102 },
                        anchor: 'bottom center',
                        hoverScale: false,
                        style: {
                            pointerEvents: 'auto',
                        }
                    });

                    function markerClickHandler() {
                        window.location.href = '/' + window.project + '/' + window.locationID + '/' + point.target_photo_sphere;
                    }

                    const element = markersPlugin.markers[point.id.toString()].element
                    element.addEventListener('click', markerClickHandler);
                    element.addEventListener('touchstart', markerClickHandler);

                });

                data.info_points.forEach(point => {
                    markersPlugin.addMarker({
                        id: point.id.toString(),
                        position: { pitch: point.pitch, yaw: point.yaw },
                        image: '/static/guidein_space/images/info.png',
                        size: { width: 70, height: 70 },
                        anchor: 'bottom center',
                        hoverScale: false,
                        style: {
                            pointerEvents: 'auto',
                        }
                    });

                    function markerClickHandler() {
                        Swal.fire({
                            title: point.title,
                            html: point.description,
                            icon: 'info',
                            confirmButtonText: 'OK'
                        });
                    }

                    const element = markersPlugin.markers[point.id.toString()].element
                    element.addEventListener('click', markerClickHandler);
                    element.addEventListener('touchstart', markerClickHandler);

                });

                data.polygon_points.forEach(point => {
                    markersPlugin.addMarker({
                        id: point.id.toString(),
                        tooltip: false,
                        anchor: 'bottom',
                        hoverScale: true,
                        polygon: point.coordinates,
                        style: {
                            fill: point.fill,
                            opacity: point.opacity,
                            stroke: point.stroke,
                            strokeWidth: point.stroke_width,
                            pointerEvents: 'auto',
                        },
                    });
                });

                data.video_points.forEach(point => {
                    markersPlugin.addMarker({
                        id: point.id.toString(),
                        videoLayer: point.video,
                        position: point.coordinates,
                        style: {
                            cursor: 'pointer',
                            pointerEvents: 'auto',
                        },
                        chromaKey: {
                            enabled: point.enable_chroma_key,
                            color: point.color_chroma_key,
                            similarity: 0.3,
                        },
                    });
                });

                data.image_points.forEach(point => {
                    markersPlugin.addMarker({
                        id: point.id.toString(),
                        imageLayer: point.image,
                        position: point.coordinates,
                        anchor: 'bottom center',
                        style: {
                            pointerEvents: 'auto',
                        }
                    });
                });

                data.polyline_points.forEach(point => {
                    markersPlugin.addMarker({
                        id: point.id.toString(),
                        polyline: point.coordinates,
                        svgStyle: {
                            stroke: point.stroke,
                            strokeLinecap: point.stroke_linecap,
                            strokeLinejoin: point.stroke_linejoin,
                            strokeWidth: point.stroke_width,
                        },
                        style: {
                            pointerEvents: 'auto',
                        }
                    });
                });
            });
        });
}

renderMarkers();

if (window.isSuperuser) {
    let modeInfoMarker, modeMoveMarker, addPolygonMarker, addVideoMarker, modeImageMarker, modePolyLineMarker = false;
    let currentButton = null;

    /* Элементы формы перемещения */
    const moveForm = document.querySelector('.form-move-point');
    const dropdowns = document.querySelectorAll('.dropdown');
    const dropdownContainer = document.querySelector('.form-move-point .menu');
    const submitMovePointBtn = document.querySelector('.submit-move-btn');

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

    /* Элементы формы информации */
    const infoForm = document.querySelector('.form-info-point');
    const submitInfoPointBtn = document.querySelector('.submit-info-btn');

    /* Элементы формы изображения */
    const imageForm = document.querySelector('.form-image-point');
    const submitImagePointBtn = document.querySelector('.submit-image-btn');
    const dropAreaImage = document.getElementById('drop-area-image');
    const inputFileImage = document.getElementById('input-file-image');
    const imageView = document.getElementById('image-view');
    const arrayImage = [];
    const arrayDictsImages = [];

    inputFileImage.addEventListener('change', uploadImage);

    function uploadImage() {
        let imgLink = URL.createObjectURL(inputFileImage.files[0]);
        imageView.style.backgroundImage = `url(${imgLink})`;
        imageView.textContent = '';
        imageView.style.border = 0;
    }

    dropAreaImage.addEventListener('dragover', function(event) {
        event.preventDefault();
    });

    dropAreaImage.addEventListener('drop', function(event) {
        event.preventDefault();
        inputFileImage.files = event.dataTransfer.files;
    });

    /* Элементы формы видео */
    const videoForm = document.querySelector('.form-video-point');
    const submitVideoPointBtn = document.querySelector('.submit-video-btn');
    const dropAreaVideo = document.getElementById('drop-area-video');
    const inputFileVideo = document.getElementById('input-file-video');
    const videoView = document.getElementById('video-view');
    const arrayVideo = [];
    const arrayDictsVideo = [];

    inputFileVideo.addEventListener('change', uploadVideo);

    function uploadVideo() {
        let videoLink = URL.createObjectURL(inputFileVideo.files[0]);
        videoView.innerHTML = `<video width='100%' height='100%' controls><source src='${videoLink}' type='video/mp4'></video>`;
    }

    dropAreaVideo.addEventListener('dragover', function(event) {
        event.preventDefault();
    });

    dropAreaVideo.addEventListener('drop', function(event) {
        event.preventDefault();
        inputFileVideo.files = event.dataTransfer.files;
    });

    document.getElementById('eyedropper').addEventListener('click', (event) => {
        event.preventDefault();
        const output = document.querySelector('.chromakey-eyedrop');

        const dropper = new EyeDropper();
        const abortController = new AbortController();

        dropper
            .open({ signal: abortController.signal })
            .then((result) => {
                output.style.background = result.sRGBHex.replace('0)', '1)');
            })
            .catch((err) => {
                output.textContent = err;
                output.style.borderLeftColor = `transparent`;
            });
    });

    /* Элементы формы полигона */
    const polygoneForm = document.querySelector('.form-polygone-point');
    const submitPolygonPointBtn = document.querySelector('.submit-polygon-btn');
    const arrayPolygon = [];

    const pickrPolygonFill = createColorPicker('.color-picker-fill');
    const pickrFillPolygoneButton = document.querySelector('.fill-polygone .pcr-button');
    pickrFillPolygoneButton.id = 'color-picker-button-fill-polygone';

    const pickrPolygonStroke = createColorPicker('.color-picker-stroke');
    const pickrStrokePolygoneButton = document.querySelector('.stroke-polygone .pcr-button');
    pickrStrokePolygoneButton.id = 'color-picker-button-stroke-polygone';

    createSlider('range-thumb-fill-polygone', 'range-number-fill-polygone',
        'range-line-fill-polygone', 'range-input-fill-polygone', 100);

    createSlider('range-thumb-stroke-polygone', 'range-number-stroke-polygone',
        'range-line-stroke-polygone', 'range-input-stroke-polygone', 10);

    /* Элементы формы линии */
    const polyLineForm = document.querySelector('.form-polyline-point');
    const submitPolyLinePointBtn = document.querySelector('.submit-polyline-btn');
    const arrayPolyLine = [];

    const pickrStrokePolyline = createColorPicker('.color-picker-stroke-polyline');
    const pickrStrokePolylineButton = document.querySelector('.stroke-polyline .pcr-button');
    pickrStrokePolylineButton.id = 'color-picker-button-inside';

    createSlider('range-thumb-polyline-stroke', 'range-number-polyline-stroke',
        'range-line-polyline-stroke', 'range-input-polyline-stroke', 10);

    /* Элементы админ панели */
    const adminPanel = document.querySelector('.admin-panel');
    const buttonsAdminCreatePoints = document.querySelector('.buttons-panel');
    const adminAddPointForms = document.querySelectorAll('.admin-add-point form');
    const adminAddPointButton = document.querySelectorAll('.buttons-panel button-item');


    function deleteTemporaryMarkers() {
        /* Временные маркеры */
        const temporaryMarker = document.getElementById('psv-marker-temporary-marker');
        if (temporaryMarker) {
            markersPlugin.removeMarker('temporary-marker');
        }
    }

    function createColorPicker(idColorPicker) {
        Pickr.create({
            el: idColorPicker,
            theme: 'classic',
            components: {
                preview: true,
                hue: true,
                interaction: {
                    hex: true,
                    rgba: true,
                    input: true,
                    clear: true,
                    save: true
                }
            }
        });
    }

    function createSlider(thumb, number, line, input, maxValue) {
        const rangeThumb = document.getElementById(thumb);
        const rangeNumber = document.getElementById(number);
        const rangeLine = document.getElementById(line);
        const rangeInput = document.getElementById(input);

        function rangeInputSlider() {
            rangeNumber.textContent = rangeInput.value;

            const thumbPosition = rangeInput.value / rangeInput.max;

            rangeThumb.style.left = (thumbPosition * 90) + '%';

            rangeLine.style.width = (rangeInput.value * maxValue) + '%';

            rangeInput.addEventListener('input', rangeInputSlider);
        }

        rangeInputSlider();
    }

    function createTemporaryMarker(sequenceCoordinates) {
        if (sequenceCoordinates.length === 1) {
            markersPlugin.addMarker({
                id: 'temporary-marker',
                position: { yaw: sequenceCoordinates[0][0], pitch: sequenceCoordinates[0][1] },
                svgStyle: {
                    fill: 'rgba(255, 0, 0, 0.6)',
                    stroke: 'rgba(255, 0, 0, 1)',
                    strokeWidth: '2px',
                },
                circle: 1,
            });
        } else if (sequenceCoordinates.length > 1) {
            if (sequenceCoordinates === arrayPolyLine) {
                deleteTemporaryMarkers()
                markersPlugin.addMarker({
                    id: 'temporary-marker',
                    polyline: arrayPolyLine,
                    svgStyle: {
                        stroke: 'rgba(255, 0, 0, 1)',
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeWidth: '2px',
                    },
                });
            } else {
                if (sequenceCoordinates.length === 2) {
                    deleteTemporaryMarkers();
                    markersPlugin.addMarker({
                        id: 'temporary-marker',
                        polyline: sequenceCoordinates,
                        svgStyle: {
                            stroke: 'rgba(255, 0, 0, 1)',
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                            strokeWidth: '2px',
                        },
                    });
                } else if (sequenceCoordinates.length > 2) {
                    deleteTemporaryMarkers()
                    markersPlugin.addMarker({
                        id: 'temporary-marker',
                        polygon: sequenceCoordinates,
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
            }
        }
    }

    function handleKeyPress(event) {
        if (event.keyCode === 13) {
            if (modePolyLineMarker) {
                 handlePolyLinePoint();
            } else if (addPolygonMarker) {
                 handlePolygonPoint();
            }
        }
    }

    function resetModes() {
        modeInfoMarker = false;
        modeMoveMarker = false;
        addPolygonMarker = false;
        addVideoMarker = false;
        modeImageMarker = false;
        modePolyLineMarker = false;
        infoForm.style.display = 'none'
        polygoneForm.style.display = 'none';
        videoForm.style.display = 'none';
        imageForm.style.display = 'none';
        polyLineForm.style.display = 'none';
        moveForm.style.display = 'none';
        arrayPolyLine.length = 0;
        arrayVideo.length = 0;
        arrayPolygon.length = 0;
        arrayImage.length = 0;
        arrayDictsVideo.length = 0;
        arrayDictsVideo.length = 0;
    }

    if (buttonsAdminCreatePoints) {
        buttonsAdminCreatePoints.addEventListener('click', (event) => {
            const target = event.target.closest('.button-item');
            if (!target) {
                return;
            }

            if (target.classList.contains('ActiveItem') && currentButton === target) {
                adminPanel.classList.remove('open');
                currentButton.classList.remove('ActiveItem');
                viewer.addEventListener('click', clickHandler);
                currentButton = null;
                deleteTemporaryMarkers();

                switch (target.id) {
                    case 'move-button':
                        resetModes();
                        break;
                    case 'image-button':
                        resetModes();
                        break;
                    case 'info-button':
                        resetModes();
                        break;
                    case 'polyline-button':
                        resetModes();
                        break;
                    case 'polygon-button':
                        resetModes();
                        break;
                    case 'video-button':
                        resetModes();
                        break;
                    default:
                        break;
                }
            } else {
                if (currentButton) {
                    currentButton.classList.remove('ActiveItem');
                    resetModes();
                }

                target.classList.add('ActiveItem');

                currentButton = target;
                adminPanel.classList.remove('open');
                viewer.addEventListener('click', clickHandler);

                deleteTemporaryMarkers()

                switch (target.id) {
                    case 'move-button':
                        resetModes();
                        modeMoveMarker = true;
                        moveForm.style.display = 'flex';
                        break;
                    case 'image-button':
                        resetModes();
                        modeImageMarker = true;
                        imageForm.style.display = 'flex';
                        break;
                    case 'info-button':
                        resetModes();
                        modeInfoMarker = true;
                        infoForm.style.display = 'flex';
                        break;
                    case 'polyline-button':
                        resetModes();
                        modePolyLineMarker = true;
                        polyLineForm.style.display = 'flex';
                        break;
                    case 'polygon-button':
                        resetModes();
                        addPolygonMarker = true;
                        polygoneForm.style.display = 'flex';
                        break;
                    case 'video-button':
                        resetModes();
                        addVideoMarker = true;
                        videoForm.style.display = 'flex';
                        break;
                    default:
                        break;
                }
            }
        });
    }

    function clickHandler({ data }) {
        const outputPosition = {
            yaw: data.yaw,
            pitch: data.pitch,
        };

        if (modeInfoMarker) {
            handleAddInfoPoint(outputPosition);
        } else if (modeMoveMarker) {
            handleMovePoint(outputPosition);
        } else if (addPolygonMarker) {
            let coordinateClick = [data.yaw, data.pitch];
            arrayPolygon.push(coordinateClick);
            createTemporaryMarker(arrayPolygon);
        } else if (addVideoMarker) {
            let coordinateClick = [data.yaw, data.pitch];
            arrayVideo.push(coordinateClick);
            createTemporaryMarker(arrayVideo);
            if (arrayVideo.length === 4) {
                arrayVideo.forEach((array, index) => {
                    arrayDictsVideo[index] = { yaw: array[0], pitch: array[1] }
                });
                handleVideoPoint();
            }
        } else if (modeImageMarker) {
            let coordinateClick = [data.yaw, data.pitch];
            arrayImage.push(coordinateClick);
            createTemporaryMarker(arrayImage);
            if (arrayImage.length === 4) {
                arrayImage.forEach((array, index) => {
                    arrayDictsImages[index] = { yaw: array[0], pitch: array[1] }
                });
                handleImagePoint();
            }
        } else if (modePolyLineMarker) {
            let coordinateClick = [data.yaw, data.pitch];
            arrayPolyLine.push(coordinateClick);
            createTemporaryMarker(arrayPolyLine);
        }
    }

    document.addEventListener('keypress', handleKeyPress);

    viewer.addEventListener('click', clickHandler);

    const createInfoPoint = async (outputPosition) => {
        const description = document.getElementById('description-input-info').value;
        const title = document.getElementById('title-input-info').value;

        const response = await fetch(`/api/photospheres/information-points/`, {
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

        if (response.ok) {
            renderMarkers();
        }
    };

    const createMovePoint = async (outputPosition) => {
        const targetSphereId = document.querySelector('.selected').getAttribute('data-sphere-id');

        const response = await fetch(`/api/photospheres/move-points/`, {
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

        if (response.ok) {
            renderMarkers();
        }
    };

    const createPolygonPoint = async (arrayPolygon) => {
        const colorStroke = document.getElementById('color-picker-button-stroke-polygone');
        const colorValueStroke = colorStroke.style.getPropertyValue('--pcr-color');

        const colorFill = document.getElementById('color-picker-button-fill-polygone');
        const colorValueFill = colorFill.style.getPropertyValue('--pcr-color');

        const spanElementFill = document.getElementById('range-number-fill-polygone');
        const spanValueFill = spanElementFill.textContent || spanElementFill.innerText;

        const spanElementStroke = document.getElementById('range-number-stroke-polygone');
        const spanValueStroke = spanElementStroke.textContent || spanElementStroke.innerText;

        const inputPolygone = document.getElementById('title-input-polygone').value;
        const descriptionPolygone = document.getElementById('description-input-polygone').value;

        const response = await fetch(`/api/photospheres/polygon-points/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({
                photo_sphere: window.imageID,
                coordinates: arrayPolygon,
                fill: colorValueFill,
                stroke: colorValueStroke,
                stroke_width: spanValueStroke,
                opacity: spanValueFill,
                title: inputPolygone,
                description: descriptionPolygone
            }),
        });

        if (response.ok) {
            renderMarkers();
        }
    };

    const createVideoPoint = async (arrayDictsVideo) => {
        const videoInput = document.getElementById('input-file-video');
        const file = videoInput.files[0];

        const colorChromoKey = document.getElementById('chromakey-color');
        const colorChromoKeyValue = colorChromoKey.style.getPropertyValue('background');

        const checkBox = document.getElementById('chromakey-switch-video').checked;

        const formData = new FormData();
        formData.append('photo_sphere', window.imageID);
        formData.append('video', file);
        formData.append('coordinates', JSON.stringify(arrayDictsVideo));
        formData.append('enable_chroma_key', checkBox);
        formData.append('color_chroma_key', colorChromoKeyValue);

            const response = await fetch(`/api/photospheres/video-points/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                body: formData,
            });
            if (response.ok) {
                renderMarkers();
            }
    };

    const createImagePoint = async (arrayDictsImages) => {
        const imageInput = document.getElementById('input-file-image');
        const file = imageInput.files[0];

        const formData = new FormData();
        formData.append('photo_sphere', window.imageID);
        formData.append('image', file);
        formData.append('coordinates', JSON.stringify(arrayDictsImages));

            const response = await fetch(`/api/photospheres/image-points/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                body: formData,
            });
            if (response.ok) {
                renderMarkers();
            }
    };

    const createPolyLinePoint = async (arrayPolyLine) => {
        const title = document.getElementById('title-input-polyline').value;
        const description = document.getElementById('description-input-polyline').value;

        const spanElement = document.getElementById('range-number-polyline-stroke');
        const spanValue = spanElement.textContent;

        const colorPolyLine = document.getElementById('color-picker-button-inside');
        const rgbaValue = colorPolyLine.style.getPropertyValue('--pcr-color');

        const response = await fetch(`/api/photospheres/polyline-points/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({
                photo_sphere: window.imageID,
                coordinates: arrayPolyLine,
                stroke: rgbaValue,
                stroke_linecap: 'round',
                stroke_linejoin: 'round',
                stroke_width: spanValue,
                title: title,
                description: description,
            }),
        });
        if (response.ok) {
            renderMarkers();
        }
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
                    const selectElement = document.querySelector('.form-move-point .selected');
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
        adminPanel.classList.add('open');
        infoForm.style.display = 'flex';

        function submitInfoMarkerClickHandler() {
            createInfoPoint(outputPosition);

            const inputs = document.querySelectorAll('#title-input-info, #description-input-info');
            inputs.forEach(input => input.value = '');

            adminPanel.classList.remove('open');

            submitInfoPointBtn.removeEventListener('click', submitInfoMarkerClickHandler);

            resetModes();
            currentButton.classList.remove('ActiveItem');
            viewer.addEventListener('click', clickHandler).then(renderMarkers());
        }
        submitInfoPointBtn.addEventListener('click', submitInfoMarkerClickHandler);
    }

    function handleMovePoint(outputPosition) {
        viewer.removeEventListener('click', clickHandler);
        adminPanel.classList.add('open');
        moveForm.style.display = 'flex';

        function submitMoveMarkerClickHandler() {
            createMovePoint(outputPosition);

            adminPanel.classList.remove('open');

            submitMovePointBtn.removeEventListener('click', submitMoveMarkerClickHandler);

            resetModes();
            currentButton.classList.remove('ActiveItem');
            viewer.addEventListener('click', clickHandler).then(renderMarkers());
        }
        submitMovePointBtn.addEventListener('click', submitMoveMarkerClickHandler);
    }

    function handleVideoPoint() {
        viewer.removeEventListener('click', clickHandler);
        adminPanel.classList.add('open');
        videoForm.style.display = 'flex';

        function submitVideoMarkerClickHandler() {
            createVideoPoint(arrayDictsVideo);

            adminPanel.classList.remove('open');

            submitVideoPointBtn.removeEventListener('click', submitVideoMarkerClickHandler);

            resetModes();
            currentButton.classList.remove('ActiveItem');
            viewer.addEventListener('click', clickHandler).then(renderMarkers());
        }
        submitVideoPointBtn.addEventListener('click', submitVideoMarkerClickHandler);
    }

    function handleImagePoint() {
        viewer.removeEventListener('click', clickHandler);
        adminPanel.classList.add('open');
        imageForm.style.display = 'flex';

        function submitImageMarkerClickHandler() {
            createImagePoint(arrayDictsImages);

            adminPanel.classList.remove('open');

            submitImagePointBtn.removeEventListener('click', submitImageMarkerClickHandler);

            resetModes();
            currentButton.classList.remove('ActiveItem');
            viewer.addEventListener('click', clickHandler).then(renderMarkers());
        }
        submitImagePointBtn.addEventListener('click', submitImageMarkerClickHandler);
    }

    function handlePolyLinePoint() {
        viewer.removeEventListener('click', clickHandler);
        adminPanel.classList.add('open');
        polyLineForm.style.display = 'flex';

        function submitPolyLineMarkerClickHandler() {
            createPolyLinePoint(arrayPolyLine);

            adminPanel.classList.remove('open');

            submitPolyLinePointBtn.removeEventListener('click', submitPolyLineMarkerClickHandler);

            resetModes();
            currentButton.classList.remove('ActiveItem');
            viewer.addEventListener('click', clickHandler).then(renderMarkers());
        }
        submitPolyLinePointBtn.addEventListener('click', submitPolyLineMarkerClickHandler);
    }

    function handlePolygonPoint() {
        viewer.removeEventListener('click', clickHandler);
        adminPanel.classList.add('open');
        polygoneForm.style.display = 'flex';

        function submitPolygoneMarkerClickHandler() {
            deleteTemporaryMarkers();

            createPolygonPoint(arrayPolygon);

            adminPanel.classList.remove('open');

            submitPolygonPointBtn.removeEventListener('click', submitPolygoneMarkerClickHandler);

            resetModes();
            currentButton.classList.remove('ActiveItem');
            viewer.addEventListener('click', clickHandler).then(renderMarkers());
        }
        submitPolygonPointBtn.addEventListener('click', submitPolygoneMarkerClickHandler);
    }
}
