import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const RAW = 'https://raw.githubusercontent.com/benwieler-commits/queerz-mc-app/main/';

// Insert status + test controls unobtrusively
function ensureStatusControls() {
  if (!document.getElementById('firebaseStatus')) {
    const s = document.createElement('div');
    s.id = 'firebaseStatus';
    s.textContent = '🔴 Offline';
    document.body.appendChild(s);
  }
  if (!document.getElementById('testConnectionBtn')) {
    const b = document.createElement('button');
    b.id = 'testConnectionBtn';
    b.textContent = 'Check Connection';
    b.addEventListener('click', checkConnection);
    document.body.appendChild(b);
  }
}

async function checkConnection() {
  const status = document.getElementById('firebaseStatus');
  try {
    await set(ref(db, 'debug/connection'), { ts: Date.now() });
    if (status) {
      status.textContent = '🟢 Connected';
      status.classList.add('online');
    }
  } catch (e) {
    console.error('Firebase offline:', e);
    if (status) {
      status.textContent = '🔴 Offline';
      status.classList.remove('online');
    }
  }
}

function toRawGithub(urlOrPath) {
  if (!urlOrPath) return null;
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath; // already absolute
  return RAW + urlOrPath.replace(/^\/*/, '');
}

function guessSceneImageFromValue(val) {
  // Map known locations to repo image paths (as you named them earlier)
  const map = {
    'cafe-greenwich': 'images/locations/cafe-greenwich.jpg',
    'theater-district': 'images/locations/theater-district.jpg',
    'morettis': 'images/locations/morettis-comedy-cellar.webp'
  };
  return map[val] ? toRawGithub(map[val]) : null;
}

function getCurrentState() {
  const locationSelect = document.getElementById('locationSelect');
  const trackSelect = document.getElementById('trackSelect');
  const audio = document.getElementById('audioPlayer');

  const sceneValue = locationSelect?.value || '';
  const sceneLabel = locationSelect?.selectedOptions?.[0]?.textContent || '';

  // Try to read displayed image src if <img> exists in sceneDisplay
  let sceneImg = null;
  const sceneDisplay = document.getElementById('sceneDisplay');
  if (sceneDisplay) {
    const img = sceneDisplay.querySelector('img');
    if (img && img.src) sceneImg = img.src;
  }
  if (!sceneImg) {
    sceneImg = guessSceneImageFromValue(sceneValue);
  }

  // Music: prefer the audio element's currentSrc if set (actual resolved URL)
  let musicUrl = (audio && audio.currentSrc) ? audio.currentSrc : (trackSelect?.value || '');
  musicUrl = toRawGithub(musicUrl); // will leave Google Drive links untouched

  return {
    scene: sceneLabel || sceneValue || 'Scene',
    image: sceneImg,
    music: musicUrl
  };
}

async function broadcast() {
  const btn = document.getElementById('broadcastBtn');
  try {
    const payload = getCurrentState();
    await set(ref(db, 'broadcast/current'), { ...payload, timestamp: Date.now() });
    console.log('✅ Broadcast payload:', payload);
    if (btn) {
      const old = btn.textContent;
      btn.textContent = '✅ Broadcast Sent';
      setTimeout(() => (btn.textContent = old), 1800);
    }
  } catch (e) {
    console.error('❌ Broadcast failed:', e);
    if (btn) {
      const old = btn.textContent;
      btn.textContent = '❌ Broadcast Failed';
      setTimeout(() => (btn.textContent = old), 2000);
    }
  }
}

function ensureBroadcastButton() {
  const spotlight = document.getElementById('spotlightPlayers');
  if (!spotlight) return;
  let btn = document.getElementById('broadcastBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'broadcastBtn';
    btn.className = 'player-btn';
    btn.title = 'Broadcast to Players';
    btn.textContent = '📡 Broadcast';
    spotlight.appendChild(btn);
  }
  btn.addEventListener('click', broadcast);
}

document.addEventListener('DOMContentLoaded', () => {
  ensureBroadcastButton();
  ensureStatusControls();
  checkConnection();
});
