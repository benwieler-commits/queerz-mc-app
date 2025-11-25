// ================================
// FIREBASE BROADCAST - MC APP
// ================================

import { db } from "./firebase-config.js";
import { ref, set, onValue, goOnline } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Ensure Firebase is online
try {
  goOnline(db);
  console.log('✅ Firebase connected successfully');

  const badge = document.getElementById("connBadge");
  if (badge) {
    badge.textContent = "● Live Sync";
    badge.classList.remove("offline");
    badge.classList.add("online");
  }
} catch (e) {
  console.warn("⚠️ Firebase connection issue:", e);
}

// ================================
// BROADCAST TO PLAYERS
// ================================

/**
 * Main broadcast function - sends complete scene data to all players
 * @param {Object} payload - Complete broadcast payload
 * @returns {Promise}
 */
export function broadcast(payload) {
  if (!payload) {
    console.warn('⚠️ Cannot broadcast empty payload');
    return Promise.reject(new Error('Empty payload'));
  }
  
  // Convert 'environment' to 'location' for Player App compatibility
  if (payload.environment) {
    payload.location = {
      name: payload.environment.name || 'Unknown Location',
      description: payload.environment.description || '',
      imageUrl: payload.environment.imageUrl || '',
      tags: payload.environment.tags || []
    };
    delete payload.environment; // Remove old key
  }
  
  console.log('📡 Broadcasting to players:', payload);
  
  return set(ref(db, "mcBroadcast"), {
    ...payload,
    timestamp: Date.now()
  });
}

/**
 * Broadcast location/scene information
 */
export function broadcastLocation(locationData) {
  return broadcast({
    location: {
      name: locationData.name || 'Unknown Location',
      description: locationData.description || '',
      imageUrl: locationData.imageUrl || '',
      tags: locationData.tags || []
    }
  });
}

/**
 * Broadcast NPC information
 */
export function broadcastNPC(npcData) {
  return broadcast({
    npc: {
      name: npcData.name || 'Unknown NPC',
      description: npcData.description || '',
      portraitUrl: npcData.portraitUrl || npcData.imageUrl || ''
    }
  });
}

/**
 * Broadcast music information
 */
export function broadcastMusic(musicData) {
  return broadcast({
    music: {
      name: musicData.name || 'Unknown Track',
      url: musicData.url || '',
      isPlaying: !!musicData.isPlaying,
      loop: !!musicData.loop,
      isLooping: !!musicData.isLooping
    }
  });
}

/**
 * Broadcast tags (status and story) to players
 * @param {Object} tagData - { status: [], story: [] }
 */

/**
 * FIXED: Broadcast tags using the `players[]` structure that Player App actually reads
 */
