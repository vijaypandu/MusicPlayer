// script.js
const image = document.querySelector("img");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const music = document.querySelector("audio");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const currentTimeEle = document.getElementById("current-time");
const durationEle = document.getElementById("duration");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const loopBtn = document.getElementById("loop");
const musicListBtn = document.getElementById("music-list");
const musicListContainer = document.createElement("div");

// Doubly Linked List Node
class Node {
    constructor(data) {
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}

// Doubly Linked List
class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.current = null;
    }

    // Add new node at the end
    add(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = this.tail = newNode;
            this.current = this.head;
        } else {
            this.tail.next = newNode;
            newNode.prev = this.tail;
            this.tail = newNode;
        }
    }

    // Get next node
    next() {
        if (this.current.next) {
            this.current = this.current.next;
        } else {
            this.current = this.head; // Loop back to start
        }
        return this.current.data;
    }

    // Get previous node
    prev() {
        if (this.current.prev) {
            this.current = this.current.prev;
        } else {
            this.current = this.tail; // Loop back to end
        }
        return this.current.data;
    }

    // Get current node
    getCurrent() {
        return this.current.data;
    }
}

// Music
const songs = [
    {
        name: "Kalki",
        displayName: "Ta Takkra",
        artist: "Sanjith Hedge",
    },
    {
        name: "ShapeOfYou",
        displayName: "Shape of you",
        artist: "Ed Sheeran",
    },
    {
        name: "Vikram",
        displayName: "Title Track",
        artist: "Anirudh Ravichander",
    },
   
    {
        name: "Devara",
        displayName: "Fear Song",
        artist: "Anirudh Ravichander",
    },
    {
        name: "Peta",
        displayName: "Mass Maranam",
        artist: "Anirudh Ravichander",
    },
    
    
    
];

// Create a doubly linked list and add songs to it
const songList = new DoublyLinkedList();
songs.forEach(song => songList.add(song));

// Check if playing
let isPlaying = false;

// Update DOM
function loadSong(song) {
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    music.src = `music/${song.name}.mp3`;
    image.src = `img/${song.name}.jpg`;
}

// On load: Select the first song
loadSong(songList.getCurrent());

// Set Song Duration when it's possible to play a song
function setSongDuration(e) {
    const totalSeconds = Math.floor(e.target.duration);
    const durationMinutes = Math.floor(totalSeconds / 60);
    let durationSeconds = totalSeconds % 60;
    if (durationSeconds < 10) {
        durationSeconds = `0${durationSeconds}`;
    }
    durationEle.textContent = `${durationMinutes}:${durationSeconds}`;
}

// Play
function playSong() {
    isPlaying = true;
    playBtn.classList.replace("fa-play", "fa-pause");
    playBtn.setAttribute("title", "Pause");
    music.play();
}

// Pause
function pauseSong() {
    isPlaying = false;
    playBtn.classList.replace("fa-pause", "fa-play");
    playBtn.setAttribute("title", "Play");
    music.pause();
}

// Previous Song
function prevSong() {
    const song = songList.prev();
    loadSong(song);
    progress.style.width = `0%`;
    playSong();
}

// Next Song
function nextSong() {
    const song = songList.next();
    loadSong(song);
    progress.style.width = `0%`;
    playSong();
}

musicListContainer.className = "music-list-container";
document.body.appendChild(musicListContainer);

function showMusicList() {
    // Create a list of songs
    const songListHTML = songs.map((song, index) => 
        `<li data-index="${index}">${song.displayName} - ${song.artist}</li>`
    ).join('');
    
    musicListContainer.innerHTML = `<ul>${songListHTML}</ul>`;
    
    // Toggle the visibility of the music list container
    if (musicListContainer.style.display === "none" || musicListContainer.style.display === "") {
        musicListContainer.style.display = "block";
    } else {
        musicListContainer.style.display = "none";
    }
}

// Function to handle song click from list
function handleSongClick(event) {
    const li = event.target.closest('li');
    if (li) {
        const songIndex = li.getAttribute('data-index');
        const song = songs[songIndex];
        loadSong(song);
        progress.style.width = `0%`;
        playSong();
        musicListContainer.style.display = "none"; // Hide list after selection
    }
}
let isLooping = false;
function toggleLoop() {
    isLooping = !isLooping; // Toggle the looping state
    loopBtn.classList.toggle("active", isLooping); // Add or remove 'active' class based on state
    
    music.loop = isLooping; // Set the audio element to loop if enabled
    if (isLooping) {
        loopBtn.setAttribute("title", "Looped");
    } else {
        loopBtn.setAttribute("title", "Loop");
    }
    loopBtn.setAttribute("title", "looped");
    console.log(`Looping: ${isLooping}`); // Log the loop status (optional)
}

// Display progress bar width and calculate display for current time function
function barWidthAndCurrentTime() {
    const { duration, currentTime } = music;
    // Update progress bar width
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    // Calculate display for current time
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) {
        currentSeconds = `0${currentSeconds}`;
    }
    currentTimeEle.textContent = `${currentMinutes}:${currentSeconds}`;
}

// Update Progress Bar & Time while playing
function updateProgressBar() {
    if (isPlaying) {
        barWidthAndCurrentTime();
    }
}

// Set Progress Bar and current time if and if not playing when user clicks on progress bar
function setProgressBar(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const { duration } = music;
    music.currentTime = (clickX / width) * duration;
    if (!isPlaying) {
        barWidthAndCurrentTime();
    }
}

// Event Listeners
music.addEventListener("canplay", setSongDuration);
playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

loopBtn.addEventListener("click", toggleLoop);
music.addEventListener("timeupdate", updateProgressBar);
music.addEventListener("ended", nextSong);
progressContainer.addEventListener("click", setProgressBar);
musicListBtn.addEventListener("click", showMusicList);
musicListContainer.addEventListener("click", handleSongClick);

// Initialize the music list container to be hidden
musicListContainer.style.display = "none";
