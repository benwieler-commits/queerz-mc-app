// firebase-broadcast.js - FIXED VERSION
import { db } from "./firebase-config.js";
import { ref, set, goOnline } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

export function broadcast(payload) {
  console.log('📡 Broadcasting payload:', payload);
  return set(ref(db, "mcBroadcast"), payload);
}

console.log('✅ firebase-broadcast.js loaded');
