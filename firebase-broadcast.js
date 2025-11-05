import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDOeJQjTm0xuFDAhhLaWP6d_kK_hNwRY58",
  authDomain: "queerz-mc-live.firebaseapp.com",
  databaseURL: "https://queerz-mc-live-default-rtdb.firebaseio.com",
  projectId: "queerz-mc-live",
  storageBucket: "queerz-mc-live.firebasestorage.app",
  messagingSenderId: "155846709409",
  appId: "1:155846709409:web:8c12204dc7d502586a20e0"
};

function setIndicator(online){
  const el = document.getElementById('firebaseStatus');
  if (!el) return;
  el.textContent = online ? "● Online" : "● Offline";
  el.classList.toggle('fb-online', online);
  el.classList.toggle('fb-offline', !online);
}

let app, db;
try{
  app = initializeApp(firebaseConfig);
  db  = getDatabase(app);
  setIndicator(true);
}catch(e){
  console.error("Firebase init error:", e);
  setIndicator(false);
}

const ROOM = "default-room";
async function send(payload){
  if (!db) throw new Error("DB not ready");
  const ts = Date.now();
  await set(ref(db, `broadcast/${ROOM}/state`), { ...payload, ts });
  return ts;
}

window.Broadcast = { send };
export { send };
