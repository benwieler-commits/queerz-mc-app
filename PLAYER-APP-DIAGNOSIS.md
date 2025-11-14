# Player App → MC App Connection Diagnosis

## Issue Summary
Player app appears unable to send character data to MC app for display.

## Investigation Results

### ✅ Firebase Paths - CORRECT
**Player App (benwieler-commits/queerz-player-app/firebase-broadcast.js)**
- Writes to: `playerCharacters/${userId}`
- Uses: `await set(playerRef, broadcastData)`
- The code is CORRECT and should work

**MC App (benwieler-commits/queerz-mc-app/firebase-broadcast.js)**
- Listens at: `playerCharacters`
- Uses: `onValue(playersRef, callback)`
- The code is CORRECT and should receive updates

### 🔍 What to Check

Since the Firebase paths match correctly, the issue is likely one of these:

1. **Authentication Issue**
   - Check if `window.currentUserId` is set in the player app
   - Look for console errors: "⚠️ Cannot broadcast: Not authenticated yet"
   - The player app requires Firebase auth to complete before broadcasting

2. **Function Not Being Called**
   - Check if `broadcastPlayerToMc()` is actually being invoked
   - Search for calls to this function in the player app
   - May need to wire it up to a button or auto-save event

3. **Database Connection**
   - Verify Firebase database is initialized in player app
   - Check for console error: "❌ Firebase database not initialized"
   - Look for network errors in browser DevTools

4. **Character Data Missing**
   - The function returns false if `!characterData`
   - Check if character data exists when broadcast is attempted

### 📊 Data Structure Being Sent

The player app broadcasts:
```javascript
{
  name: string,
  pronouns: string,
  portraitUrl: string,
  currentPortraitMode: 'civilian' | 'qfactor',
  themeColor: string,
  juice: number,
  themes: Array,
  currentStatuses: Array,
  storyTags: Array,
  lastBroadcast: timestamp,
  sessionId: userId,
  characterLocked: boolean
}
```

### 🔧 Debugging Steps

1. **In Player App**: Open browser console and look for:
   - `✅ firebase-config.js loaded`
   - `✅ Firebase authenticated: <userId>`
   - `📤 Broadcasting to MC (count): { name, pronouns, juice, themes }`

2. **In MC App**: Look for:
   - `✅ MC App ready to broadcast and receive player data`
   - `📥 Player character data received: [userId1, userId2, ...]`

3. **Firebase Console**: Check `playerCharacters/` node
   - Should see entries like `playerCharacters/<userId>/`
   - Each entry should have name, pronouns, juice, etc.

### ✅ Fixed Issues

1. **app-mc.js Campaign Loading**
   - Fixed malformed `campaignFiles` array (line 202)
   - Now properly loads both campaign files:
     - `campaign-chapter1-kaylin-vale.json`
     - `example-campaign.json`
   - Excludes `campaign-template.json` as requested

## Recommended Next Steps

1. Test player app in browser with DevTools console open
2. Check Firebase Realtime Database viewer for `playerCharacters/` data
3. If broadcast succeeds but MC doesn't receive, check Firebase security rules
4. If broadcast isn't happening, find where to call `broadcastPlayerToMc(characterData)`
