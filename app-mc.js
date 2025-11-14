// ===================================
// QUEERZ! MC COMPANION - ENHANCED
// Main Application Logic
// ===================================

import { broadcast, listenToPlayers } from './firebase-broadcast.js';
import {
    createCampaign,
    addScene,
    loadCampaign,
    getMyCampaigns,
    listenToCampaign
} from './campaign-manager-mc.js';

// ===================================
// GLOBAL STATE
// ===================================

let players = [];
let activePlayerIndex = -1;
let currentCampaignId = null;
let currentArc = 'arc-1';
let currentChapter = 1;
let campaigns = {};
let checkpoints = [];
let counters = {
    ignorance: { current: 0, max: 5 },
    acceptance: { current: 0 },
    rejection: { current: 0 }
};
let playlist = [];
let isLooping = false;
let currentPlaylistIndex = 0;

// Session state
let currentSession = {
    name: 'Default Session',
    players: [],
    checkpoints: [],
    counters: {...counters}
};
let savedSessions = [];

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🎨 Initializing MC Companion...');

    // Load from local storage
    loadFromLocalStorage();

    // Setup event listeners
    setupEventListeners();

    // Load campaigns
    await loadCampaigns();

    // Initialize UI
    renderPlayers();
    renderCheckpoints();
    updateCounterDisplays();

    // Listen for player data from Player App
    setupPlayerListener();

    console.log('✅ MC Companion initialized');
});

// ===================================
// PLAYER DATA SYNC FROM PLAYER APP
// ===================================

function setupPlayerListener() {
    listenToPlayers((playerData) => {
        console.log('📥 Syncing player data from Player App:', playerData);

        // playerData structure from Player App:
        // playerCharacters/[uid]: {
        //   name: string,
        //   pronouns: string,
        //   portraitUrl: string,
        //   currentStatuses: [],
        //   storyTags: [],
        //   juice: number,
        //   themes: []
        // }

        Object.entries(playerData).forEach(([playerId, data]) => {
            const playerName = data.name || playerId || 'Unnamed Character';

            // Find existing player or create new one
            let player = players.find(p => p.name === playerName);

            if (!player) {
                // New player - add to spotlight
                player = {
                    name: playerName,
                    pronouns: data.pronouns || '',
                    portraitUrl: data.portraitUrl || '',
                    juice: data.juice || 0,
                    themes: data.themes || [],
                    tags: {
                        story: [],
                        status: []
                    }
                };
                players.push(player);
                console.log(`✅ Added new player from Player App: ${playerName}`);
            } else {
                // Update existing player data
                if (data.pronouns) player.pronouns = data.pronouns;
                if (data.portraitUrl) player.portraitUrl = data.portraitUrl;
                if (data.juice !== undefined) player.juice = data.juice;
                if (data.themes) player.themes = data.themes;
            }

            // Sync story tags from Player App
            if (data.storyTags && Array.isArray(data.storyTags)) {
                data.storyTags.forEach(tag => {
                    if (!player.tags.story.includes(tag)) {
                        player.tags.story.push(tag);
                    }
                });
            }

            // Sync status tags from Player App (currentStatuses → status tags)
            if (data.currentStatuses && Array.isArray(data.currentStatuses)) {
                data.currentStatuses.forEach(tag => {
                    if (!player.tags.status.includes(tag)) {
                        player.tags.status.push(tag);
                    }
                });
            }
        });

        // Update UI
        renderPlayers();
        renderPlayerOverview();
        saveToLocalStorage();
    });

    console.log('✅ Player listener setup - MC App ready to receive player broadcasts');
}

// ===================================
// LOCAL STORAGE
// ===================================

function loadFromLocalStorage() {
    try {
        const savedPlayers = localStorage.getItem('mcApp_players_v2');
        if (savedPlayers) players = JSON.parse(savedPlayers);

        const savedCheckpoints = localStorage.getItem('mcApp_checkpoints');
        if (savedCheckpoints) checkpoints = JSON.parse(savedCheckpoints);

        const savedCounters = localStorage.getItem('mcApp_counters');
        if (savedCounters) counters = JSON.parse(savedCounters);

        const savedSessionsData = localStorage.getItem('mcApp_sessions_v2');
        if (savedSessionsData) savedSessions = JSON.parse(savedSessionsData);

        const savedCurrentSession = localStorage.getItem('mcApp_currentSession_v2');
        if (savedCurrentSession) {
            currentSession = JSON.parse(savedCurrentSession);
            players = currentSession.players || [];
            checkpoints = currentSession.checkpoints || [];
            counters = currentSession.counters || {ignorance: {current: 0, max: 5}, acceptance: {current: 0}, rejection: {current: 0}};
        }

        console.log('✅ Loaded from localStorage');
    } catch (error) {
        console.error('❌ Error loading from localStorage:', error);
    }
}

function saveToLocalStorage() {
    try {
        currentSession.players = players;
        currentSession.checkpoints = checkpoints;
        currentSession.counters = counters;

        localStorage.setItem('mcApp_players_v2', JSON.stringify(players));
        localStorage.setItem('mcApp_checkpoints', JSON.stringify(checkpoints));
        localStorage.setItem('mcApp_counters', JSON.stringify(counters));
        localStorage.setItem('mcApp_currentSession_v2', JSON.stringify(currentSession));
        localStorage.setItem('mcApp_sessions_v2', JSON.stringify(savedSessions));
    } catch (error) {
        console.error('❌ Error saving to localStorage:', error);
    }
}

// ===================================
// CAMPAIGN MANAGEMENT
// ===================================

async function loadCampaigns() {
    try {
        // List of campaign files to load
        const campaignFiles = [
            'example-campaign.json',
            'tori-campaign.json'
        ];

        // Load each campaign file
        for (const filename of campaignFiles) {
            try {
                const response = await fetch(`./campaigns/${filename}`);
                if (response.ok) {
                    const campaign = await response.json();
                    campaigns[campaign.id] = campaign;
                    console.log(`✅ Loaded campaign: ${campaign.name || filename}`);
                } else {
                    console.warn(`⚠️ Campaign file not found: ${filename}`);
                }
            } catch (err) {
                console.warn(`⚠️ Error loading ${filename}:`, err.message);
            }
        }

        // Load from Firebase
        const firebaseCampaigns = await getMyCampaigns();
        firebaseCampaigns.forEach(campaign => {
            campaigns[`firebase-${campaign.id}`] = campaign;
        });

        // Populate campaign dropdown
        populateCampaignSelect();
    } catch (error) {
        console.error('❌ Error loading campaigns:', error);
    }
}

