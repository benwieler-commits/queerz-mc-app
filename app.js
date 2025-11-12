// ===================================
// QUEERZ! MC COMPANION APP - JAVASCRIPT
// COMPLETE VERSION WITH SESSION MANAGEMENT
// ===================================

// === IMPORT CAMPAIGN MANAGER FUNCTIONS ===
import {
    createCampaign,
    addScene,
    setCurrentScene,
    addChapter,
    setCurrentChapter,
    progressToNextChapter,
    createBranchPoint,
    resolveBranchPoint,
    startSession,
    endSession,
    addPlayerToCampaign,
    removePlayerFromCampaign,
    loadCampaign,
    updateCampaignMetadata,
    deleteCampaign,
    updateScene,
    deleteScene,
    getMyCampaigns,
    listenToCampaign,
    listenToPlayers
} from './campaign-manager-mc.js';

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
    sessionId: null, // Firebase session ID for player app sync
    players: [],
    campaign: {
        id: 'queerz-chapter1', // Current campaign ID
        chapter: 1,
        outcomes: {}
    },
    playerTags: {} // Store tags for each player
};

let savedSessions = [];

// Campaign Management
let currentCampaignId = 'queerz-chapter1';
let availableCampaigns = {}; // Will be populated with campaign data
let firebaseCampaigns = {}; // Firebase campaigns from campaign-manager-mc.js
let activeFirebaseCampaign = null; // Currently loaded Firebase campaign data

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
const campaignSelect = document.getElementById('campaignSelect');
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

