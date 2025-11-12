// ===================================
// QUEERZ! MC COMPANION APP - JAVASCRIPT
// COMPLETE VERSION WITH SESSION MANAGEMENT
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
let characters = {}; // Stores PC character data from Firebase
let currentAudio = null;
let currentCharImg = null;

// Campaign State
let currentChapter = 1;
let storyOutcomes = {
    chapter1: 'none' // 'none', 'redeemed', 'partial', 'vendetta'
};

// Music Player State
let isLooping = false;
let playlist = [];
let currentPlaylistIndex = 0;

// Session State
let currentSession = {
    name: 'Default Session',
    players: [],
    campaign: {
        chapter: 1,
        outcomes: {}
    },
    playerTags: {} // Store tags for each player
};

let savedSessions = [];

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

// Buttons
const toggleScriptBtn = document.getElementById('toggleScriptBtn');
const toggleMcMovesBtn = document.getElementById('toggleMcMovesBtn');
const closeScriptBtn = document.getElementById('closeScriptBtn');
const closeMcMovesBtn = document.getElementById('closeMcMovesBtn');
const campaignSettingsBtn = document.getElementById('campaignSettingsBtn');
const closeCampaignSettingsBtn = document.getElementById('closeCampaignSettingsBtn');

// Modals & Panels
const campaignSettingsModal = document.getElementById('campaignSettingsModal');
const sessionMgmtModal = document.getElementById('sessionMgmtModal');
const playerOverviewModal = document.getElementById('playerOverviewModal');

// Session Management Elements
const sessionMgmtBtn = document.getElementById('sessionMgmtBtn');
const closeSessionMgmtBtn = document.getElementById('closeSessionMgmtBtn');
const sessionList = document.getElementById('sessionList');
const currentSessionName = document.getElementById('currentSessionName');

// Player Overview Elements
const playerOverviewBtn = document.getElementById('playerOverviewBtn');
const closePlayerOverviewBtn = document.getElementById('closePlayerOverviewBtn');
const playerOverviewContent = document.getElementById('playerOverviewContent');

// Selectors
const chapterSelect = document.getElementById('chapterSelect');

// === CHARACTER DATA (NPCs) ===
const characterData = {
    'mama-jay': {
        name: 'Mama Jay Rainbow',
        image: 'https://raw.githubusercontent.com/benwieler-commits/queerz-mc-app/main/images/characters/mama-jay-portrait.png',
        info: 'Founder of House Rainbow and owner of Café Greenwich. A wise mentor figure who guides the heroes.'
    },
    'danny-civilian': {
        name: 'Danny "Dice" Carbone',
        image: 'https://raw.githubusercontent.com/benwieler-commits/queerz-mc-app/main/images/characters/danny-civilian.png',
        info: 'Former stand-up comedian who feels left behind by changing times. Currently civilian form.'
    },
    'danny-justice': {
        name: 'Danny "The Jester"',
        image: 'https://raw.githubusercontent.com/benwieler-commits/queerz-mc-app/main/images/characters/danny-justice-knight.png',
        info: 'Justice Knight form. Spreads "Nostalgic Justice" through comedy that cuts and excludes.'
    },
    'pawn': {
        name: 'Tough Crowd (Pawn)',
        image: 'https://raw.githubusercontent.com/benwieler-commits/queerz-mc-app/main/images/characters/pawn-tough-crowd-general.png',
        info: 'Brainwashed follower of Danny. Working-class person infected with Nostalgic Ignorance.'
    }
};

// === STORY TAGS DATABASE ===
const storyTagsDatabase = {
    beneficial: [
        'Advantage', 'Protected', 'Hidden', 'Inspired', 'Coordinated', 'Prepared',
        'Intel', 'Backup', 'Momentum', 'Focus', 'Empowered', 'Connected'
    ],
    harmful: [
        'Exposed', 'Vulnerable', 'Shaken', 'Conforming', 'Isolated', 'Overwhelmed',
        'Marked', 'Distracted', 'Weakened', 'Compromised', 'Trapped', 'Unstable'
    ],
    investigation: [
        'Clue Found', 'Witness Located', 'Evidence Gathered', 'Pattern Recognized',
        'Connection Made', 'Lead Discovered', 'Alibi Checked', 'Scene Analyzed'
    ],
    emotional: [
        'Hopeful', 'Determined', 'Angry', 'Scared', 'Confident', 'Guilty',
        'Protective', 'Betrayed', 'Peaceful', 'Restless', 'Loved', 'Rejected'
    ]
};

