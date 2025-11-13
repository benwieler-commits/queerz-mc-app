# QUEERZ! MC Companion App - Complete Guide

## Overview

The QUEERZ! MC Companion App is a comprehensive Master of Ceremonies tool designed for running QUEERZ! tabletop RPG sessions. Built with a beautiful teal/coral dark theme inspired by the player app, it provides everything you need to run engaging, organized sessions.

## Features

### 🎬 Broadcast System
- **Live Broadcasting** to companion Player App
- Broadcast Environment images to set the scene
- Show NPC Profile Pictures to players
- Play synchronized Music across all devices
- Real-time player synchronization via Firebase

### 🏷️ Tag Management System
- **Story Tags**: Track narrative developments (beneficial, harmful, investigation, emotional)
- **Status Tags**: Manage character conditions and modifiers
- **Player-Specific Tags**: Assign and remove tags for individual players
- **Pre-defined Tag Library**: Quick access to common tags
- **Custom Tags**: Create free-form tags as needed

### ✅ Campaign Progress Tracking
- **Checkpoint System**: Track major story milestones
- **Checkbox Outcomes**: Mark completed story beats
- **Automatic Chapter Loading**: Checkboxes can trigger next chapter
- **Visual Progress**: See campaign advancement at a glance

### ⚔️ Combat Encounter Counters
- **Ignorance Limit Counter**: Track villain corruption levels
- **Adjustable Maximum**: Set custom limits per encounter
- **Inner Space Counters** (Justice Knight encounters):
  - **Acceptance Counter**: Track redemption progress
  - **Rejection Counter**: Track descent into darkness
- **Quick Controls**: Increment, decrement, and reset

### 🎵 Advanced Music Player
- **Playlist Assembly**: Build custom playlists for your session
- **Playlist Looping**: Auto-play through entire playlist
- **Individual Track Looping**: Repeat atmospheric tracks
- **Organized Library**: Locations, Boss Battles, Emotional Themes, Hero Time
- **Broadcast Integration**: Share music with players

### 🎲 Dice Roller
- **2d6 + Modifier**: Standard QUEERZ! roll mechanics
- **Visual Display**: See individual dice and total
- **Result Interpretation**: Automatic success/partial/miss calculation
- **Quick Modifier Entry**: -5 to +5 range

### 📖 Campaign Script System
- **Full Script Display**: Complete campaign content
- **Searchable**: Find specific content quickly
- **Tabbed Organization**: Overview, Scenes, Inner Space, Aftermath, Scaling
- **Adjustable Scene Count**: Customize chapter structure
- **MC Guidance**: Soft Moves and Hard Moves reference

### 💾 Session Management
- **Save Sessions**: Preserve your game state
- **Load Sessions**: Return to previous games
- **Multiple Sessions**: Run different campaigns
- **Export Progress**: Save campaign data as JSON

### 📤 JSON Export System
- **Campaign Progress Export**: Save complete session state
- **Sideloaded Campaigns**: Load campaigns from JSON files
- **Template Files**: Easy campaign creation
- **Repository Storage**: Keep campaigns organized

## File Structure

```
queerz-mc-app/
├── index-mc.html           # New redesigned HTML interface
├── styles-mc.css           # New teal/coral dark theme CSS
├── app-mc.js              # Main application logic
├── firebase-config.js      # Firebase configuration
├── firebase-broadcast.js   # Broadcasting functionality
├── campaign-manager-mc.js  # Campaign management
├── campaigns/
│   ├── campaign-template.json    # Template for creating campaigns
│   └── example-campaign.json     # Fully-featured example campaign
├── images/
│   ├── locations/         # Environment images
│   ├── characters/        # NPC profile pictures
│   └── icons/             # UI icons
└── music/
    ├── locations/         # Location themes
    ├── boss-battles/      # Combat music
    ├── emotional-themes/  # Inner Space themes
    └── hero-time/         # Triumphant moments
```

## Getting Started

### 1. Open the App
- Open `index-mc.html` in a modern web browser
- Recommended: Chrome, Firefox, or Edge

