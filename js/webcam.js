var webCam, webcamList = [];

var videoWidth, videoHeight;
var snapButton, canvasRefreshButton, sendPhoto, photo;
var camID;

let root = document.documentElement;

const startWebcam = function () {
    cancelCamButton = document.querySelector('.js-cam-cancel');
    cameraSelection = document.querySelector('.js-cams');
    snapButton = document.querySelector('.js-snap');
    sendPhoto = document.querySelector('.js-send-photo');
    listenToCancel();

    webcamElement = document.getElementById('webcam');
    canvasElement = document.getElementById('canvas');
    webcam = new Webcam(webcamElement, 'user', canvasElement, null);
    webcam._selectedDeviceId = camID;

    webcam.start()
        .then(result => {
            console.log("webcam started");
            webcamElement.addEventListener('playing', getVideoSize, false);
            loadCameras();
            listenToSnap();
            listenToSendPhoto();
        })
        .catch(err => {
            console.error(err);
            alert("Without acces to the camera you won't be able to upload photos to the photobooth")
        });


}

const getVideoSize = function () {
    videoWidth = webcamElement.videoWidth;
    videoHeight = webcamElement.videoHeight;

    root.style.setProperty('--global-overlay-width', videoWidth);

    // canvasElement.style.width = videoWidth + "px";
    // canvasElement.style.height = videoHeight + "px";

    webcamElement.removeEventListener('playing', getVideoSize, false);
}

const stopOverlay = function () {
    resetCanvas();
    removeRefresh();
    cameraSelection.innerHTML = '';
    webcamOverlay.classList.add('c-cam-overlay-hide')
    webcam.stop();
}

const listenToCancel = function () {
    cancelCamButton.addEventListener('click', stopOverlay);
}

const resetCanvas = function () {
    const context = canvasElement.getContext('2d');
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);
}

const loadCameras = function () {
    navigator.mediaDevices.enumerateDevices()
        .then(getVideoInputs)
        .catch((err) => console.error("An error occurd", err));

    function getVideoInputs(mediaDevices) {
        mediaDevices.forEach(mediaDevice => {
            if (mediaDevice.kind === 'videoinput') {
                webcamList.push(mediaDevice);
            }
        });
        console.log(webcamList)
        loadOptions();
    }
}

const loadOptions = function () {
    cameraSelection.innerHTML = '';
    var htmlString = ''
    webcamList.forEach(cam => {
        htmlString += `<option class="js-cam-opt" value="${cam.deviceId}" id="${cam.deviceId}">${cam.label}</option>`
    });
    cameraSelection.innerHTML = htmlString;
    listenToSelection();
}

const listenToSelection = function () {
    cameraSelection.addEventListener('change', function () {
        webcam._selectedDeviceId = cameraSelection.value;
        camID = cameraSelection.value;
        webcam.start();
        webcamElement.addEventListener('playing', getVideoSize, false);
    })
}

const listenToSnap = function () {
    snapButton.addEventListener('click', function () {
        photo = webcam.snap();
        addRefresh();
    })
}

const listenToSendPhoto = function () {
    sendPhoto.addEventListener('click', function () {
        postPhoto(photo)
        stopOverlay();
    });
}

const postPhoto = function (data) {
    var url = 'http://localhost:7071/api/krak/nye/live/photbooth/add';
    fetch(url, {
            method: 'POST',
            body: data,
        }).then(response => console.log('Success:', JSON.stringify(response)))
        .catch(error => console.error('Error:', error));
}

const addRefresh = function () {
    document.querySelector('.js-cam-buttons').classList.remove('c-hide-refresh');
    canvasRefreshButton = document.querySelector('.js-cam-refresh');
    canvasRefreshButton.addEventListener('click', resetCanvas);
}

const removeRefresh = function () {
    document.querySelector('.js-cam-buttons').classList.add('c-hide-refresh');
}