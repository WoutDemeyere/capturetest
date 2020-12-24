var webcam, loadCamButton;

var webcamElement, canvasElement, webcamSelection;

var webcamList = [];

const listenToCam = function () {
    webcam.start()
        .then(result => {
            console.log("webcam started");
        })
        .catch(err => {
            console.log(err);
        });
}

const listenToCamLoad = function() {
    loadCamButton.addEventListener('click', displayPhotobooth)
}

const displayPhotobooth = function() {
    
}

const listenToSelection = function() {
    webcamSelection.addEventListener('change', function() {
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

const getDOMElements = function() {
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
    loadCameras();
});