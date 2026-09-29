const image = document.getElementById("mood-gif");
const moodButtons = document.querySelectorAll(".mood-btn");
let currentMood = "chill";
function selectMood(moodName) {
  currentMood = moodName;
  image.src = moods[currentMood].gif;
  moodButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mood === moodName);
  });
}
moodButtons.forEach((btn) => {
  btn.addEventListener("click", () => selectMood(btn.dataset.mood));
});