// === STATUS TAGS DATABASE ===
const statusTagsDatabase = {
    beneficial: [
        '+1 Forward', '+1 Ongoing', 'Armored', 'Enhanced', 'Invisible', 'Flying'
    ],
    harmful: [
        'Shaken (-1 Ongoing)', 'Conforming (-1 to Resist)', 'Marked', 'Wounded',
        'Exhausted', 'Confused', 'Restrained', 'Bleeding'
    ]
};

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    initializeEventListeners();
    renderPlayers();
    updatePlayerCharacterSelect();

    // Initialize volume
    if (audioPlayer && volumeSlider) {
        audioPlayer.volume = volumeSlider.value / 100;
    }

    // Initialize dice display
    initializeDiceDisplay();

    // Load correct chapter tabs
    loadChapterTabs();
    const scriptPanelTitle = document.getElementById('scriptPanelTitle');
    if (scriptPanelTitle) {
        scriptPanelTitle.textContent = `Campaign Script - Chapter ${currentChapter}`;
    }

    console.log('✅ MC App initialized successfully');
});

// ===================================
// CORE FUNCTIONS
// ===================================

function loadFromLocalStorage() {
    try {
        const savedPlayers = localStorage.getItem('mcApp_players');
        if (savedPlayers) {
            players = JSON.parse(savedPlayers);
        }

        const savedChapter = localStorage.getItem('mcApp_chapter');
        if (savedChapter) {
            currentChapter = parseInt(savedChapter);
            if (chapterSelect) {
                chapterSelect.value = currentChapter;
            }
        }

        const savedOutcomes = localStorage.getItem('mcApp_outcomes');
        if (savedOutcomes) {
            storyOutcomes = JSON.parse(savedOutcomes);
        }

        const savedSessionsList = localStorage.getItem('mcApp_sessions');
        if (savedSessionsList) {
            savedSessions = JSON.parse(savedSessionsList);
        }

        const savedCurrentSession = localStorage.getItem('mcApp_currentSession');
        if (savedCurrentSession) {
            currentSession = JSON.parse(savedCurrentSession);
            players = currentSession.players || [];
            currentChapter = currentSession.campaign?.chapter || 1;
        }

        console.log('✅ Loaded from localStorage:', { players, currentChapter, sessions: savedSessions.length });
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('mcApp_players', JSON.stringify(players));
        localStorage.setItem('mcApp_chapter', currentChapter.toString());
        localStorage.setItem('mcApp_outcomes', JSON.stringify(storyOutcomes));

        // Update current session
        currentSession.players = players;
        currentSession.campaign.chapter = currentChapter;
        currentSession.campaign.outcomes = storyOutcomes;

        localStorage.setItem('mcApp_currentSession', JSON.stringify(currentSession));
        localStorage.setItem('mcApp_sessions', JSON.stringify(savedSessions));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function initializeEventListeners() {
    // Player Management
    if (addPlayerBtn) {
        addPlayerBtn.addEventListener('click', () => {
            playerModal.classList.remove('hidden');
            playerNameInput.value = '';
            playerCharSelect.selectedIndex = 0;
        });
    }

    if (confirmPlayerBtn) {
        confirmPlayerBtn.addEventListener('click', addPlayer);
    }

    if (cancelPlayerBtn) {
        cancelPlayerBtn.addEventListener('click', () => {
            playerModal.classList.add('hidden');
        });
    }

    // Chapter Selection
    if (chapterSelect) {
        chapterSelect.addEventListener('change', (e) => {
            currentChapter = parseInt(e.target.value);
            loadChapterTabs();
            saveToLocalStorage();
            const scriptPanelTitle = document.getElementById('scriptPanelTitle');
            if (scriptPanelTitle) {
                scriptPanelTitle.textContent = `Campaign Script - Chapter ${currentChapter}`;
            }
        });
    }

    // Panel Toggles
    if (toggleScriptBtn) {
        toggleScriptBtn.addEventListener('click', () => {
            scriptPanel.classList.toggle('hidden');
        });
    }

    if (toggleMcMovesBtn) {
        toggleMcMovesBtn.addEventListener('click', () => {
            mcMovesPanel.classList.toggle('hidden');
        });
    }

    if (closeScriptBtn) {
        closeScriptBtn.addEventListener('click', () => {
            scriptPanel.classList.add('hidden');
        });
    }

    if (closeMcMovesBtn) {
        closeMcMovesBtn.addEventListener('click', () => {
            mcMovesPanel.classList.add('hidden');
        });
    }

    // Campaign Settings
    if (campaignSettingsBtn) {
        campaignSettingsBtn.addEventListener('click', () => {
            campaignSettingsModal.classList.remove('hidden');
        });
    }

    if (closeCampaignSettingsBtn) {
        closeCampaignSettingsBtn.addEventListener('click', () => {
            campaignSettingsModal.classList.add('hidden');
        });
    }

    // Session Management
    if (sessionMgmtBtn) {
        sessionMgmtBtn.addEventListener('click', () => {
            sessionMgmtModal.classList.remove('hidden');
            renderSessionList();
            if (currentSessionName) {
                currentSessionName.textContent = currentSession.name;
            }
        });
    }

    if (closeSessionMgmtBtn) {
        closeSessionMgmtBtn.addEventListener('click', () => {
            sessionMgmtModal.classList.add('hidden');
        });
    }

    // Player Overview
    if (playerOverviewBtn) {
        playerOverviewBtn.addEventListener('click', () => {
            playerOverviewModal.classList.remove('hidden');
            renderPlayerOverview();
        });
    }

    if (closePlayerOverviewBtn) {
        closePlayerOverviewBtn.addEventListener('click', () => {
            playerOverviewModal.classList.add('hidden');
        });
    }

    // Music Player Controls
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (audioPlayer.src) {
                audioPlayer.play();
                nowPlaying.textContent = `Now Playing: ${trackSelect.options[trackSelect.selectedIndex]?.textContent || 'Unknown'}`;
            }
        });
    }

    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            audioPlayer.pause();
        });
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            nowPlaying.textContent = 'No track playing';
        });
    }

    if (loopBtn) {
        loopBtn.addEventListener('click', () => {
            isLooping = !isLooping;
            audioPlayer.loop = isLooping;
            loopBtn.classList.toggle('active');
            loopBtn.style.background = isLooping ? 'rgba(102, 126, 234, 0.6)' : '';
        });
    }

    if (addToPlaylistBtn) {
        addToPlaylistBtn.addEventListener('click', () => {
            const selectedTrack = trackSelect.options[trackSelect.selectedIndex];
            if (selectedTrack && selectedTrack.value) {
                addToPlaylist(selectedTrack.textContent, selectedTrack.value);
            }
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value;
            audioPlayer.volume = volume / 100;
            volumeLabel.textContent = `${volume}%`;
        });
    }

    // Audio player ended event - for playlist auto-play
    if (audioPlayer) {
        audioPlayer.addEventListener('ended', () => {
            if (!isLooping && playlist.length > 0) {
                playNextInPlaylist();
            }
        });
    }

    // Dice Roller
    if (rollDiceBtn) {
        rollDiceBtn.addEventListener('click', rollDice);
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            scriptPanel.classList.toggle('hidden');
        } else if (e.key === 'm' || e.key === 'M') {
            e.preventDefault();
            mcMovesPanel.classList.toggle('hidden');
        }
    });
}

