var fireworkButton, beerButton, cavaButton, wineButton;

var messageInput, messageButton;

var loadCamButton, cancelCamButton, cameraSelection, webcamElement, canvasElement;

var photoWall;

var webcamOverlay;

const listenToLoadCam = function() {
    loadCamButton.addEventListener('click', function() {
        // document.querySelector('.js-global-container').style.opacity = "80%"
        webcamOverlay.classList.remove('c-cam-overlay-hide')
        startWebcam();
    });
}

const listenToSubmit = function () {
    messageButton.addEventListener('click', function () {
        console.log(messageInput.value.length);
        if(messageInput.value.length <= 40) {
            var json = {
                "name": "nothing",
                "dialog": messageInput.value
            };
            console.log(json);
            postMessage(json);
            messageInput.value = "";
            messageInput.classList.remove('c-input-has-error');
        } else {
            messageInput.classList.add('c-input-has-error');
        }
        
    });
}

const postMessage = function(data) {
    var url = 'http://localhost:7071/api/krak/nye/live/messages';

    fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .then(response => console.log('Success:', JSON.stringify(response)))
        .catch(error => console.error('Error:', error));
}

const listenToIcons = function () {
    fireworkButton.addEventListener('click', sendFireworks);
    beerButton.addEventListener('click', sendBeer);
    cavaButton.addEventListener('click', sendCava);
    wineButton.addEventListener('click', sendWine);
}

const sendBeer = async () => {
    const beer = await fetch(
            ` http://localhost:7071/api/krak/nye/live/icons/beer`
        )
        .then((r) => r.json())
        .catch((err) => console.error("An error occurd", err));
    console.log(beer);
}

const sendCava = async () => {
    const cava = await fetch(
            ` http://localhost:7071/api/krak/nye/live/icons/cava`
        )
        .then((r) => r.json())
        .catch((err) => console.error("An error occurd", err));
    console.log(cava);
}

const sendWine = async () => {
    const wine = await fetch(
            ` http://localhost:7071/api/krak/nye/live/icons/wine`
        )
        .then((r) => r.json())
        .catch((err) => console.error("An error occurd", err));
    console.log(wine);
}

const sendFireworks = async () => {
    const firework = await fetch(
            ` http://localhost:7071/api/krak/nye/live/icons/firework`
        )
        .then((r) => r.json())
        .catch((err) => console.error("An error occurd", err));
    console.log(firework);
}

const getDOMElements = function () {
    fireworkButton = document.querySelector('.js-firework');
    beerButton = document.querySelector('.js-beer');
    cavaButton = document.querySelector('.js-cava');
    wineButton = document.querySelector('.js-wine');

    messageInput = document.querySelector('.js-message-input');
    messageButton = document.querySelector('.js-message-button');

    loadCamButton = document.querySelector('.js-load-cam');

    photoWall = document.querySelector('.js-photo-wall');

    webcamOverlay = document.querySelector('.js-overlay')
    
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Script loaded!');
    getDOMElements();
    listenToLoadCam();
    listenToSubmit();
    listenToIcons();
});