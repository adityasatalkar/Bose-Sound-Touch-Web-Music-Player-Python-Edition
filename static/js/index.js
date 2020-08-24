const playButton = document.getElementById('play-song');
const pauseButton = document.getElementById('pause-song');
const nextSongButton = document.getElementById('next-song');
const prevSongButton = document.getElementById('prev-song');

var slider = document.getElementById("volume-range");
var output = document.getElementById("volume-level");
output.innerHTML = slider.value;

const apiCall = (method, url, headers, formData) => {
	console.log("Endpoint : " + url + "\n" + "Body of Request : " + formData)
	var request = new XMLHttpRequest();
	request.open(method,url,true)
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var doc = request.responseXML;
            console.log(doc)
        }
	};

    if(method === "GET"){
        request.send();
    }else {
        request.send(formData);
    }
};

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