function renderPlayers() {
    if (!spotlightPlayersContainer) return;

    // Clear existing players (keep add button)
    const addBtn = spotlightPlayersContainer.querySelector('.add-btn');
    spotlightPlayersContainer.innerHTML = '';
    if (addBtn) {
        spotlightPlayersContainer.appendChild(addBtn);
    }

    players.forEach((player, index) => {
        const playerBtn = document.createElement('button');
        playerBtn.className = 'player-btn';
        if (index === activePlayerIndex) {
            playerBtn.classList.add('active');
        }

        playerBtn.innerHTML = `${player.name} <span class="remove-player" data-index="${index}">×</span>`;

        playerBtn.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-player')) {
                removePlayer(index);
            } else {
                setActivePlayer(index);
            }
        });

        spotlightPlayersContainer.insertBefore(playerBtn, addBtn);
    });

    saveToLocalStorage();
}

function addPlayer() {
    const charId = playerCharSelect.value;
    const playerName = playerNameInput.value.trim();

    if (!charId && !playerName) {
        alert('Please select a character or enter a name');
        return;
    }

    const newPlayer = {
        name: playerName || 'Player ' + (players.length + 1),
        characterId: charId || null,
        tags: {
            story: [],
            status: []
        }
    };

    players.push(newPlayer);
    currentSession.players = players;

    playerModal.classList.add('hidden');
    renderPlayers();
    saveToLocalStorage();
}