### 2. Load a Campaign
- Click the **Campaign dropdown** in the header
- Select a campaign (or load from JSON file)
- Choose Arc and Chapter

### 3. Add Players
- Click **+ Add Player** in the Spotlight bar
- Enter player names
- Players appear in the spotlight

### 4. Broadcast to Players
- Select Environment from dropdown
- Select NPC to show
- Choose Music track
- Click **📡 Broadcast All** to send to player devices

### 5. Manage Tags
- Click on a player in spotlight to select them
- Use **+ Add Story Tag** or **+ Add Status Tag**
- Choose from presets or create custom tags
- Tags appear as color-coded badges

### 6. Track Combat
- Use **Ignorance Limit** counter for villain encounters
- Increment/decrement as players deal damage
- For Justice Knight encounters, enable **Inner Space Counters**
- Track **Acceptance** and **Rejection** during emotional confrontations

### 7. Mark Progress
- Click **+ Add Checkpoint** to create story milestones
- Check boxes as story beats complete
- Optional: Set checkpoint to trigger next chapter

### 8. Save Your Session
- Click **💾 Sessions** in header
- Choose **Save Session** or **Save As New**
- Resume later by loading saved session

## Creating Custom Campaigns

### Using the Template

1. Copy `campaigns/campaign-template.json`
2. Fill in your campaign details:
   - Metadata (id, name, description)
   - Chapters with scenes
   - NPCs with stats and images
   - Locations with atmosphere
   - Music tracks
   - Story and status tags
3. Save to `campaigns/` folder
4. Refresh app to load

### Campaign Structure

**Chapters** contain:
- Overview
- Scenes (adjustable number)
- Inner Space encounter
- Aftermath & Consequences
- Scaling & Pacing guidance
- Combat encounters with counters

**Each Scene** includes:
- Scene name and number
- Location reference
- Music suggestions
- Full content/script
- NPC appearances
- Available story tags

**Inner Space** provides:
- Core emotional wounds
- Approaches (Talk It Out, Care, Slay)
- Acceptance/Rejection tracking
- Resolution paths

**Aftermath** defines:
- Possible outcomes (best, partial, worst)
- Consequences for each
- Impact on future chapters

### JSON Template Fields

See `campaigns/campaign-template.json` for complete structure with field descriptions.

## Broadcasting to Player App

### Firebase Setup
The app uses Firebase Realtime Database for live broadcasting:

- **Environment**: Player screens show current location
- **NPC**: Large portrait of current NPC appears
- **Music**: Audio plays on player devices
- **Tags**: Player character sheets update with new tags

### Broadcast Payload
```javascript
{
  environment: { name, imageUrl },
  npc: { name, imageUrl },
  music: { name, url, isLooping, playlist },
  players: [{ name, tags }],
  counters: { ignorance, acceptance, rejection },
  timestamp
}
```

## Tag System

### Story Tags
**Beneficial**: Advantage, Protected, Inspired, etc.
**Harmful**: Exposed, Vulnerable, Shaken, etc.
**Investigation**: Clue Found, Evidence Gathered, etc.
**Emotional**: Hopeful, Determined, Angry, etc.

### Status Tags
**Beneficial**: +1 Forward, +1 Ongoing, Armored, etc.
**Harmful**: Shaken, Conforming, Wounded, etc.

### Tag Application
1. Select player from spotlight
2. Click **+ Add Tag**
3. Choose from categories or create custom
4. Tag appears as colored badge
5. Remove by clicking ×

## Counter Mechanics

### Ignorance Limit
- Set maximum per encounter (typically 5-7)
- Decrement when players succeed on moves
- Reaches 0 = Villain defeated/vulnerable
- Reset between encounters

### Inner Space Counters (Justice Knights)
**Acceptance**:
- Increases when players show understanding
- Represents path to redemption
- High acceptance = best outcome possible

**Rejection**:
- Increases when villain feels attacked/dismissed
- Represents doubling down on Ignorance
- High rejection = worst outcome likely

**Resolution**:
- Compare counters at encounter end
- Higher Acceptance = redemption path
- Higher Rejection = conflict escalates