// === CAMPAIGNS DATABASE ===
const campaignsDatabase = {
    'queerz-chapter1': {
        id: 'queerz-chapter1',
        name: 'QUEERZ! - Chapter 1: The Jester\'s Last Laugh',
        description: 'A washed-up comedian spreads hate through nostalgia. Can the team save him from himself?',
        chapters: [
            {number: 1, name: 'The Jester\'s Last Laugh', available: true}
        ],
        scriptData: {
            chapter1: {
                title: "Chapter 1: The Jester's Last Laugh",
                tabs: {
                    overview: {
                        title: "Overview",
                        content: `
                            <h2>🎭 Chapter Overview</h2>
                            <p>The Queerz investigate harassment in NYC's Theater District, discovering a washed-up comedian named Danny "The Jester" Carbone who leads the Tough Crowd - a gang of bitter performers targeting LGBTQ+ venues.</p>

                            <h3>🎯 Key Themes</h3>
                            <ul>
                                <li><strong>Nostalgia as Ignorance:</strong> Danny weaponizes "the good old days" to justify exclusion</li>
                                <li><strong>Comedy vs Cruelty:</strong> Exploring where humor ends and harm begins</li>
                                <li><strong>Redemption:</strong> Can someone trapped in bitterness find their way back?</li>
                            </ul>

                            <h3>📊 Story Tag Categories</h3>
                            <div class="tag-categories">
                                <div class="tag-category">
                                    <h4>Investigation Phase (Scene 2)</h4>
                                    <ul>
                                        <li>15+ NPC conversation tags</li>
                                        <li>6+ environmental tags</li>
                                        <li>8+ optional encounter tags</li>
                                    </ul>
                                </div>
                                <div class="tag-category">
                                    <h4>Inner Space (Scene 4)</h4>
                                    <ul>
                                        <li>18+ TALK IT OUT tags</li>
                                        <li>12+ SLAY tags</li>
                                        <li>9+ CARE tags</li>
                                    </ul>
                                </div>
                            </div>
                        `
                    },
                    scene1: {
                        title: "Scene 1: Café Greenwich",
                        content: `
                            <h2>☕ Scene 1: The Call to Action</h2>
                            <p><strong>Location:</strong> Café Greenwich (House Rainbow HQ)</p>
                            <p><strong>Music:</strong> Café Greenwich 1 or 2</p>

                            <h3>Opening</h3>
                            <p>Mama Jay gathers the team at Café Greenwich, looking more serious than usual. She's received reports of escalating harassment in the Theater District - LGBTQ+ performers being heckled, shows disrupted, venues vandalized.</p>

                            <blockquote>
                            "My dears, something's happening in the Theater District. It's not random hate - there's organization behind it. Someone calling themselves 'The Jester' is leading a group called the Tough Crowd. They're targeting our community's venues, saying comedy's gotten too 'soft' and 'woke.' We need you to investigate before this escalates further."
                            </blockquote>

                            <h3>Key Information</h3>
                            <ul>
                                <li>The Jester leads a group called "Tough Crowd"</li>
                                <li>They target LGBTQ+ friendly venues and performers</li>
                                <li>Claims about "real comedy" and "the good old days"</li>
                                <li>Started 2 weeks ago, getting worse</li>
                                <li>Mama Jay heard the name "Danny Carbone" mentioned</li>
                            </ul>

                            <h3>MC Moves</h3>
                            <ul>
                                <li>Let players ask questions and plan their approach</li>
                                <li>Mama Jay can provide basic info about the Theater District</li>
                                <li>Offer opportunity: "There's an open mic tonight at The Laugh Track - might be a good place to start"</li>
                            </ul>
                        `
                    },
                    scene2: {
                        title: "Scene 2: Theater District Investigation",
                        content: `
                            <h2>🎭 Scene 2: Streets of Memory</h2>
                            <p><strong>Location:</strong> Theater District</p>
                            <p><strong>Music:</strong> Theater District Investigation 1 or 2</p>

                            <h3>The Scene</h3>
                            <p>The Theater District is a mix of old and new - historic theaters alongside modern comedy clubs. Posters advertise shows with diverse performers, but some have been defaced with spraypaint: "MAKE COMEDY FUNNY AGAIN"</p>

                            <h3>Investigation Options</h3>

                            <h4>1. Talk to Performers (GET A CLUE)</h4>
                            <p>Various performers can share:</p>
                            <ul>
                                <li>"The Tough Crowd shows up at queer-friendly venues"</li>
                                <li>"Their leader, The Jester, used to perform here years ago"</li>
                                <li>"Danny Carbone - he had a show at The Comedy Cellar back in the 90s"</li>
                                <li>"He got bitter when the scene changed, when we started actually caring about punching up instead of down"</li>
                            </ul>
                            <p><strong>Tags Available:</strong> "Performer Testimony", "Pattern Recognized", "Lead: Danny Carbone"</p>

                            <h4>2. Check Vandalized Venues (GET A CLUE)</h4>
                            <p>Examining defaced posters and graffiti reveals:</p>
                            <ul>
                                <li>Consistent imagery: jester's cap, playing cards, dice</li>
                                <li>References to "Moretti's" - an old comedy cellar</li>
                                <li>Recent activity - some paint is still wet</li>
                            </ul>
                            <p><strong>Tags Available:</strong> "Evidence Gathered", "Connection: Moretti's", "Fresh Lead"</p>

                            <h4>3. Optional Encounter: Tough Crowd Members</h4>
                            <p>1-3 Tough Crowd Pawns might appear, heckling a street performer:</p>
                            <ul>
                                <li><strong>If players engage diplomatically (TALK IT OUT):</strong> Pawns reveal they're "bringing back real comedy" and mention meeting at "the old place"</li>
                                <li><strong>If players use force (SLAY/RESIST):</strong> Combat with Pawns (Ignorance Limit: 2-3 each)</li>
                                <li><strong>If players CARE:</strong> Might reach one Pawn who admits feeling left behind by changing times</li>
                            </ul>
                            <p><strong>Tags Available:</strong> "Pawn Encounter", "Moretti's Location", "Understanding: Left Behind"</p>

                            <h3>Scene Conclusion</h3>
                            <p>Investigation leads to <strong>Moretti's Comedy Cellar</strong> - an abandoned venue that was Danny's old home stage.</p>
                        `
                    },
                    scene3: {
                        title: "Scene 3: Moretti's Comedy Cellar",
                        content: `
                            <h2>🎤 Scene 3: The Abandoned Stage</h2>
                            <p><strong>Location:</strong> Moretti's Comedy Cellar</p>
                            <p><strong>Music:</strong> Theater District Investigation 2, then shift to Danny Battle 1 if combat occurs</p>

                            <h3>The Scene</h3>
                            <p>Moretti's Comedy Cellar is a time capsule - closed for 15 years but recently active. Old posters line the walls, including many featuring a younger Danny Carbone. The stage has been used recently - fresh microphone setup, scattered beer bottles.</p>

                            <h3>Investigation</h3>

                            <h4>Exploring the Space (GET A CLUE)</h4>
                            <ul>
                                <li><strong>Old Posters:</strong> Danny's career peak was mid-90s - "King of New York Comedy"</li>
                                <li><strong>Reviews:</strong> Old newspaper clippings show mixed reception - praised for edgy humor, criticized for "punching down"</li>
                                <li><strong>Recent Activity:</strong> Tough Crowd has been meeting here - planning harassment campaigns</li>
                                <li><strong>Danny's Journal:</strong> Bitter entries about "comedy getting soft", "can't say anything anymore", "they don't understand what we lost"</li>
                            </ul>
                            <p><strong>Tags Available:</strong> "Danny's History", "Motivation: Bitterness", "Tough Crowd Plans", "Journal Evidence"</p>

                            <h3>The Confrontation</h3>
                            <p>Danny "The Jester" Carbone arrives with 2-4 Tough Crowd Pawns (scale to party size).</p>

                            <h4>Danny's Opening</h4>
                            <blockquote>
                            "Well well, House Rainbow sends its diversity squad. Let me guess - you're here to tell me I'm a bigot? That I need to 'evolve'? I had this whole city laughing once. REAL laughs. Before everyone got so sensitive they can't take a joke anymore. The Jester's bringing REAL comedy back - the kind that doesn't apologize."
                            </blockquote>

                            <h4>Options</h4>

                            <h5>Combat Approach</h5>
                            <ul>
                                <li><strong>Danny (Justice Knight - The Jester):</strong> Ignorance Limit 5, uses construct moves based on "Exclusionary Humor"</li>
                                <li><strong>Tough Crowd Pawns:</strong> 2-4 Pawns (Ignorance Limit 2-3 each)</li>
                                <li><strong>Victory Condition:</strong> Reduce Danny to 0 Ignorance OR convince him to enter Inner Space</li>
                            </ul>

                            <h5>Diplomatic Approach (TALK IT OUT)</h5>
                            <p>Players can try to reach Danny before fighting:</p>
                            <ul>
                                <li>"What happened to make you this bitter?"</li>
                                <li>"Comedy evolves - you could too"</li>
                                <li>"You're hurting people who are already marginalized"</li>
                                <li>"When did you stop punching up and start punching down?"</li>
                            </ul>
                            <p>On 10+, Danny hesitates. His Justice Knight form flickers. "Maybe... maybe we can talk. But not here. Not in front of them."</p>

                            <h3>Scene Conclusion</h3>
                            <p>However the confrontation resolves, Danny either:</p>
                            <ul>
                                <li><strong>If defeated in combat:</strong> Brought to 0 Ignorance, transported to Inner Space</li>
                                <li><strong>If convinced diplomatically:</strong> Agrees to face his inner demons, opens portal to Inner Space</li>
                                <li><strong>If players fail:</strong> Danny escapes, Tough Crowd escalates (delay to prepare for final confrontation)</li>
                            </ul>
                        `
                    },
                    innerSpace: {
                        title: "Scene 4: Inner Space",
                        content: `
                            <h2>💭 Scene 4: Danny's Inner Space</h2>
                            <p><strong>Location:</strong> Danny's Apartment (Inner Space)</p>
                            <p><strong>Music:</strong> Inner Space Theme 1 or 2</p>

                            <h3>The Space</h3>
                            <p>Danny's Inner Space is a shabby NYC apartment, frozen in the late 90s. Walls covered with comedy posters from his glory days. A CRT TV plays his old sets on loop. Empty bottles everywhere. The laughter from the TV sounds hollow, echoing.</p>

                            <p>Civilian Danny sits on a worn couch, no longer in his Jester costume. He looks older, tired, human.</p>

                            <h3>The Core Wounds</h3>
                            <p>Players must help Danny confront his pain through TALK IT OUT, CARE, or SLAY moves:</p>

                            <h4>1. The Industry Changed</h4>
                            <blockquote>
                            "I had the city in my hand. Then suddenly, overnight, I was the bad guy. All I did was tell the same jokes that made everyone laugh for years. But now? Now those jokes make you a monster. They just... left me behind."
                            </blockquote>
                            <ul>
                                <li><strong>TALK IT OUT:</strong> "The jokes didn't change - we learned who they hurt"</li>
                                <li><strong>CARE:</strong> "Being left behind hurts. But you're hurting others now"</li>
                                <li><strong>SLAY:</strong> "You weren't left behind - you refused to grow"</li>
                            </ul>
                            <p><strong>Tags Available:</strong> "Understanding: Industry Change", "Core Wound: Abandonment"</p>

                            <h4>2. The Glory Days</h4>
                            <p>Manifestations of Danny's past success appear - newspaper clippings, award statues, audience laughter. But they're all FROM the 90s.</p>
                            <blockquote>
                            "This was real comedy. This was when people could take a joke. Why can't we go back to this?"
                            </blockquote>
                            <ul>
                                <li><strong>TALK IT OUT:</strong> "You can't go back - but you can move forward"</li>
                                <li><strong>CARE:</strong> "You're trying to freeze time because you're afraid"</li>
                                <li><strong>SLAY:</strong> "That version of you caused real harm"</li>
                            </ul>
                            <p><strong>Tags Available:</strong> "Core Wound: Glory Lost", "Understanding: Fear of Irrelevance"</p>

                            <h4>3. The Real Fear</h4>
                            <p>The apartment's walls close in. The TV shows Danny's last few gigs - smaller venues, smaller crowds, eventually just online rants.</p>
                            <blockquote>
                            "I'm not a bigot. I never hated anyone. I just... I don't know how to be funny in this new world. And if I can't be funny... who am I? Comedy is all I had."
                            </blockquote>
                            <ul>
                                <li><strong>TALK IT OUT:</strong> "You can learn new ways to be funny - ways that don't hurt"</li>
                                <li><strong>CARE:</strong> "You're more than your comedy. You're a person who can grow"</li>
                                <li><strong>SLAY:</strong> "Then find a new way. The world doesn't owe you an audience"</li>
                            </ul>
                            <p><strong>Tags Available:</strong> "Core Wound: Identity Crisis", "Understanding: Fear of Obsolescence", "Path to Redemption"</p>

                            <h3>Resolution Options</h3>

                            <h4>Full Success (10+ on final move)</h4>
                            <p>Danny breaks down crying. The apartment slowly updates - photos from recent years appear, showing LGBTQ+ comedians he could have learned from, supported, grown with.</p>
                            <blockquote>
                            "I was so angry about losing my spotlight, I didn't see I was becoming the villain. I can't take back the hurt I caused... but maybe I can do better going forward?"
                            </blockquote>
                            <p><strong>Outcome:</strong> Danny is redeemed. Agrees to make amends, attend restorative justice sessions, use his platform to support marginalized comedians.</p>

                            <h4>Partial Success (7-9)</h4>
                            <p>Danny understands he was wrong but isn't ready to fully change.</p>
                            <blockquote>
                            "I hear you. I do. But this is hard. I need time to figure out who I am if I'm not THAT Danny anymore."
                            </blockquote>
                            <p><strong>Outcome:</strong> Danny steps back from Tough Crowd but isn't actively helping. A seed is planted.</p>

                            <h4>Failure (6-)</h4>
                            <p>Danny rejects the team's help, doubling down on his nostalgia.</p>
                            <blockquote>
                            "You don't get it. None of you do. The world left ME behind. I'm just fighting back."
                            </blockquote>
                            <p><strong>Outcome:</strong> Danny must be defeated through other means. Tough Crowd continues under new leadership (potentially ties to Chapter 2's villain, Professor Pierce).</p>

                            <h3>Return to Reality</h3>
                            <p>Based on the outcome, Danny either:</p>
                            <ul>
                                <li><strong>Redeemed:</strong> Returns to reality ready to change, Tough Crowd dissolves</li>
                                <li><strong>Partial:</strong> Returns uncertain, Tough Crowd fractures but doesn't fully stop</li>
                                <li><strong>Failed:</strong> Remains as enemy, must be defeated by other means</li>
                            </ul>
                        `
                    },
                    aftermath: {
                        title: "Aftermath & Consequences",
                        content: `
                            <h2>🎬 Aftermath: The Ripples</h2>

                            <h3>Based on Danny's Resolution</h3>

                            <h4>Danny Redeemed (Best Outcome)</h4>
                            <ul>
                                <li>Danny publicly apologizes for his actions and rhetoric</li>
                                <li>Begins attending restorative justice circles at House Rainbow</li>
                                <li>Uses his remaining platform to amplify marginalized voices</li>
                                <li>Tough Crowd dissolves - some members seek help, others scatter</li>
                                <li><strong>Chapter 2 Impact:</strong> Danny may offer information about Professor Pierce, who he met at a "concerned citizens" meeting</li>
                            </ul>

                            <h4>Danny Partial Reform (Mixed Outcome)</h4>
                            <ul>
                                <li>Danny quietly retires from public view</li>
                                <li>Tough Crowd fractures - most members stop, but hardcore believers continue</li>
                                <li>The movement loses steam but doesn't fully end</li>
                                <li><strong>Chapter 2 Impact:</strong> Some Tough Crowd members become new recruits for Pierce's movement</li>
                            </ul>

                            <h4>Danny's Vendetta Continues (Worst Outcome)</h4>
                            <ul>
                                <li>Danny allies with Professor Pierce (Chapter 2 villain)</li>
                                <li>Tough Crowd becomes more organized and dangerous</li>
                                <li>Harassment escalates throughout the campaign</li>
                                <li><strong>Chapter 2 Impact:</strong> Danny actively supports Pierce's "traditional values" movement, making Chapter 2 harder</li>
                            </ul>

                            <h3>Community Response</h3>
                            <ul>
                                <li>Theater District LGBTQ+ venues hold solidarity events</li>
                                <li>House Rainbow gains reputation and resources</li>
                                <li>Young performers cite the team as inspirations</li>
                                <li>Media coverage (depending on how public the confrontation was)</li>
                            </ul>

                            <h3>Character Growth</h3>
                            <p>Each PC should reflect on:</p>
                            <ul>
                                <li>What did you learn about fighting ignorance vs. fighting people?</li>
                                <li>Did you see any of yourself in Danny's fear of change?</li>
                                <li>How do you balance accountability with compassion?</li>
                                <li>What does "redemption" mean to you?</li>
                            </ul>

                            <h3>Teaser for Chapter 2</h3>
                            <p>Mama Jay receives word of something new: Professor Vivian Pierce, a prominent academic, is gaining followers with rhetoric about "biological truth" and "protecting children." Her movement seems more organized, better funded than Danny's Tough Crowd ever was...</p>

                            <blockquote>
                            "My dears, I'm afraid Danny was just the beginning. Someone's organizing these movements, giving them structure and legitimacy. And this Professor Pierce - she's far more dangerous than a bitter comedian could ever be."
                            </blockquote>
                        `
                    },
                    scaling: {
                        title: "Scaling & Pacing",
                        content: `
                            <h2>⚖️ Scaling for Different Party Sizes</h2>

                            <h3>Combat Encounters</h3>

                            <h4>Scene 2: Optional Tough Crowd Encounter</h4>
                            <ul>
                                <li><strong>1-2 Players:</strong> 1 Tough Crowd Pawn</li>
                                <li><strong>3-4 Players:</strong> 2 Tough Crowd Pawns</li>
                                <li><strong>5+ Players:</strong> 3 Tough Crowd Pawns</li>
                            </ul>
                            <p><strong>Pawn Stats:</strong> Ignorance Limit 2-3, basic attacks, easily swayed by CARE moves</p>

                            <h4>Scene 3: Moretti's Confrontation</h4>
                            <ul>
                                <li><strong>1-2 Players:</strong> Danny + 1 Pawn</li>
                                <li><strong>3-4 Players:</strong> Danny + 2 Pawns</li>
                                <li><strong>5+ Players:</strong> Danny + 3-4 Pawns</li>
                            </ul>
                            <p><strong>Danny Stats:</strong> Ignorance Limit 5, Justice Knight construct moves, can summon hurtful "punchlines" as attacks</p>

                            <h3>Pacing Guidance</h3>

                            <h4>Session 1 (3-4 hours)</h4>
                            <ul>
                                <li>Scene 1: Café Greenwich (30-45 min)</li>
                                <li>Scene 2: Investigation (90-120 min)</li>
                                <li>End on discovering Moretti's location</li>
                            </ul>

                            <h4>Session 2 (3-4 hours)</h4>
                            <ul>
                                <li>Scene 3: Moretti's Confrontation (60-90 min)</li>
                                <li>Scene 4: Inner Space (90-120 min)</li>
                                <li>Aftermath (30-45 min)</li>
                            </ul>

                            <h4>One-Shot Version (4-5 hours)</h4>
                            <ul>
                                <li>Streamline Scene 1 (15-20 min)</li>
                                <li>Scene 2: Focus investigation, skip optional encounter (45-60 min)</li>
                                <li>Scene 3: Quick combat if needed (30-45 min)</li>
                                <li>Scene 4: Core Inner Space moments only (60-90 min)</li>
                                <li>Brief aftermath (15-20 min)</li>
                            </ul>

                            <h3>Difficulty Adjustments</h3>

                            <h4>Easier (New Players or Shorter Session)</h4>
                            <ul>
                                <li>Lower Danny's Ignorance Limit to 3-4</li>
                                <li>Give players more Story Tags from investigation</li>
                                <li>Make Danny more receptive to diplomatic approaches</li>
                                <li>Reduce number of Pawns in each encounter</li>
                            </ul>

                            <h4>Harder (Experienced Players or Epic Campaign)</h4>
                            <ul>
                                <li>Increase Danny's Ignorance Limit to 6-7</li>
                                <li>Add a second Justice Knight (veteran Tough Crowd member)</li>
                                <li>Danny has more complex Inner Space wounds to address</li>
                                <li>Partial success on Inner Space still leaves Danny partially hostile</li>
                            </ul>

                            <h3>Time-Saving Tips</h3>
                            <ul>
                                <li><strong>Pre-gen Characters:</strong> Have characters ready with relevant backgrounds (comedian, activist, former victim of harassment)</li>
                                <li><strong>Start In Media Res:</strong> Begin at Scene 2 with players already investigating</li>
                                <li><strong>Montage Investigation:</strong> Each player describes one clue they find, combine for full picture</li>
                                <li><strong>Fast-Track to Inner Space:</strong> Skip Moretti's combat, go straight to Inner Space after investigation</li>
                            </ul>
                        `
                    }
                }
            }
        }
    },
    'queerz-chapters-2-5': {
        id: 'queerz-chapters-2-5',
        name: 'QUEERZ! - Chapters 2-5 (Coming Soon)',
        description: 'Continue the fight against Ignorance through New York City',
        chapters: [
            {number: 2, name: 'The Professor\'s Prescription', available: false},
            {number: 3, name: 'The Champion\'s Last Stand', available: false},
            {number: 4, name: 'The Mogul\'s Empire', available: false},
            {number: 5, name: 'The Titan\'s Domain', available: false}
        ],
        scriptData: {
            placeholder: {
                title: "Coming Soon",
                tabs: {
                    overview: {
                        title: "Chapters 2-5 Overview",
                        content: `
                            <h2>📚 Future Chapters</h2>
                            <p>The story continues with four more chapters:</p>

                            <h3>Chapter 2: The Professor's Prescription</h3>
                            <p>Professor Vivian Pierce uses academic credibility to spread "biological truths" and "protect children" from LGBTQ+ acceptance. More organized and funded than Danny ever was.</p>

                            <h3>Chapter 3: The Champion's Last Stand</h3>
                            <p>Rex "The Titan" Branson, a washed-up athlete, weaponizes masculinity and "traditional strength" to recruit young men into his movement.</p>

                            <h3>Chapter 4: The Mogul's Empire</h3>
                            <p>Victoria Sterling, a media mogul, controls the narrative and manufactures the "moral panic" that fuels all previous villains.</p>

                            <h3>Chapter 5: The Titan's Domain</h3>
                            <p>Marcus Creed, the true Titan of Ignorance, reveals himself as the puppetmaster behind all the Justice Knights.</p>

                            <p><em>Script content for these chapters will be added in future updates.</em></p>
                        `
                    }
                }
            }
        }
    }
};

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize campaigns
    availableCampaigns = campaignsDatabase;

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

    // Load Firebase campaigns and populate dropdown
    await loadFirebaseCampaigns();

    // Load correct chapter tabs and content
    loadChapterTabs();
    loadScriptContent('overview'); // Load default tab
    const scriptPanelTitle = document.getElementById('scriptPanelTitle');
    if (scriptPanelTitle) {
        const campaign = availableCampaigns[currentCampaignId];
        scriptPanelTitle.textContent = campaign ? campaign.name : `Campaign Script - Chapter ${currentChapter}`;
    }

    console.log('✅ MC App initialized successfully');
});

