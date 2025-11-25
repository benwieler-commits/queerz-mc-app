// firebase-broadcast.js - MC App Broadcast & Listen
import { db } from "./firebase-config.js";
import { ref, set, onValue, goOnline } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

try {
  goOnline(db);
  console.log('✅ Firebase connected successfully');

  // Only update badge if it exists
  const badge = document.getElementById("connBadge");
  if (badge) {
    badge.textContent = "● Live Sync";
    badge.classList.remove("offline");
    badge.classList.add("online");
  }
} catch (e) {
  console.warn("⚠️ Firebase connection issue:", e);
}

// Broadcast FROM MC TO Players
export function broadcast(payload) {
  console.log('📡 Broadcasting to players:', payload);
  return set(ref(db, "mcBroadcast"), payload);
}

// Listen for data FROM Players TO MC
export function listenToPlayers(callback) {
  const playersRef = ref(db, "playerCharacters");
  onValue(playersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      console.log('📥 Received player data:', data);
      callback(data);
    }
  });
}

// Listen for player dice rolls
export function listenToPlayerRolls(callback) {
  const rollsRef = ref(db, "playerRolls");
  onValue(rollsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      console.log('🎲 Received player rolls:', data);
      callback(data);
    }
  });
}

// Listen for player-created tags (separate from MC-created tags)
export function listenToPlayerTags(callback) {
  const playersRef = ref(db, "playerCharacters");
  onValue(playersRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {

      // Extract player-created tags from all players
      Object.entries(data).forEach(([userId, playerData]) => {
        if (playerData.currentStatuses || playerData.storyTags) {
          console.log('🏷️ Player tags from', playerData.name, {
            statuses: playerData.currentStatuses?.length || 0,
            story: playerData.storyTags?.length || 0
          });

          callback({
            userId,
            playerName: playerData.name,
            currentStatuses: playerData.currentStatuses || [],
            storyTags: playerData.storyTags || []
          });
        }
      });
    }
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

// Make available globally for app.js
window.listenToPlayerRolls = listenToPlayerRolls;
window.listenToPlayerTags = listenToPlayerTags;
window.createStatusTag = createStatusTag;
window.createStoryTag = createStoryTag;

console.log('✅ firebase-broadcast.js loaded');
console.log('   📡 MC broadcasts → mcBroadcast');
console.log('   📥 MC listens ← playerCharacters, playerRolls');
console.log('   🏷️ Tag format: "text-text-number" (number = negative modifier)');