export function broadcastTags(tagData, targetPlayerName = null) {
  if (!tagData || (!tagData.status && !tagData.story)) {
    console.warn('No tags to broadcast');
    return Promise.resolve();
  }

  const playersPayload = [];

  if (targetPlayerName) {
    playersPayload.push({
      name: targetPlayerName,
      storyTags: tagData.story || [],
      currentStatuses: (tagData.status || []).map(status => {
        // Use your existing formatStatusForBroadcast if it exists
        if (typeof window.formatStatusForBroadcast === 'function') {
          return window.formatStatusForBroadcast(status);
        }
        const clean = status.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        const match = status.match(/\(?-(\d+)/);
        const mod = match ? match[1] : '2';
        return clean.includes(`-${mod}`) ? clean : `${clean}-${mod}`;
      })
    });
  } else {
    playersPayload.push({
      name: "ALL_PLAYERS",
      storyTags: tagData.story || [],
      currentStatuses: (tagData.status || []).map(status => {
        if (typeof window.formatStatusForBroadcast === 'function') return window.formatStatusForBroadcast(status);
        const clean = status.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        const match = status.match(/\(?-(\d+)/);
        const mod = match ? match[1] : '2';
        return clean.includes(`-${mod}`) ? clean : `${clean}-${mod}`;
      })
    });
  }

  const payload = {
    players: playersPayload,
    spotlightedPlayer: targetPlayerName || null,
    tagsOnly: true,
    timestamp: Date.now()
  };

  console.log('Broadcasting FIXED tags → players array:', payload);
  return broadcast(payload);
}

/**
 * Broadcast character spotlight
 */
export function broadcastSpotlight(characterName, characterData = {}) {
  return broadcast({
    spotlight: {
      characterName: characterName,
      portraitUrl: characterData.portraitUrl || '',
      themeColor: characterData.themeColor || '#4A7C7E'
    }
  });
}

/**
 * Broadcast complete scene (location + NPC + music + tags)
 * This is a convenience function for updating everything at once
 */
export function broadcastCompleteScene(sceneData) {
  const payload = {
    timestamp: Date.now()
  };
  
  if (sceneData.location) {
    payload.location = {
      name: sceneData.location.name || 'Unknown Location',
      description: sceneData.location.description || '',
      imageUrl: sceneData.location.imageUrl || '',
      tags: sceneData.location.tags || []
    };
  }
  
  if (sceneData.npc) {
    payload.npc = {
      name: sceneData.npc.name || 'Unknown NPC',
      description: sceneData.npc.description || '',
      portraitUrl: sceneData.npc.portraitUrl || ''
    };
  }
  
  if (sceneData.music) {
    payload.music = {
      name: sceneData.music.name || 'Unknown Track',
      url: sceneData.music.url || '',
      isPlaying: !!sceneData.music.isPlaying,
      loop: !!sceneData.music.loop
    };
  }
  
  if (sceneData.tags) {
    payload.tags = {
      status: sceneData.tags.status || [],
      story: sceneData.tags.story || []
    };
  }
  
  if (sceneData.spotlight) {
    payload.spotlight = {
      characterName: sceneData.spotlight.characterName || '',
      portraitUrl: sceneData.spotlight.portraitUrl || '',
      themeColor: sceneData.spotlight.themeColor || '#4A7C7E'
    };
  }
  
  console.log('📡 Broadcasting complete scene:', payload);
  
  return set(ref(db, "mcBroadcast"), payload);
}

// ================================
// LISTEN FROM PLAYERS
// ================================

/**
 * Listen for player character data
 */
export function listenToPlayers(callback) {
  const playersRef = ref(db, "playerCharacters");
  onValue(playersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      console.log('📥 Received player data:', Object.keys(data));
      callback(data);
    }
  });
}

/**
 * Listen for player dice rolls and prompt for MC moves
 */
export function listenToPlayerRolls(callback) {
  const rollsRef = ref(db, "playerRolls");
  
  onValue(rollsRef, (snapshot) => {
    const data = snapshot.val();
    
    if (!data) return;
    
    console.log('🎲 Player rolls received:', data);
    
    // Process each player's roll
    Object.entries(data).forEach(([userId, rollData]) => {
      if (!rollData || !rollData.result) return;
      
      const result = rollData.result.toLowerCase();
      const characterName = rollData.characterName || 
                            (await resolvePlayerNameFromUid(userId)) || 
                            'Unknown Player';
      const move = rollData.move || 'Unknown Move';
      const roll = rollData.roll || 0;
      
      // Determine move type based on result
      let movePrompt = '';
      
      if (result === 'miss' || result === 'failure') {
        movePrompt = `❌ MISS - ${characterName} rolled ${roll} on ${move}\n\n⚠️ MAKE A HARD MOVE:\n- Deal damage\n- Apply severe status\n- Create major complication\n- Take away something important`;
      } else if (result === 'partial' || result === 'partial success') {
        movePrompt = `⚠️ PARTIAL - ${characterName} rolled ${roll} on ${move}\n\n⚡ MAKE A SOFT MOVE:\n- Offer tough choice\n- Apply minor status\n- Complicate situation\n- Show approaching threat`;
      } else if (result === 'success' || result === 'full success') {
        movePrompt = `✅ SUCCESS - ${characterName} rolled ${roll} on ${move}\n\n💫 Player succeeds! Consider:\n- Grant story tag\n- Advance the scene\n- Reward creative play`;
      }
      
      // Display prompt in MC App
      displayMcMovePrompt(movePrompt, rollData);
      
      // Call callback if provided
      if (callback) {
        callback({
          userId,
          rollData,
          movePrompt
        });
      }
    });
  });
}

/**
 * Display MC move prompt in the app
 * This should show a notification or modal prompting the MC to make a move
 */
function displayMcMovePrompt(prompt, rollData) {
  console.log('📢 MC Move Prompt:', prompt);
  
  // Try to display in MC App UI
  const promptArea = document.getElementById('mcMovePrompt');
  if (promptArea) {
    promptArea.innerHTML = `
      <div class="mc-move-notification">
        <strong>🎲 Player Roll Detected!</strong>
        <pre>${prompt}</pre>
        <button onclick="this.parentElement.remove()" class="btn">Dismiss</button>
      </div>
    `;
    promptArea.style.display = 'block';
  }
  
  // Dispatch custom event for other handlers
  document.dispatchEvent(new CustomEvent('player-roll-detected', {
    detail: { prompt, rollData }
  }));
}

