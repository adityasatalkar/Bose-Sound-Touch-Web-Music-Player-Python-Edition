const playButton = document.getElementById('play-song');
const pauseButton = document.getElementById('pause-song');
const nextSongButton = document.getElementById('next-song');
const prevSongButton = document.getElementById('prev-song');
const sender = "Gabbo"

var slider = document.getElementById("volume-range");
var output = document.getElementById("volume-level");
output.innerHTML = slider.value;

let apis = {
    boseSoundTouch: {
    //get user selected recomendation weather
        api:"http://192.168.0.118",
        port:":8090",
        getUrl: (endpoint) => {
            return apis.boseSoundTouch.api + apis.boseSoundTouch.port + "/" + endpoint
        },
        getVolumeUrlBody: (endpoint, value) => {
            return "<" + endpoint + ">" + value + "</"+endpoint+">"
        },
        getSourceUrlBody:(source, sourceAccount) => {
        	return "<ContentItem source=" + source + " sourceAccount=" + sourceAccount + "></ContentItem>"
        },
        getBluetoothUrlBody:(source) => {
            return "<ContentItem source=" + source + "></ContentItem>"
        },
        getKeyUrlBody:(state, sender, key) => {
        	return "<key state=" + state + " sender=" + sender + ">" + key + "</key>"
        }
    }
};

function getData(endpoint, element1) {
    var doc = ""
    var imagedata = ""
    var titledata = ""
    var artistdata = ""
    var albumdata = ""
    var songMax = ""
    var songcurrentprogress = ""
    var source = ""
    var itemName = ""
    console.log('getData')
    var img = document.getElementById('image');
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("GET", apis.boseSoundTouch.getUrl(endpoint), true);
    xmlHttpRequest.onreadystatechange = function() {
        if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
            doc = xmlHttpRequest.responseXML;
            console.log(doc)

            source = doc.getElementsByTagName(element1)[0].getElementsByTagName('ContentItem')[0].getAttribute('source');
            if (source == "AUX") {
                console.log('Source : ' + source);
                img.setAttribute("src", "assets/bostsa5a.jpg")
                titledata = "AUX"
                document.getElementById("title").innerHTML = titledata;
                artistdata = "Bose SA-5"; // SA-5
                document.getElementById("artist").innerHTML = artistdata;
            } else if (source == "BLUETOOTH") {
                console.log('Source : ' + source);
                img.setAttribute("src", "assets/bostsa5a.jpg")
                titledata = "BLUETOOTH"
                document.getElementById("title").innerHTML = titledata;
                artistdata = "Bose SA-5"; // SA-5
                document.getElementById("artist").innerHTML = artistdata;
                titledata = doc.getElementsByTagName(element1)[0].getElementsByTagName('track')[0].firstChild.nodeValue;
                document.getElementById("title").innerHTML = titledata;
                //display itemName to display device Name
                artistdata = doc.getElementsByTagName(element1)[0].getElementsByTagName('artist')[0].firstChild.nodeValue;
                document.getElementById("artist").innerHTML = artistdata;
                itemName = doc.getElementsByTagName(element1)[0].getElementsByTagName('itemName')[0].firstChild.nodeValue;
                document.getElementById("album").innerHTML = albumdata;
            } else if (source == "STANDBY") {
                console.log('Source : ' + source);
                img.setAttribute("src", "assets/bostsa5a.jpg")
                titledata = "STANDBY"
                document.getElementById("title").innerHTML = titledata;
                artistdata = "Bose SA-5"; // SA-5
                document.getElementById("artist").innerHTML = artistdata;
            } else {
                //display itemName to display genre of the song currently playing
                imagedata = doc.getElementsByTagName(element1)[0].getElementsByTagName('art')[0].firstChild.nodeValue;
                img.setAttribute("src", imagedata);
                console.log(imagedata)
                titledata = doc.getElementsByTagName(element1)[0].getElementsByTagName('track')[0].firstChild.nodeValue;
                document.getElementById("title").innerHTML = titledata;
                artistdata = doc.getElementsByTagName(element1)[0].getElementsByTagName('artist')[0].firstChild.nodeValue;
                document.getElementById("artist").innerHTML = artistdata;
                albumdata = doc.getElementsByTagName(element1)[0].getElementsByTagName('album')[0].firstChild.nodeValue;
                document.getElementById("album").innerHTML = albumdata;
                songMax = doc.getElementsByTagName(element1)[0].getElementsByTagName('time')[0].getAttribute('total');
                document.getElementById("progresssong").max = songMax;
                console.log('Song Max : ' + songMax);
                // document.getElementById("song-length").innerHTML = (songMax/60).toFixed(2);
                
                songcurrentprogress = doc.getElementsByTagName(element1)[0].getElementsByTagName('time')[0].firstChild.nodeValue;
                document.getElementById("progresssong").value = songcurrentprogress;
                console.log('Song current : ' + songcurrentprogress);
                // document.getElementById("song-current").innerHTML = (songcurrentprogress/60).toFixed(2) ;
            }
        }
    };
    getVolumeLevel('volume','actualvolume');
    xmlHttpRequest.send(null);
}

