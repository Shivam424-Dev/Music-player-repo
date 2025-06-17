const songs = [
  {
    name: "Music/SANAM_RE_Title__Song_FULL_VIDEO___Pulkit_Samrat%2C_Yami_Gautam%2C_Urvashi_Rautela___Divya_Khosla_Kumar.mp3",
    title: "SANAM_RE_Song.mp3",
    cover: "images/cover1.jpg"
  },
  {
    name: "Music/WAJAH_TUM_HO_Full_Video_Song___HATE_STORY_3_Songs___Zareen_Khan%2C_Karan_Singh_Grover___T-Series.mp3",
    title: "Wajah_tum_ho.mp3",
    cover: "images/cover2.jpg"
  },
  {
    name: "Music/Hua_Hain_Aaj_Pehli_Baar_FULL_VIDEO___SANAM_RE___Pulkit_Samrat%2C_Urvashi_Rautela___Divya_Khosla_Kumar.mp3",
    title: "Hua_Hai_aaj_pehli_bar_song.mp3",
    cover: "images/cover3.jpg"
  }
];

let songIndex = 0;
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const cover = document.getElementById("cover");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const volumeSlider = document.getElementById("volume");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const playlistEl = document.getElementById("playlist");
const downloadBtn = document.getElementById("download");

function loadSong(song) {
  title.textContent = song.title;
  audio.src = `music/${song.name}`;
  cover.src = song.cover;
  downloadBtn.href = audio.src;
  highlightCurrentSong();
}

function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.innerHTML = "&#10074;&#10074;";
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = "&#9658;";
}

playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

nextBtn.addEventListener("click", () => {
  if (isShuffle) {
    songIndex = Math.floor(Math.random() * songs.length);
  } else {
    songIndex = (songIndex + 1) % songs.length;
  }
  loadSong(songs[songIndex]);
  playSong();
});

prevBtn.addEventListener("click", () => {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
});

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.background = isShuffle ? "#09f" : "#444";
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.style.background = isRepeat ? "#09f" : "#444";
});

audio.addEventListener("ended", () => {
  if (isRepeat) {
    playSong();
  } else {
    nextBtn.click();
  }
});

audio.addEventListener("timeupdate", updateProgress);

function updateProgress() {
  const { currentTime, duration } = audio;
  const percent = (currentTime / duration) * 100;
  progress.style.width = `${percent}%`;

  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
}

function formatTime(time) {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

// Volume
audio.volume = 0.5;
volumeSlider.value = 0.5;
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

// Playlist
function createPlaylist() {
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.title;
    li.addEventListener("click", () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

function highlightCurrentSong() {
  [...playlistEl.children].forEach((li, index) => {
    li.style.background = index === songIndex ? "#333" : "transparent";
  });
}

// Initialize
loadSong(songs[songIndex]);
createPlaylist();
