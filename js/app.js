var webcam, loadCamButton;

var webcamElement, canvasElement, webcamSelection;

var webcamList = [];




const listenToVideo = function () {
    navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
            listenToVideo();
        })
        .catch(function (err) {
            console.error("An error occurred: " + err);
        });

    video.addEventListener('canplay', function (ev) {
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);

            video.setAttribute('width', width);
            video.setAttribute('height', height);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            streaming = true;
        }
    }, false);
}

const listenToCam = function () {
    webcam.start()
        .then(result => {
            console.log("webcam started");
        })
        .catch(err => {
            console.log(err);
        });
}

const listenToCamLoad = function () {
    loadCamButton.addEventListener('click', displayPhotobooth)
}

const displayPhotobooth = function () {

}

const listenToSelection = function () {
    webcamSelection.addEventListener('change', function () {
        webcam._selectedDeviceId = webcamSelection.value;
        console.log(webcam._selectedDeviceId)
        webcam.start();
    })
}

const loadOptions = function () {
    var htmlString = ''
    webcamList.forEach(cam => {
        htmlString += `<option class="js-cam-opt" value="${cam.deviceId}" id="${cam.deviceId}">${cam.label}</option>`
    });

    webcamSelection.innerHTML = htmlString;
    listenToSelection();
}

const loadCameras = function () {
    navigator.mediaDevices.enumerateDevices()
        .then(getVideoInputs)
        .catch(console.log("err"));

    function getVideoInputs(mediaDevices) {
        mediaDevices.forEach(mediaDevice => {
            if (mediaDevice.kind === 'videoinput') {
                webcamList.push(mediaDevice);
            }
        });
        loadOptions();
    }
}

const getDOMElements = function () {
    webcamElement = document.getElementById('webcam');
    canvasElement = document.getElementById('canvas');
    // webcam = new Webcam(webcamElement, 'user', canvasElement, null);

    webcamSelection = document.querySelector('.js-cams');
    // container = document.querySelector('.js-pb-container');
    webcam = new Webcam(webcamElement, 'user', canvasElement, null);
    loadCamButton = document.querySelector('.js-load-cam');
};

document.addEventListener('DOMContentLoaded', function () {
    console.log('Script loaded');
    getDOMElements();
    listenToVideo();
    loadCameras();
});