function removePlayer(index) {
    if (confirm(`Remove ${players[index].name} from spotlight?`)) {
        players.splice(index, 1);
        if (activePlayerIndex === index) {
            activePlayerIndex = -1;
        } else if (activePlayerIndex > index) {
            activePlayerIndex--;
        }
        currentSession.players = players;
        renderPlayers();
        saveToLocalStorage();
    }
}

function setActivePlayer(index) {
    activePlayerIndex = index;
    renderPlayers();

    const player = players[index];

    // Show player's character sheet if they have one
    if (player.characterId && characters[player.characterId]) {
        showCharacterSheet(characters[player.characterId]);
    } else {
        characterSheetDisplay.classList.add('hidden');
    }
}

function showCharacterSheet(characterData) {
    if (!characterSheetDisplay) return;

    const html = `
        <div class="character-sheet">
            <h3>${characterData.name || 'Character'}</h3>
            <div class="character-portrait">
                <img src="${characterData.image || ''}" alt="${characterData.name}" style="max-width: 100%; border-radius: 10px;">
            </div>
            <div class="character-stats">
                <p><strong>Status:</strong> ${characterData.status || 'Active'}</p>
            </div>
        </div>
    `;

    characterSheetDisplay.innerHTML = html;
    characterSheetDisplay.classList.remove('hidden');
}

function updatePlayerCharacterSelect() {
    if (!playerCharSelect) return;

    // Keep the default option
    playerCharSelect.innerHTML = '<option value="">-- Select Character --</option>';

    // Add PC characters from Firebase
    Object.keys(characters).forEach(charId => {
        const char = characters[charId];
        const option = document.createElement('option');
        option.value = charId;
        option.textContent = char.name || charId;
        playerCharSelect.appendChild(option);
    });
}

function setupPlayerCharacterSync() {
    if (!firebaseReady || !database || !firebaseRef) {
        console.warn('⚠️ Firebase not ready for player character sync');
        return;
    }

    const playerCharsRef = firebaseRef(database, 'playerCharacters');
    const { onValue } = window;

    if (onValue) {
        onValue(playerCharsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                characters = data;
                updatePlayerCharacterSelect();
                console.log('📥 Player characters synced:', Object.keys(characters));
            }
        });
    }
}

// ===================================
// MUSIC PLAYER FUNCTIONS
// ===================================

function addToPlaylist(trackName, trackUrl) {
    if (!trackUrl) return;

    const track = { name: trackName, url: trackUrl };
    playlist.push(track);

    renderPlaylist();
    playlistElement.style.display = 'block';
}

function renderPlaylist() {
    if (!playlistTracks) return;

    playlistTracks.innerHTML = '';

    playlist.forEach((track, index) => {
        const trackItem = document.createElement('div');
        trackItem.style.cssText = 'padding: 5px; margin: 5px 0; background: rgba(255,255,255,0.1); border-radius: 5px; display: flex; justify-content: space-between; align-items: center;';
        trackItem.dataset.url = track.url;

        const trackName = document.createElement('span');
        trackName.textContent = track.name;
        trackName.style.cursor = 'pointer';
        trackName.addEventListener('click', () => {
            playTrackFromPlaylist(index);
        });

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '🗑️';
        removeBtn.style.cssText = 'background: none; border: none; color: #ff6b6b; cursor: pointer; font-size: 1.2em;';
        removeBtn.addEventListener('click', () => {
            removeFromPlaylist(index);
        });

        trackItem.appendChild(trackName);
        trackItem.appendChild(removeBtn);
        playlistTracks.appendChild(trackItem);
    });
}

