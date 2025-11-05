import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { app } from './mc-firebase-config.js';

const db = getDatabase(app);

const sceneImageInput = document.getElementById("sceneImage");
const musicURLInput = document.getElementById("musicURL");
const sceneTextInput = document.getElementById("sceneText");
const previewArea = document.getElementById("previewArea");
const audioPlayer = document.getElementById("audioPlayer");
const broadcastBtn = document.getElementById("broadcastBtn");
const previewBtn = document.getElementById("previewBtn");
const statusIndicator = document.getElementById("firebaseStatus");

function updateStatus(connected) {
  if (connected) {
    statusIndicator.textContent = "🟢 Connected to Firebase";
    statusIndicator.classList.replace("disconnected", "connected");
  } else {
    statusIndicator.textContent = "🔴 Disconnected from Firebase";
    statusIndicator.classList.replace("connected", "disconnected");
  }
}

window.addEventListener("load", () => {
  try {
    updateStatus(true);
  } catch {
    updateStatus(false);
  }
});

previewBtn.addEventListener("click", () => {
  const img = sceneImageInput.value;
  const txt = sceneTextInput.value;
  const music = musicURLInput.value;

  previewArea.innerHTML = img ? `<img src="${img}" alt="Scene Preview">` : `<p>${txt || "Preview appears here…"}</p>`;
  audioPlayer.src = music || "";
  audioPlayer.load();
  if (music) audioPlayer.play();
});

broadcastBtn.addEventListener("click", async () => {
  const payload = {
    image: sceneImageInput.value,
    music: musicURLInput.value,
    text: sceneTextInput.value,
    timestamp: Date.now()
  };

  try {
    await set(ref(db, "broadcast/current"), payload);
    broadcastBtn.textContent = "✅ Broadcast Sent!";
    setTimeout(() => (broadcastBtn.textContent = "Broadcast to Players"), 2000);
  } catch (error) {
    console.error("Broadcast failed:", error);
  }
});