// QUEERZ! MC App — Classic (Firebase + GitHub assets)
// Broadcast button + Firebase indicator while keeping your classic UI intact.

// Firebase via CDN ESM
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDOeJQjTm0xuFDAhhLaWP6d_kK_hNwRY58",
  authDomain: "queerz-mc-live.firebaseapp.com",
  databaseURL: "https://queerz-mc-live-default-rtdb.firebaseio.com",
  projectId: "queerz-mc-live",
  storageBucket: "queerz-mc-live.firebasestorage.app",
  messagingSenderId: "155846709409",
  appId: "1:155846709409:web:8c12204dc7d502586a20e0"
};

let app, db;
try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  setConnected(true);
} catch (e) {
  console.error("Firebase init failed:", e);
  setConnected(false);
}

// GitHub raw asset helper
const RAW_BASE = "https://raw.githubusercontent.com/benwieler-commits/queerz-mc-app/main/";
function rawUrl(path) {
  if (!path) return "";
  const clean = String(path).replace(/^\/+/, "");
  return RAW_BASE + clean;
}

// Connection light
const statusEl = document.getElementById("firebaseStatus");
function setConnected(yes) {
  if (!statusEl) return;
  statusEl.textContent = yes ? "🟢 Connected" : "🔴 Offline";
  statusEl.classList.toggle("connected", !!yes);
}

// Lightly ping a node so onValue attaches and we get a connected signal
try {
  if (db) {
    const pingRef = ref(db, "_meta/ping");
    onValue(pingRef, () => setConnected(true), () => setConnected(false));
  }
} catch { /* no-op */}

// Integration layer
let externalProvider = null;
window.setBroadcastDataProvider = (fn) => { externalProvider = fn; };

/** Collects scene, image, music from either external provider or optional demo fields. */
function collectDataForBroadcast() {
  if (typeof externalProvider === "function") {
    const out = externalProvider();
    return normalize(out);
  }
  const scene = document.getElementById("locationName")?.value?.trim() || "";
  const imagePath = document.getElementById("locationImage")?.value?.trim() || "";
  const musicPath = document.getElementById("currentMusicSource")?.value?.trim() || "";
  return normalize({ scene, imagePath, musicPath });
}

function normalize({ scene = "", imagePath = "", musicPath = "" }) {
  return {
    scene: scene || "",
    image: rawUrl(imagePath || ""),
    music: rawUrl(musicPath || ""),
    timestamp: Date.now()
  };
}

// Broadcast
async function broadcastToPlayers() {
  if (!db) { console.warn("Firebase not ready"); setConnected(false); return; }
  const data = collectDataForBroadcast();

  if (!data.image && !data.music && !data.scene) {
    alert("Nothing to broadcast. Enter a scene name, image path, or music path.");
    return;
  }
  try {
    await set(ref(db, "broadcast/current"), data);
    console.log(`✅ Broadcast sent to players: Scene=${data.scene || "(none)"} | image=${data.image} | music=${data.music}`);
    flashBtn();
  } catch (e) {
    console.error("❌ Broadcast failed:", e);
    setConnected(false);
    alert("Broadcast failed. See console for details.");
  }
}

function flashBtn() {
  const btn = document.getElementById("broadcastBtn");
  if (!btn) return;
  const prev = btn.textContent;
  btn.textContent = "✅ Sent!";
  btn.disabled = true;
  setTimeout(() => { btn.textContent = prev; btn.disabled = false; }, 1200);
}

document.getElementById("broadcastBtn")?.addEventListener("click", broadcastToPlayers);

// Expose helpers
window.QUEERZ_MC = { broadcastToPlayers, rawUrl };