function playTrackFromPlaylist(index) {
    if (index < 0 || index >= playlist.length) return;

    currentPlaylistIndex = index;
    const track = playlist[index];

    audioPlayer.src = track.url;
    audioPlayer.play();
    nowPlaying.textContent = `Now Playing: ${track.name}`;

    // Update trackSelect to match
    for (let i = 0; i < trackSelect.options.length; i++) {
        if (trackSelect.options[i].value === track.url) {
            trackSelect.selectedIndex = i;
            break;
        }
    }
}

function playNextInPlaylist() {
    if (playlist.length === 0) return;

    currentPlaylistIndex = (currentPlaylistIndex + 1) % playlist.length;
    playTrackFromPlaylist(currentPlaylistIndex);
}

function removeFromPlaylist(index) {
    playlist.splice(index, 1);
    renderPlaylist();

    if (playlist.length === 0) {
        playlistElement.style.display = 'none';
    }
}

// ===================================
// DICE ROLLER
// ===================================

function initializeDiceDisplay() {
    if (!diceDisplay) return;

    const die1 = diceDisplay.querySelector('.die1');
    const die2 = diceDisplay.querySelector('.die2');
    const modifier = diceDisplay.querySelector('.modifier');
    const total = diceDisplay.querySelector('.total');

    if (die1) die1.textContent = '?';
    if (die2) die2.textContent = '?';
    if (modifier) modifier.textContent = '?';
    if (total) total.textContent = '?';
}

function rollDice() {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const mod = parseInt(powerModifier.value) || 0;
    const totalResult = die1 + die2 + mod;

    // Update display
    const die1Elem = diceDisplay.querySelector('.die1');
    const die2Elem = diceDisplay.querySelector('.die2');
    const modifierElem = diceDisplay.querySelector('.modifier');
    const totalElem = diceDisplay.querySelector('.total');

    if (die1Elem) die1Elem.textContent = die1;
    if (die2Elem) die2Elem.textContent = die2;
    if (modifierElem) modifierElem.textContent = mod >= 0 ? `+${mod}` : mod;
    if (totalElem) totalElem.textContent = totalResult;

    // Determine result
    let resultText = '';
    let resultColor = '';

    if (totalResult <= 6) {
        resultText = 'MISS (6-) - MC makes a move';
        resultColor = '#ff6b6b';
    } else if (totalResult <= 9) {
        resultText = 'PARTIAL HIT (7-9) - Success with cost';
        resultColor = '#ffd700';
    } else {
        resultText = 'FULL HIT (10+) - Success!';
        resultColor = '#4CAF50';
    }

    if (rollResult) {
        rollResult.textContent = resultText;
        rollResult.style.color = resultColor;
        rollResult.style.fontWeight = 'bold';
        rollResult.style.marginTop = '10px';
    }
}

// ===================================
// SCRIPT PANEL
// ===================================

function loadChapterTabs() {
    // This would load different script content based on currentChapter
    // For now, just log the chapter change
    console.log(`📖 Loading Chapter ${currentChapter} script`);
}

// ===================================
// SESSION MANAGEMENT
// ===================================

function saveSession() {
    const sessionName = prompt('Enter session name:', currentSession.name);
    if (!sessionName) return;

    currentSession.name = sessionName;
    currentSession.players = players;
    currentSession.campaign.chapter = currentChapter;
    currentSession.campaign.outcomes = storyOutcomes;

    // Check if session already exists
    const existingIndex = savedSessions.findIndex(s => s.name === sessionName);
    if (existingIndex >= 0) {
        savedSessions[existingIndex] = { ...currentSession };
    } else {
        savedSessions.push({ ...currentSession });
    }

    saveToLocalStorage();
    alert(`Session "${sessionName}" saved!`);
    renderSessionList();
}