function populateCampaignSelect() {
    const campaignSelect = document.getElementById('campaignSelect');
    if (!campaignSelect) return;

    campaignSelect.innerHTML = '<option value="">Select Campaign...</option>';

    Object.entries(campaigns).forEach(([id, campaign]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = campaign.name || campaign.metadata?.name || id;
        campaignSelect.appendChild(option);
    });
}

// Track current scene and script state
let currentScriptState = {
    chapterId: null,
    sceneId: null,
    branchChoices: {},
    counterStates: {}
};

function loadCampaignScript(campaignId) {
    const campaign = campaigns[campaignId];
    if (!campaign) return;

    const scriptContent = document.getElementById('scriptContent');
    const scriptTabs = document.getElementById('scriptTabs');
    const scriptPanelTitle = document.getElementById('scriptPanelTitle');

    if (!scriptContent || !scriptTabs) return;

    // Update panel title
    if (scriptPanelTitle) {
        scriptPanelTitle.textContent = campaign.name || 'Campaign Script';
    }

    // Get first chapter
    const chapter = campaign.chapters && campaign.chapters[0];
    if (!chapter) {
        scriptContent.innerHTML = '<p class="placeholder-text">No chapter content available</p>';
        return;
    }

    // Store chapter reference
    currentScriptState.chapterId = chapter.number;

    // Create tabs - individual tabs for each scene
    scriptTabs.innerHTML = '';
    const tabs = [{ id: 'overview', label: 'Overview' }];

    // Add individual scene tabs
    if (chapter.scenes && chapter.scenes.length > 0) {
        chapter.scenes.forEach((scene, index) => {
            tabs.push({
                id: `scene-${scene.number}`,
                label: `Scene ${scene.number}`,
                sceneData: scene
            });
        });
    }

    // Add other tabs
    tabs.push({ id: 'innerSpace', label: 'Inner Space' });
    tabs.push({ id: 'aftermath', label: 'Aftermath' });
    tabs.push({ id: 'scaling', label: 'Scaling' });

    tabs.forEach((tab, index) => {
        const tabBtn = document.createElement('button');
        tabBtn.className = `tab-btn ${index === 0 ? 'active' : ''}`;
        tabBtn.textContent = tab.label;
        tabBtn.onclick = () => {
            // Remove active from all tabs
            scriptTabs.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            tabBtn.classList.add('active');
            if (tab.sceneData) {
                displayScriptTab(chapter, tab.id, tab.sceneData);
            } else {
                displayScriptTab(chapter, tab.id);
            }
        };
        scriptTabs.appendChild(tabBtn);
    });

    // Display overview by default
    displayScriptTab(chapter, 'overview');
}

// Helper function to render counter bubbles
function renderCounterBubbles(type, limit, sceneId) {
    const stateKey = `${type}-${sceneId}`;
    const currentState = currentScriptState.counterStates[stateKey] || 0;

    let bubbles = '';
    for (let i = 0; i < limit; i++) {
        const filled = i < currentState ? 'filled' : '';
        bubbles += `<div class="counter-bubble ${filled}" data-counter="${type}" data-scene="${sceneId}" data-index="${i}"></div>`;
    }

    const label = type === 'ignorance' ? 'Ignorance Limit' :
                  type === 'acceptance' ? 'Acceptance' : 'Rejection';
    const color = type === 'ignorance' ? '#E89B9B' :
                  type === 'acceptance' ? '#4A7C7E' : '#8B5A5A';

    return `
        <div class="inline-counter" style="margin: 15px 0; padding: 10px; background: rgba(26, 26, 26, 0.5); border-radius: 10px; display: inline-block;">
            <div style="color: ${color}; font-weight: bold; margin-bottom: 5px; font-size: 14px;">${label}</div>
            <div class="counter-bubbles-container" style="display: flex; gap: 8px;">
                ${bubbles}
            </div>
        </div>
    `;
}

// Helper function to find combat encounters in scene content
function renderSceneWithCounters(scene) {
    let content = scene.content || scene.description || 'No scene content available';

    // Check for combat encounter in the scene
    const combatMatch = content.match(/Ignorance Limit:\s*(\d+)/i);
    let combatHtml = '';

    if (combatMatch) {
        const ignoranceLimit = parseInt(combatMatch[1]);
        combatHtml = renderCounterBubbles('ignorance', ignoranceLimit, `scene-${scene.number}`);
    }

    return combatHtml;
}

