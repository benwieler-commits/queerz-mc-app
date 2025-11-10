// ================================
// QUEERZ! MC COMPANION APP
// Firebase Configuration - WITH BROADCASTING SUPPORT
// ================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

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

try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
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

// Export database and functions for use in other modules
export { database, ref, set, onValue };
