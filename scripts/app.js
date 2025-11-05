// Basic local preview logic
const sceneDisplay = document.getElementById('sceneDisplay');
const audioPlayer = document.getElementById('audioPlayer');
const sceneImageUrl = document.getElementById('sceneImageUrl');
const musicUrl = document.getElementById('musicUrl');
const sceneTextInput = document.getElementById('sceneTextInput');
const applyLocal = document.getElementById('applyLocal');

applyLocal?.addEventListener('click', ()=>{
  const img = sceneImageUrl.value.trim();
  const mus = musicUrl.value.trim();
  const txt = sceneTextInput.value.trim();
  if (img){
    sceneDisplay.innerHTML = `<img src="${img}" alt="Scene">`;
  } else if (txt){
    sceneDisplay.innerHTML = `<div class="hint">${txt}</div>`;
  } else {
    sceneDisplay.innerHTML = `<div class="hint">Preview appears here…</div>`;
  }
  if (mus){ audioPlayer.src = mus; audioPlayer.play().catch(()=>{}); }
});

// --- Firebase Broadcast wiring ---
import { db } from './mc-firebase-config.js';
import { ref, set } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

const broadcastBtn = document.getElementById('syncBroadcastBtn');

function broadcastToPlayers(imageUrl, musicUrl, sceneText=""){
  set(ref(db,'broadcast/current'), {
    image: imageUrl || "",
    music: musicUrl || "",
    sceneText: sceneText || "",
    timestamp: Date.now()
  }).then(()=> console.log("Broadcast updated successfully"))
    .catch(err=> console.error("Broadcast error:", err));
}

broadcastBtn?.addEventListener('click', ()=>{
  const img = document.getElementById('sceneImageUrl')?.value?.trim() || "";
  const mus = document.getElementById('musicUrl')?.value?.trim() || "";
  const txt = document.getElementById('sceneTextInput')?.value?.trim() || "";
  broadcastToPlayers(img, mus, txt);
});
