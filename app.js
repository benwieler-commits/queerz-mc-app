import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getDatabase, ref, set, get } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const statusIndicator = document.getElementById('firebaseStatus');
const broadcastBtn = document.getElementById('broadcastBtn');
const testBtn = document.getElementById('testConnectionBtn');

async function checkConnection() {
  try {
    await set(ref(db, 'debug/connection'), { timestamp: Date.now() });
    statusIndicator.textContent = '🟢 Connected';
    statusIndicator.classList.remove('offline');
    statusIndicator.classList.add('online');
  } catch (error) {
    console.error('Firebase connection failed:', error);
    statusIndicator.textContent = '🔴 Offline';
    statusIndicator.classList.remove('online');
    statusIndicator.classList.add('offline');
  }
}

async function broadcastToPlayers() {
  try {
    const scene = 'Theater District'; // Placeholder until integrated with UI
    const image = 'https://raw.githubusercontent.com/benwieler-commits/queerz-mc-app/main/images/locations/theater-district.png';
    const music = 'https://raw.githubusercontent.com/benwieler-commits/queerz-mc-app/main/music/locations/theater-district-investigation-2.mp3';
    
    await set(ref(db, 'broadcast/current'), { scene, image, music, timestamp: Date.now() });
    console.log('✅ Broadcast sent successfully.');
    broadcastBtn.textContent = '✅ Broadcast Sent!';
    setTimeout(() => { broadcastBtn.textContent = '📡 Broadcast to Players'; }, 2000);
  } catch (error) {
    console.error('❌ Broadcast failed:', error);
  }
}

broadcastBtn.addEventListener('click', broadcastToPlayers);
testBtn.addEventListener('click', checkConnection);
checkConnection();