/**
 * Listen for player-created tags (tags created by players, not MC)
 */
export function listenToPlayerTags(callback) {
  const playersRef = ref(db, "playerCharacters");
  
  onValue(playersRef, (snapshot) => {
    const data = snapshot.val();
    
    if (!data) return;

    // Extract player-created tags from all players
    Object.entries(data).forEach(([userId, playerData]) => {
      // Only look at player-created tags (not MC-created)
      const playerCreatedStatuses = playerData.currentStatuses || [];
      const playerCreatedStory = playerData.storyTags || [];
      
      if (playerCreatedStatuses.length > 0 || playerCreatedStory.length > 0) {
        console.log('🏷️ Player tags from', playerData.name, {
          statuses: playerCreatedStatuses.length,
          story: playerCreatedStory.length
        });

        if (callback) {
          callback({
            userId,
            playerName: playerData.name,
            currentStatuses: playerCreatedStatuses,
            storyTags: playerCreatedStory
          });
        }
      }
    });
  });
}

// ================================
// TAG FORMAT UTILITIES
// ================================

/**
 * Create a status tag in the correct format: "text-text-number"
 * @param {string} displayText - The flavor text (e.g., "wounded badly")
 * @param {number} modifier - The negative modifier (will be made positive for format)
 * @returns {string} Formatted tag (e.g., "wounded-badly-2")
 */
export function createStatusTag(displayText, modifier) {
  if (!displayText) return '';

  // Convert spaces to hyphens
  const textPart = displayText.toLowerCase().replace(/\s+/g, '-');

  // Ensure modifier is a positive number in the tag (represents negative modifier in game)
  const modifierValue = Math.abs(parseInt(modifier) || 0);

  if (modifierValue > 0) {
    return `${textPart}-${modifierValue}`;
  }

  // No modifier - just return the text
  return textPart;
}

/**
 * Create a story tag (no modifier, just descriptive)
 * @param {string} displayText - The story tag text
 * @returns {string} Formatted tag with hyphens
 */
export function createStoryTag(displayText) {
  if (!displayText) return '';
  return displayText.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Parse a status tag back into text and modifier
 * @param {string} tag - Formatted tag (e.g., "wounded-badly-2")
 * @returns {Object} { text: "Wounded Badly", modifier: -2 }
 */
export function parseStatusTag(tag) {
  if (!tag) return { text: '', modifier: 0 };
  
  const parts = tag.split('-');
  const lastPart = parts[parts.length - 1];
  const modifier = parseInt(lastPart);
  
  if (!isNaN(modifier)) {
    // Has a modifier
    const textParts = parts.slice(0, -1);
    const text = textParts
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      text: text,
      modifier: -modifier // Negative in game mechanics
    };
  }
  
  // No modifier
  const text = parts
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    text: text,
    modifier: 0
  };
}

// ================================
// MAKE GLOBALLY AVAILABLE
// ================================

window.broadcast = broadcast;
window.broadcastLocation = broadcastLocation;
window.broadcastNPC = broadcastNPC;
window.broadcastMusic = broadcastMusic;
window.broadcastTags = broadcastTags;
window.broadcastSpotlight = broadcastSpotlight;
window.broadcastCompleteScene = broadcastCompleteScene;
window.listenToPlayers = listenToPlayers;
window.listenToPlayerRolls = listenToPlayerRolls;
window.listenToPlayerTags = listenToPlayerTags;
window.createStatusTag = createStatusTag;
window.createStoryTag = createStoryTag;
window.parseStatusTag = parseStatusTag;

/**
 * Helper: Resolve player name from UID (used for dice rolls)
 */
async function resolvePlayerNameFromUid(uid) {
  try {
    const { get } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js');
    const snap = await get(ref(db, `playerCharacters/${uid}/name`));
    return snap.val();
  } catch (e) {
    console.warn('Could not resolve player name for UID:', uid);
    return null;
  }
}

console.log('✅ mc-firebase-broadcast.js loaded');
console.log('   📡 MC broadcasts → mcBroadcast');
console.log('   📥 MC listens ← playerCharacters, playerRolls');
console.log('   🏷️ Tag format: "text-text-number" (number = negative modifier)');
console.log('   🎲 Player roll detection with MC move prompts active');
console.log('   🔄 Data structure: environment → location (Player App compatible)');