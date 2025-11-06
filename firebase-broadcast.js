import { db } from "./firebase-config.js";
import { ref, set, goOnline } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

try {
  goOnline(db);
  const badge = document.getElementById("connBadge");
  badge.textContent = "● Live Sync";
  badge.classList.remove("offline");
  badge.classList.add("online");
} catch (e) {
  console.warn("Firebase connection issue:", e);
}

export function broadcast(payload) {
  return set(ref(db, "mcBroadcast"), payload);
}
