const image = document.getElementById("mood-gif");
const moodButtons = document.querySelectorAll(".mood-btn");
const savedMood = localStorage.getItem("lastMood") || "chill";
let currentMood = savedMood;
function selectMood(moodName) {
  currentMood = moodName;
  image.src = moods[currentMood].gif;
  localStorage.setItem("lastMood", moodName);

  moodButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mood === moodName);
  });
  if (playerReady) {
    const randomIndex = Math.floor(
      Math.random() * moods[moodName].videoId.length,
    );
    player.loadVideoById(moods[moodName].videoId[randomIndex]);

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
const shuffleBtn = document.getElementById("shuffle-btn");

shuffleBtn.addEventListener("click", () => {
  if (!playerReady) return;

  const randomIndex = Math.floor(
    Math.random() * moods[currentMood].videoId.length,
  );

  player.loadVideoById(moods[currentMood].videoId[randomIndex]);

  isPlaying = true;
  playPauseBtn.textContent = "⏸ Pause";
});
document.getElementById("volume").addEventListener("input", (e) => {
  if (playerReady) player.setVolume(Number(e.target.value));
});
const bars = document.querySelectorAll(".bar");
function animateBars() {
  bars.forEach((bar) => {
    const randomHeight = isPlaying ? Math.floor(Math.random() * 31) + 10 : 5;

    bar.style.height = `${randomHeight}px`;
  });
}

animateBars();

setInterval(animateBars, 180);
