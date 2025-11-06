// Firebase config (no modules; works on GitHub Pages)
// Loaded after CDN firebase-app-compat and firebase-database-compat.
window.firebaseConfig = {
  apiKey: "AIzaSyDOeJQjTm0xuFDAhhLaWP6d_kK_hNwRY58",
  authDomain: "queerz-mc-live.firebaseapp.com",
  databaseURL: "https://queerz-mc-live-default-rtdb.firebaseio.com",
  projectId: "queerz-mc-live",
  storageBucket: "queerz-mc-live.firebasestorage.app",
  messagingSenderId: "155846709409",
  appId: "1:155846709409:web:8c12204dc7d502586a20e0"
};

(function() {
  if (!window.firebase) return;
  if (!window._firebaseApp) {
    window._firebaseApp = firebase.initializeApp(window.firebaseConfig);
    window._firebaseDb  = firebase.database();
  }
})();