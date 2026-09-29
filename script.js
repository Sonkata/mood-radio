const image = document.getElementById("mood-gif");
const moodButtons = document.querySelectorAll(".mood-btn");
let currentMood = "chill";
function selectMood(moodName) {
  currentMood = moodName;
  image.src = moods[currentMood].gif;
  moodButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mood === moodName);
  });
  if (playerReady) {
    player.loadVideoById(moods[moodName].videoId);
    isPlaying = true;
    playPauseBtn.textContent = "⏸ Pause";
  }
  image.style.opacity = 0;
  setTimeout(() => {
    image.src = moods[moodName].gif;
    image.style.opacity = 1;
  }, 200);
}

moodButtons.forEach((btn) => {
  btn.addEventListener("click", () => selectMood(btn.dataset.mood));
});
let player;
let playerReady = false;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("yt-player", {
    height: "1",
    width: "1",
    videoId: "CLeZyIID9Bo",
    playerVars: {
      autoplay: 0,
      controls: 0,
    },
    events: {
      onReady: () => {
        playerReady = true;
      },
    },
  });
}
const playPauseBtn = document.getElementById("play-pause-btn");
let isPlaying = false;

playPauseBtn.addEventListener("click", () => {
  if (!playerReady) return; // guard: player might not be ready yet

  if (isPlaying) {
    player.pauseVideo();
    playPauseBtn.textContent = "▶ Play";
  } else {
    player.playVideo();
    playPauseBtn.textContent = "⏸ Pause";
  }
  isPlaying = !isPlaying;
});
