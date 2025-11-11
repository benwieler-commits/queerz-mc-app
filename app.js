// ===================================
// QUEERZ! MC COMPANION APP - JAVASCRIPT
// FIXED VERSION - INTEGRATED WITH PLAYER APP (Full Parts 1-3)
// ===================================

// === FIREBASE CONNECTION ===
let database = null;
let firebaseRef = null;
let firebaseSet = null;
let firebaseReady = false;

// Wait for Firebase with retry
const firebaseInitInterval = setInterval(() => {
    if (window.firebaseDatabase && window.firebaseRef && window.firebaseSet) {
        database = window.firebaseDatabase;
        firebaseRef = window.firebaseRef;
        firebaseSet = window.firebaseSet;
        firebaseReady = true;
        console.log('✅ MC App connected to Firebase - broadcasting ready');
        clearInterval(firebaseInitInterval);
        setupPlayerCharacterSync(); // Start sync once ready
    }
}, 500);

// Fallback if not ready after 10s
setTimeout(() => {
    if (!firebaseReady) {
        console.warn('⚠️ Firebase timeout - check firebase-config.js');
    }
}, 10000);

// === GLOBAL STATE ===
let players = [];
let activePlayerIndex = -1;
let characters = {}; // Stores PC character data
let currentAudio = null;
let currentCharImg = null; // ⭐ FIXED: Missing var for switchCharImgTab

// Campaign State
let currentChapter = 1;
let storyOutcomes = {
    chapter1: 'none' // 'none', 'redeemed', 'partial', 'vendetta'
};

// Music Player State
let isLooping = false;
let playlist = [];
let currentPlaylistIndex = 0;

// === DOM ELEMENTS ===
const spotlightPlayersContainer = document.getElementById('spotlightPlayers');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const playerModal = document.getElementById('playerModal');
const playerNameInput = document.getElementById('playerNameInput');
const playerCharSelect = document.getElementById('playerCharSelect');
const confirmPlayerBtn = document.getElementById('confirmPlayerBtn');
const cancelPlayerBtn = document.getElementById('cancelPlayerBtn');

// Scene & Character Display
const locationSelect = document.getElementById('locationSelect');
const sceneDisplay = document.getElementById('sceneDisplay');
const characterSelect = document.getElementById('characterSelect');
const characterDisplay = document.getElementById('characterDisplay');
const characterInfo = document.getElementById('characterInfo');
const characterSheetDisplay = document.getElementById('characterSheetDisplay');
const characterPanelTitle = document.getElementById('characterPanelTitle');

// Audio Player
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const loopBtn = document.getElementById('loopBtn');
const addToPlaylistBtn = document.getElementById('addToPlaylistBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeLabel = document.getElementById('volumeLabel');
const trackSelect = document.getElementById('trackSelect');
const nowPlaying = document.getElementById('nowPlaying');
const playlistElement = document.getElementById('playlist');
const playlistTracks = document.getElementById('playlistTracks');

// Dice Roller
const rollDiceBtn = document.getElementById('rollDiceBtn');
const powerModifier = document.getElementById('powerModifier');
const diceDisplay = document.getElementById('diceDisplay');
const rollResult = document.getElementById('rollResult');

// Panels & Modals
const scriptPanel = document.getElementById('scriptPanel');
const mcMovesPanel = document.getElementById('mcMovesPanel');
const charMgmtModal = document.getElementById('charMgmtModal');

// Buttons
const toggleScriptBtn = document.getElementById('toggleScriptBtn');
const toggleMcMovesBtn = document.getElementById('toggleMcMovesBtn');
const openCharMgmtBtn = document.getElementById('openCharMgmtBtn');
const closeScriptBtn = document.getElementById('closeScriptBtn');
const closeMcMovesBtn = document.getElementById('closeMcMovesBtn');
const closeCharMgmtModalBtn = document.getElementById('closeCharMgmtModalBtn');
const campaignSettingsBtn = document.getElementById('campaignSettingsBtn');
const closeCampaignSettingsBtn = document.getElementById('closeCampaignSettingsBtn');

// Modals & Panels
const campaignSettingsModal = document.getElementById('campaignSettingsModal');

// Selectors
const chapterSelect = document.getElementById('chapterSelect');

// === CHARACTER DATA (NPCs) ===
const characterData = {
    'mama-jay': {
        name: 'Mama Jay Rainbow',
        image: 'https://drive.google.com/uc?export=view&id=1ajj4lmmoEpxtMvXO61W1956z1oTrVM0_',
        characterSheet: 'https://drive.google.com/uc?export=view&id=1ajj4lmmoEpxtMvXO61W1956z1oTrVM0_',
        info: 'Founder of House Rainbow and owner of Café Greenwich. A wise mentor figure who guides the heroes.'
    },
    'danny-civilian': {
        name: 'Danny "Dice" Carbone',
        image: 'https://drive.google.com/uc?export=view&id=1tQHUwn0ajdLIZeo07C6wGk
