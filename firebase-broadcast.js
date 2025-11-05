import { database } from './firebase-config.js';
import { ref, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const statusEl = document.getElementById('firebaseStatus');
const testBtn = document.getElementById('testConnectionBtn');
const broadcastBtn = document.getElementById('broadcastBtn');

function updateStatus(online) {
    if (online) {
        statusEl.textContent = 'Online';
        statusEl.classList.add('online');
        statusEl.classList.remove('offline');
    } else {
        statusEl.textContent = 'Offline';
        statusEl.classList.add('offline');
        statusEl.classList.remove('online');
    }
}

async function testConnection() {
    try {
        await set(ref(database, 'connectionTest'), { timestamp: Date.now() });
        updateStatus(true);
    } catch {
        updateStatus(false);
    }
}

if (testBtn) testBtn.addEventListener('click', testConnection);
if (broadcastBtn) {
    broadcastBtn.addEventListener('click', async () => {
        const scene = document.getElementById('locationSelect')?.value || 'none';
        const music = document.getElementById('trackSelect')?.value || 'none';
        const character = document.getElementById('characterSelect')?.value || 'none';
        try {
            await set(ref(database, 'broadcast/current'), { scene, music, character, timestamp: Date.now() });
            updateStatus(true);
        } catch {
            updateStatus(false);
        }
    });
}

window.addEventListener('load', testConnection);