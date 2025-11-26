// ================================
// FIREBASE BROADCAST - MC APP
// COMPLETE REWRITE - Proper Tag Formatting
// Story Tags: example-tag (no modifier, always ongoing)
// Status Tags: example-tag-1 through example-tag-6 (negative modifier, always ongoing)
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
// TAG FORMAT UTILITIES
// ================================

/**
 * Format a STATUS tag for broadcast
 * INPUT: Any format like "Shaken (-1 Ongoing)", "Wounded", "guilty-2", "Trapped (3)"
 * OUTPUT: "shaken-1", "wounded-2", "guilty-2", "trapped-3" (format: kebab-case-number)
 * 
 * STATUS TAGS are ALWAYS:
 * - Ongoing (until removed by MC)
 * - Negative modifier (applied as penalty to Power)
 * - Range 1-6 for the numerical suffix
 * 
 * @param {string} status - The status text in any format
 * @returns {string} Formatted tag like "example-status-2"
 */
export function formatStatusTag(status) {
  if (!status || typeof status !== 'string') return '';
  
  // Normalize: trim and convert to lowercase for pattern matching
  const normalized = status.trim().toLowerCase();
  
  // Already in correct format? (ends with -1 through -6, all lowercase)
  if (/^[a-z0-9-]+-[1-6]$/.test(normalized)) {
    return normalized;
  }
  
  // ================================
  // STEP 1: Extract the modifier number FIRST (before cleaning the name)
  // This ensures we capture the modifier before any text manipulation
  // ================================
  let modifier = null; // Start with null, we'll default to 2 only if nothing found
  
  // Priority order for finding modifier:
  // 1. Explicit format: "tag-1" at end
  // 2. Parenthetical: "(-1)" or "(1)" or "(-1 Ongoing)"
  // 3. Tier notation: "Tier 1" or "tier 1"
  // 4. Space + number at end: "tag 1"
  
  // Check for -1 through -6 at end of string (highest priority)
  const endNumberMatch = status.match(/-([1-6])(?:\s|$)/);
  if (endNumberMatch) {
    modifier = parseInt(endNumberMatch[1]);
  }
  
  // Check for parenthetical modifier: (-1), (1), (-2 Ongoing), etc.
  if (modifier === null) {
    const parenMatch = status.match(/\(\s*-?\s*([1-6])\s*(?:ongoing|to|penalty)?\s*\)/i);
    if (parenMatch) {
      modifier = parseInt(parenMatch[1]);
    }
  }
  
  // Check for "Tier X" notation
  if (modifier === null) {
    const tierMatch = status.match(/tier\s*([1-6])/i);
    if (tierMatch) {
      modifier = parseInt(tierMatch[1]);
    }
  }
  
  // Check for just a number at the end after space
  if (modifier === null) {
    const spaceNumMatch = status.match(/\s([1-6])$/);
    if (spaceNumMatch) {
      modifier = parseInt(spaceNumMatch[1]);
    }
  }
  
  // Default to 2 if no modifier found
  if (modifier === null) {
    modifier = 2;
    console.log(`ℹ️ No modifier found in "${status}", defaulting to -2`);
  }
  
  // ================================
  // STEP 2: Extract the base name (remove modifiers, parentheticals, etc.)
  // ================================
  let baseName = status
    .replace(/\s*\([^)]*\)/g, '')     // Remove anything in parentheses
    .replace(/\s*tier\s*\d+/gi, '')   // Remove "Tier X"
    .replace(/-[1-6](?:\s|$)/g, '')   // Remove -1 through -6 at word boundary
    .replace(/\s+[1-6]$/g, '')        // Remove trailing space + number
    .trim();
  
  // If baseName is empty after cleaning, use the original (minus parentheses)
  if (!baseName) {
    baseName = status.replace(/\s*\([^)]*\)/g, '').trim();
  }
  
  // ================================
  // STEP 3: Convert to kebab-case
  // ================================
  const kebabCase = baseName
    .toLowerCase()
    .replace(/[''`]/g, '')          // Remove apostrophes and backticks
    .replace(/\s+/g, '-')           // Spaces to hyphens
    .replace(/[^a-z0-9-]/g, '')     // Remove special characters
    .replace(/-+/g, '-')            // Collapse multiple hyphens
    .replace(/^-|-$/g, '');         // Remove leading/trailing hyphens
  
  // Return formatted tag: "kebab-case-number"
  const result = `${kebabCase}-${modifier}`;
  console.log(`📌 Formatted status: "${status}" → "${result}"`);
  return result;
}

/**
 * Format a STORY tag for broadcast
 * INPUT: Any format like "Mama Jay's Blessing", "investigating the crime", "CLUE-REMINDER"
 * OUTPUT: "mama-jays-blessing", "investigating-the-crime", "clue-reminder"
 * 
 * STORY TAGS are ALWAYS:
 * - Ongoing (until removed by MC)
 * - NO modifier (used as clue reminders, not power bonuses)
 * 
 * @param {string} tag - The story tag text
 * @returns {string} Formatted tag like "example-story-tag"
 */
export function formatStoryTag(tag) {
  if (!tag || typeof tag !== 'string') return '';
  
  // Already in correct format? (all lowercase with hyphens, no numbers at end)
  if (/^[a-z][a-z0-9-]*[a-z0-9]$/.test(tag) && !/\d$/.test(tag)) {
    return tag;
  }
  
  // Convert to kebab-case
  return tag
    .toLowerCase()
    .replace(/['']/g, 's')          // Handle possessives (Jay's → jays)
    .replace(/\s+/g, '-')           // Spaces to hyphens
    .replace(/[^a-z0-9-]/g, '')     // Remove special characters
    .replace(/-+/g, '-')            // Collapse multiple hyphens
    .replace(/^-|-$/g, '')          // Remove leading/trailing hyphens
    .replace(/-\d+$/, '');          // Remove trailing numbers (story tags don't have modifiers)
}

/**
 * Parse a STATUS tag back to display format
 * INPUT: "shaken-2"
 * OUTPUT: { name: "Shaken", tier: 2, modifier: -2 }
 * 
 * @param {string} tag - Formatted status tag
 * @returns {Object} { name, tier, modifier }
 */
export function parseStatusTag(tag) {
  if (!tag) return { name: '', tier: 0, modifier: 0 };
  
  const match = tag.match(/^(.+)-([1-6])$/);
  
  if (match) {
    const [, namePart, tierStr] = match;
    const tier = parseInt(tierStr);
    
    // Convert kebab-case to Title Case
    const displayName = namePart
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      name: displayName,
      tier: tier,
      modifier: -tier // Status tags are always negative
    };
  }
  
  // Fallback for malformed tags
  return { name: tag, tier: 2, modifier: -2 };
}

/**
 * Parse a STORY tag back to display format
 * INPUT: "investigating-the-crime"
 * OUTPUT: { name: "Investigating The Crime" }
 * 
 * @param {string} tag - Formatted story tag
 * @returns {Object} { name }
 */
export function parseStoryTag(tag) {
  if (!tag) return { name: '' };
  
  // Convert kebab-case to Title Case
  const displayName = tag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return { name: displayName };
}

// Make format functions globally available for MC App
window.formatStatusTag = formatStatusTag;
window.formatStoryTag = formatStoryTag;
window.parseStatusTag = parseStatusTag;
window.parseStoryTag = parseStoryTag;

// Legacy alias for compatibility
window.formatStatusForBroadcast = formatStatusTag;

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
    delete payload.environment;
  }
  
  console.log('📡 Broadcasting to players:', payload);
  
  return set(ref(db, "mcBroadcast"), {
    ...payload,
    timestamp: Date.now()
  });
}

/**
 * Broadcast location/scene information
 * NOTE: Changing location STOPS music unless new music is provided
 */
export function broadcastLocation(locationData) {
  return broadcast({
    location: {
      name: locationData.name || 'Unknown Location',
      description: locationData.description || '',
      imageUrl: locationData.imageUrl || '',
      tags: locationData.tags || []
    }
    // No music = music stops on location change
  });
}

/**
 * Broadcast NPC information (does NOT affect music)
 */
export function broadcastNPC(npcData) {
  const payload = {
    npc: {
      name: npcData.name || 'Unknown NPC',
      description: npcData.description || '',
      portraitUrl: npcData.portraitUrl || npcData.imageUrl || ''
    },
    tagsOnly: true  // Prevents music reset
  };
  
  return broadcast(payload);
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
 * Uses the `players[]` array structure that Player App expects
 * 
 * STATUS TAGS: format "example-tag-1" through "example-tag-6" (negative modifier, ongoing)
 * STORY TAGS: format "example-tag" (no modifier, ongoing, used as clue reminders)
 * 
 * @param {Object} tagData - { status: [], story: [] }
 * @param {string|null} targetPlayerName - Specific player or null for all
 */
export function broadcastTags(tagData, targetPlayerName = null) {
  if (!tagData || (!tagData.status && !tagData.story)) {
    console.warn('⚠️ No tags to broadcast');
    return Promise.resolve();
  }
  
  // Format status tags to "example-tag-1" format
  const formattedStatuses = (tagData.status || []).map(status => {
    return formatStatusTag(status);
  }).filter(tag => tag); // Remove empty
  
  // Format story tags to "example-tag" format
  const formattedStoryTags = (tagData.story || []).map(tag => {
    return formatStoryTag(tag);
  }).filter(tag => tag); // Remove empty
  
  const playersPayload = [];
  
  if (targetPlayerName) {
    // Send to specific player
    playersPayload.push({
      name: targetPlayerName,
      storyTags: formattedStoryTags,
      currentStatuses: formattedStatuses
    });
  } else {
    // Send to all players
    playersPayload.push({
      name: "ALL_PLAYERS",
      storyTags: formattedStoryTags,
      currentStatuses: formattedStatuses
    });
  }
  
  const payload = {
    players: playersPayload,
    spotlightedPlayer: targetPlayerName || null,
    tagsOnly: true,  // Prevents music/location reset
    timestamp: Date.now()
  };
  
  console.log('🏷️ Broadcasting tags:', payload);
  console.log('   Status tags formatted:', formattedStatuses);
  console.log('   Story tags formatted:', formattedStoryTags);
  
  return broadcast(payload);
}

/**
 * Broadcast character spotlight (does NOT affect music)
 */
export function broadcastSpotlight(characterName, characterData = {}) {
  const payload = {
    spotlight: {
      characterName: characterName,
      portraitUrl: characterData.portraitUrl || '',
      themeColor: characterData.themeColor || '#4A7C7E'
    },
    spotlightedPlayer: characterName,
    tagsOnly: true  // Prevents music reset
  };
  
  return broadcast(payload);
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
    // Format tags properly before broadcasting
    const formattedPlayers = [];
    
    if (sceneData.spotlight?.characterName) {
      formattedPlayers.push({
        name: sceneData.spotlight.characterName,
        storyTags: (sceneData.tags.story || []).map(formatStoryTag),
        currentStatuses: (sceneData.tags.status || []).map(formatStatusTag)
      });
    } else {
      formattedPlayers.push({
        name: "ALL_PLAYERS",
        storyTags: (sceneData.tags.story || []).map(formatStoryTag),
        currentStatuses: (sceneData.tags.status || []).map(formatStatusTag)
      });
    }
    
    payload.players = formattedPlayers;
  }
  
  if (sceneData.spotlight) {
    payload.spotlight = {
      characterName: sceneData.spotlight.characterName || '',
      portraitUrl: sceneData.spotlight.portraitUrl || '',
      themeColor: sceneData.spotlight.themeColor || '#4A7C7E'
    };
    payload.spotlightedPlayer = sceneData.spotlight.characterName;
  }
  
  console.log('📡 Broadcasting complete scene:', payload);
  
  return set(ref(db, "mcBroadcast"), payload);
}

// ================================
// LISTEN FROM PLAYERS
// ================================

/**
 * Listen for player character data
 * Also checks for lastRoll data as a backup for dice roll detection
 */
export function listenToPlayers(callback) {
  const playersRef = ref(db, "playerCharacters");
  
  // Track last seen roll timestamps to avoid duplicate notifications
  const lastSeenRolls = {};
  
  onValue(playersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      console.log('📥 Received player data:', Object.keys(data));
      
      // Check each player for new rolls (backup detection)
      Object.entries(data).forEach(([sessionId, playerData]) => {
        if (playerData.lastRoll && playerData.lastRoll.timestamp) {
          const rollTimestamp = playerData.lastRoll.timestamp;
          const playerName = playerData.name || 'Unknown';
          
          // Check if this is a new roll we haven't seen
          if (!lastSeenRolls[sessionId] || lastSeenRolls[sessionId] < rollTimestamp) {
            lastSeenRolls[sessionId] = rollTimestamp;
            
            // Create roll data object matching MC App's expected format
            const rollData = {
              move: playerData.lastRoll.move,
              moveId: playerData.lastRoll.move,
              moveName: playerData.lastRoll.moveName || playerData.lastRoll.move || 'Unknown Move',
              dice: playerData.lastRoll.dice || [0, 0],
              power: playerData.lastRoll.power || 0,
              total: playerData.lastRoll.total || 0,
              result: playerData.lastRoll.result,
              resultType: playerData.lastRoll.result,
              resultText: playerData.lastRoll.resultText,
              timestamp: rollTimestamp,
              burntTagUsed: playerData.lastRoll.burntTagUsed || false,
              guaranteedHit: playerData.lastRoll.guaranteedHit || false
            };
            
            console.log('🎲 NEW ROLL detected from playerCharacters:', {
              player: playerName,
              move: rollData.moveName,
              total: rollData.total,
              result: rollData.result
            });
            
            // ================================
            // CALL MC APP'S NOTIFICATION SYSTEM
            // ================================
            // The MC App's showRollNotification() function already has:
            // - Beautiful notification styling
            // - CORE_MOVES_REFERENCE integration
            // - Move-specific Hard/Soft/Success prompts
            // - Auto-dismiss after 15 seconds
            
            if (typeof window.showRollNotification === 'function') {
              console.log('✅ Calling MC App showRollNotification()');
              window.showRollNotification(playerName, rollData);
            } else {
              console.log('⚠️ showRollNotification not found, dispatching event instead');
              // Dispatch event as fallback
              document.dispatchEvent(new CustomEvent('player-roll-detected', {
                detail: { playerName, rollData }
              }));
            }
            
            // Also update recentRolls if available (for dice rolls panel)
            if (typeof window.recentRolls !== 'undefined' && Array.isArray(window.recentRolls)) {
              window.recentRolls.unshift({
                playerName: playerName,
                ...rollData
              });
              if (window.recentRolls.length > 10) {
                window.recentRolls = window.recentRolls.slice(0, 10);
              }
              // Update the dice rolls panel if function exists
              if (typeof window.renderDiceRolls === 'function') {
                window.renderDiceRolls();
              }
            }
          }
        }
      });
      
      callback(data);
    }
  });
}

/**
 * Listen for player dice rolls and provide MC move prompts
 * 
 * Roll Results:
 * - 6 or less: MISS → MC makes HARD MOVE
 * - 7-9: PARTIAL SUCCESS → MC makes SOFT MOVE
 * - 10+: SUCCESS → Player gets what they want
 */
export function listenToPlayerRolls(callback) {
  const rollsRef = ref(db, "playerRolls");
  
  onValue(rollsRef, (snapshot) => {
    const data = snapshot.val();
    
    if (!data) return;
    
    console.log('🎲 Player rolls received:', data);
    
    // Process each player's roll
    Object.entries(data).forEach(([sessionId, rollData]) => {
      if (!rollData) return;
      
      // Handle both result formats
      const result = (rollData.result || rollData.resultType || '').toLowerCase();
      const total = rollData.roll || rollData.total || 0;
      const characterName = rollData.characterName || 'Unknown Player';
      const move = rollData.move || rollData.moveName || 'Unknown Move';
      
      // Determine move type based on result AND total
      let moveType = '';
      let movePrompt = '';
      
      // Check for miss/failure (6 or less)
      if (result.includes('miss') || result.includes('fail') || total <= 6) {
        moveType = 'hard';
        movePrompt = `❌ MISS - ${characterName} rolled ${total} on ${move}\n\n⚠️ MAKE A HARD MOVE:\n- Deal damage or apply severe status (tier 2-3)\n- Create major complication\n- Take away something important\n- Separate the players\n- Turn their move back on them`;
      } 
      // Check for partial success (7-9)
      else if (result.includes('partial') || (total >= 7 && total <= 9)) {
        moveType = 'soft';
        movePrompt = `⚡ PARTIAL SUCCESS - ${characterName} rolled ${total} on ${move}\n\n💡 MAKE A SOFT MOVE:\n- Offer tough choice\n- Apply minor status (tier 1)\n- Complicate situation\n- Show approaching threat\n- Tell the cost and ask`;
      } 
      // Success (10+)
      else {
        moveType = 'success';
        movePrompt = `✅ SUCCESS! - ${characterName} rolled ${total} on ${move}\n\n🌟 Player succeeds! Consider:\n- Grant story tag (clue reminder)\n- Advance the scene\n- Reward creative play\n- Move the narrative forward`;
      }
      
      // Display prompt in MC App
      displayMcMovePrompt(movePrompt, rollData, moveType);
      
      // Call callback if provided
      if (callback) {
        callback({
          sessionId,
          rollData: {
            ...rollData,
            characterName,
            move,
            total,
            moveType,
            movePrompt
          }
        });
      }
    });
  });
}

/**
 * Display MC move prompt in the app
 */
function displayMcMovePrompt(prompt, rollData, moveType) {
  console.log('📢 MC Move Prompt:', prompt);
  
  // Determine styling based on move type
  let bgColor, borderColor;
  switch (moveType) {
    case 'hard':
      bgColor = 'rgba(255, 107, 107, 0.2)';
      borderColor = '#ff6b6b';
      break;
    case 'soft':
      bgColor = 'rgba(244, 211, 94, 0.2)';
      borderColor = '#F4D35E';
      break;
    default:
      bgColor = 'rgba(74, 222, 128, 0.2)';
      borderColor = '#4ADE80';
  }
  
  // Try to display in MC App UI
  const promptArea = document.getElementById('mcMovePrompt');
  if (promptArea) {
    promptArea.innerHTML = `
      <div class="mc-move-notification" style="background: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 8px; padding: 15px; margin: 10px 0;">
        <strong>🎲 Player Roll Detected!</strong>
        <pre style="white-space: pre-wrap; margin: 10px 0;">${prompt}</pre>
        <button onclick="this.parentElement.remove()" class="btn" style="margin-top: 10px;">Dismiss</button>
      </div>
    `;
    promptArea.style.display = 'block';
  }
  
  // Dispatch custom event for other handlers
  document.dispatchEvent(new CustomEvent('player-roll-detected', {
    detail: { prompt, rollData, moveType }
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

console.log('✅ mc-firebase-broadcast.js loaded (REWRITTEN)');
console.log('   📡 MC broadcasts → mcBroadcast');
console.log('   📥 MC listens ← playerCharacters, playerRolls');
console.log('   🏷️ STATUS TAGS: "example-tag-1" through "example-tag-6"');
console.log('   📖 STORY TAGS: "example-tag" (no modifier)');
console.log('   🎵 Music only stops on LOCATION change');
console.log('   🎲 Roll detection: playerRolls (primary) + playerCharacters.lastRoll (backup)');
console.log('   ⚡ Move prompts: 6- = Hard Move, 7-9 = Soft Move, 10+ = Success');
