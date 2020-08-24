const powerButton = document.getElementById('power');
const playButton = document.getElementById('play-song');
const pauseButton = document.getElementById('pause-song');
const nextSongButton = document.getElementById('next-song');
const prevSongButton = document.getElementById('prev-song');
const muteButton = document.getElementById('mute');
var img = document.getElementById('image');


var slider = document.getElementById("volume-range");
var output = document.getElementById("volume-level");
output.innerHTML = slider.value;

const apiCall = (method, url, headers, formData, successCallback) => {
	console.log("Endpoint : " + url + "\n" + "Body of Request : " + formData)
	var request = new XMLHttpRequest();
	request.open(method,url,true)
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var doc = JSON.parse(request.response);
            successCallback(doc)
            console.log(doc);
        }
	};

    if(method === "GET"){
        request.send();
    }else {
        request.send(formData);
    }
};

/*
    "Press" *AND* "Release" Key Values
    For the POWER value entry, it is important that you send two /key POST messages in rapid succession. The first should set state to be "press", and the second should set state to be "release". Sending only one command (either "press" or "release") will produce inconsistent results for some SoundTouch products.

powerButton.addEventListener('click',function (event) {
    var formData = new FormData();
    formData.append('key','POWER')
    apiCall('POST','http://127.0.0.1:5000/key',null, formData)
})
 */

playButton.addEventListener('click',function (event) {
    var formData = new FormData();
    formData.append('key','PLAY')
    apiCall('POST','http://127.0.0.1:5000/key',null, formData)
})

pauseButton.addEventListener('click', function () {
    var formData = new FormData();
    formData.append('key','PAUSE')
    apiCall('POST','http://127.0.0.1:5000/key',null, formData)
})

nextSongButton.addEventListener('click', function () {
    var formData = new FormData();
    formData.append('key','NEXT_TRACK')
    apiCall('POST','http://127.0.0.1:5000/key',null, formData)
})
prevSongButton.addEventListener('click', function () {
    var formData = new FormData();
    formData.append('key','PREV_TRACK')
    apiCall('POST','http://127.0.0.1:5000/key',null, formData)
})

/*
muteButton.addEventListener('click',function (event) {
    var formData = new FormData();
    formData.append('key','MUTE')
    apiCall('POST','http://127.0.0.1:5000/key',null, formData)
})
*/

window.setInterval(function(){
    /// call your function here
    apiCall('GET','http://127.0.0.1:5000/nowPlaying',null, null, function (doc) {
        img.setAttribute("src", doc['art_text']);
        document.getElementById("title").innerHTML = doc['track'];
        document.getElementById("album").innerHTML = doc['album'];
        document.getElementById("artist").innerHTML = doc['artist'];
    })
}, 1000);