## Checkpoint System

### Creating Checkpoints
1. Click **+ Add Checkpoint**
2. Enter description: "Players discovered Moretti's"
3. Optional: Set chapter to load when checked
4. Checkpoint appears in progress panel

### Using Checkpoints
- Check box when milestone reached
- Unchecked = still to accomplish
- Checked = completed
- Auto-loads next chapter if configured

### Checkpoint Best Practices
- Mark investigation discoveries
- Note key NPC interactions
- Track Inner Space progress
- Highlight player choices

## Music Player Features

### Building Playlists
1. Select track from dropdown
2. Click **➕ Playlist**
3. Track added to playlist
4. Repeat for additional tracks

### Playing Playlists
- Click track in playlist to play
- Auto-advances when track ends
- Loops entire playlist when complete
- Remove tracks with 🗑️ button

### Track Categories
- **Locations**: Ambient scene-setters
- **Boss Battles**: High-energy combat
- **Emotional Themes**: Inner Space moments
- **Hero Time**: Triumphant victories

## Session Management

### Saving Sessions
**Save Session**: Overwrites current session
**Save As New**: Creates new saved session

**What's Saved**:
- All players and their tags
- Campaign progress checkpoints
- Counter states
- Session name

### Loading Sessions
1. Click **💾 Sessions**
2. View saved sessions list
3. Click **📂 Load** on desired session
4. Session state restored

## Keyboard Shortcuts

- **S**: Toggle Script Panel
- **M**: Toggle MC Moves Panel

## Troubleshooting

### Broadcasts Not Working
- Check Firebase connection in console
- Verify player app is connected to same Firebase project
- Ensure database rules allow read/write

### Campaign Won't Load
- Verify JSON syntax is valid
- Check file path in campaigns folder
- Look for console errors

### Tags Not Appearing
- Select a player from spotlight first
- Refresh page if tags disappear
- Check localStorage isn't full

### Counters Resetting
- Use save session to preserve state
- Don't reload page without saving
- Export progress as backup

## Design System

### Colors
- **Primary**: Teal (#4A7C7E, #2D5456)
- **Accent**: Coral (#E89B9B)
- **Backgrounds**: Dark (#1a1a1a, #2a2a2a)
- **Highlights**: Gold (#F4D35E), Cream (#F5EFE6)
- **UI States**: Purple (#A78BFA), Cyan (#67E8F9), Green (#4ADE80)

### Layout
- 3-column responsive grid
- 15px border radius on cards
- 20px padding and gaps
- Glass-morphism effects with backdrop blur

## Advanced Features

### Custom Campaign Integration
- Place JSON in `campaigns/` folder
- Reference images with full URLs
- Link music files from repository
- Use template structure

### Firebase Customization
- Modify `firebase-config.js` for your project
- Adjust broadcast payload in `app-mc.js`
- Customize realtime listeners

### Extending Functionality
- Add custom tag categories in `TAG_DATABASE`
- Create new counter types
- Expand checkpoint trigger options
- Add custom broadcast fields

## Tips for MCs

1. **Prepare Checkpoints**: Create major story beats before session
2. **Tag Generously**: Give players tags for good roleplay
3. **Use Counters Visually**: Show players the countdown
4. **Build Playlists Early**: Smooth music transitions
5. **Save Frequently**: Don't lose progress
6. **Export Sessions**: Backup campaign state
7. **Broadcast Often**: Keep players immersed
8. **Reference Moves**: Use MC Moves panel for inspiration

## Support

For issues or questions:
- Check browser console for errors
- Verify all file paths are correct
- Ensure Firebase is configured
- Review JSON syntax in campaigns

## Version

**MC App Redesign v2.0**
- Complete UI overhaul with player app design system
- Enhanced broadcasting system
- Advanced tag management
- Campaign checkpoint system
- Combat encounter counters
- Playlist functionality
- JSON import/export
- Session management

---

**Made for QUEERZ! - A Powered by the Apocalypse game about queer heroes fighting Ignorance**