function loadSession(sessionName) {
    const session = savedSessions.find(s => s.name === sessionName);
    if (!session) {
        alert('Session not found!');
        return;
    }

    currentSession = { ...session };
    players = session.players || [];
    currentChapter = session.campaign?.chapter || 1;
    storyOutcomes = session.campaign?.outcomes || {};

    if (chapterSelect) {
        chapterSelect.value = currentChapter;
    }

    renderPlayers();
    loadChapterTabs();
    saveToLocalStorage();

    alert(`Session "${sessionName}" loaded!`);
}

function renderSessionList() {
    if (!sessionList) return;

    sessionList.innerHTML = '';

    if (savedSessions.length === 0) {
        sessionList.innerHTML = '<p style="color: rgba(255,255,255,0.6);">No saved sessions yet.</p>';
        return;
    }

    savedSessions.forEach((session, index) => {
        const sessionCard = document.createElement('div');
        sessionCard.style.cssText = 'background: rgba(255,255,255,0.1); padding: 15px; margin: 10px 0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;';

        const sessionInfo = document.createElement('div');
        sessionInfo.innerHTML = `
            <h4 style="margin: 0 0 5px 0;">${session.name}</h4>
            <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 0.9em;">
                Players: ${session.players?.length || 0} | Chapter: ${session.campaign?.chapter || 1}
            </p>
        `;

        const buttonGroup = document.createElement('div');
        buttonGroup.style.cssText = 'display: flex; gap: 10px;';

        const loadBtn = document.createElement('button');
        loadBtn.className = 'header-btn';
        loadBtn.textContent = '📂 Load';
        loadBtn.style.cssText = 'padding: 8px 16px; font-size: 0.9em;';
        loadBtn.addEventListener('click', () => {
            loadSession(session.name);
            sessionMgmtModal.classList.add('hidden');
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'header-btn';
        deleteBtn.textContent = '🗑️ Delete';
        deleteBtn.style.cssText = 'padding: 8px 16px; font-size: 0.9em; background: rgba(255,0,0,0.3);';
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Delete session "${session.name}"?`)) {
                savedSessions.splice(index, 1);
                saveToLocalStorage();
                renderSessionList();
            }
        });

        buttonGroup.appendChild(loadBtn);
        buttonGroup.appendChild(deleteBtn);

        sessionCard.appendChild(sessionInfo);
        sessionCard.appendChild(buttonGroup);

        sessionList.appendChild(sessionCard);
    });

    console.log('📋 Rendered sessions:', savedSessions.map(s => s.name));
}

function saveSessionAs() {
    const sessionName = prompt('Enter new session name:');
    if (!sessionName) return;

    const newSession = {
        name: sessionName,
        players: [...players],
        campaign: {
            chapter: currentChapter,
            outcomes: { ...storyOutcomes }
        },
        playerTags: {}
    };

    savedSessions.push(newSession);
    saveToLocalStorage();
    alert(`Session "${sessionName}" created!`);
    renderSessionList();
    if (currentSessionName) {
        currentSessionName.textContent = sessionName;
    }
}

// ===================================
// PLAYER OVERVIEW
// ===================================

function renderPlayerOverview() {
    if (!playerOverviewContent) return;

    playerOverviewContent.innerHTML = '';

    if (players.length === 0) {
        playerOverviewContent.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6); padding: 40px;">No players in spotlight. Add players to see their overview.</p>';
        return;
    }

    players.forEach((player, index) => {
        const playerCard = document.createElement('div');
        playerCard.style.cssText = 'background: rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.2); border-radius: 15px; padding: 20px; margin: 15px 0;';

        // Player Header
        const playerHeader = document.createElement('div');
        playerHeader.style.cssText = 'display: flex; align-items: center; gap: 20px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid rgba(255,255,255,0.2);';

        // Portrait
        const portrait = document.createElement('div');
        portrait.style.cssText = 'width: 100px; height: 100px; border-radius: 50%; overflow: hidden; background: rgba(255,255,255,0.1); flex-shrink: 0;';

        const characterId = player.characterId;
        if (characterId && characters[characterId] && characters[characterId].image) {
            portrait.innerHTML = `<img src="${characters[characterId].image}" alt="${player.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else {
            portrait.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2em;">👤</div>';
        }

        // Player Info
        const playerInfo = document.createElement('div');
        playerInfo.style.cssText = 'flex: 1;';
        playerInfo.innerHTML = `
            <h3 style="margin: 0 0 5px 0; font-size: 1.5em;">${player.name}</h3>
            <p style="margin: 0; color: rgba(255,255,255,0.7);">
                ${characterId && characters[characterId] ? characters[characterId].name : 'No character assigned'}
            </p>
        `;

        playerHeader.appendChild(portrait);
        playerHeader.appendChild(playerInfo);

        // Tags Section
        const tagsSection = document.createElement('div');
        tagsSection.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 20px;';

        // Story Tags
        const storyTagsDiv = createTagSection(player, index, 'story', 'Story Tags', storyTagsDatabase);

        // Status Tags
        const statusTagsDiv = createTagSection(player, index, 'status', 'Status Tags', statusTagsDatabase);

        tagsSection.appendChild(storyTagsDiv);
        tagsSection.appendChild(statusTagsDiv);

        playerCard.appendChild(playerHeader);
        playerCard.appendChild(tagsSection);

        playerOverviewContent.appendChild(playerCard);
    });
}

function createTagSection(player, playerIndex, tagType, title, tagDatabase) {
    const section = document.createElement('div');
    section.style.cssText = 'background: rgba(255,255,255,0.05); border-radius: 10px; padding: 15px;';

    const header = document.createElement('h4');
    header.style.cssText = 'margin: 0 0 10px 0; display: flex; justify-content: space-between; align-items: center;';
    header.innerHTML = `
        <span>${title}</span>
        <button class="header-btn" style="padding: 5px 10px; font-size: 0.8em;" onclick="showAddTagDialog(${playerIndex}, '${tagType}')">+ Add</button>
    `;

    const tagsList = document.createElement('div');
    tagsList.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; min-height: 30px;';

    const playerTags = player.tags && player.tags[tagType] ? player.tags[tagType] : [];

    if (playerTags.length === 0) {
        tagsList.innerHTML = '<span style="color: rgba(255,255,255,0.5); font-style: italic;">No tags</span>';
    } else {
        playerTags.forEach(tag => {
            const tagElem = document.createElement('span');
            const isBeneficial = tagDatabase.beneficial && tagDatabase.beneficial.includes(tag);
            const isHarmful = tagDatabase.harmful && tagDatabase.harmful.includes(tag);

            let bgColor = 'rgba(102, 126, 234, 0.3)'; // Default blue
            if (isBeneficial) bgColor = 'rgba(76, 175, 80, 0.3)'; // Green
            if (isHarmful) bgColor = 'rgba(255, 107, 107, 0.3)'; // Red

            tagElem.style.cssText = `
                background: ${bgColor};
                border: 1px solid rgba(255,255,255,0.3);
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 0.9em;
                display: inline-flex;
                align-items: center;
                gap: 5px;
            `;
            tagElem.innerHTML = `
                ${tag}
                <button onclick="removeTagFromPlayer(${playerIndex}, '${tagType}', '${tag}'); renderPlayerOverview();"
                        style="background: none; border: none; color: #ff6b6b; cursor: pointer; font-size: 1.2em; padding: 0; margin: 0;">×</button>
            `;

            tagsList.appendChild(tagElem);
        });
    }

    section.appendChild(header);
    section.appendChild(tagsList);

    return section;
}

function showAddTagDialog(playerIndex, tagType) {
    const tagDatabase = tagType === 'story' ? storyTagsDatabase : statusTagsDatabase;

    let options = '<h4>Select Tag Category:</h4>';

    Object.keys(tagDatabase).forEach(category => {
        options += `<div style="margin: 10px 0;">`;
        options += `<strong style="text-transform: capitalize; color: #ffd700;">${category}:</strong><br>`;
        tagDatabase[category].forEach(tag => {
            options += `<button class="header-btn" style="margin: 5px; padding: 8px 12px; font-size: 0.9em;"
                        onclick="addTagToPlayer(${playerIndex}, '${tagType}', '${tag}'); renderPlayerOverview(); closeAddTagDialog();">${tag}</button>`;
        });
        options += `</div>`;
    });

    // Custom tag option
    options += `<hr style="margin: 15px 0; border-color: rgba(255,255,255,0.2);">`;
    options += `<div><strong>Or enter custom tag:</strong><br>`;
    options += `<input type="text" id="customTagInput" placeholder="Custom tag name" style="padding: 8px; margin: 5px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.3); background: rgba(0,0,0,0.5); color: white;">`;
    options += `<button class="header-btn" style="margin: 5px;" onclick="addCustomTag(${playerIndex}, '${tagType}')">Add Custom</button></div>`;

    const dialogHtml = `
        <div id="addTagDialog" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
             background: rgba(0,0,0,0.95); border: 2px solid rgba(255,255,255,0.3); border-radius: 15px;
             padding: 30px; max-width: 600px; max-height: 80vh; overflow-y: auto; z-index: 10000;">
            <button onclick="closeAddTagDialog()" style="position: absolute; top: 10px; right: 10px;
                    background: rgba(255,0,0,0.5); border: none; color: white; padding: 10px 15px;
                    border-radius: 5px; cursor: pointer; font-size: 1.2em;">×</button>
            ${options}
        </div>
        <div id="addTagOverlay" onclick="closeAddTagDialog()" style="position: fixed; top: 0; left: 0;
             width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 9999;"></div>
    `;

    const dialogContainer = document.createElement('div');
    dialogContainer.innerHTML = dialogHtml;
    document.body.appendChild(dialogContainer);
}

function closeAddTagDialog() {
    const dialog = document.getElementById('addTagDialog');
    const overlay = document.getElementById('addTagOverlay');
    if (dialog) dialog.parentElement.remove();
    if (overlay) overlay.remove();
}

function addCustomTag(playerIndex, tagType) {
    const input = document.getElementById('customTagInput');
    if (!input || !input.value.trim()) {
        alert('Please enter a tag name');
        return;
    }

    addTagToPlayer(playerIndex, tagType, input.value.trim());
    renderPlayerOverview();
    closeAddTagDialog();
}

// ===================================
// TAG MANAGEMENT
// ===================================

function addTagToPlayer(playerIndex, tagType, tagName) {
    if (playerIndex < 0 || playerIndex >= players.length) return;

    const player = players[playerIndex];
    if (!player.tags) {
        player.tags = { story: [], status: [] };
    }

    if (tagType === 'story' || tagType === 'status') {
        if (!player.tags[tagType].includes(tagName)) {
            player.tags[tagType].push(tagName);
            saveToLocalStorage();
            return true;
        }
    }
    return false;
}

function removeTagFromPlayer(playerIndex, tagType, tagName) {
    if (playerIndex < 0 || playerIndex >= players.length) return;

    const player = players[playerIndex];
    if (!player.tags || !player.tags[tagType]) return;

    const tagIndex = player.tags[tagType].indexOf(tagName);
    if (tagIndex >= 0) {
        player.tags[tagType].splice(tagIndex, 1);
        saveToLocalStorage();
        return true;
    }
    return false;
}

function getPlayerTags(playerIndex) {
    if (playerIndex < 0 || playerIndex >= players.length) return null;

    const player = players[playerIndex];
    return player.tags || { story: [], status: [] };
}

// ===================================
// GLOBAL OUTCOME SETTER
// ===================================
window.setOutcome = function(chapter, outcome) {
    storyOutcomes[chapter] = outcome;
    saveToLocalStorage();
    console.log(`📝 Chapter ${chapter} outcome set to: ${outcome}`);
};

// ===================================
// EXPOSE FUNCTIONS FOR UI
// ===================================
window.saveSession = saveSession;
window.saveSessionAs = saveSessionAs;
window.loadSession = loadSession;
window.renderSessionList = renderSessionList;
window.renderPlayerOverview = renderPlayerOverview;
window.addTagToPlayer = addTagToPlayer;
window.removeTagFromPlayer = removeTagFromPlayer;
window.getPlayerTags = getPlayerTags;
window.showAddTagDialog = showAddTagDialog;
window.closeAddTagDialog = closeAddTagDialog;
window.addCustomTag = addCustomTag;

console.log('🌈 QUEERZ! MC Companion - Fully Loaded!');