// ===================================
// CORE FUNCTIONS
// ===================================

// ===================================
// FIREBASE CAMPAIGN INTEGRATION
// ===================================

async function loadFirebaseCampaigns() {
    try {
        const campaigns = await getMyCampaigns();

        if (campaigns && campaigns.length > 0) {
            // Store Firebase campaigns with 'firebase-' prefix to distinguish them
            campaigns.forEach(campaign => {
                const fbId = `firebase-${campaign.id}`;
                firebaseCampaigns[fbId] = campaign;
            });

            console.log(`✅ Loaded ${campaigns.length} Firebase campaigns`);
        }

        // Populate campaign dropdown with both hardcoded and Firebase campaigns
        populateCampaignDropdown();

    } catch (error) {
        console.error('❌ Failed to load Firebase campaigns:', error);
        // Still populate dropdown with hardcoded campaigns
        populateCampaignDropdown();
    }
}

function populateCampaignDropdown() {
    if (!campaignSelect) return;

    // Clear existing options except for hardcoded ones (keep them)
    campaignSelect.innerHTML = '';

    // Add hardcoded campaigns
    const hardcodedOption1 = document.createElement('option');
    hardcodedOption1.value = 'queerz-chapter1';
    hardcodedOption1.textContent = 'QUEERZ! Chapter 1';
    campaignSelect.appendChild(hardcodedOption1);

    const hardcodedOption2 = document.createElement('option');
    hardcodedOption2.value = 'queerz-chapters-2-5';
    hardcodedOption2.textContent = 'QUEERZ! Chapters 2-5 (Coming Soon)';
    campaignSelect.appendChild(hardcodedOption2);

    // Add divider if there are Firebase campaigns
    if (Object.keys(firebaseCampaigns).length > 0) {
        const divider = document.createElement('option');
        divider.disabled = true;
        divider.textContent = '─────── My Campaigns ───────';
        campaignSelect.appendChild(divider);

        // Add Firebase campaigns
        Object.entries(firebaseCampaigns).forEach(([fbId, campaign]) => {
            const option = document.createElement('option');
            option.value = fbId;
            option.textContent = `📚 ${campaign.name}`;
            campaignSelect.appendChild(option);
        });
    }

    // Set current selection
    if (currentCampaignId) {
        campaignSelect.value = currentCampaignId;
    }

    console.log(`✅ Campaign dropdown populated with ${Object.keys(firebaseCampaigns).length} Firebase campaigns`);
}

