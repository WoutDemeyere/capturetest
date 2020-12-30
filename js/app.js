var fireworkButton, beerButton, cavaButton, wineButton;

var messageInput, messageButton;

var loadCamButton, cancelCamButton, cameraSelection, webcamElement, canvasElement, refreshPhotowall;

var photoWall;

var webcamOverlay;

var ip;

var player, sleepTime;

const listenToLoadCam = function () {
    loadCamButton.addEventListener('click', function () {
        // document.querySelector('.js-global-container').style.opacity = "80%"
        webcamOverlay.classList.remove('c-cam-overlay-hide')
        startWebcam();
    });
}

const loadIp = async function () {
    //Anybody wondering why were asking your ip, its to blacklist potential spammers not to trace you you paranoid dingus
    let response = await fetch("https://www.cloudflare.com/cdn-cgi/trace", {
        mode: "cors"
    });
    let text = await response.text();

    let ip_cont = text.split("\n").filter(el => el.startsWith("ip")).join('\n')
    ip = ip_cont.split('=')[1]
}

String.prototype.isEmpty = function () {
    return (this.length === 0 || !this.trim());
};

const listenToButtons = function () {
    messageButton.addEventListener('click', listenToSubmit);
}

const listenToSubmit = function () {
    console.log('SUBMIT CLICKED');
    sleepTimeCET = new Date(new Date().getTime() + 1 * 60 * 1000);
    sleepTimeMillies = new Date().getTime() + 1 * 60 * 1000;

    console.log(`TIS SET for ${sleepTime}`)

    Cookies.set('submit', 'digeriedoo', {
        expires: sleepTimeCET
    });

    Cookies.set('submit_timeout', sleepTimeMillies, {
        expires: sleepTimeCET
    });
    messageButton.classList.add('c-button-off');
    if (messageInput.value.length <= 60 && !messageInput.value.isEmpty()) {
        var json = {
            "ip": ip,
            "dialog": messageInput.value
        };
        console.log(json);
        postMessage(json);
        messageInput.value = "";
        messageInput.classList.remove('c-input-has-error');
    } else {
        messageInput.classList.add('c-input-has-error');
    }
}

const checkCookies = function () {
    Cookies.get('submit') != undefined ? (messageButton.classList.add('c-button-off'), messageButton.removeEventListener('click', listenToSubmit), addTimerMessageButton()) : (messageButton.classList.remove('c-button-off'), messageButton.addEventListener('click', listenToSubmit));
    Cookies.get('firework') != undefined ? (fireworkButton.classList.add('c-button-off'), fireworkButton.removeEventListener('click', sendFireworks)) : (fireworkButton.classList.remove('c-button-off'), fireworkButton.addEventListener('click', sendFireworks));

}

const addTimerMessageButton = function () {
    var x = setInterval(function () {
        var now = new Date().getTime()
        var distance = sleepTimeMillies - now;

        console.log(`Now: ${now} Sleeptime: ${sleepTimeMillies} Dif: ${distance}`)
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        messageButton.innerHTML = seconds;

        if (distance < 0) {
            clearInterval(x);
            messageButton.innerHTML = "SEND";
        }
    }, 1000);
}

const cookieTest = function () {
    var inFifteenMinutes = new Date(new Date().getTime() + 1 * 60 * 1000);
    console.log(`TIS SET for ${inFifteenMinutes}`)

    Cookies.set('firework', 'false', {
        expires: inFifteenMinutes
    });
}

const postMessage = function (data) {
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
    var inFifteenMinutes = new Date(new Date().getTime() + 1 * 60 * 1000);
    console.log(`TIS SET for ${inFifteenMinutes}`)
    Cookies.set('firework', 'digeriedoo', {
        expires: inFifteenMinutes
    });
    fireworkButton.classList.add('c-button-off');
    const firework = await fetch(
            ` http://localhost:7071/api/krak/nye/live/icons/firework`
        )
        .then((r) => r.json())
        .catch((err) => console.error("An error occurd", err));
    console.log(firework);
}

const listenToRefresh = function () {
    refreshPhotowall.addEventListener('click', getImages);
}

const getImages = async () => {
    var data = [];
    data = await fetch(
            `http://localhost:7071/api/krak/nye/live/photbooth/photos`
        )
        .then((r) => r.json())
        .catch((err) => console.error("An error occurd", err));
    console.log('HELLLOOO');
    console.log(data);
    fillImages(data)
};

const fillImages = function (images) {
    var htmlString = '';
    images.forEach(img => {
        htmlString += ` <li class="c-pb_wall--li">
                            <img src="${img}" alt="foto" class="c-pb_wall--img">
                        </li>`
    });
    htmlString += '<li></li>';
    photoWall.innerHTML = htmlString;
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

    webcamOverlay = document.querySelector('.js-overlay');
    refreshPhotowall = document.querySelector('.js-refresh-pw');

    //streamContent = document.querySelector('.js-stream-content');
}

const loadStream = function () {
    //var streamWidth = getComputedStyle(document.documentElement).getPropertyValue('--global-stream-width');
    //console.log(streamWidth)
    //var streamWidth = getComputedStyle(document.documentElement).getPropertyValue('--global-stream-width');
    var options = {
        height: '100%',
        width: '100%',
        channel: "JHkrak"
        //width: 1280, 

        // only needed if your site is also embedded on embed.example.com and othersite.example.com
        //parent: ["embed.example.com", "othersite.example.com"]
    };
    player = new Twitch.Player("js-stream-content", options);
    //player.setVolume(0.5);
}

const checkIE = function() {
    var isIE = false;
    var ua = window.navigator.userAgent;
    var old_ie = ua.indexOf('MSIE ');
    var new_ie = ua.indexOf('Trident/');

    if ((old_ie > -1) || (new_ie > -1)) {
        isIE = true;
    }

    // if (isIE) {
    //     alert('You are using an outdatet browser, please switch to firefox or chrome to take full advantage of the site!')
    // }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Script loaded!');

    // if (ua.indexOf("FBAN") != -1 || ua.indexOf("FBAV") != -1) {
    //     //alert('ting is faceookkkkkk')
    //     if (!window.location.href.match('capturetest')) {
    //         //alert('redericting init')
    //         window.location.href = "https://www.woutdemeyere.github.io/capturetest/";
    //     }
    // } else if(ua.indexOf("MSIE ")){
    //     alert('You are using an outdatet browser, please switch to firefox or chrome to take full advantage of the site!')
    // }

    sleepTimeMillies = Cookies.get('submit_timeout');

    //checkIE();
    getDOMElements();
    //cookieTest();
    checkCookies();
    setInterval(checkCookies, 2000);
    loadIp();
    getImages();
    loadStream();
    listenToLoadCam();
    listenToIcons();
    listenToButtons();
    listenToRefresh();

});