function getVolumeLevel(endpoint, element1) {
    var doc = ""
    var actualvolume = ""
    console.log('getVolumeLevel')
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("GET", apis.boseSoundTouch.getUrl(endpoint), true);
    xmlHttpRequest.onreadystatechange = function() {
        if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
            doc = xmlHttpRequest.responseXML;
            console.log(doc)
            actualvolume = doc.getElementsByTagName(endpoint)[0].getElementsByTagName(element1)[0].firstChild.nodeValue;
            slider.value = actualvolume;
            output.innerHTML = actualvolume;
        }
    };
    xmlHttpRequest.send(null);
}

function bluetooth() {
    console.log('Bluetooth')
    apiCall('select',apis.boseSoundTouch.getBluetoothUrlBody('BLUETOOTH'))
}

function power() {
    var state = "press"
    var key = "POWER"
    console.log(key)
    var bodyOfRequest = apis.boseSoundTouch.getKeyUrlBody(state,sender,key)
    apiCall('key', bodyOfRequest)
}


const apiCall = (endpoint, bodyOfRequest) => {
	console.log("Endpoint : " + endpoint + "\n" + "Body of Request : " + bodyOfRequest)
	fetch(apis.boseSoundTouch.getUrl(endpoint), {method: 'post', body: bodyOfRequest})
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => console.log(data))
}

const playSong = () => {
    // <key state="press" sender="Gabbo">PLAY</key>
    console.log('playSong');
    var state = "press"
    var key = "PLAY"
    var bodyOfRequest = apis.boseSoundTouch.getKeyUrlBody(state,sender,key)
    apiCall('key', bodyOfRequest)
    getData('now_playing','nowPlaying')
};

const pauseSong = () => {
    // <key state="press" sender="Gabbo">PAUSE</key>
    console.log('pauseSong');
    var state = "press"
    var key = "PAUSE"
    var bodyOfRequest = apis.boseSoundTouch.getKeyUrlBody(state,sender,key)
    apiCall('key', bodyOfRequest)
    getData('now_playing','nowPlaying')
};

const nextSong = () => {
    // <key state="press" sender="Gabbo">NEXT_TRACK</key>
    console.log('nextSong');
    var state = "press"
    var key = "NEXT_TRACK"
    var bodyOfRequest = apis.boseSoundTouch.getKeyUrlBody(state,sender,key)
    apiCall('key', bodyOfRequest)
    getData('now_playing','nowPlaying')
};

const prevSong = () => {
    // <key state="press" sender="Gabbo">PREV_TRACK</key>
    console.log('prevSong');
    var state = "press"
    var key = "PREV_TRACK"
    var bodyOfRequest = apis.boseSoundTouch.getKeyUrlBody(state,sender,key)
    apiCall('key', bodyOfRequest)
    getData('now_playing','nowPlaying')
};

slider.oninput = function() {
	output.innerHTML = this.value;
	var bodyOfRequest =  apis.boseSoundTouch.getVolumeUrlBody('volume', this.value)
	apiCall('volume', bodyOfRequest)
}

window.setInterval(function(){
  /// call your function here
    getData('now_playing','nowPlaying')
}, 1000);

// powerButton.addEventListener('click', power);
playButton.addEventListener('click', playSong);
pauseButton.addEventListener('click', pauseSong);
nextSongButton.addEventListener('click', nextSong);
prevSongButton.addEventListener('click', prevSong);

// sourceButton.addEventListener('click', source);
// bluetoothButton.addEventListener('click', bluetooth);