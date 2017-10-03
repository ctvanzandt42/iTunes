let songFinder = document.querySelector("input");
let songContainer = document.querySelector(".container");
let formSubmitter = document.querySelector(".submit");
let audioPlayer = document.querySelector("#music");
let iTunesSource = document.querySelector(".m4asrc");
let currentSong = document.querySelector(".currentSong")
let music = document.getElementById("music");
let duration = music.duration;
let pButton = document.getElementById("pButton");
let playhead = document.getElementById("playhead");
let timeline = document.getElementById("timeline");
let timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

pButton.addEventListener("click", play);

music.addEventListener("timeupdate", timeUpdate, false);

timeline.addEventListener(
    "click",
    function (event) {
        moveplayhead(event);
        music.currentTime = duration * clickPercent(event);
    },
    false
);

function clickPercent(event) {
    return (event.clientX - getPosition(timeline)) / timelineWidth;
}

playhead.addEventListener("mousedown", mouseDown, false);
window.addEventListener("mouseup", mouseUp, false);

let onplayhead = false;

function mouseDown() {
    onplayhead = true;
    window.addEventListener("mousemove", moveplayhead, true);
    music.removeEventListener("timeupdate", timeUpdate, false);
}

function mouseUp(event) {
    if (onplayhead == true) {
        moveplayhead(event);
        window.removeEventListener("mousemove", moveplayhead, true);
        music.currentTime = duration * clickPercent(event);
        music.addEventListener("timeupdate", timeUpdate, false);
    }
    onplayhead = false;
}
function moveplayhead(event) {
    let newMargLeft = event.clientX - getPosition(timeline);

    if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
        playhead.style.marginLeft = newMargLeft + "px";
    }
    if (newMargLeft < 0) {
        playhead.style.marginLeft = "0px";
    }
    if (newMargLeft > timelineWidth) {
        playhead.style.marginLeft = timelineWidth + "px";
    }
}

function timeUpdate() {
    let playPercent = timelineWidth * (music.currentTime / duration);
    playhead.style.marginLeft = playPercent + "px";
    if (music.currentTime == duration) {
        pButton.className = "";
        pButton.className = "play";
    }
}

function play() {
    if (music.paused) {
        music.play();
        pButton.className = "";
        pButton.className = "pause";
    } else {
        music.pause();
        pButton.className = "";
        pButton.className = "play";
    }
}

music.addEventListener(
    "canplaythrough",
    function () {
        duration = music.duration;
    },
    false
);

function getPosition(el) {
    return el.getBoundingClientRect().left;
}

songContainer.addEventListener("click", function (e) {
    let newTrack = e.target.getAttribute("value");
    iTunesSource.setAttribute("src", newTrack);
    let currentlyPlaying = e.target.getAttribute("title");
    currentSong.innerHTML = `<span>Now Playing: </span>` + currentlyPlaying;
    audioPlayer.load();
    audioPlayer.play();
    pButton.className = "pause";
});

formSubmitter.addEventListener("click", function (e) {
    let url =
        "https://itunes.apple.com/search?term=" + songFinder.value + "&entity=song";
    e.preventDefault();
    axios.get(url).then(function (response) {
        songContainer.innerHTML = ``;
        let data = response.data.results;
        data.forEach(function (data) {
            let searchResults = ``;

            searchResults = `<div class ="returnItem"><img class="albumArt" title="${data.trackName}" value="${data.previewUrl}" src="${data.artworkUrl100}">
        <div class="songTitle">${data.trackName}</div>
        <div class="artist"><a class="artistLink" href="${data.artistViewUrl}">${data.artistName}</a></div>
        </div>
        `;
            songContainer.innerHTML += searchResults;
        });
    });
});