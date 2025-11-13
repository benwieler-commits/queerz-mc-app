// ================================
// QUEERZ! MC COMPANION APP
// Firebase Configuration - COMPATIBLE WITH ALL FILES
// ================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref, set, get, push, onValue } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOeJQjTm0xuFDAhhLaWP6d_kK_hNwRY58",
  authDomain: "queerz-mc-live.firebaseapp.com",
  databaseURL: "https://queerz-mc-live-default-rtdb.firebaseio.com",
  projectId: "queerz-mc-live",
  storageBucket: "queerz-mc-live.firebasestorage.app",
  messagingSenderId: "155846709409",
  appId: "1:155846709409:web:8c12204dc7d502586a20e0"
};

// Initialize Firebase
let app;
let database;
let db; // Alias for compatibility with firebase-broadcast.js

try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    db = database; // Make db point to the same database
    
    console.log('✅ Firebase initialized successfully - MC App connected to queerz-mc-live');
    
    // Make database available globally for app-MC.js
    window.firebaseDatabase = database;
    window.firebaseRef = ref;
    window.firebaseSet = set;
    
} catch (error) {
    console.error('❌ Firebase initialization failed:', error);
}

// Listen for player character data (when players send their characters)
if (database) {
    const playerCharsRef = ref(database, 'playerCharacters');
    onValue(playerCharsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log('📥 Player character data received:', Object.keys(data));
            // You can process player characters here if needed
        }
    });
    
    console.log('✅ MC App ready to broadcast and receive player data');
}

// Anonymous authentication for MC users
let auth;
try {
    auth = getAuth(app);
    window.currentUserId = null;

    // Sign in anonymously
    signInAnonymously(auth).then(() => {
        console.log('✅ Signed in anonymously for MC operations');
    }).catch((error) => {
        console.error('❌ Anonymous sign-in failed:', error);
    });

    // Track auth state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            window.currentUserId = user.uid;
            console.log('✅ MC authenticated:', user.uid);

            // Dispatch custom event so app.js can reload campaigns
            window.dispatchEvent(new CustomEvent('firebaseAuthReady', {
                detail: { userId: user.uid }
            }));
        } else {
            window.currentUserId = null;
        }
    });
} catch (error) {
    console.error('❌ Auth initialization failed:', error);
}

// Export for campaign-manager-mc.js compatibility
// firebase-broadcast.js expects 'db'
// app.js uses window.firebaseDatabase
// campaign-manager-mc.js expects { database, ref, set, get, push, onValue }
export { database, db, ref, set, get, push, onValue, auth };
