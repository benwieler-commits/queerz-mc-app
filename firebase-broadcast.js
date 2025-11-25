// firebase-broadcast.js - MC App Broadcast & Listen
import { db } from "./firebase-config.js";
import { ref, set, onValue, goOnline } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

try {
  goOnline(db);
  console.log('✅ Firebase connected successfully');

  // Only update badge if it exists
  const badge = document.getElementById("connBadge");
  if (badge) {
    badge.textContent = "● Live Sync";
    badge.classList.remove("offline");
    badge.classList.add("online");
  }
} catch (e) {
  console.warn("⚠️ Firebase connection issue:", e);
}

// Broadcast FROM MC TO Players
export function broadcast(payload) {
  console.log('📡 Broadcasting to players:', payload);
  return set(ref(db, "mcBroadcast"), payload);
}

// Listen for data FROM Players TO MC
export function listenToPlayers(callback) {
  const playersRef = ref(db, "playerCharacters");
  onValue(playersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      console.log('📥 Received player data:', data);
      callback(data);
    }
  });
}

// Listen for player dice rolls
export function listenToPlayerRolls(callback) {
  const rollsRef = ref(db, "playerRolls");
  onValue(rollsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      console.log('🎲 Received player rolls:', data);
      callback(data);
    }
  });
}

console.log('✅ firebase-broadcast.js loaded');