function displayScriptTab(chapter, tabId, sceneData = null) {
    const scriptContent = document.getElementById('scriptContent');
    if (!scriptContent) return;

    let html = '';

    // Handle individual scene tabs
    if (tabId.startsWith('scene-') && sceneData) {
        currentScriptState.sceneId = sceneData.number;

        const counterBubbles = renderSceneWithCounters(sceneData);

        html = `
            <div class="scene-content">
                <h2 style="color: #F4D35E; margin-bottom: 15px;">Scene ${sceneData.number}: ${sceneData.name || 'Untitled Scene'}</h2>
                ${sceneData.location ? `<p style="color: #E89B9B; margin-bottom: 10px;"><strong>Location:</strong> ${sceneData.location}</p>` : ''}
                ${sceneData.music ? `<p style="color: #E89B9B; margin-bottom: 10px;"><strong>Music:</strong> ${sceneData.music}</p>` : ''}

                ${counterBubbles ? `<div class="combat-counters" style="margin: 20px 0;">${counterBubbles}</div>` : ''}

                <div class="script-text" style="white-space: pre-wrap; line-height: 1.7; margin: 20px 0;">
                    ${sceneData.content || sceneData.description || 'No scene content available'}
                </div>

                ${sceneData.npcs && sceneData.npcs.length > 0 ? `
                    <p style="margin-top: 15px; color: #4A7C7E;"><strong>NPCs:</strong> ${sceneData.npcs.join(', ')}</p>
                ` : ''}
                ${sceneData.tags && sceneData.tags.length > 0 ? `
                    <p style="margin-top: 10px; color: #4A7C7E;"><strong>Tags:</strong> ${sceneData.tags.join(', ')}</p>
                ` : ''}

                ${sceneData.branches ? `
                    <div class="scene-branches" style="margin-top: 30px; padding: 20px; background: rgba(74, 124, 126, 0.15); border-radius: 10px;">
                        <h3 style="color: #F4D35E; margin-bottom: 15px;">What happens next?</h3>
                        ${sceneData.branches.map((branch, idx) => `
                            <label style="display: block; margin: 10px 0; cursor: pointer; padding: 10px; background: rgba(26, 26, 26, 0.3); border-radius: 5px;">
                                <input type="radio" name="scene-${sceneData.number}-branch" value="${branch.nextScene}"
                                    onchange="handleBranchSelection(${sceneData.number}, '${branch.nextScene}', '${branch.label}')"
                                    ${currentScriptState.branchChoices[`scene-${sceneData.number}`] === branch.nextScene ? 'checked' : ''}>
                                <span style="margin-left: 10px; color: #F5EFE6;">${branch.label}</span>
                            </label>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        scriptContent.innerHTML = html;
        attachCounterListeners();
        return;
    }

    switch (tabId) {
        case 'overview':
            html = `
                <div class="overview-content">
                    <h2 style="color: #F4D35E;">${chapter.name || `Chapter ${chapter.number}`}</h2>
                    <div class="script-text" style="line-height: 1.7; margin: 20px 0;">
                        ${chapter.overview || 'No overview available'}
                    </div>
                    ${chapter.scenes ? `
                        <h3 style="color: #E89B9B; margin-top: 30px;">Scenes (${chapter.scenes.length})</h3>
                        <ul style="list-style: none; padding: 0;">
                            ${chapter.scenes.map(s => `
                                <li style="margin: 10px 0; padding: 10px; background: rgba(74, 124, 126, 0.15); border-radius: 5px;">
                                    <strong style="color: #F4D35E;">Scene ${s.number}: ${s.name}</strong>
                                    <br><span style="color: #4A7C7E;">${s.location}</span>
                                </li>
                            `).join('')}
                        </ul>
                    ` : ''}
                </div>
            `;
            break;

        case 'innerSpace':
            if (chapter.innerSpace) {
                // Render acceptance/rejection counters for Inner Space
                const acceptanceLimit = chapter.innerSpace.counters?.acceptance?.triggers?.length || 5;
                const rejectionLimit = chapter.innerSpace.counters?.rejection?.triggers?.length || 5;

                html = `
                    <div class="innerspace-content">
                        <h2 style="color: #E89B9B;">Inner Space</h2>

                        <div class="innerspace-counters" style="margin: 20px 0; padding: 15px; background: rgba(74, 124, 126, 0.1); border-radius: 10px;">
                            ${renderCounterBubbles('acceptance', acceptanceLimit, 'innerspace')}
                            ${renderCounterBubbles('rejection', rejectionLimit, 'innerspace')}
                        </div>

                        <div class="script-text" style="line-height: 1.7; margin: 20px 0;">
                            ${chapter.innerSpace.description || ''}
                        </div>

                        ${chapter.innerSpace.coreWounds ? `
                            <h3 style="color: #E89B9B; margin-top: 30px;">Core Wounds</h3>
                            ${chapter.innerSpace.coreWounds.map(wound => `
                                <div style="background: rgba(232, 155, 155, 0.15); padding: 20px; margin: 15px 0; border-radius: 10px; border-left: 4px solid #E89B9B;">
                                    <h4 style="color: #F4D35E; margin-bottom: 10px;">${wound.name}</h4>
                                    <p style="line-height: 1.7; margin-bottom: 15px;">${wound.description}</p>
                                    ${wound.approaches ? `
                                        <div style="margin-top: 15px;">
                                            <p style="margin: 10px 0;"><strong style="color: #4A7C7E;">Talk It Out:</strong> ${wound.approaches.talkItOut || 'N/A'}</p>
                                            <p style="margin: 10px 0;"><strong style="color: #4A7C7E;">Care:</strong> ${wound.approaches.care || 'N/A'}</p>
                                            <p style="margin: 10px 0;"><strong style="color: #4A7C7E;">Slay:</strong> ${wound.approaches.slay || 'N/A'}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        ` : ''}

                        ${chapter.innerSpace.counters ? `
                            <h3 style="color: #E89B9B; margin-top: 30px;">Counter Triggers</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                                ${chapter.innerSpace.counters.acceptance ? `
                                    <div style="background: rgba(74, 124, 126, 0.15); padding: 15px; border-radius: 10px;">
                                        <h4 style="color: #4A7C7E; margin-bottom: 10px;">Acceptance</h4>
                                        <p style="font-size: 14px; margin-bottom: 10px;">${chapter.innerSpace.counters.acceptance.description || ''}</p>
                                        ${chapter.innerSpace.counters.acceptance.triggers ? `
                                            <ul style="font-size: 13px;">${chapter.innerSpace.counters.acceptance.triggers.map(t => `<li style="margin: 5px 0;">${t}</li>`).join('')}</ul>
                                        ` : ''}
                                    </div>
                                ` : ''}
                                ${chapter.innerSpace.counters.rejection ? `
                                    <div style="background: rgba(139, 90, 90, 0.15); padding: 15px; border-radius: 10px;">
                                        <h4 style="color: #8B5A5A; margin-bottom: 10px;">Rejection</h4>
                                        <p style="font-size: 14px; margin-bottom: 10px;">${chapter.innerSpace.counters.rejection.description || ''}</p>
                                        ${chapter.innerSpace.counters.rejection.triggers ? `
                                            <ul style="font-size: 13px;">${chapter.innerSpace.counters.rejection.triggers.map(t => `<li style="margin: 5px 0;">${t}</li>`).join('')}</ul>
                                        ` : ''}
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                `;
            } else {
                html = '<p class="placeholder-text">No Inner Space content available</p>';
            }
            break;

        case 'aftermath':
            if (chapter.aftermath && chapter.aftermath.outcomes) {
                html = `
                    <div class="aftermath-content">
                        <h2 style="color: #E89B9B;">Aftermath & Outcomes</h2>
                        <p style="margin: 15px 0; font-style: italic; color: #F5EFE6;">Select the outcome that best matches your session:</p>

                        <div class="outcome-branches">
                            ${chapter.aftermath.outcomes.map((outcome, idx) => `
                                <div style="margin: 20px 0; padding: 20px; background: rgba(74, 124, 126, 0.15); border-radius: 10px; border-left: 4px solid ${outcome.condition === 'best' ? '#4A7C7E' : outcome.condition === 'worst' ? '#8B5A5A' : '#F4D35E'};">
                                    <label style="cursor: pointer; display: block;">
                                        <input type="radio" name="aftermath-outcome" value="${outcome.condition}"
                                            onchange="handleAftermathSelection('${outcome.condition}')"
                                            ${currentScriptState.branchChoices['aftermath'] === outcome.condition ? 'checked' : ''}>
                                        <h3 style="display: inline; color: #F4D35E; text-transform: capitalize; margin-left: 10px;">${outcome.condition} Outcome</h3>
                                    </label>
                                    <p style="line-height: 1.7; margin: 15px 0;">${outcome.description}</p>
                                    ${outcome.consequences && outcome.consequences.length > 0 ? `
                                        <h4 style="color: #E89B9B; margin-top: 15px;">Consequences:</h4>
                                        <ul style="margin: 10px 0;">${outcome.consequences.map(c => `<li style="margin: 5px 0;">${c}</li>`).join('')}</ul>
                                    ` : ''}
                                    ${outcome.nextChapterImpact ? `
                                        <p style="margin-top: 15px;"><strong style="color: #4A7C7E;">Next Chapter Impact:</strong> ${outcome.nextChapterImpact}</p>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>

                        ${chapter.consequences ? `
                            <div style="margin-top: 30px; padding: 20px; background: rgba(232, 155, 155, 0.1); border-radius: 10px;">
                                <h3 style="color: #E89B9B;">Long-term Consequences</h3>
                                <p style="line-height: 1.7; margin: 15px 0;">${chapter.consequences.description || ''}</p>
                                ${chapter.consequences.rippleEffects && chapter.consequences.rippleEffects.length > 0 ? `
                                    <ul style="margin: 10px 0;">${chapter.consequences.rippleEffects.map(e => `<li style="margin: 5px 0;">${e}</li>`).join('')}</ul>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                `;
            } else {
                html = '<p class="placeholder-text">No aftermath content available</p>';
            }
            break;

        case 'scaling':
            if (chapter.scalingAndPacing) {
                const scaling = chapter.scalingAndPacing;
                html = `
                    <div class="scaling-content">
                        <h2 style="color: #E89B9B;">Scaling & Pacing</h2>
                        ${scaling.partySize ? `
                            <h3 style="color: #4A7C7E; margin-top: 30px;">Party Size Adjustments</h3>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 15px;">
                                ${Object.entries(scaling.partySize).map(([size, config]) => `
                                    <div style="background: rgba(74, 124, 126, 0.15); padding: 15px; border-radius: 10px;">
                                        <h4 style="color: #F4D35E; margin-bottom: 10px;">${size} Players</h4>
                                        <p style="margin: 5px 0;"><strong>Ignorance Limit:</strong> ${config.ignoranceLimit}</p>
                                        <p style="margin: 5px 0;"><strong>Pawns:</strong> ${config.pawns}</p>
                                        <p style="margin: 5px 0; font-style: italic; color: #E89B9B;">${config.difficulty}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        ${scaling.sessionLength ? `
                            <h3 style="color: #4A7C7E; margin-top: 30px;">Session Length Options</h3>
                            <div style="margin-top: 15px;">
                                ${Object.entries(scaling.sessionLength).map(([type, desc]) => `
                                    <p style="margin: 15px 0;"><strong style="color: #F4D35E; text-transform: capitalize;">${type.replace(/([A-Z])/g, ' $1')}:</strong> ${desc}</p>
                                `).join('')}
                            </div>
                        ` : ''}
                        ${scaling.difficultyAdjustments ? `
                            <h3 style="color: #4A7C7E; margin-top: 30px;">Difficulty Adjustments</h3>
                            <div style="margin-top: 15px;">
                                ${Object.entries(scaling.difficultyAdjustments).map(([type, settings]) => `
                                    <div style="margin: 15px 0; padding: 15px; background: rgba(232, 155, 155, 0.1); border-radius: 10px;">
                                        <h4 style="color: #F4D35E; text-transform: capitalize;">${type}</h4>
                                        <p style="margin: 10px 0;">${settings.note || ''}</p>
                                        <p style="margin: 5px 0; font-size: 14px; color: #E89B9B;">Ignorance Modifier: ${settings.ignoranceLimitModifier >= 0 ? '+' : ''}${settings.ignoranceLimitModifier || 0}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;
            } else {
                html = '<p class="placeholder-text">No scaling content available</p>';
            }
            break;
    }

    scriptContent.innerHTML = html;
    attachCounterListeners();
}

// Attach click listeners to counter bubbles
function attachCounterListeners() {
    document.querySelectorAll('.counter-bubble').forEach(bubble => {
        bubble.addEventListener('click', function() {
            const type = this.dataset.counter;
            const sceneId = this.dataset.scene;
            const index = parseInt(this.dataset.index);
            const stateKey = `${type}-${sceneId}`;

            // Toggle: if clicking a filled bubble, empty from that point
            // If clicking an empty bubble, fill up to that point
            if (this.classList.contains('filled')) {
                currentScriptState.counterStates[stateKey] = index;
            } else {
                currentScriptState.counterStates[stateKey] = index + 1;
            }

            // Update all bubbles for this counter
            const container = this.parentElement;
            container.querySelectorAll('.counter-bubble').forEach((b, i) => {
                if (i < currentScriptState.counterStates[stateKey]) {
                    b.classList.add('filled');
                } else {
                    b.classList.remove('filled');
                }
            });

            saveToLocalStorage();
        });
    });
}

// Handle branch selection in scenes
window.handleBranchSelection = function(sceneNumber, nextScene, label) {
    currentScriptState.branchChoices[`scene-${sceneNumber}`] = nextScene;
    console.log(`Branch selected: ${label} → Scene ${nextScene}`);
    saveToLocalStorage();
    // Could auto-navigate to next scene here if desired
};

// Handle aftermath outcome selection
window.handleAftermathSelection = function(outcome) {
    currentScriptState.branchChoices['aftermath'] = outcome;
    console.log(`Aftermath outcome selected: ${outcome}`);
    saveToLocalStorage();
};

// ===================================
// PLAYER MANAGEMENT
// ===================================

function renderPlayers() {
    const spotlightPlayers = document.getElementById('spotlightPlayers');
    if (!spotlightPlayers) return;

    const addBtn = spotlightPlayers.querySelector('.add-btn');
    spotlightPlayers.innerHTML = '';

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

        spotlightPlayers.appendChild(playerBtn);
    });

    if (addBtn) {
        spotlightPlayers.appendChild(addBtn);
    }

    updatePlayerTagsDisplay();
    saveToLocalStorage();
}

function addPlayer(name) {
    const newPlayer = {
        name: name || `Player ${players.length + 1}`,
        tags: {
            story: [],
            status: []
        }
    };

    players.push(newPlayer);
    renderPlayers();
    broadcastToPlayers();
}

function removePlayer(index) {
    if (confirm(`Remove ${players[index].name}?`)) {
        players.splice(index, 1);
        if (activePlayerIndex === index) {
            activePlayerIndex = -1;
        } else if (activePlayerIndex > index) {
            activePlayerIndex--;
        }
        renderPlayers();
        broadcastToPlayers();
    }
}

function setActivePlayer(index) {
    activePlayerIndex = index;
    renderPlayers();
    updatePlayerTagsDisplay();
}

// ===================================
// TAG MANAGEMENT
// ===================================

const TAG_DATABASE = {
    story: {
        beneficial: ['Advantage', 'Protected', 'Hidden', 'Inspired', 'Coordinated', 'Prepared', 'Intel', 'Backup', 'Momentum', 'Focus'],
        harmful: ['Exposed', 'Vulnerable', 'Shaken', 'Conforming', 'Isolated', 'Overwhelmed', 'Marked', 'Distracted'],
        investigation: ['Clue Found', 'Witness Located', 'Evidence Gathered', 'Pattern Recognized', 'Connection Made']
    },
    status: {
        beneficial: ['+1 Forward', '+1 Ongoing', 'Armored', 'Enhanced', 'Invisible', 'Flying'],
        harmful: ['Shaken (-1 Ongoing)', 'Conforming (-1 to Resist)', 'Marked', 'Wounded', 'Exhausted', 'Confused']
    }
};

function updatePlayerTagsDisplay() {
    const container = document.getElementById('playerTagsContainer');
    if (!container) return;

    if (activePlayerIndex === -1 || !players[activePlayerIndex]) {
        container.innerHTML = '<p class="placeholder-text">Select a player from the spotlight to manage tags</p>';
        return;
    }

    const player = players[activePlayerIndex];
    const html = `
        <h4 style="color: #F4D35E; margin-bottom: 15px;">Tags for ${player.name}</h4>

        <div class="tag-section">
            <h4>Story Tags</h4>
            <div class="tags-display" id="storyTagsDisplay">
                ${renderTags(player.tags.story, 'story')}
                <button class="add-tag-btn" onclick="showAddTagDialog('story')">+ Add Story Tag</button>
            </div>
        </div>

        <div class="tag-section">
            <h4>Status Tags</h4>
            <div class="tags-display" id="statusTagsDisplay">
                ${renderTags(player.tags.status, 'status')}
                <button class="add-tag-btn" onclick="showAddTagDialog('status')">+ Add Status Tag</button>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function renderTags(tags, type) {
    if (!tags || tags.length === 0) {
        return '<span class="placeholder-text">No tags</span>';
    }

    return tags.map(tag => {
        const tagType = getTagType(tag, type);
        return `
            <div class="tag-badge ${tagType}">
                ${tag}
                <span class="remove-tag" onclick="removeTag('${type}', '${tag}')">×</span>
            </div>
        `;
    }).join('');
}

function getTagType(tag, categoryType) {
    const category = TAG_DATABASE[categoryType];
    if (!category) return 'neutral';

    for (const [type, tags] of Object.entries(category)) {
        if (tags.includes(tag)) {
            return type === 'beneficial' ? 'beneficial' : type === 'harmful' ? 'harmful' : 'neutral';
        }
    }
    return 'neutral';
}

window.showAddTagDialog = function(tagType) {
    if (activePlayerIndex === -1) {
        alert('Please select a player first');
        return;
    }

    const categories = TAG_DATABASE[tagType];
    let dialogHTML = '<div style="max-height: 400px; overflow-y: auto;">';

    for (const [category, tags] of Object.entries(categories)) {
        dialogHTML += `<div style="margin-bottom: 15px;">`;
        dialogHTML += `<strong style="text-transform: capitalize; color: #E89B9B;">${category}:</strong><br>`;
        tags.forEach(tag => {
            dialogHTML += `<button class="add-tag-btn" style="margin: 5px;" onclick="addTag('${tagType}', '${tag}'); closeTagDialog();">${tag}</button>`;
        });
        dialogHTML += `</div>`;
    }

    dialogHTML += `<hr style="border-color: rgba(74, 124, 126, 0.3); margin: 15px 0;">`;
    dialogHTML += `<strong>Or enter custom tag:</strong><br>`;
    dialogHTML += `<input type="text" id="customTagInput" class="text-input" placeholder="Custom tag name">`;
    dialogHTML += `<button class="header-btn" style="margin-top: 10px;" onclick="addCustomTag('${tagType}')">Add Custom</button>`;
    dialogHTML += `</div>`;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'tagDialog';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add ${tagType === 'story' ? 'Story' : 'Status'} Tag</h2>
                <button class="close-modal-btn" onclick="closeTagDialog()">×</button>
            </div>
            ${dialogHTML}
        </div>
    `;
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeTagDialog();
    });
    document.body.appendChild(modal);
};

window.closeTagDialog = function() {
    const dialog = document.getElementById('tagDialog');
    if (dialog) dialog.remove();
};

window.addTag = function(type, tag) {
    if (activePlayerIndex === -1) return;

    const player = players[activePlayerIndex];
    if (!player.tags[type].includes(tag)) {
        player.tags[type].push(tag);
        updatePlayerTagsDisplay();
        saveToLocalStorage();
    }
};

window.addCustomTag = function(type) {
    const input = document.getElementById('customTagInput');
    if (!input || !input.value.trim()) {
        alert('Please enter a tag name');
        return;
    }

    addTag(type, input.value.trim());
    closeTagDialog();
};

window.removeTag = function(type, tag) {
    if (activePlayerIndex === -1) return;

    const player = players[activePlayerIndex];
    const index = player.tags[type].indexOf(tag);
    if (index > -1) {
        player.tags[type].splice(index, 1);
        updatePlayerTagsDisplay();
        saveToLocalStorage();
    }
};

// ===================================
// CHECKPOINT MANAGEMENT
// ===================================

function renderCheckpoints() {
    const container = document.getElementById('progressContainer');
    if (!container) return;

    if (checkpoints.length === 0) {
        container.innerHTML = '<p class="placeholder-text">No checkpoints yet. Add story checkpoints to track progress!</p>';
        return;
    }

    container.innerHTML = checkpoints.map((checkpoint, index) => `
        <div class="checkpoint ${checkpoint.completed ? 'completed' : ''}">
            <input type="checkbox" class="checkpoint-checkbox"
                   ${checkpoint.completed ? 'checked' : ''}
                   onchange="toggleCheckpoint(${index})">
            <div class="checkpoint-label">${checkpoint.description}</div>
        </div>
    `).join('');
}

window.toggleCheckpoint = function(index) {
    checkpoints[index].completed = !checkpoints[index].completed;

    // If this checkpoint has a next chapter, load it
    if (checkpoints[index].completed && checkpoints[index].nextChapter) {
        currentChapter = checkpoints[index].nextChapter;
        const chapterSelect = document.getElementById('chapterSelect');
        if (chapterSelect) chapterSelect.value = currentChapter;
        loadChapterContent();
    }

    renderCheckpoints();
    saveToLocalStorage();
};

function addCheckpoint(description, nextChapter = null) {
    checkpoints.push({
        description,
        nextChapter: nextChapter ? parseInt(nextChapter) : null,
        completed: false,
        timestamp: Date.now()
    });

    renderCheckpoints();
    saveToLocalStorage();
}

// ===================================
// COUNTER MANAGEMENT
// ===================================

function updateCounterDisplays() {
    const ignoranceCounter = document.getElementById('ignoranceCounter');
    const acceptanceCounter = document.getElementById('acceptanceCounter');
    const rejectionCounter = document.getElementById('rejectionCounter');

    if (ignoranceCounter) ignoranceCounter.textContent = counters.ignorance.current;
    if (acceptanceCounter) acceptanceCounter.textContent = counters.acceptance.current;
    if (rejectionCounter) rejectionCounter.textContent = counters.rejection.current;
}

window.changeCounter = function(type, delta) {
    counters[type].current = Math.max(0, counters[type].current + delta);

    // Cap ignorance counter at max
    if (type === 'ignorance' && counters[type].max) {
        counters[type].current = Math.min(counters[type].current, counters[type].max);
    }

    updateCounterDisplays();
    saveToLocalStorage();
};

window.resetCounter = function(type) {
    counters[type].current = 0;
    updateCounterDisplays();
    saveToLocalStorage();
};

window.toggleInnerSpaceCounters = function() {
    const container = document.getElementById('innerSpaceCounters');
    const toggleText = document.getElementById('innerSpaceToggleText');

    if (container.style.display === 'none' || !container.style.display) {
        container.style.display = 'grid';
        toggleText.textContent = 'Hide Inner Space Counters';
    } else {
        container.style.display = 'none';
        toggleText.textContent = 'Show Inner Space Counters';
    }
};

// ===================================
// DICE ROLLER
// ===================================

function rollDice() {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const modifier = parseInt(document.getElementById('powerModifier').value) || 0;
    const total = die1 + die2 + modifier;

    document.getElementById('die1').textContent = die1;
    document.getElementById('die2').textContent = die2;
    document.getElementById('modDisplay').textContent = modifier >= 0 ? `+${modifier}` : modifier;
    document.getElementById('totalDisplay').textContent = total;

    const resultElement = document.getElementById('rollResult');
    let resultText, resultColor;

    if (total <= 6) {
        resultText = 'MISS (6-) - MC makes a move';
        resultColor = '#ff6b6b';
    } else if (total <= 9) {
        resultText = 'PARTIAL HIT (7-9) - Success with cost';
        resultColor = '#F4D35E';
    } else {
        resultText = 'FULL HIT (10+) - Success!';
        resultColor = '#4ADE80';
    }

    resultElement.textContent = resultText;
    resultElement.style.color = resultColor;
}

// ===================================
// MUSIC PLAYER
// ===================================

function setupMusicPlayer() {
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playMusicBtn');
    const pauseBtn = document.getElementById('pauseMusicBtn');
    const stopBtn = document.getElementById('stopMusicBtn');
    const loopBtn = document.getElementById('loopMusicBtn');
    const addPlaylistBtn = document.getElementById('addPlaylistBtn');
    const musicSelect = document.getElementById('musicSelect');
    const nowPlaying = document.getElementById('nowPlaying');

    playBtn?.addEventListener('click', () => {
        if (audioPlayer.src) {
            audioPlayer.play();
            const selectedOption = musicSelect.options[musicSelect.selectedIndex];
            nowPlaying.textContent = `Now Playing: ${selectedOption.textContent}`;
        }
    });

    pauseBtn?.addEventListener('click', () => audioPlayer.pause());

    stopBtn?.addEventListener('click', () => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        nowPlaying.textContent = 'No track playing';
    });

    loopBtn?.addEventListener('click', () => {
        isLooping = !isLooping;
        audioPlayer.loop = isLooping;
        loopBtn.classList.toggle('active');
    });

    addPlaylistBtn?.addEventListener('click', () => {
        const selected = musicSelect.options[musicSelect.selectedIndex];
        if (selected && selected.value) {
            playlist.push({
                name: selected.textContent,
                url: selected.value
            });
            renderPlaylist();
        }
    });

    musicSelect?.addEventListener('change', (e) => {
        const selected = e.target.options[e.target.selectedIndex];
        if (selected && selected.value) {
            audioPlayer.src = selected.value;
        }
    });

    audioPlayer?.addEventListener('ended', () => {
        if (!isLooping && playlist.length > 0) {
            playNextInPlaylist();
        }
    });
}

function renderPlaylist() {
    const container = document.getElementById('playlistContainer');
    const tracksDiv = document.getElementById('playlistTracks');

    if (playlist.length > 0) {
        container.classList.remove('hidden');
        tracksDiv.innerHTML = playlist.map((track, index) => `
            <div class="playlist-item" onclick="playFromPlaylist(${index})">
                <span>${track.name}</span>
                <span style="cursor: pointer;" onclick="event.stopPropagation(); removeFromPlaylist(${index})">🗑️</span>
            </div>
        `).join('');
    } else {
        container.classList.add('hidden');
    }
}

window.playFromPlaylist = function(index) {
    const track = playlist[index];
    const audioPlayer = document.getElementById('audioPlayer');
    const nowPlaying = document.getElementById('nowPlaying');

    audioPlayer.src = track.url;
    audioPlayer.play();
    nowPlaying.textContent = `Now Playing: ${track.name}`;
    currentPlaylistIndex = index;
};

window.removeFromPlaylist = function(index) {
    playlist.splice(index, 1);
    renderPlaylist();
};

function playNextInPlaylist() {
    if (playlist.length === 0) return;
    currentPlaylistIndex = (currentPlaylistIndex + 1) % playlist.length;
    playFromPlaylist(currentPlaylistIndex);
}

// ===================================
// BROADCAST FUNCTIONALITY
// ===================================

async function broadcastToPlayers() {
    try {
        const environmentSelect = document.getElementById('environmentSelect');
        const npcSelect = document.getElementById('npcSelect');
        const musicSelect = document.getElementById('musicSelect');

        const payload = {
            environment: {
                name: environmentSelect?.options[environmentSelect.selectedIndex]?.textContent || '',
                imageUrl: environmentSelect?.options[environmentSelect.selectedIndex]?.dataset?.img || ''
            },
            npc: {
                name: npcSelect?.options[npcSelect.selectedIndex]?.textContent || '',
                imageUrl: npcSelect?.options[npcSelect.selectedIndex]?.dataset?.img || ''
            },
            music: {
                name: musicSelect?.options[musicSelect.selectedIndex]?.textContent || '',
                url: musicSelect?.value || '',
                isLooping: isLooping,
                playlist: playlist
            },
            players: players.map(p => ({
                name: p.name,
                tags: p.tags
            })),
            counters: counters,
            timestamp: Date.now()
        };

        await broadcast(payload);

        showExportIndicator('Broadcast sent to players!');
        console.log('✅ Broadcast successful');
    } catch (error) {
        console.error('❌ Broadcast failed:', error);
        alert('Failed to broadcast: ' + error.message);
    }
}

// ===================================
// EXPORT FUNCTIONALITY
// ===================================

function exportCampaignProgress() {
    const exportData = {
        campaign: {
            id: currentCampaignId,
            arc: currentArc,
            chapter: currentChapter
        },
        session: currentSession.name,
        players: players,
        checkpoints: checkpoints,
        counters: counters,
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `campaign-progress-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);

    showExportIndicator('Campaign progress exported!');
}

function showExportIndicator(message) {
    const indicator = document.createElement('div');
    indicator.className = 'export-indicator';
    indicator.textContent = message;
    document.body.appendChild(indicator);

    setTimeout(() => {
        indicator.remove();
    }, 3000);
}

// ===================================
// SESSION MANAGEMENT
// ===================================

window.saveCurrentSession = function() {
    const name = prompt('Save session as:', currentSession.name);
    if (!name) return;

    currentSession.name = name;
    const existingIndex = savedSessions.findIndex(s => s.name === name);

    if (existingIndex >= 0) {
        savedSessions[existingIndex] = {...currentSession};
    } else {
        savedSessions.push({...currentSession});
    }

    saveToLocalStorage();
    renderSessionList();
    alert(`Session "${name}" saved!`);
};

window.saveSessionAs = function() {
    const name = prompt('Enter new session name:');
    if (!name) return;

    const newSession = {...currentSession, name};
    savedSessions.push(newSession);

    saveToLocalStorage();
    renderSessionList();
    alert(`Session "${name}" created!`);
};

function renderSessionList() {
    const container = document.getElementById('sessionList');
    if (!container) return;

    if (savedSessions.length === 0) {
        container.innerHTML = '<p class="placeholder-text">No saved sessions yet</p>';
        return;
    }

    container.innerHTML = savedSessions.map((session, index) => `
        <div style="background: rgba(74, 124, 126, 0.2); padding: 15px; margin: 10px 0; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h4 style="color: #F4D35E; margin-bottom: 5px;">${session.name}</h4>
                <p style="color: rgba(245, 239, 230, 0.7); font-size: 0.9rem;">
                    Players: ${session.players?.length || 0} | Checkpoints: ${session.checkpoints?.length || 0}
                </p>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="header-btn" onclick="loadSession(${index})">📂 Load</button>
                <button class="header-btn" onclick="deleteSession(${index})" style="background: rgba(255, 107, 107, 0.4);">🗑️</button>
            </div>
        </div>
    `).join('');
}

window.loadSession = function(index) {
    if (!savedSessions[index]) return;

    currentSession = {...savedSessions[index]};
    players = currentSession.players || [];
    checkpoints = currentSession.checkpoints || [];
    counters = currentSession.counters || {ignorance: {current: 0, max: 5}, acceptance: {current: 0}, rejection: {current: 0}};

    renderPlayers();
    renderCheckpoints();
    updateCounterDisplays();
    saveToLocalStorage();

    const sessionModal = document.getElementById('sessionModal');
    if (sessionModal) sessionModal.classList.add('hidden');

    alert(`Session "${currentSession.name}" loaded!`);
};

window.deleteSession = function(index) {
    if (!confirm(`Delete session "${savedSessions[index].name}"?`)) return;

    savedSessions.splice(index, 1);
    saveToLocalStorage();
    renderSessionList();
};

// ===================================
// EVENT LISTENERS SETUP
// ===================================

function setupEventListeners() {
    // Player management
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const playerModal = document.getElementById('playerModal');
    const closePlayerModalBtn = document.getElementById('closePlayerModalBtn');
    const cancelPlayerBtn = document.getElementById('cancelPlayerBtn');
    const confirmPlayerBtn = document.getElementById('confirmPlayerBtn');
    const playerNameInput = document.getElementById('playerNameInput');

    addPlayerBtn?.addEventListener('click', () => {
        playerModal?.classList.remove('hidden');
        if (playerNameInput) playerNameInput.value = '';
    });

    closePlayerModalBtn?.addEventListener('click', () => playerModal?.classList.add('hidden'));
    cancelPlayerBtn?.addEventListener('click', () => playerModal?.classList.add('hidden'));

    confirmPlayerBtn?.addEventListener('click', () => {
        const name = playerNameInput?.value.trim();
        if (name) {
            addPlayer(name);
            playerModal?.classList.add('hidden');
        } else {
            alert('Please enter a player name');
        }
    });

    // Campaign selection
    const campaignSelect = document.getElementById('campaignSelect');
    campaignSelect?.addEventListener('change', (e) => {
        currentCampaignId = e.target.value;
        if (currentCampaignId && campaigns[currentCampaignId]) {
            loadCampaignScript(currentCampaignId);
        }
    });

    // Checkpoint management
    const addCheckpointBtn = document.getElementById('addCheckpointBtn');
    const checkpointModal = document.getElementById('checkpointModal');
    const closeCheckpointModalBtn = document.getElementById('closeCheckpointModalBtn');
    const cancelCheckpointBtn = document.getElementById('cancelCheckpointBtn');
    const confirmCheckpointBtn = document.getElementById('confirmCheckpointBtn');

    addCheckpointBtn?.addEventListener('click', () => {
        checkpointModal?.classList.remove('hidden');
        const input = document.getElementById('checkpointInput');
        if (input) input.value = '';
    });

    closeCheckpointModalBtn?.addEventListener('click', () => checkpointModal?.classList.add('hidden'));
    cancelCheckpointBtn?.addEventListener('click', () => checkpointModal?.classList.add('hidden'));

    confirmCheckpointBtn?.addEventListener('click', () => {
        const description = document.getElementById('checkpointInput')?.value.trim();
        const nextChapter = document.getElementById('checkpointNextChapter')?.value;

        if (description) {
            addCheckpoint(description, nextChapter);
            checkpointModal?.classList.add('hidden');
        } else {
            alert('Please enter a checkpoint description');
        }
    });

    // Broadcast
    const broadcastAllBtn = document.getElementById('broadcastAllBtn');
    broadcastAllBtn?.addEventListener('click', broadcastToPlayers);

    // Export
    const exportCampaignBtn = document.getElementById('exportCampaignBtn');
    exportCampaignBtn?.addEventListener('click', exportCampaignProgress);

    // Dice roller
    const rollDiceBtn = document.getElementById('rollDiceBtn');
    rollDiceBtn?.addEventListener('click', rollDice);

    // Panels
    const toggleScriptBtn = document.getElementById('toggleScriptBtn');
    const toggleMcMovesBtn = document.getElementById('toggleMcMovesBtn');
    const scriptPanel = document.getElementById('scriptPanel');
    const mcMovesPanel = document.getElementById('mcMovesPanel');
    const closeScriptBtn = document.getElementById('closeScriptBtn');
    const closeMcMovesBtn = document.getElementById('closeMcMovesBtn');

    toggleScriptBtn?.addEventListener('click', () => scriptPanel?.classList.toggle('hidden'));
    toggleMcMovesBtn?.addEventListener('click', () => mcMovesPanel?.classList.toggle('hidden'));
    closeScriptBtn?.addEventListener('click', () => scriptPanel?.classList.add('hidden'));
    closeMcMovesBtn?.addEventListener('click', () => mcMovesPanel?.classList.add('hidden'));

    // Session management
    const sessionMgmtBtn = document.getElementById('sessionMgmtBtn');
    const sessionModal = document.getElementById('sessionModal');
    const closeSessionModalBtn = document.getElementById('closeSessionModalBtn');

    sessionMgmtBtn?.addEventListener('click', () => {
        sessionModal?.classList.remove('hidden');
        renderSessionList();
        const currentSessionName = document.getElementById('currentSessionName');
        if (currentSessionName) currentSessionName.textContent = currentSession.name;
    });

    closeSessionModalBtn?.addEventListener('click', () => sessionModal?.classList.add('hidden'));

    // Campaign settings
    const campaignSettingsBtn = document.getElementById('campaignSettingsBtn');
    const campaignSettingsModal = document.getElementById('campaignSettingsModal');
    const closeCampaignSettingsBtn = document.getElementById('closeCampaignSettingsBtn');

    campaignSettingsBtn?.addEventListener('click', () => campaignSettingsModal?.classList.remove('hidden'));
    closeCampaignSettingsBtn?.addEventListener('click', () => campaignSettingsModal?.classList.add('hidden'));

    // Player overview
    const playerOverviewBtn = document.getElementById('playerOverviewBtn');
    const playerOverviewModal = document.getElementById('playerOverviewModal');
    const closePlayerOverviewBtn = document.getElementById('closePlayerOverviewBtn');

    playerOverviewBtn?.addEventListener('click', () => {
        playerOverviewModal?.classList.remove('hidden');
        renderPlayerOverview();
    });

    closePlayerOverviewBtn?.addEventListener('click', () => playerOverviewModal?.classList.add('hidden'));

    // Music player
    setupMusicPlayer();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            scriptPanel?.classList.toggle('hidden');
        } else if (e.key === 'm' || e.key === 'M') {
            e.preventDefault();
            mcMovesPanel?.classList.toggle('hidden');
        }
    });
}

// ===================================
// PLAYER OVERVIEW
// ===================================

function renderPlayerOverview() {
    const container = document.getElementById('playerOverviewContent');
    if (!container) return;

    if (players.length === 0) {
        container.innerHTML = '<p class="placeholder-text">No players yet</p>';
        return;
    }

    container.innerHTML = players.map((player, index) => `
        <div style="background: rgba(74, 124, 126, 0.2); padding: 20px; margin: 15px 0; border-radius: 15px; border: 2px solid rgba(74, 124, 126, 0.4);">
            <h3 style="color: #F4D35E; margin-bottom: 15px;">${player.name}</h3>

            <div style="margin-bottom: 15px;">
                <h4 style="color: #E89B9B; margin-bottom: 10px;">Story Tags</h4>
                <div class="tags-display">
                    ${renderTags(player.tags.story, 'story')}
                </div>
            </div>

            <div>
                <h4 style="color: #E89B9B; margin-bottom: 10px;">Status Tags</h4>
                <div class="tags-display">
                    ${renderTags(player.tags.status, 'status')}
                </div>
            </div>
        </div>
    `).join('');
}

// ===================================
// EXPORT GLOBALS
// ===================================

console.log('✅ MC Companion App loaded successfully');
