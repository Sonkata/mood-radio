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
  searchMoodTrack(moodName);
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
  searchMoodTrack(currentMood);
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

// MOOD-11: LIVE YOUTUBE SEARCH
const API_KEY = "AIzaSyAPc6X8OOcGl8ZDIhlYH58eKPR_5qizTnU";
const moodQueries = {
  chill: "chill lofi relaxing music",
  hype: "energetic synthwave music mix",
  sad: "sad ambient piano music",
  focus: "deep focus study music",
};

// Prevent older search results from replacing newer ones.
let searchRequestId = 0;

function searchMoodTrack(moodName) {
  if (!playerReady) return;

  const query = moodQueries[moodName];
  if (!query) return;

  const requestId = ++searchRequestId;

  fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoEmbeddable=true&maxResults=10&key=${API_KEY}`,
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`YouTube API Error: ${res.status}`);
      }

      return res.json();
    })
    .then((data) => {
      // Ignore outdated search results.
      if (requestId !== searchRequestId || currentMood !== moodName) {
        return;
      }

      const videos = (data.items || []).filter(
        (item) => item.id && item.id.videoId,
      );

      if (videos.length === 0) {
        console.log("No videos found.");
        return;
      }

      // Pick a random video from the search results.
      const randomIndex = Math.floor(Math.random() * videos.length);

      const videoId = videos[randomIndex].id.videoId;

      // Load and play the video.
      player.loadVideoById(videoId);

      isPlaying = true;
      playPauseBtn.textContent = "⏸ Pause";

      console.log("Now playing:", videos[randomIndex].snippet.title);
    })
    .catch((error) => {
      console.error("Mood Radio Search Error:", error);
    });
}