async function loadFirebaseCampaignData(campaignId) {
    try {
        // Extract the real Firebase ID (remove 'firebase-' prefix)
        const realId = campaignId.replace('firebase-', '');
        const campaignData = await loadCampaign(realId);

        if (campaignData) {
            activeFirebaseCampaign = {
                id: realId,
                data: campaignData
            };

            // Update chapter dropdown with Firebase campaign chapters
            updateChapterDropdownForFirebase(campaignData);

            console.log(`✅ Loaded Firebase campaign: ${campaignData.metadata.name}`);
            return true;
        }

        return false;
    } catch (error) {
        console.error('❌ Failed to load Firebase campaign data:', error);
        return false;
    }
}

function updateChapterDropdownForFirebase(campaignData) {
    if (!chapterSelect) return;

    // Clear existing options
    chapterSelect.innerHTML = '';

    // Check if campaign has chapters
    if (campaignData.chapters && Object.keys(campaignData.chapters).length > 0) {
        Object.entries(campaignData.chapters).forEach(([chapterNum, chapterData]) => {
            const option = document.createElement('option');
            option.value = chapterNum;
            option.textContent = chapterData.name || `Chapter ${chapterNum}`;
            chapterSelect.appendChild(option);
        });
    } else {
        // No chapters yet, show placeholder
        const option = document.createElement('option');
        option.value = '1';
        option.textContent = 'No chapters yet - Add via Campaign Manager';
        chapterSelect.appendChild(option);
    }

    // Set current chapter
    if (campaignData.metadata.currentChapter) {
        chapterSelect.value = campaignData.metadata.currentChapter;
        currentChapter = campaignData.metadata.currentChapter;
    }
}

function loadFirebaseCampaignScript() {
    const scriptContent = document.getElementById('scriptContent');
    if (!scriptContent || !activeFirebaseCampaign) return;

    const campaignData = activeFirebaseCampaign.data;
    const chapterData = campaignData.chapters ? campaignData.chapters[currentChapter] : null;

    if (chapterData && chapterData.script) {
        // Display chapter script
        scriptContent.innerHTML = `
            <div style="padding: 20px;">
                <h2>${chapterData.name || `Chapter ${currentChapter}`}</h2>
                <div style="white-space: pre-wrap; font-family: inherit; line-height: 1.6;">
                    ${chapterData.script}
                </div>
            </div>
        `;
    } else {
        // No script yet
        scriptContent.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h3 style="color: rgba(255,255,255,0.7);">No script for this chapter yet</h3>
                <p style="color: rgba(255,255,255,0.5);">Add script content via the Campaign Manager</p>
            </div>
        `;
    }

    // Clear tabs for Firebase campaigns (they don't use tabbed interface like hardcoded campaigns)
    const panelTabs = document.querySelector('.panel-tabs');
    if (panelTabs) {
        panelTabs.innerHTML = '';
    }

    console.log(`✅ Loaded script for Firebase campaign chapter ${currentChapter}`);
}

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

    // Campaign Selection
    if (campaignSelect) {
        campaignSelect.addEventListener('change', async (e) => {
            currentCampaignId = e.target.value;
            currentSession.campaign.id = currentCampaignId;

            // Check if this is a Firebase campaign
            if (currentCampaignId.startsWith('firebase-')) {
                // Load Firebase campaign data
                const success = await loadFirebaseCampaignData(currentCampaignId);

                if (success && activeFirebaseCampaign) {
                    // Firebase campaign loaded successfully
                    currentChapter = activeFirebaseCampaign.data.metadata.currentChapter || 1;

                    // Load Firebase campaign script content
                    loadFirebaseCampaignScript();

                    const scriptPanelTitle = document.getElementById('scriptPanelTitle');
                    if (scriptPanelTitle) {
                        scriptPanelTitle.textContent = activeFirebaseCampaign.data.metadata.name;
                    }
                }
            } else {
                // Hardcoded campaign - use existing logic
                activeFirebaseCampaign = null;

                // Reset to chapter 1 when changing campaigns
                currentChapter = 1;
                if (chapterSelect) {
                    chapterSelect.value = 1;
                }

                loadChapterTabs();
                loadScriptContent('overview');

                const scriptPanelTitle = document.getElementById('scriptPanelTitle');
                if (scriptPanelTitle) {
                    const campaign = availableCampaigns[currentCampaignId];
                    scriptPanelTitle.textContent = campaign ? campaign.name : 'Campaign Script';
                }
            }

            saveToLocalStorage();
            broadcastSessionToPlayers();

            console.log(`📚 Switched to campaign: ${currentCampaignId}`);
        });
    }

    // Chapter Selection
    if (chapterSelect) {
        chapterSelect.addEventListener('change', (e) => {
            currentChapter = parseInt(e.target.value);

            // Check if we're in a Firebase campaign
            if (activeFirebaseCampaign) {
                // Update Firebase campaign current chapter
                setCurrentChapter(activeFirebaseCampaign.id, currentChapter);

                // Reload Firebase script for new chapter
                loadFirebaseCampaignScript();

                const scriptPanelTitle = document.getElementById('scriptPanelTitle');
                if (scriptPanelTitle && activeFirebaseCampaign.data.chapters[currentChapter]) {
                    scriptPanelTitle.textContent = activeFirebaseCampaign.data.chapters[currentChapter].name;
                }
            } else {
                // Hardcoded campaign
                loadChapterTabs();
                loadScriptContent('overview');

                const scriptPanelTitle = document.getElementById('scriptPanelTitle');
                if (scriptPanelTitle) {
                    const campaign = availableCampaigns[currentCampaignId];
                    const chapterKey = `chapter${currentChapter}`;
                    const chapterData = campaign?.scriptData[chapterKey] || campaign?.scriptData.placeholder;
                    scriptPanelTitle.textContent = chapterData?.title || `Campaign Script - Chapter ${currentChapter}`;
                }
            }

            saveToLocalStorage();
            broadcastSessionToPlayers();
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

    // Script Search
    const scriptSearchInput = document.getElementById('scriptSearch');
    if (scriptSearchInput) {
        scriptSearchInput.addEventListener('input', searchScriptContent);
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
    broadcastSessionToPlayers(); // Broadcast updated player list
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
        broadcastSessionToPlayers(); // Broadcast updated player list
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
    // Load script tabs based on current campaign and chapter
    const campaign = availableCampaigns[currentCampaignId];
    if (!campaign) {
        console.warn(`⚠️ Campaign ${currentCampaignId} not found`);
        return;
    }

    const chapterKey = `chapter${currentChapter}`;
    const chapterData = campaign.scriptData[chapterKey] || campaign.scriptData.placeholder;

    if (!chapterData) {
        console.warn(`⚠️ No script data for ${chapterKey} in ${currentCampaignId}`);
        return;
    }

    // Update panel title
    const scriptPanelTitle = document.getElementById('scriptPanelTitle');
    if (scriptPanelTitle) {
        scriptPanelTitle.textContent = chapterData.title || campaign.name;
    }

    // Update tabs
    const panelTabs = document.querySelector('.panel-tabs');
    if (panelTabs && chapterData.tabs) {
        panelTabs.innerHTML = '';
        let isFirst = true;

        Object.keys(chapterData.tabs).forEach(tabKey => {
            const tabData = chapterData.tabs[tabKey];
            const tabBtn = document.createElement('button');
            tabBtn.className = `tab-btn${isFirst ? ' active' : ''}`;
            tabBtn.dataset.tab = tabKey;
            tabBtn.textContent = tabData.title;

            tabBtn.addEventListener('click', () => {
                // Remove active class from all tabs
                panelTabs.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });

                // Add active class to clicked tab
                tabBtn.classList.add('active');

                // Load content for this tab
                loadScriptContent(tabKey);
            });

            panelTabs.appendChild(tabBtn);
            isFirst = false;
        });
    }

    console.log(`📖 Loaded ${chapterKey} tabs for ${campaign.name}`);
}

function loadScriptContent(tabKey) {
    const scriptContent = document.getElementById('scriptContent');
    if (!scriptContent) return;

    const campaign = availableCampaigns[currentCampaignId];
    if (!campaign) return;

    const chapterKey = `chapter${currentChapter}`;
    const chapterData = campaign.scriptData[chapterKey] || campaign.scriptData.placeholder;

    if (!chapterData || !chapterData.tabs || !chapterData.tabs[tabKey]) {
        scriptContent.innerHTML = '<p style="padding: 20px; color: rgba(255,255,255,0.7);">No content available for this tab.</p>';
        return;
    }

    // Load and display content
    scriptContent.innerHTML = chapterData.tabs[tabKey].content;

    // Add search functionality
    const searchInput = document.getElementById('scriptSearch');
    if (searchInput) {
        searchInput.value = ''; // Clear search on tab change
    }
}

function searchScriptContent() {
    const searchInput = document.getElementById('scriptSearch');
    const scriptContent = document.getElementById('scriptContent');

    if (!searchInput || !scriptContent) return;

    const searchTerm = searchInput.value.toLowerCase();
    const allElements = scriptContent.querySelectorAll('h2, h3, h4, p, li, blockquote');

    allElements.forEach(elem => {
        const text = elem.textContent.toLowerCase();
        if (searchTerm === '' || text.includes(searchTerm)) {
            elem.style.display = '';
        } else {
            elem.style.display = 'none';
        }
    });
}

// ===================================
// FIREBASE SESSION BROADCASTING
// ===================================

function broadcastSessionToPlayers() {
    if (!firebaseReady || !database || !firebaseRef || !firebaseSet) {
        console.warn('⚠️ Firebase not ready for session broadcast');
        return;
    }

    // Create session data for player app
    const sessionData = {
        sessionId: currentSession.sessionId || `session_${Date.now()}`,
        name: currentSession.name,
        campaign: {
            id: currentCampaignId,
            name: availableCampaigns[currentCampaignId]?.name || 'Unknown Campaign',
            chapter: currentChapter
        },
        players: players.map(p => ({
            name: p.name,
            characterId: p.characterId || null,
            tags: p.tags || {story: [], status: []}
        })),
        timestamp: Date.now(),
        mcOnline: true
    };

    // Update session ID if needed
    if (!currentSession.sessionId) {
        currentSession.sessionId = sessionData.sessionId;
        saveToLocalStorage();
    }

    // Broadcast to Firebase
    const sessionRef = firebaseRef(database, 'activeSession');
    firebaseSet(sessionRef, sessionData)
        .then(() => {
            console.log('✅ Session broadcast to players:', sessionData.sessionId);
        })
        .catch(error => {
            console.error('❌ Session broadcast failed:', error);
        });
}

function stopSessionBroadcast() {
    if (!firebaseReady || !database || !firebaseRef || !firebaseSet) {
        return;
    }

    const sessionRef = firebaseRef(database, 'activeSession');
    firebaseSet(sessionRef, {mcOnline: false, timestamp: Date.now()})
        .then(() => {
            console.log('✅ Session broadcast stopped');
        })
        .catch(error => {
            console.error('❌ Failed to stop session broadcast:', error);
        });
}

// Broadcast session when page becomes visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && players.length > 0) {
        broadcastSessionToPlayers();
    } else if (document.hidden) {
        stopSessionBroadcast();
    }
});

// Broadcast session periodically (every 30 seconds)
setInterval(() => {
    if (!document.hidden && players.length > 0) {
        broadcastSessionToPlayers();
    }
}, 30000);

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
window.broadcastSessionToPlayers = broadcastSessionToPlayers;
window.stopSessionBroadcast = stopSessionBroadcast;
window.loadScriptContent = loadScriptContent;
window.searchScriptContent = searchScriptContent;
window.loadFirebaseCampaigns = loadFirebaseCampaigns;
window.populateCampaignDropdown = populateCampaignDropdown;

console.log('🌈 QUEERZ! MC Companion - Fully Loaded with Campaign Support!');
