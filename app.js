// ===================================
// QUEERZ! MC COMPANION APP - JAVASCRIPT
// COMPLETE INTEGRATED VERSION
// ===================================

// === GLOBAL STATE ===
let players = [];
let activePlayerIndex = -1;
let characters = {}; // Stores PC character data
let currentAudio = null;

// Campaign State
let currentChapter = 1;
let storyOutcomes = {
    chapter1: 'none' // Options: 'none', 'redeemed', 'partial', 'vendetta'
    // More chapters can be added here
};

// Music Player State
let isLooping = false;
let playlist = [];
let currentPlaylistIndex = 0;

// === DOM ELEMENTS ===
// Spotlight
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

// === CHARACTER DATA (NPCs for display) ===
const characterData = {
    'mama-jay': {
        name: 'Mama Jay Rainbow',
        image: 'https://drive.google.com/uc?export=view&id=1ajj4lmmoEpxtMvXO61W1956z1oTrVM0_',
        characterSheet: 'https://drive.google.com/uc?export=view&id=1ajj4lmmoEpxtMvXO61W1956z1oTrVM0_',

        info: 'Founder of House Rainbow and owner of Café Greenwich. A wise mentor figure who guides the heroes.'
    },
    'danny-civilian': {
        name: 'Danny "Dice" Carbone',
        image: 'https://drive.google.com/uc?export=view&id=1tQHUwn0ajdLIZeo07C6wGk3v4vT-i7i2',
        characterSheet: 'https://drive.google.com/uc?export=view&id=1tQHUwn0ajdLIZeo07C6wGk3v4vT-i7i2',

        info: 'Former stand-up comedian who feels left behind by changing times. Currently civilian form.'
    },
    'danny-justice': {
        name: 'Danny "Dice" Carbone - The Jester',
        image: 'https://drive.google.com/uc?export=view&id=1dBr2ES_GFiYojkKJ7VmBAcS26G-K3ZF-',
        characterSheet: 'https://drive.google.com/uc?export=view&id=1dBr2ES_GFiYojkKJ7VmBAcS26G-K3ZF-',

        info: 'Justice Knight form. Spreads "Nostalgic Justice" through comedy that cuts and excludes. Ignorance Limit: 5'
    },
    'pawn': {
        name: 'Tough Crowd (Pawn)',
        image: 'https://drive.google.com/uc?export=view&id=1qrok5Y5-Kdyu47Y9KZpGEhAxPQgwO3Qq',
        characterSheet: 'https://drive.google.com/uc?export=view&id=1qrok5Y5-Kdyu47Y9KZpGEhAxPQgwO3Qq',

        info: 'Brainwashed follower of Danny. Working-class person infected with Nostalgic Ignorance. Ignorance Limit: 2-3'
    }
};

// === LOCATION DATA ===
const locationData = {
    'cafe-greenwich': 'https://drive.google.com/uc?export=view&id=1SD9HFWYbxEBXrnd6z-780QDXHO-UidlX',
    'theater-district': 'https://drive.google.com/uc?export=view&id=16Q4Kcv7VdM0qqKOZailslsRzVCv4xsId',
    'morettis': 'https://drive.google.com/uc?export=view&id=1-4fvxguaEyCEYY9aWqVKpiE3AGIsqZIV'
};

// === SCRIPT DATA - CHAPTER 1 ===
// (Your complete script content from the original file)
const scriptData = {
  chapter1: {
    title: "Chapter 1: The Jester's Last Laugh",
    subtitle: "WITH STORY TAGS",
    tabs: {
      overview: {
        title: "Overview",
        content: `
          <div class="script-section">
            <h2>🎭 Chapter Overview</h2>
            <p>The Queerz investigate harassment in NYC's Theater District, discovering a washed-up comedian named Danny "The Jester" Carbone who leads the Tough Crowd - a gang of bitter performers targeting LGBTQ+ venues. The investigation leads to Moretti's Comedy Cellar and culminates in Danny's Inner Space apartment, where the team must help him confront the emotional wounds that turned laughter into a weapon.</p>
            
            <h3>🎯 Key Story Features</h3>
            <ul>
              <li><strong>Story Tags Integration:</strong> Over 100+ story tags available throughout the chapter</li>
              <li><strong>Investigation Phase:</strong> Multiple NPCs with clues and tag rewards</li>
              <li><strong>Environmental Tags:</strong> Location-based tags that affect all players</li>
              <li><strong>Character Development:</strong> Danny's redemption arc based on player choices</li>
              <li><strong>Scalable Encounters:</strong> Adjustable for 1-7+ players</li>
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
                <h4>Moretti's Discovery (Scene 3)</h4>
                <ul>
                  <li>12+ journal reading tags</li>
                  <li>9+ location search tags</li>
                  <li>5+ optional encounter tags</li>
                </ul>
              </div>
              <div class="tag-category">
                <h4>Inner Space (Scene 4)</h4>
                <ul>
                  <li>18+ TALK IT OUT tags</li>
                  <li>12+ SLAY tags</li>
                  <li>9+ CARE tags</li>
                  <li>6+ resolution tags</li>
                </ul>
              </div>
            </div>

            <h3>🎬 Key Scenes</h3>
            <ol>
              <li><strong>Café Greenwich:</strong> Mama Jay introduces the threat</li>
              <li><strong>Theater District:</strong> Investigation and encounters</li>
              <li><strong>Moretti's Cellar:</strong> Discovery and confrontation</li>
              <li><strong>Inner Space:</strong> Danny's apartment and redemption</li>
            </ol>

            <div class="mc-tip">
              <h4>💡 MC Tips for Story Tags</h4>
              <ul>
                <li>Remind players when they have relevant tags</li>
                <li>Let tags stack with character tags for combos</li>
                <li>Environmental tags affect everyone in the space</li>
                <li>Some tags can be upgraded with more info</li>
                <li>Temporary tags last until scene/chapter end</li>
                <li>Ongoing tags persist across chapters</li>
              </ul>
            </div>
          </div>
        `
      },
      
      scene1: {
        title: "Scene 1: Café Greenwich",
        content: `
          <div class="script-section">
            <h2>☕ Scene 1: Café Greenwich - Morning</h2>
            
            <div class="scene-description">
              <h3>Environment</h3>
              <p>The familiar warmth of Café Greenwich wraps around you like a well-worn leather jacket. Steam rises from mismatched mugs while indie music plays softly over conversations between artists, activists, and the beautifully ordinary people who make this neighborhood home. Mama Jay Rainbow moves between tables with practiced grace, her silver hair catching the morning light as she refills coffee cups and dispenses wisdom in equal measure.</p>
            </div>

            <div class="read-aloud">
              <h3>📖 Read to Players</h3>
              <p>"The morning news drones from the vintage TV mounted in the corner, but something makes Mama Jay reach for the remote with unusual urgency. The volume rises just as a reporter's voice cuts through the café's gentle hum:</p>
              <p><em>'...third incident this week involving what witnesses describe as aggressive street performers in the Theater District. Business owners report customers being harassed by individuals making crude jokes and demanding audiences 'toughen up' or face consequences. Police are investigating what appears to be organized intimidation tactics targeting LGBTQ+ establishments and community centers...'</em>"</p>
            </div>

            <div class="npc-dialogue">
              <h3>💬 Mama Jay's Response</h3>
              <p>She turns to face you, her expression mixing concern with determination.</p>
              <p><strong>Mama Jay:</strong> "Well, sugar, sounds like someone's trying to turn humor into a weapon. The Theater District's been good to House Rainbow over the years - we've got friends there, venues that gave us stages when nobody else would. Time to return the favor."</p>
            </div>

            <div class="npc-box">
              <h3>👤 MAMA JAY RAINBOW</h3>
              <ul>
                <li><strong>Motivation:</strong> Protect the community spaces that support queer artists</li>
                <li><strong>Information:</strong> Has contacts in the Theater District, knows the area's history</li>
                <li><strong>Personality:</strong> Maternal but fierce, speaks in metaphors about performance and authenticity</li>
                <li><strong>Key Quote:</strong> "Real comedy builds bridges, baby. What we're seeing sounds more like someone trying to burn them down."</li>
              </ul>
            </div>

            <div class="mc-tip">
              <h4>💡 MC Notes</h4>
              <ul>
                <li>Let players ask Mama Jay questions about the Theater District</li>
                <li>She can provide background on past community support</li>
                <li>Emphasize the personal connection - this affects their artistic home</li>
                <li>Players might want to gear up or gather info before heading out</li>
              </ul>
            </div>
          </div>
        `
      },

      scene2: {
        title: "Scene 2: Theater District Investigation",
        content: `
          <div class="script-section">
            <h2>🎭 Scene 2: The Theater District - Investigation</h2>
            
            <div class="scene-description">
              <h3>Environment</h3>
              <p>The Theater District buzzes with its usual chaotic energy, but there's an undercurrent of tension you can feel in your bones. Street performers juggle fire while tourists snap photos, but vendors keep glancing over their shoulders. The smell of hot dogs and possibility usually fills the air here, but today it's tinged with something sour - like milk left too long in the sun.</p>
              <p>Neon signs advertise everything from Shakespeare to stand-up comedy, their colors bleeding together in the afternoon light. The sidewalks pulse with the rhythm of a hundred different dreams, but some of those dreams look a little more like nightmares today.</p>
            </div>

            <div class="story-tags environmental">
              <h3>🏷️ Available Environmental Story Tags</h3>
              <ul>
                <li><strong>"Creative Energy" (ongoing)</strong> - The district thrums with artistic passion</li>
                <li><strong>"Nervous Tension"-2 (ongoing)</strong> - Everyone's on edge about recent incidents</li>
                <li><strong>"Lots of Witnesses" (ongoing)</strong> - Perfect for gathering information</li>
                <li><strong>"Crowded Streets" (ongoing)</strong> - Easy to blend in, hard to single out threats</li>
              </ul>
            </div>

            <div class="investigation-section">
              <h3>🔍 Investigation Opportunities</h3>
              <p>Players can approach different NPCs to gather information. Each provides clues and story tags.</p>

              <div class="clue-source">
                <h4>1. STREET PERFORMERS</h4>
                <p><strong>Trigger:</strong> Approaching other street performers in the area</p>
                
                <div class="clue-box">
                  <h5>Clue 1:</h5>
                  <p>"Yeah, these guys showed up three days ago. Not from around here - they got this weird, old-school vibe but mean, you know? Like comedy from when it was okay to punch down."</p>
                  <p class="tags-earned"><strong>Story Tags Earned:</strong></p>
                  <ul>
                    <li>"Old School Tactics"-1 (temporary)</li>
                    <li>"Not Local Troublemakers" (temporary)</li>
                  </ul>
                </div>

                <div class="clue-box">
                  <h5>Clue 2:</h5>
                  <p>"They're not trying to make money - that's what's weird. Real performers, we're hustling for tips. These guys just want to... I don't know, prove a point?"</p>
                  <p class="tags-earned"><strong>Story Tags Earned:</strong></p>
                  <ul>
                    <li>"Ideological Motivation"-2 (temporary)</li>
                    <li>"Different from Normal Street Crime" (temporary)</li>
                  </ul>
                </div>

                <div class="clue-box">
                  <h5>Clue 3:</h5>
                  <p>"Heard their leader's some washed-up comic from way back. Danny something? Used to pack the big rooms before people stopped laughing at that kind of thing."</p>
                  <p class="tags-earned"><strong>Story Tags Earned:</strong></p>
                  <ul>
                    <li>"Danny's Identity"-2 (temporary)</li>
                    <li>"Washed-Up Comedian" (temporary)</li>
                    <li>"Old Fame, New Bitterness"-1 (temporary)</li>
                  </ul>
                </div>
              </div>

              <div class="clue-source">
                <h4>2. VENUE OWNERS</h4>
                <p><strong>Trigger:</strong> Visiting comedy clubs or theaters</p>
                
                <div class="clue-box">
                  <h5>Clue 1:</h5>
                  <p>"My comedy nights used to be packed. Now half my regulars are scared to come down here. These Tough Crowd guys heckle anyone who doesn't fit their idea of 'real' comedy."</p>
                  <p class="tags-earned"><strong>Story Tags Earned:</strong></p>
                  <ul>
                    <li>"Economic Impact"-1 (temporary)</li>
                    <li>"Targeting Modern Comedy" (temporary)</li>
                    <li>"Tough Crowd Identified" (temporary)</li>
                  </ul>
                </div>

                <div class="clue-box">
                  <h5>Clue 2:</h5>
                  <p>"They've been targeting the queer-friendly spaces specifically. Like they're trying to push us back into hiding."</p>
                  <p class="tags-earned"><strong>Story Tags Earned:</strong></p>
                  <ul>
                    <li>"Targeted Harassment"-3 (temporary)</li>
                    <li>"Pattern of Bigotry"-2 (temporary)</li>
                    <li>"Personal Stakes" (ongoing)</li>
                  </ul>
                </div>

                <div class="clue-box">
                  <h5>Clue 3:</h5>
                  <p>"The leader, Danny - he keeps talking about 'when comedy was honest.' Keeps mentioning some place called Moretti's, like it was sacred or something."</p>
                  <p class="tags-earned"><strong>Story Tags Earned:</strong></p>
                  <ul>
                    <li>"Moretti's Location Lead"-2 (temporary)</li>
                    <li>"Sacred Ground to Danny"-1 (temporary)</li>
                    <li>"Where Comedy Was 'Honest'" (temporary)</li>
                  </ul>
                </div>
              </div>

              <div class="clue-source">
                <h4>3. FRIGHTENED PATRONS</h4>
                <p><strong>Trigger:</strong> Finding victims of harassment</p>
                
                <div class="clue-box">
                  <h5>Clue 1:</h5>
                  <p>"I was just trying to enjoy the show when one of them started targeting me. Called me 'soft,' said I needed to 'toughen up.' Everyone laughed - not with me, at me. I haven't been back since."</p>
                  <p class="tags-earned"><strong>Story Tags Earned:</strong></p>
                  <ul>
                    <li>"Victim Testimony"-1 (temporary)</li>
                    <li>"Public Humiliation Tactic" (temporary)</li>
                    <li>"Creating Fear Through Shame"-2 (temporary)</li>
                  </ul>
                </div>

                <div class="clue-box">
                  <h5>Clue 2:</h5>
                  <p>"It's not just jokes anymore. Last night they cornered someone outside the Laugh Factory. Told them they were 'making the district weak' just by existing. That's when I called the police."</p>
                  <p class="tags-earned"><strong>Story Tags Earned:</strong></p>
                  <ul>
                    <li>"Escalating Violence"-3 (temporary)</li>
                    <li>"Physical Threats Made" (temporary)</li>
                    <li>"Urgent Timeline"-2 (temporary)</li>
                  </ul>
                </div>

                <div class="clue-box">
                  <h5>Clue 3:</h5>
                  <p>"I heard them say something about 'the Seven' having a plan. Whatever that means."</p>
                  <p class="tags-earned"><strong>Story Tags Earned:</strong></p>
                  <ul>
                    <li>"Ignorant Seven Connection"-2 (temporary)</li>
                    <li>"Part of Something Bigger"-2 (temporary)</li>
                  </ul>
                </div>
              </div>

              <div class="clue-source optional">
                <h4>4. LOCAL ACTIVIST (Optional)</h4>
                <p><strong>Trigger:</strong> Players seek out community organizers</p>
                
                <div class="npc-box">
                  <h5>👤 JAMIE CHEN</h5>
                  <p>Local organizer who's been tracking the harassment</p>
                  <p><strong>Information Provided:</strong></p>
                  <ul>
                    <li>Timeline of incidents over the past week</li>
                    <li>List of specifically targeted venues (all LGBTQ+ friendly)</li>
                    <li>Rumors about a "comedy club in a basement" where the group meets</li>
                    <li>Knowledge that this started right after a controversial article in the Village Voice</li>
                  </ul>
                  <p class="tags-earned"><strong>Story Tags Earned:</strong></p>
                  <ul>
                    <li>"Community Ally"-1 (ongoing)</li>
                    <li>"Detailed Timeline" (temporary)</li>
                    <li>"Village Voice Article Lead" (temporary)</li>
                    <li>"Basement Club Location"-2 (temporary)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="optional-encounter">
              <h3>⚔️ Optional: Random Encounter with Tough Crowd</h3>
              <p><strong>Trigger:</strong> Players linger or make themselves obvious</p>
              
              <div class="encounter-setup">
                <h4>Setup</h4>
                <p>A young non-binary performer is being circled by three Tough Crowd members, who are doing aggressive "crowd work" - really just bullying disguised as comedy.</p>
                <p><strong>Tough Crowd Member:</strong> "What is it, anyway? Can't even pick a side! That's what's wrong with kids today - no commitment, no backbone. In my day, you knew what you were and you lived with it!"</p>
              </div>

              <div class="combat-stats">
                <h4>Combat Stats</h4>
                <ul>
                  <li><strong>Tough Crowd Members (3):</strong> Ignorance 1 each</li>
                  <li><strong>Behavior:</strong> Will flee if reduced to Ignorance 0</li>
                  <li><strong>Special Attack:</strong> "Comedy Roast" (targets one PC, attempts to inflict embarrassed-2)</li>
                </ul>
              </div>

              <p class="tags-earned"><strong>Story Tags Earned for Intervening:</strong></p>
              <ul>
                <li>"Stood Up to Bullies"-2 (temporary)</li>
                <li>"Seen Their Tactics Firsthand"-1 (ongoing)</li>
                <li>"Made an Enemy" (temporary)</li>
              </ul>
            </div>

            <div class="mc-tip">
              <h4>💡 MC Notes</h4>
              <ul>
                <li>Let players choose which NPCs to approach</li>
                <li>Not all clues are needed - players determine investigation depth</li>
                <li>Track which story tags they've earned</li>
                <li>Optional encounter adds action but isn't required</li>
                <li>Once players have "Moretti's Location Lead", they can proceed to Scene 3</li>
              </ul>
            </div>
          </div>
        `
      },

      scene3: {
        title: "Scene 3: Moretti's Comedy Cellar",
        content: `
          <div class="script-section">
            <h2>🎪 Scene 3: Moretti's Comedy Cellar</h2>
            
            <div class="scene-description">
              <h3>Finding the Entrance</h3>
              <p>Following your leads, you discover the entrance to Moretti's Comedy Cellar - not in the Theater District proper, but tucked away in an alley that seems to exist between time zones. The brick facade looks unchanged since the 1970s, complete with faded posters advertising comics long dead or forgotten.</p>
              <p>A narrow staircase descends into darkness, the smell of old cigarettes and older dreams wafting up like ghosts.</p>
            </div>

            <div class="read-aloud">
              <h3>📖 Entering Moretti's</h3>
              <p>"As you descend, the world above fades away. The basement opens into a time capsule - a comedy club frozen in amber. Dim stage lights illuminate a small platform with a lone microphone stand. Tables circle the stage like supplicants at an altar. The walls are covered in signed photos from the club's glory days: smiling faces you might recognize from old TV specials, mixed with names you've never heard.</p>
              <p>But something's wrong. The whole place radiates wrongness - not danger exactly, but displacement. This space shouldn't exist anymore, but here it is, preserved by... what? Memory? Bitterness? Ignorance itself?"</p>
            </div>

            <div class="story-tags environmental">
              <h3>🏷️ Environmental Story Tags</h3>
              <ul>
                <li><strong>"Frozen in Time"-2 (ongoing)</strong> - The 1970s aesthetic is oppressive</li>
                <li><strong>"Sacred Ground to Danny" (ongoing)</strong> - This place means everything to him</li>
                <li><strong>"Heavy with Memory"-1 (ongoing)</strong> - Past echoes strongly here</li>
                <li><strong>"Ignorance-Saturated" (ongoing)</strong> - The walls themselves resist change</li>
              </ul>
            </div>

            <div class="exploration">
              <h3>🔍 Exploration Opportunities</h3>
              
              <div class="search-area">
                <h4>1. THE STAGE</h4>
                <div class="discovery">
                  <h5>Investigation</h5>
                  <p>The microphone stand is dented and scarred, the mic itself crackling with strange static when touched. Stage lights flicker like dying stars.</p>
                  <p class="tags-earned"><strong>Story Tags Available:</strong></p>
                  <ul>
                    <li>"Performance Anxiety"-1 (temporary) - Understanding the pressure Danny felt</li>
                    <li>"Center Stage Fear" (temporary) - Where Danny's trauma began</li>
                  </ul>
                </div>
              </div>

              <div class="search-area">
                <h4>2. THE PHOTO WALL</h4>
                <div class="discovery">
                  <h5>Investigation</h5>
                  <p>Dozens of signed 8x10 glossies. You spot a younger Danny Carbone multiple times - always in the background, never quite in focus, always just beside someone more famous. One photo shows him actually on stage... but someone's drawn a red X over his face.</p>
                  <p class="tags-earned"><strong>Story Tags Available:</strong></p>
                  <ul>
                    <li>"Always Second Fiddle"-2 (temporary) - Danny's professional frustration</li>
                    <li>"Marked for Failure" (temporary) - Someone (Danny himself?) marked his own face</li>
                    <li>"Background Player"-1 (temporary) - Never the star</li>
                  </ul>
                </div>
              </div>

              <div class="search-area">
                <h4>3. BACKSTAGE AREA</h4>
                <div class="discovery">
                  <h5>Investigation</h5>
                  <p>A cramped space with a cracked mirror surrounded by dead light bulbs. Graffiti covers the walls - crude jokes, phone numbers, desperate prayers from comedians hoping for their big break. One message is fresher than the others, written in marker: "REAL COMEDY DIED HERE. TIME TO RESURRECT IT."</p>
                  <p class="tags-earned"><strong>Story Tags Available:</strong></p>
                  <ul>
                    <li>"Danny's Manifesto"-2 (temporary) - His mission statement</li>
                    <li>"Death and Resurrection Theme" (temporary) - Messianic complex</li>
                    <li>"Comedian's Desperation"-1 (ongoing) - Universal performer anxiety</li>
                  </ul>
                </div>
              </div>

              <div class="search-area key-item">
                <h4>4. DANNY'S JOURNAL (Key Discovery)</h4>
                <div class="discovery">
                  <h5>Located: Hidden beneath a loose floorboard backstage</h5>
                  <p>A leather-bound journal filled with years of material - jokes, observations, bitter rants. The early entries show promise and passion. The later entries grow increasingly angry, targeting specific groups, blaming audiences for not understanding "real" comedy anymore.</p>
                  
                  <div class="journal-excerpts">
                    <h6>Key Excerpts:</h6>
                    <div class="journal-entry">
                      <p><em>"March 1985 - Killed at Moretti's tonight. Standing ovation. This is it. This is where I belong. Dad would be proud if he was still around."</em></p>
                      <p class="tags-earned"><strong>Tags Available:</strong> "Early Success Memory"-1 (temporary), "Father's Approval Sought" (temporary)</p>
                    </div>
                    
                    <div class="journal-entry">
                      <p><em>"June 1992 - They don't get it anymore. Too sensitive. Can't take a joke. They want everything soft and safe. That's not comedy, that's therapy."</em></p>
                      <p class="tags-earned"><strong>Tags Available:</strong> "Audience Disconnect"-2 (temporary), "Therapy vs Comedy"-1 (temporary)</p>
                    </div>
                    
                    <div class="journal-entry">
                      <p><em>"November 2003 - Lost another gig. Said my material was 'problematic.' What does that even mean? Comedy is supposed to push boundaries. Dad always said if they're not uncomfortable, you're not doing it right."</em></p>
                      <p class="tags-earned"><strong>Tags Available:</strong> "Father's Toxic Advice"-3 (temporary), "Justifying Harm"-2 (temporary)</p>
                    </div>
                    
                    <div class="journal-entry">
                      <p><em>"January 2024 - They contacted me. The Ignorant Seven. Finally, people who understand. People who remember when the world made sense. We're going to remind everyone what real laughter sounds like."</em></p>
                      <p class="tags-earned"><strong>Tags Available:</strong> "Seven's Recruitment"-3 (temporary), "Found Belonging in Hate"-2 (temporary), "Recent Radicalization" (temporary)</p>
                    </div>
                  </div>

                  <div class="mc-tip">
                    <h5>💡 Reading the Journal</h5>
                    <p>Let players decide how much to read. Each excerpt gives different tags. Reading the whole journal takes time but provides comprehensive understanding of Danny's fall.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="optional-encounter">
              <h3>⚔️ Optional: Confrontation in the Cellar</h3>
              <p><strong>Trigger:</strong> If players make noise or linger too long</p>
              
              <div class="encounter-setup">
                <p>Danny enters from a hidden door, flanked by 3-4 Tough Crowd members. He's not in his Justice Knight form yet - just a tired-looking man in his 60s wearing a leather jacket and jeans. But there's something about his eyes - they gleam with the Star of Ignorance.</p>
                
                <div class="npc-dialogue">
                  <p><strong>Danny:</strong> "So. House Rainbow finally shows up. Let me guess - Mama Jay sent you? Told you to come 'fix' me with your acceptance and your safe spaces?"</p>
                  <p>He laughs, but it's not a happy sound.</p>
                  <p><strong>Danny:</strong> "This place - Moretti's - this was the last place comedy was honest. Before everyone got soft. Before you had to worry about every word, every look, every joke. You want to stop me? You'll have to understand me first. And trust me, kids - you're not ready for that truth."</p>
                </div>
              </div>

              <div class="decision-point">
                <h4>Player Options:</h4>
                <ul>
                  <li><strong>TALK IT OUT:</strong> Try to reason with Danny here (difficult without Inner Space access)</li>
                  <li><strong>FIGHT:</strong> Combat with Danny (Ignorance 3) and Tough Crowd (Ignorance 1 each)</li>
                  <li><strong>FOLLOW:</strong> Danny may retreat to his Inner Space, providing entry</li>
                  <li><strong>INVESTIGATE FIRST:</strong> Danny gives them time to look around before confronting</li>
                </ul>
              </div>

              <p class="tags-earned"><strong>Story Tags from Confrontation:</strong></p>
              <ul>
                <li>"Direct Confrontation with Danny"-2 (temporary)</li>
                <li>"Saw Him Vulnerable"-1 (temporary)</li>
                <li>"He Mentioned His Father" (temporary)</li>
              </ul>
            </div>

            <div class="scene-transition">
              <h3>🚪 Transition to Inner Space</h3>
              <p>Whether through combat, conversation, or investigation, the path eventually leads to Danny's Inner Space. The entry point is the stage itself - when Danny is pressed or defeated, he retreats into a door that appears in the darkness behind the stage lights.</p>
              <p>The door leads to his apartment, the space where his pain crystallized into Ignorance.</p>
            </div>

            <div class="mc-tip">
              <h4>💡 MC Notes for This Scene</h4>
              <ul>
                <li>This scene builds understanding before the emotional confrontation</li>
                <li>The journal is crucial for context but not required</li>
                <li>Environmental tags here stack with ones earned in Inner Space</li>
                <li>Danny's optional appearance can be adjusted based on pacing</li>
                <li>Players should feel the weight of history and pain in this space</li>
                <li>Moretti's represents what Danny thinks he's fighting for</li>
              </ul>
            </div>
          </div>
        `
      },

      innerSpace: {
        title: "Scene 4: Danny's Inner Space",
        content: `
          <div class="script-section">
            <h2>💭 Scene 4: Danny's Inner Space - The Apartment</h2>
            
            <div class="scene-description">
              <h3>Entering the Inner Space</h3>
              <p>The transition is disorienting. One moment you're in Moretti's basement, the next you're standing in a cramped studio apartment that smells like old Chinese takeout and failure. But this isn't just any apartment - it's a memory given form, held together by Danny's Ignorance.</p>
            </div>

            <div class="read-aloud">
              <h3>📖 The Apartment</h3>
              <p>"The apartment is frozen in the late 1990s - wood-paneled walls, a box TV on a milk crate, a futon that's seen better days. Posters of comedy legends watch from the walls like disappointed gods. A desk is buried under rejection letters, unopened bills, and notes for jokes that never quite landed.</p>
              <p>But the centerpiece is the answering machine on the desk - its red light blinking infinitely, demanding attention. You can hear a voice coming from it, tinny and distant: a man's voice, older, stern.</p>
              <p>This is where Danny lives - not his physical home, but the emotional prison he built brick by bitter brick."</p>
            </div>

            <div class="story-tags environmental">
              <h3>🏷️ Environmental Story Tags</h3>
              <ul>
                <li><strong>"Frozen Failure"-3 (ongoing)</strong> - Time stopped at Danny's lowest point</li>
                <li><strong>"Father's Voice"-2 (ongoing)</strong> - His judgment echoes everywhere</li>
                <li><strong>"Rejection Letters" (ongoing)</strong> - Physical manifestations of his pain</li>
                <li><strong>"1990s Prison" (ongoing)</strong> - He can't move forward</li>
              </ul>
            </div>

            <div class="npc-encounter">
              <h3>👤 DANNY CARBONE - Inner Space Form</h3>
              <div class="npc-stats">
                <p><strong>Appearance:</strong> Younger than in reality (late 30s), wearing the same leather jacket but clean, new. Hair darker. Eyes constantly checking the answering machine. The Star of Ignorance pulses on his chest - a shield and a prison both.</p>
                <p><strong>Ignorance Limit:</strong> 5 (starts at 3, can increase to 5 if threatened)</p>
                <p><strong>Behavior:</strong> Defensive, angry, but underneath - terrified of being vulnerable</p>
              </div>

              <div class="npc-dialogue">
                <p><strong>Danny (as PCs enter):</strong> "So you followed me here. Into the real joke. Welcome to the punchline of Danny Carbone's life - the apartment where every dream came to die."</p>
                <p>He gestures at the rejection letters, the answering machine.</p>
                <p><strong>Danny:</strong> "You want to understand? Fine. But you're going to hear what my father had to say about it first."</p>
                <p>He presses play on the answering machine.</p>
              </div>
            </div>

            <div class="key-item">
              <h3>📞 THE ANSWERING MACHINE MESSAGES</h3>
              
              <div class="message">
                <h4>Message 1 (Early Days):</h4>
                <p><em>"Danny. Your mother told me about that comedy thing you're doing. Let me tell you something - comedy's not a real job. You want to make people laugh? Be a clown at children's parties. You want to be a man? Get a real career. Call me back when you're ready to be serious."</em></p>
                <p class="tags-earned"><strong>Tags Available:</strong> "Father's Disapproval"-2 (temporary), "Comedy Delegitimized" (temporary)</p>
              </div>

              <div class="message">
                <h4>Message 2 (Mid-Career):</h4>
                <p><em>"Saw you on that late-night show. Third-rate time slot, weak material. You're going soft, Danny. Comedy's supposed to have teeth. That touchy-feely crap - that's not comedy, that's cowardice. Real men aren't afraid to offend people. Call me when you remember how to be funny."</em></p>
                <p class="tags-earned"><strong>Tags Available:</strong> "Toxic Masculinity"-3 (temporary), "Offense as Strength"-2 (temporary)</p>
              </div>

              <div class="message">
                <h4>Message 3 (Recent):</h4>
                <p><em>"I'm dead, Danny. Been dead two years now. But you're still listening to these messages, aren't you? Still trying to make me proud. Pathetic. Even my ghost knows you failed."</em></p>
                <p>This message is different - Danny recorded it himself, imitating his father's voice.</p>
                <p class="tags-earned"><strong>Tags Available:</strong> "Self-Imposed Judgment"-3 (temporary), "Father's Ghost"-2 (temporary), "Internalized Voice" (temporary)</p>
              </div>

              <div class="mc-tip">
                <p><strong>💡 The Answering Machine:</strong> This is the core of Danny's Ignorance. His father's voice (and his own internalized version) drives his need to prove himself through cruelty.</p>
              </div>
            </div>

            <div class="confrontation-options">
              <h3>🎭 Confrontation Approaches</h3>
              
              <div class="approach-option">
                <h4>APPROACH 1: TALK IT OUT</h4>
                <p>Address Danny's pain, his father's influence, his fear of vulnerability</p>
                
                <div class="dialogue-options">
                  <h5>Effective Arguments:</h5>
                  
                  <div class="dialogue-choice">
                    <h6>Option: Address the Father's Voice</h6>
                    <p><em>"That voice on the machine - that's not comedy. That's abuse. Your father was wrong about what makes someone strong."</em></p>
                    <p class="tags-earned"><strong>Effective With Tags:</strong> "Father's Toxic Advice"-3, "Saw Victim Testimony"-1</p>
                    <p><strong>Danny's Response:</strong> "He was just... trying to make me tough. The world's not kind to soft people."</p>
                    <p class="tags-earned"><strong>Story Tags Earned:</strong> "Challenged His Core Belief"-2 (temporary), "Made Him Question" (temporary)</p>
                  </div>

                  <div class="dialogue-choice">
                    <h6>Option: Share Vulnerability</h6>
                    <p><em>"You think you're the only one who's scared? Who worries they're not enough? That's not weakness - that's being human."</em></p>
                    <p class="tags-earned"><strong>Effective With Tags:</strong> "Community Experience" tags, personal character themes about identity</p>
                    <p><strong>Danny's Response:</strong> "But if I admit that... if I'm soft... then he was right. I am weak."</p>
                    <p class="tags-earned"><strong>Story Tags Earned:</strong> "Shared Vulnerability"-2 (temporary), "Connected on Human Level"-1 (ongoing)</p>
                  </div>

                  <div class="dialogue-choice">
                    <h6>Option: Reframe Comedy</h6>
                    <p><em>"Real comedy doesn't punch down - it punches up. It speaks truth to power. What you're doing? That's just bullying with a laugh track."</em></p>
                    <p class="tags-earned"><strong>Effective With Tags:</strong> "Understanding Modern Comedy", "Saw His Old Performances"</p>
                    <p><strong>Danny's Response:</strong> "But that's not what I learned. That's not what made people laugh back then."</p>
                    <p class="tags-earned"><strong>Story Tags Earned:</strong> "Comedy Philosophy Challenge"-2 (temporary), "Planted Doubt"-1 (temporary)</p>
                  </div>

                  <div class="dialogue-choice">
                    <h6>Option: Acknowledge Lost Potential</h6>
                    <p><em>"I saw your early stuff. You were good - really good. What happened wasn't about you being soft. The world changed, and instead of growing with it, you got stuck."</em></p>
                    <p class="tags-earned"><strong>Effective With Tags:</strong> "Early Success Memory"-1, "Always Second Fiddle"-2</p>
                    <p><strong>Danny's Response:</strong> (Visible emotion) "I... I was good, wasn't I? Before everything went wrong."</p>
                    <p class="tags-earned"><strong>Story Tags Earned:</strong> "Recognized His Past Self"-3 (temporary), "Moment of Pride" (temporary)</p>
                  </div>
                </div>

                <div class="success-conditions">
                  <h5>Success Conditions:</h5>
                  <p>Successfully TALK IT OUT requires reducing Danny's Ignorance AND making him question his core beliefs. Combinations of tags and arguments are more effective than single approaches.</p>
                  <ul>
                    <li><strong>Minimum:</strong> 3 successful arguments + relevant story tags</li>
                    <li><strong>Optimal:</strong> Addressing father's voice + sharing vulnerability + reframing comedy</li>
                  </ul>
                </div>
              </div>

              <div class="approach-option">
                <h4>APPROACH 2: SLAY (Combat)</h4>
                <p>Break through Danny's Ignorance barriers through direct confrontation</p>
                
                <div class="combat-details">
                  <h5>Danny's Combat Stats:</h5>
                  <ul>
                    <li><strong>Ignorance Limit:</strong> 5 (starts at 3, increases if threatened)</li>
                    <li><strong>Special Ability:</strong> "Cutting Roast" - targets player's insecurities (attempts to inflict ashamed-2 or worthless-1)</li>
                    <li><strong>Environment Hazard:</strong> Rejection letters swirl around room, may inflict unwanted-1</li>
                    <li><strong>Father's Voice:</strong> Answering machine plays on loop, potentially empowering Danny</li>
                  </ul>

                  <h5>Combat Story Tags:</h5>
                  <div class="combat-tag">
                    <h6>Destroying the Answering Machine</h6>
                    <p>If a player targets and destroys the answering machine (creative use of power/move), Danny loses access to "Father's Voice" buff.</p>
                    <p class="tags-earned"><strong>Tags Earned:</strong> "Silenced the Voice"-3 (temporary), "Symbolic Victory"-2 (temporary)</p>
                  </div>

                  <div class="combat-tag">
                    <h6>Using the Environment</h6>
                    <p>Rejection letters, posters, and other apartment elements can be used creatively. Examples:</p>
                    <ul>
                      <li>Tear down father's photos → "Rejected His Judgment"-2</li>
                      <li>Rewrite rejection letters → "Changed the Narrative"-1</li>
                      <li>Turn on different music → "Broke His Time Loop" (environmental)</li>
                    </ul>
                  </div>

                  <h5>Victory Conditions:</h5>
                  <p>Reduce Danny to Ignorance 0. However, pure combat without emotional context leads to him fleeing rather than redemption.</p>
                  <p><strong>For full success:</strong> Combat must be paired with at least one TALK IT OUT or CARE moment.</p>
                </div>
              </div>

              <div class="approach-option">
                <h4>APPROACH 3: CARE</h4>
                <p>Show Danny compassion and help him see himself as worthy of it</p>
                
                <div class="care-actions">
                  <h5>Care-Based Actions:</h5>
                  
                  <div class="care-option">
                    <h6>Fix Something in the Apartment</h6>
                    <p>Clean up the space, organize the bills, make it livable. Show Danny his life doesn't have to be frozen in failure.</p>
                    <p class="tags-earned"><strong>Tags Earned:</strong> "Made Space for Hope"-2 (temporary), "Caring Action"-1 (ongoing)</p>
                  </div>

                  <div class="care-option">
                    <h6>Offer to Help With New Material</h6>
                    <p>Suggest working together on comedy that connects rather than divides. Be his collaborator, not his judge.</p>
                    <p class="tags-earned"><strong>Tags Earned:</strong> "Creative Partnership"-2 (temporary), "Saw His Potential" (ongoing)</p>
                  </div>

                  <div class="care-option">
                    <h6">Listen to His Story</h6>
                    <p>Just... listen. Let Danny talk about his career, his father, his fears without trying to fix it immediately.</p>
                    <p class="tags-earned"><strong>Tags Earned:</strong> "Witnessed His Pain"-2 (temporary), "Gave Him Space"-1 (temporary)</p>
                  </div>

                  <div class="care-option">
                    <h6>Share Your Own Struggles</h6>
                    <p>Open up about times you felt like failures, when you wondered if you were enough. Make him feel less alone.</p>
                    <p class="tags-earned"><strong>Tags Earned:</strong> "Mutual Vulnerability"-3 (temporary), "Not Alone" (ongoing)</p>
                  </div>
                </div>

                <div class="success-conditions">
                  <h5>Success Through Care:</h5>
                  <p>CARE approaches work best when combined with understanding Danny's core wounds. Pure care without addressing the father's voice may feel empty to him.</p>
                  <p><strong>Most Effective:</strong> Care action + acknowledgment of his pain + vision of different future</p>
                </div>
              </div>
            </div>

            <div class="resolution">
              <h3>🎬 Resolution Outcomes</h3>
              
              <div class="outcome success">
                <h4>FULL SUCCESS: Danny is Redeemed</h4>
                <p>The answering machine shatters (whether physically or symbolically). The apartment begins to transform - walls become lighter, rejection letters dissolve, posters of comedy legends smile rather than judge.</p>
                
                <div class="read-aloud">
                  <h5>Resolution Scene:</h5>
                  <p><em>"Danny slumps into the futon, and for the first time, he looks his actual age. The Star of Ignorance flickers, cracks, falls away like old paint. His Pawns - the Tough Crowd members - appear in the apartment's doorway, looking confused but free.</em></p>
                  <p><em>Danny looks at you with genuine tears in his eyes.</em></p>
                  <p><strong>Danny:</strong> "I... I've been so angry for so long, I forgot what it felt like to just... be sad. To admit I'm scared. To say 'I'm hurting' instead of making everyone else hurt worse."</p>
                  <p>He picks up a piece of paper - a rejection letter - and instead of reading it, he writes something new on the back.</p>
                  <p><strong>Danny:</strong> "Maybe it's not too late to learn a new kind of comedy. The kind that builds up instead of tears down. Think... think you kids would help an old comic find his way again?"</p>
                </div>

                <p class="tags-earned"><strong>Story Tags Earned:</strong></p>
                <ul>
                  <li>"Redeemed Danny Carbone"-3 (ongoing)</li>
                  <li>"Freed the Pawns"-2 (ongoing)</li>
                  <li>"Broke the Cycle" (ongoing)</li>
                  <li>"New Comedy Philosophy" (ongoing)</li>
                  <li>"Defeated First of Seven"-3 (ongoing)</li>
                </ul>
              </div>

              <div class="outcome partial">
                <h4>PARTIAL SUCCESS: Danny Retreats</h4>
                <p>You make progress - the answering machine goes quiet, some of the rejection letters fade - but Danny isn't ready to fully let go. He sees the truth but can't quite accept it yet.</p>
                
                <div class="read-aloud">
                  <h5>Resolution Scene:</h5>
                  <p><strong>Danny:</strong> "You... you're not wrong. About any of it. But I can't... I've been this person for so long. I don't know who I am without the anger."</p>
                  <p>He backs toward a door that wasn't there before - an exit from his Inner Space.</p>
                  <p><strong>Danny:</strong> "I need time. To think. To figure out... maybe you're right. Maybe comedy can be different. But I can't promise anything."</p>
                  <p>The Tough Crowd members fade away - not freed, but no longer under his direct control either.</p>
                </div>

                <p class="tags-earned"><strong>Story Tags Earned:</strong></p>
                <ul>
                  <li>"Complicated Relationship with Danny"-1 (ongoing)</li>
                  <li>"Freed the Pawns" (temporary)</li>
                  <li>"Partial Victory"-1 (temporary)</li>
                  <li>"May Return"-1 (ongoing)</li>
                </ul>
              </div>

              <div class="outcome failure">
                <h4>FAILURE: Danny Escapes</h4>
                <p>The apartment becomes a house of mirrors, all reflecting Danny's father's disappointed face. The Queerz find themselves back in the present-day Moretti's as Danny rebuilds his Ignorance barriers.</p>
                
                <div class="read-aloud">
                  <h5>Resolution Scene:</h5>
                  <p><strong>Danny:</strong> "Nice try, kids. But some lessons can only be learned the hard way. Maybe next time you'll be ready for the truth."</p>
                  <p>He transforms fully into his Justice Knight form - The Jester - armor of bitterness gleaming with the Star of Ignorance.</p>
                  <p><strong>Danny:</strong> "The world needs to be reminded what real strength looks like. And if I have to force that lesson down everyone's throat one joke at a time, so be it."</p>
                  <p>He vanishes into the shadows of Moretti's, his Tough Crowd reforming around him.</p>
                </div>

                <p class="tags-earned"><strong>Story Tags Earned (Negative):</strong></p>
                <ul>
                  <li>"Failed to Reach Danny"-2 (temporary)</li>
                  <li>"Theater District in Danger"-3 (ongoing)</li>
                  <li>"Danny's Vendetta" (ongoing)</li>
                  <li>"Need to Try Again"-1 (ongoing)</li>
                </ul>
              </div>
            </div>

            <div class="mc-tip">
              <h4>💡 MC Notes for Inner Space</h4>
              <ul>
                <li>This is the emotional heart of the chapter</li>
                <li>Players should feel Danny's pain even as they oppose him</li>
                <li>Multiple approaches can work - honor different play styles</li>
                <li>The answering machine is symbolic - creative solutions welcomed</li>
                <li>Combination approaches (TALK + SLAY, CARE + TALK) are most effective</li>
                <li>Even "failure" should feel meaningful and setup future encounters</li>
                <li>Track all story tags earned - they'll matter in future chapters</li>
              </ul>
            </div>
          </div>
        `
      },

      aftermath: {
        title: "Aftermath & Connections",
        content: `
          <div class="script-section">
            <h2>📜 Aftermath and Future Connections</h2>

            <div class="aftermath-scene redeemed">
              <h3>✨ If Danny is Redeemed</h3>
              
              <div class="scene-setup">
                <h4>Scene: Three Days Later - Café Greenwich</h4>
                <p>Danny sits awkwardly at a corner table, still wearing his leather jacket but with the Star of Ignorance replaced by reading glasses as he flips through a notebook. Mama Jay refills his coffee with the same warmth she shows everyone, but her eyes stay watchful.</p>
              </div>

              <div class="read-aloud">
                <p><strong>Danny to the PCs:</strong> "So, uh... turns out there are four more like me. Got contacted by this Ignorant Seven group when I was at my lowest. They said they understood about being 'cancelled' by a world that got too soft. But after what you kids showed me..."</p>
                <p>He closes the notebook - it's full of new material, gentler material that finds humor in shared human struggles rather than targeting the vulnerable.</p>
                <p>"I think maybe the world didn't get too soft. Maybe I got too hard. Anyway, there's this professor type - Dr. Pierce - who's been making noise about 'fixing' people's thinking. Sounds like he might be next on your list."</p>
              </div>

              <div class="story-tags future">
                <h4>🏷️ Story Tags Available for Future Chapters</h4>
                <ul>
                  <li><strong>"Reformed Comedian Contact"-2 (ongoing)</strong> - Danny helps with future investigations</li>
                  <li><strong>"Understanding Fallen Icons" (ongoing)</strong> - Bonus to relating to other corrupted celebrities</li>
                  <li><strong>"Theater District Allies"-2 (ongoing)</strong> - The entertainment community trusts the PCs</li>
                  <li><strong>"Mama Jay's Approval" (ongoing)</strong> - She respects what you did</li>
                </ul>
              </div>

              <div class="future-connections">
                <h4>Future Chapter Hooks:</h4>
                <ul>
                  <li>Danny can provide intel on other Ignorant Seven members</li>
                  <li>He knows their recruiting tactics and vulnerabilities</li>
                  <li>Theater District becomes a safe haven for the team</li>
                  <li>Danny may appear as support NPC in later chapters</li>
                  <li><strong>Next Target:</strong> Dr. Marcus Pierce (The Professor) - Chapter 2</li>
                </ul>
              </div>
            </div>

            <div class="aftermath-scene partial">
              <h3>⚖️ If Partial Success</h3>
              
              <div class="scene-setup">
                <h4>Scene: Reports from the Theater District</h4>
                <p>The Tough Crowd has disbanded, but Danny is still out there. Witnesses report seeing him alone at comedy open mics, trying out gentler material but struggling. He's not actively causing harm, but he's also not helping. He's... complicated.</p>
              </div>

              <div class="story-tags future">
                <h4>🏷️ Story Tags Available for Future Chapters</h4>
                <ul>
                  <li><strong>"Complicated History with Danny"-1 (ongoing)</strong> - Mixed reactions in future encounters</li>
                  <li><strong>"Reputation in Theater District" (ongoing)</strong> - Some progress made</li>
                  <li><strong>"Partial Redemption" (ongoing)</strong> - He's trying, but not there yet</li>
                  <li><strong>"Potential Future Ally" (temporary)</strong> - Maybe he'll help later</li>
                </ul>
              </div>

              <div class="future-connections">
                <h4>Future Chapter Implications:</h4>
                <ul>
                  <li>Danny might appear again, could go either way</li>
                  <li>Theater District is safer but still wary</li>
                  <li>Less reliable information about Ignorant Seven</li>
                  <li>Possible redemption arc continues in later chapters</li>
                  <li>Players may encounter him working through issues</li>
                </ul>
              </div>
            </div>

            <div class="aftermath-scene failed">
              <h3>❌ If Failed</h3>
              
              <div class="scene-setup">
                <h4>Scene: Emergency Meeting at Café Greenwich</h4>
                <p>Mama Jay's expression is grave as she shows you her phone - videos of Danny's "teachings" spreading online, other "cancelled" comedians starting to follow his lead.</p>
              </div>

              <div class="read-aloud">
                <p><strong>Mama Jay:</strong> "He's got a following now, sugar. And they're getting bolder. We need to find those other members of the Seven before this gets worse."</p>
              </div>

              <div class="story-tags future">
                <h4>🏷️ Story Tags Available for Future Chapters</h4>
                <ul>
                  <li><strong>"Danny's Vendetta"-2 (ongoing)</strong> - He specifically targets the PCs in future</li>
                  <li><strong>"Theater District Under Threat"-3 (ongoing)</strong> - Ongoing problem to resolve</li>
                  <li><strong>"Growing Movement" (ongoing)</strong> - More people are joining him</li>
                  <li><strong>"Need Redemption" (ongoing)</strong> - Unfinished business weighs on you</li>
                </ul>
              </div>

              <div class="future-connections">
                <h4>Future Chapter Complications:</h4>
                <ul>
                  <li>Danny becomes a recurring antagonist</li>
                  <li>His movement grows, recruiting more bitter celebrities</li>
                  <li>Theater District remains dangerous territory</li>
                  <li>Harder difficulty in future social encounters (reputation damaged)</li>
                  <li>May need to face Danny again before final confrontation</li>
                  <li>Other Ignorant Seven members know about the team</li>
                </ul>
              </div>
            </div>

            <div class="ignorant-seven-intel">
              <h3>🎭 The Ignorant Seven - What Danny Knows</h3>
              <p><em>(Information available if Danny is redeemed)</em></p>
              
              <div class="seven-member">
                <h4>1. Danny "The Jester" Carbone (RESOLVED)</h4>
                <p><strong>Theme:</strong> Comedy weaponized against change</p>
              </div>

              <div class="seven-member">
                <h4>2. Dr. Marcus Pierce "The Professor"</h4>
                <p><strong>Theme:</strong> Conversion therapy and "fixing" identity</p>
                <p><strong>Danny's Intel:</strong> "Runs some kind of clinic. Says he can 'cure' people. Makes my stomach turn even thinking about it."</p>
              </div>

              <div class="seven-member">
                <h4>3. Victoria Chen "The Champion"</h4>
                <p><strong>Theme:</strong> Athletic excellence used to enforce gender norms</p>
                <p><strong>Danny's Intel:</strong> "Olympic athlete. Real 'biological advantage' type. Bitter about something."</p>
              </div>

              <div class="seven-member">
                <h4>4. Robert Kane "The Mogul"</h4>
                <p><strong>Theme:</strong> Corporate power crushing diversity initiatives</p>
                <p><strong>Danny's Intel:</strong> "Rich guy. Real rich. Funds the operation. Hates what he calls 'woke capitalism.'"</p>
              </div>

              <div class="seven-member">
                <h4>5. Alexandra "The Titan"</h4>
                <p><strong>Theme:</strong> Social media influence spreading hate</p>
                <p><strong>Danny's Intel:</strong> "Online personality. Millions of followers. Says she's 'just asking questions' but... you know the type."</p>
              </div>

              <div class="seven-members-unknown">
                <h4>6 & 7: Unknown</h4>
                <p><strong>Danny's Intel:</strong> "Never met them. Kept separate. But I heard whispers - something about law enforcement and politics. They're the ones running the show."</p>
              </div>
            </div>

            <div class="mc-tip">
              <h4>💡 MC Notes on Aftermath</h4>
              <ul>
                <li>The outcome here shapes the entire campaign</li>
                <li>Even "failure" provides hooks for future redemption</li>
                <li>Danny's intel on the Seven should feel earned, not freely given</li>
                <li>Players should feel consequences of their choices</li>
                <li>Theater District becomes either ally or problem depending on resolution</li>
                <li>Story tags from this chapter carry significant weight going forward</li>
              </ul>
            </div>
          </div>
        `
      },

      scaling: {
        title: "Scaling & MC Tips",
        content: `
          <div class="script-section">
            <h2>⚖️ Scaling Notes for Different Group Sizes</h2>

            <div class="scaling-option">
              <h3>1-2 Players: Intimate Investigation</h3>
              <div class="scaling-details">
                <h4>Adjustments:</h4>
                <ul>
                  <li><strong>Tough Crowd:</strong> Reduce to size factor 0 (individuals, not groups)</li>
                  <li><strong>Danny's Ignorance:</strong> Limit drops to 3</li>
                  <li><strong>Focus:</strong> More investigation and Inner Space, less combat</li>
                  <li><strong>NPC Support:</strong> Mama Jay or Jamie Chen may assist directly</li>
                </ul>

                <h4>Story Tag Bonus:</h4>
                <p>Each successful investigation grants an additional <strong>"Working as a Team"-1</strong> tag</p>

                <h4>Pacing:</h4>
                <ul>
                  <li>Deeper emotional conversations with Danny</li>
                  <li>More time exploring Moretti's and reading journal</li>
                  <li>Inner Space can have multiple scenes/approaches</li>
                  <li>Emphasize roleplay over combat mechanics</li>
                </ul>
              </div>
            </div>

            <div class="scaling-option">
              <h3>3-4 Players: Standard Experience</h3>
              <div class="scaling-details">
                <h4>Adjustments:</h4>
                <ul>
                  <li>Encounters as written in main script</li>
                  <li>Balanced combat and social challenges</li>
                  <li>All optional encounters available</li>
                </ul>

                <h4>Pacing:</h4>
                <ul>
                  <li>Investigation phase: 1-2 hours</li>
                  <li>Moretti's exploration: 30-45 minutes</li>
                  <li>Inner Space confrontation: 1-1.5 hours</li>
                  <li>Total session: 3-4 hours</li>
                </ul>
              </div>
            </div>

            <div class="scaling-option">
              <h3>5-6 Players: Epic Confrontation</h3>
              <div class="scaling-details">
                <h4>Adjustments:</h4>
                <ul>
                  <li><strong>All Ignorance Limits:</strong> Increase by 1-2</li>
                  <li><strong>Tough Crowd:</strong> Add second wave in final battle</li>
                  <li><strong>Environmental Challenges:</strong> Collapsing venue, fire hazard, civilian evacuation</li>
                  <li><strong>Danny's Abilities:</strong> Add area attacks, environmental manipulation</li>
                </ul>

                <h4>Additional Story Tags:</h4>
                <ul>
                  <li><strong>"Large Group Intimidation"-1 (ongoing)</strong> - Enemies are more wary</li>
                  <li><strong>"Crowd Control Experience" (temporary)</strong> - Bonus when managing civilians</li>
                </ul>

                <h4>Encounter Additions:</h4>
                <ul>
                  <li>Multiple Tough Crowd groups in different Theater District locations</li>
                  <li>Moretti's has trapped areas requiring teamwork</li>
                  <li>Inner Space may split party into different memory rooms</li>
                  <li>Civilians need evacuation during climax</li>
                </ul>
              </div>
            </div>

            <div class="scaling-option">
              <h3>7+ Players: City-Wide Crisis</h3>
              <div class="scaling-details">
                <h4>Adjustments:</h4>
                <ul>
                  <li><strong>Scope:</strong> Epic confrontation affecting multiple Theater District venues simultaneously</li>
                  <li><strong>Danny's Forces:</strong> Lieutenant-level allies (other "old school" comedians)</li>
                  <li><strong>Structure:</strong> Multi-stage battle across several locations</li>
                  <li><strong>Stakes:</strong> City-wide consequences for success/failure</li>
                </ul>

                <h4>Additional Story Tags:</h4>
                <ul>
                  <li><strong>"Theater District Defenders"-3 (ongoing)</strong> - Major reputation</li>
                  <li><strong>"Coordinated Strike" (temporary)</strong> - Ability to split party effectively</li>
                  <li><strong>"City-Wide Impact"-2 (ongoing)</strong> - Your actions have major consequences</li>
                </ul>

                <h4>Epic Elements:</h4>
                <ul>
                  <li>News crews covering the confrontation</li>
                  <li>Multiple villain lieutenants to defeat</li>
                  <li>Party splits into teams for different objectives</li>
                  <li>Innocent bystanders become plot points</li>
                  <li>Success or failure affects future chapters significantly</li>
                  <li>Potential for legendary story tags</li>
                </ul>
              </div>
            </div>

            <div class="mc-tips-section">
              <h2>💡 MC Tips for Running This Chapter</h2>

              <div class="tip-category">
                <h3>Using Story Tags Effectively</h3>
                <ul>
                  <li><strong>Remind Players:</strong> "Remember, you have 'Targeting LGBTQ+ Venues'-3 - that would be powerful here."</li>
                  <li><strong>Allow Stacking:</strong> Story tags + character tags = devastating combinations</li>
                  <li><strong>Environmental Tags Affect Everyone:</strong> "Creative Energy" helps all players in Theater District</li>
                  <li><strong>Tag Upgrades:</strong> "Danny's Identity"-1 can become "-3" with more research</li>
                  <li><strong>Temporary vs Ongoing:</strong> Track which persist to future chapters</li>
                  <li><strong>Let Players Be Creative:</strong> If they find a way to use a tag, allow it</li>
                </ul>
              </div>

              <div class="tip-category">
                <h3>Pacing the Investigation</h3>
                <ul>
                  <li>Don't require all clues - let players decide when they have enough</li>
                  <li>If stuck, have NPCs offer additional information</li>
                  <li>Optional encounter can provide urgency if pacing drags</li>
                  <li>Theater District can be revisited between scenes</li>
                  <li>Jamie Chen can summarize if players want to skip details</li>
                </ul>
              </div>

              <div class="tip-category">
                <h3>Handling Danny's Inner Space</h3>
                <ul>
                  <li><strong>Multiple Approaches Work:</strong> Don't favor one over others</li>
                  <li><strong>Answering Machine is Key:</strong> However they deal with it, make it meaningful</li>
                  <li><strong>Show Danny's Humanity:</strong> He's hurt, not evil</li>
                  <li><strong>Emotional Beats Matter:</strong> Pause for player reactions to heavy moments</li>
                  <li><strong>Partial Success is Valid:</strong> Not everything needs perfect resolution</li>
                  <li><strong>Track Argument Quality:</strong> Effective arguments > number of attempts</li>
                </ul>
              </div>

              <div class="tip-category">
                <h3>Making Failure Meaningful</h3>
                <ul>
                  <li>Failure isn't "game over" - it's "to be continued"</li>
                  <li>Danny escaping creates recurring antagonist</li>
                  <li>Negative story tags provide future redemption arcs</li>
                  <li>Theater District threat continues to next session</li>
                  <li>Players should feel weight of loss, not punishment</li>
                  <li>Offer chance to try again in future chapter</li>
                </ul>
              </div>

              <div class="tip-category">
                <h3>Tag Economy Management</h3>
                <ul>
                  <li><strong>Temporary Tags:</strong> Last until end of scene or chapter (MC's call)</li>
                  <li><strong>Ongoing Tags:</strong> Write these down - they persist across campaign</li>
                  <li><strong>Environmental Tags:</strong> Affect space itself, anyone can invoke</li>
                  <li><strong>Burning Tags:</strong> Some tags can be "spent" for dramatic moments</li>
                  <li><strong>Tag Limits:</strong> No hard limit, but keep track of most relevant ones</li>
                  <li><strong>Tag Combinations:</strong> Encourage creative stacking</li>
                </ul>
              </div>

              <div class="tip-category">
                <h3>Connecting to Future Chapters</h3>
                <ul>
                  <li>Danny's intel (if redeemed) feeds into Chapter 2: The Professor</li>
                  <li>"Understanding Fallen Icons" tag helps with other Seven members</li>
                  <li>Theater District becomes resource or liability</li>
                  <li>Mama Jay's approval affects House Rainbow relationships</li>
                  <li>Ignorant Seven members know about PCs based on outcome</li>
                  <li>Reputation tags carry weight in social encounters</li>
                </ul>
              </div>
            </div>

            <div class="summary-box">
              <h2>📊 Chapter Summary by Numbers</h2>
              
              <div class="stat-grid">
                <div class="stat-item">
                  <h3>100+</h3>
                  <p>Total Story Tags Available</p>
                </div>
                <div class="stat-item">
                  <h3>4</h3>
                  <p>Major Scenes</p>
                </div>
                <div class="stat-item">
                  <h3>15+</h3>
                  <p>Investigation Clues</p>
                </div>
                <div class="stat-item">
                  <h3>3</h3>
                  <p>Confrontation Approaches</p>
                </div>
                <div class="stat-item">
                  <h3>3</h3>
                  <p>Possible Outcomes</p>
                </div>
                <div class="stat-item">
                  <h3>1/7</h3>
                  <p>Ignorant Seven Defeated</p>
                </div>
              </div>
            </div>

            <div class="final-notes">
              <h2>🎬 Final MC Notes</h2>
              <p><strong>This chapter sets the tone for the entire Ignorant Seven campaign.</strong> It demonstrates that:</p>
              <ul>
                <li>Villains are people with pain, not monsters</li>
                <li>Redemption is possible but not guaranteed</li>
                <li>Choices matter and consequences persist</li>
                <li>Story Tags are tools for narrative power</li>
                <li>Community building is as important as combat</li>
              </ul>
              
              <p><strong>Trust your players.</strong> They'll find creative solutions you didn't anticipate. The story tags system is designed to reward that creativity. If they come up with something brilliant that uses their tags in unexpected ways, let it work.</p>
              
              <p><strong>Trust the system.</strong> The combination of TALK IT OUT, SLAY, and CARE gives multiple paths to success. Some groups will want to fight, some will want to talk, some will want to fix things with compassion. All are valid.</p>
              
              <p><strong>Trust the story.</strong> Danny's arc is about the pain of irrelevance and the toxicity that pain can create. Whether your players redeem him, partially reach him, or fail entirely, the story of a broken man trying to make sense of a world that moved on without him will resonate.</p>
              
              <p class="emphasis">Most importantly: <strong>Have fun.</strong> This is a game about queer heroes using love, authenticity, and fierce community to heal a broken world. That's a beautiful story worth telling together.</p>
            </div>
          </div>
        `
      }
    }
  },
  
  chapter2: {
    title: "Chapter 2: The Professor's Prescription",
    subtitle: "WITH BRANCHING NARRATIVE",
    tabs: {
      overview: {
        title: "Overview",
        content: `
          <div class="script-section">
            <h2>🎓 Chapter 2: The Professor's Prescription</h2>
            
            <div class="branching-notice" style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
              <h3>⚠️ BRANCHING NARRATIVE</h3>
              <p><strong>This chapter has THREE different openings based on your Chapter 1 outcome!</strong></p>
              <p>Check your Campaign Settings (⚙️ button) to see which outcome you selected:</p>
              <ul>
                <li><strong>Danny Redeemed:</strong> Café Greenwich scene with Danny as ally</li>
                <li><strong>Danny Partially Reformed:</strong> Coffee cart scene with community concern</li>
                <li><strong>Danny's Vendetta:</strong> House Rainbow emergency meeting</li>
              </ul>
              <p>The opening scene will automatically load in the "Opening" tab based on your selection!</p>
            </div>

            <h3>📖 Chapter Summary</h3>
            <p>The queer heroes discover Dr. Jeremiah Pierce, a psychology professor using "evidence-based identity counseling" to suppress LGBTQ+ students. Unlike Danny's emotional approach, Pierce wields institutional authority and academic credibility, making him far more dangerous and socially acceptable.</p>
            
            <h3>🎯 Key Features</h3>
            <ul>
              <li><strong>Academic Horror:</strong> Institutional power used to harm vulnerable people</li>
              <li><strong>Intellectual Villain:</strong> Pierce genuinely believes he's helping through "science"</li>
              <li><strong>University Investigation:</strong> Multiple NPCs, research files, and social dynamics</li>
              <li><strong>Public Debate:</strong> Confrontation in a lecture hall with media present</li>
              <li><strong>Father Issues:</strong> Inner Space explores generational trauma</li>
              <li><strong>Lost Boys:</strong> Well-meaning students converted to Pierce's ideology</li>
            </ul>

            <h3>🏛️ Key Locations</h3>
            <ul>
              <li><strong>Metropolitan University:</strong> Gothic and brutalist architecture, divided campus</li>
              <li><strong>Psychology Building:</strong> Pierce's "Cognitive Wellness Center" on 5th floor</li>
              <li><strong>Hamilton Lecture Hall:</strong> 300-seat amphitheater for final confrontation</li>
              <li><strong>Inner Space:</strong> Dr. Marcus Pierce's office from 1985</li>
            </ul>

            <h3>👥 Key NPCs</h3>
            <ul>
              <li><strong>Dr. Jeremiah Pierce:</strong> Psychology professor, Justice Knight, father issues</li>
              <li><strong>Professor Elena Vasquez:</strong> Pierce's colleague, documenting his flaws</li>
              <li><strong>Riley Chen:</strong> Graduate student with evidence of Pierce's harm</li>
              <li><strong>Marcus Torres:</strong> Student, Pierce's "success story" (clearly not okay)</li>
              <li><strong>Tyler Brett:</strong> Lost Boys leader, former activist turned true believer</li>
            </ul>

            <div class="mc-tip">
              <h4>💡 MC Tips</h4>
              <ul>
                <li><strong>Clinical Horror:</strong> Pierce never loses his professional tone, even when cruel</li>
                <li><strong>Genuine Belief:</strong> He really thinks he's helping people accept "reality"</li>
                <li><strong>Institutional Protection:</strong> The university system backs him up</li>
                <li><strong>Brennan-Style Depth:</strong> Explore how authority suppresses marginalized identities</li>
                <li><strong>Mercer-Style Stakes:</strong> Every NPC has personal investment in the outcome</li>
              </ul>
            </div>

            <h3>🎬 Chapter Structure</h3>
            <ol>
              <li><strong>Opening Scene:</strong> Three variations based on Chapter 1 outcome</li>
              <li><strong>University Investigation:</strong> Clues, NPCs, and Lost Boys encounter</li>
              <li><strong>Research Files:</strong> Uncovering Pierce's true methods and motivations</li>
              <li><strong>Lecture Hall Debate:</strong> Public confrontation with media coverage</li>
              <li><strong>Inner Space:</strong> Young Jeremiah and his emotionally absent father</li>
              <li><strong>Aftermath:</strong> Three different resolutions based on success level</li>
            </ol>
          </div>
        `
      },

      opening: {
        title: "Opening (Branching)",
        content: '' // Will be populated by getBranchingOpening() function
      },

      investigation: {
        title: "Scene 2: University Investigation",
        content: `
          <div class="script-section">
            <h2>🔍 Scene 2: The University Campus - Midday Investigation</h2>
            
            <div class="scene-description">
              <h3>Environment: Metropolitan University</h3>
              <p>Metropolitan University sprawls across several city blocks like an academic village that grew too fast and lost its way. Gothic revival buildings stand shoulder-to-shoulder with brutalist concrete structures from the 60s, while gleaming modern facilities showcase the school's attempt to stay relevant. Students hurry between classes with the universal look of people carrying too much debt and too many dreams.</p>
              <p>But there's something else in the air today - a tension that goes beyond normal academic stress. Clusters of students huddle around posted flyers, their conversations carrying words like "correction," "therapy," and "voluntary compliance."</p>
            </div>

            <div class="story-tags">
              <h3>🏷️ Environmental Tags</h3>
              <ul>
                <li><strong>"Academic Authority"-2</strong> (ongoing) - Institutional power and credibility</li>
                <li><strong>"Divided Campus"</strong> (ongoing) - Some support Pierce, others are concerned</li>
                <li><strong>"Young Minds at Stake"-3</strong> (ongoing) - Vulnerable population being targeted</li>
                <li><strong>"Bureaucratic Maze"</strong> (environmental) - Complex systems and procedures</li>
              </ul>
            </div>

            <div class="investigation-section">
              <h3>🔎 Investigation Opportunities (GET A CLUE)</h3>
              
              <div class="clue-source">
                <h4>1. Concerned Students</h4>
                <p><strong>Clue 1:</strong> "Professor Pierce started this 'Cognitive Wellness Initiative' last month. Says he's helping students overcome 'maladaptive thinking patterns' about gender and sexuality."</p>
                <p><strong>Clue 2:</strong> "My roommate went to one of his sessions after struggling with coming out. Came back talking about 'biological realities' and 'social contagion theory.'"</p>
                <p><strong>Clue 3:</strong> "He's not technically doing conversion therapy - he's too smart for that. He calls it 'evidence-based identity counseling' and has all these studies to back it up."</p>
              </div>

              <div class="clue-source">
                <h4>2. Faculty Members (Whispered Conversations)</h4>
                <p><strong>Clue 1:</strong> "Pierce has been publishing prolifically lately, but his methodology is... questionable. He cherry-picks data to support predetermined conclusions."</p>
                <p><strong>Clue 2:</strong> "The administration loves him because his 'interventions' reduce 'disciplinary incidents' - translation: LGBTQ+ students stop causing 'problems' like requesting inclusive housing or protesting discrimination."</p>
                <p><strong>Clue 3:</strong> "He's been in contact with some controversial figures - that comedian who's been causing trouble downtown, and supposedly others. Building some kind of network."</p>
              </div>

              <div class="clue-source">
                <h4>3. Campus Counselors (If approached carefully)</h4>
                <p><strong>Clue 1:</strong> "We're seeing students who went through Pierce's program. They're not 'cured' - they're traumatized and confused about their own identities."</p>
                <p><strong>Clue 2:</strong> "He's using legitimate psychological techniques but twisting them. Takes real research about resilience and uses it to justify suppression."</p>
                <p><strong>Clue 3:</strong> "There's a whole floor of the Psychology building that's been converted to his 'research center.' None of the other faculty are allowed access."</p>
              </div>
            </div>

            <div class="npc-section">
              <h3>👥 Key NPCs</h3>
              
              <div class="npc-box">
                <h4>PROFESSOR ELENA VASQUEZ</h4>
                <ul>
                  <li><strong>Role:</strong> Psychology Department, Pierce's Colleague</li>
                  <li><strong>Motivation:</strong> Protect her students and academic integrity</li>
                  <li><strong>Information:</strong> Has been documenting Pierce's methodological flaws, knows about his funding sources</li>
                  <li><strong>Personality:</strong> Brilliant but cautious, speaks in measured academic tones but with underlying passion</li>
                  <li><strong>Key Quote:</strong> "Jeremiah started as a good researcher who genuinely wanted to help people. But somewhere along the way, being right became more important than being helpful."</li>
                </ul>
              </div>

              <div class="npc-box">
                <h4>RILEY CHEN</h4>
                <ul>
                  <li><strong>Role:</strong> Graduate Student, Former Pierce Protégé</li>
                  <li><strong>Motivation:</strong> Expose what Pierce really does behind closed doors</li>
                  <li><strong>Information:</strong> Has recordings and documents from inside Pierce's program</li>
                  <li><strong>Personality:</strong> Nervous but determined, speaks quickly when passionate about something</li>
                  <li><strong>Key Quote:</strong> "I thought I was helping him help people. But we weren't treating patients - we were manufacturing compliance."</li>
                </ul>
              </div>

              <div class="npc-box">
                <h4>MARCUS TORRES</h4>
                <ul>
                  <li><strong>Role:</strong> Student, Pierce's "Success Story"</li>
                  <li><strong>Motivation:</strong> Desperately wants to believe Pierce helped him</li>
                  <li><strong>Information:</strong> Still struggling with his identity but afraid to admit the "treatment" failed</li>
                  <li><strong>Personality:</strong> Polite, controlled, but shows cracks under pressure</li>
                  <li><strong>Key Quote:</strong> "Dr. Pierce taught me to think rationally about my... urges. I'm much more stable now." [clearly not stable]</li>
                </ul>
              </div>
            </div>

            <div class="mc-tip">
              <h4>💡 MC Tips</h4>
              <ul>
                <li>Let players choose how to investigate - social, stealthy, or direct</li>
                <li>Each NPC provides different pieces of the puzzle</li>
                <li>Riley Chen can become a crucial ally if treated with respect</li>
                <li>Marcus Torres is a victim - show compassion even if he defends Pierce</li>
                <li>Environmental tags affect how students and faculty react to the PCs</li>
              </ul>
            </div>
          </div>
        `
      },

      pierce: {
        title: "Scene 3: Meeting Dr. Pierce",
        content: `
          <div class="script-section">
            <h2>🏛️ Scene 3: The Psychology Building - Pierce's Domain</h2>
            
            <div class="scene-description">
              <h3>Environment: Cognitive Wellness Center (5th Floor)</h3>
              <p>The fifth floor of the Psychology building has been transformed into something that feels more like a medical facility than an academic space. Sterile white walls display charts about "healthy cognitive patterns" and "adaptive behavioral responses." Reception areas feature comfortable chairs arranged to face a large screen cycling through slides about "evidence-based living" and "biological realities of human psychology."</p>
            </div>

            <div class="read-aloud">
              <h3>📖 Pierce's Introduction Speech</h3>
              <blockquote>
                <p>"Ah, you must be the 'Queerz' I've been hearing about. Your intervention with Mr. Carbone was quite illuminating from a psychological perspective. I represent a more scientific approach - evidence-based, sustainable. I use proven psychological techniques to help people align their self-perception with biological and social realities."</p>
              </blockquote>
            </div>

            <div class="story-tags">
              <h3>🏷️ Story Tags Available</h3>
              <ul>
                <li><strong>"Pierce's Clinical Detachment"-2</strong> (ongoing)</li>
                <li><strong>"Scientific Credibility"-3</strong> (ongoing)</li>
                <li><strong>"Sees PCs as Test Subjects"</strong> (ongoing)</li>
              </ul>
            </div>
          </div>
        `
      },

      lostboys: {
        title: "Optional: Lost Boys",
        content: `
          <div class="script-section">
            <h2>⚔️ Optional: The Lost Boys Intervention</h2>
            <p>Tyler Brett and other male students who were converted by Pierce's program attempt to "help" the PCs. They're true believers - not brainwashed, but genuinely think they're doing good.</p>
            
            <div class="combat-stats">
              <h3>Combat Stats</h3>
              <ul>
                <li><strong>Size Factor:</strong> 1 (2-3 for larger groups)</li>
                <li><strong>Ignorance Limit:</strong> 4 (collective), 2 (individual)</li>
                <li><strong>Profile:</strong> "Intellectual"</li>
              </ul>
            </div>

            <div class="mc-tip">
              <h4>💡 They're Victims Too</h4>
              <p>Lost Boys are manipulated students. Non-violent solutions using TALK IT OUT and CARE are encouraged. Successfully deprogramming even one weakens Pierce's narrative.</p>
            </div>
          </div>
        `
      },

      research: {
        title: "Scene 4: Research Files",
        content: `
          <div class="script-section">
            <h2>📁 Scene 4: The Research Files</h2>
            
            <p>Pierce's private laboratory reveals the truth: files on "Gender Identity Correction," "Sexual Orientation Modification," patient harm data, and his personal journal revealing father issues driving everything.</p>
            
            <div class="story-tags">
              <h3>🏷️ Key Tags from Research</h3>
              <ul>
                <li><strong>"Pierce's Father Issues"-3</strong> (ongoing)</li>
                <li><strong>"Systematic Oppression Evidence"</strong> (ongoing)</li>
                <li><strong>"Vasquez as Ally"</strong> (ongoing)</li>
                <li><strong>"Lost Boys Are Victims Too"-2</strong> (ongoing)</li>
              </ul>
            </div>
          </div>
        `
      },

      lecture: {
        title: "Scene 5: Lecture Hall Confrontation",
        content: `
          <div class="script-section">
            <h2>🎓 Scene 5: Hamilton Lecture Hall - The Public Debate</h2>
            
            <p>Pierce stages a "debate" about evidence-based approaches vs. emotional manipulation. The 300-seat hall is packed, media is present, and Pierce has home field advantage from his podium position.</p>

            <div class="combat-stats">
              <h3>Dr. Jeremiah Pierce - Justice Knight</h3>
              <ul>
                <li><strong>Ignorance Limit:</strong> 6 (scales to 8-9 for large groups)</li>
                <li><strong>Profile:</strong> "Intellectual"</li>
                <li><strong>Special:</strong> +1 tier to all attacks in university setting</li>
              </ul>
              
              <h4>Hard Moves</h4>
              <ul>
                <li><strong>Therapeutic Restructuring:</strong> Forces PC to confront "cognitive errors" (questioning-self-3)</li>
                <li><strong>Clinical Diagnosis:</strong> Labels PC with pathological condition (diagnosed-as-disordered-4)</li>
                <li><strong>Evidence Bombardment:</strong> Overwhelming with cherry-picked studies (confused-by-data-3)</li>
              </ul>
            </div>

            <div class="mc-tip">
              <h4>💡 MC Tips</h4>
              <p>Pierce never loses his clinical tone. He genuinely believes he's helping. When losing the debate, his professional facade cracks, revealing the angry, insecure man underneath.</p>
            </div>
          </div>
        `
      },

      innerspace: {
        title: "Scene 6: Inner Space",
        content: `
          <div class="script-section">
            <h2>🚪 Scene 6: Inner Space - "Seeking Father's Approval"</h2>
            
            <div class="scene-description">
              <h3>Dr. Marcus Pierce's Office, 1985</h3>
              <p>Twelve-year-old Jeremiah sits across from his father's massive desk, holding a report card with straight A's. But his father barely glances at it. This office has no warmth, no family photos, no evidence a child was ever welcome here.</p>
            </div>

            <div class="read-aloud">
              <h3>📖 The Core Scene</h3>
              <p><strong>Young Jeremiah:</strong> "Dad, I got all A's again! My science teacher said my project was graduate-level work."</p>
              <p><strong>Dr. Marcus Pierce:</strong> "Good. That's what's expected. Your mother tells me you've been emotional lately. Crying about something the other boys said? You'll never succeed in this field if you let emotions cloud your judgment. Real psychologists don't cry about being different. They study difference, categorize it, and help people overcome it when it becomes pathological."</p>
            </div>

            <div class="encounter-section">
              <h3>Inner Space Challenge</h3>
              <ul>
                <li><strong>Accept-Father's-Flaws Limit:</strong> 7</li>
                <li><strong>Rational-Denial Limit:</strong> 6</li>
              </ul>
              
              <h4>Success: Pierce Redeemed</h4>
              <p>Begins retracting harmful publications, helps deprogram Lost Boys, provides information about remaining Fallen Icons.</p>
              
              <h4>Partial: Pierce Scales Back</h4>
              <p>Reduces operations but doesn't abandon them. May return as a more subtle threat later.</p>
              
              <h4>Failure: Pierce Escapes</h4>
              <p>Influence grows nationally. His methods become systemic. Alliance with Rex Morrison strengthens.</p>
            </div>

            <div class="mc-tip">
              <h4>💡 Core Theme</h4>
              <p>Help young Jeremiah express genuine feelings without shame. Show that emotions enhance rather than compromise empathy. Pierce's entire professional identity was built on suppressing his humanity to earn dead father's approval.</p>
            </div>
          </div>
        `
      },

      aftermath: {
        title: "Aftermath (Branching)",
        content: `
          <div class="script-section">
            <h2>🎬 Aftermath - One Week Later</h2>
            
            <div class="branching-notice" style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
              <h3>⚠️ THREE DIFFERENT AFTERMATHS</h3>
              <p>The epilogue varies based on whether Pierce was redeemed, partially reformed, or escaped.</p>
            </div>

            <div class="aftermath-option">
              <h3>If Pierce Was Redeemed - Café Greenwich</h3>
              <p>Pierce sits awkwardly with papers - retractions he's preparing. He shares information about Rex Morrison targeting children with "Hero Training."</p>
              <div class="story-tags">
                <h4>Tags Gained:</h4>
                <ul>
                  <li><strong>"Reformed Academic Ally"-3</strong> (ongoing)</li>
                  <li><strong>"Insider Knowledge of the Seven"</strong> (ongoing)</li>
                  <li><strong>"Understanding Childhood Hero Corruption"</strong> (ongoing)</li>
                </ul>
              </div>
            </div>

            <div class="aftermath-option">
              <h3>If Pierce Partially Reformed - Campus Coffee Shop</h3>
              <p>Pierce maintains professional appearance but with new uncertainty. Warns about Rex Morrison but maintains some of his methods.</p>
              <div class="story-tags">
                <h4>Tags Gained:</h4>
                <ul>
                  <li><strong>"Uneasy Ally Pierce"-2</strong> (ongoing)</li>
                  <li><strong>"Academic Connections"</strong> (ongoing)</li>
                  <li><strong>"Partial Understanding of Children's Vulnerability"-1</strong> (ongoing)</li>
                </ul>
              </div>
            </div>

            <div class="aftermath-option">
              <h3>If Pierce Escaped - House Rainbow Emergency</h3>
              <p>Mama Jay shows how Pierce has gone national with government backing. He's sharing notes with Rex Morrison - combining systematic approach with children's trust.</p>
              <div class="story-tags">
                <h4>Tags Gained:</h4>
                <ul>
                  <li><strong>"Pierce's Growing Influence"-3</strong> (ongoing)</li>
                  <li><strong>"Systematic Opposition Needed"</strong> (ongoing)</li>
                  <li><strong>"Children at Risk"-4</strong> (ongoing)</li>
                  <li><strong>"Institutional Corruption Spreading"</strong> (ongoing)</li>
                </ul>
              </div>
            </div>

            <div class="campaign-connection">
              <h3>🔗 Connection to Chapter 3</h3>
              <p>All roads lead to Rex Morrison - "The Champion" - who targets children specifically. Unlike Danny's emotion or Pierce's intellect, Rex offers heroism and belonging, making him even more dangerous.</p>
            </div>
          </div>
        `
      },

      scaling: {
        title: "Scaling Guidelines",
        content: `
          <div class="script-section">
            <h2>📊 Chapter 2 Scaling Guidelines</h2>
            
            <div class="scaling-tier">
              <h3>1-2 Players</h3>
              <ul>
                <li>Lost Boys size factor: 0</li>
                <li>Pierce Ignorance limit: 4</li>
                <li>Remove lecture hall audience complications</li>
                <li>Focus: Psychological thriller, detective work</li>
              </ul>
            </div>

            <div class="scaling-tier">
              <h3>3-4 Players (Standard)</h3>
              <ul>
                <li>Encounters as written</li>
                <li>Balance: Investigation (40%), Confrontation (40%), Inner Space (20%)</li>
              </ul>
            </div>

            <div class="scaling-tier">
              <h3>5-6 Players</h3>
              <ul>
                <li>Lost Boys size factor: 2-3</li>
                <li>Pierce Ignorance limit: 7-8</li>
                <li>Add faculty Pawns converted by Pierce</li>
                <li>Multi-location campus chase</li>
                <li>Parallel action: Some infiltrate lab while others debate publicly</li>
              </ul>
            </div>

            <div class="scaling-tier">
              <h3>7+ Players (Epic Scale)</h3>
              <ul>
                <li>University-wide incident across multiple departments</li>
                <li>Pierce converted department heads and admin officials</li>
                <li>Multi-stage encounter across campus locations</li>
                <li>Media circus with national attention</li>
                <li>Actions affect other educational institutions city-wide</li>
              </ul>
            </div>

            <div class="mc-tip">
              <h4>💡 Brennan & Mercer Style Tips</h4>
              <ul>
                <li><strong>Institutional Power:</strong> Show how authority harms vulnerable people</li>
                <li><strong>Academic Language:</strong> Pierce's clinical terms make him more unsettling</li>
                <li><strong>Bureaucratic Horror:</strong> The system protects him because he looks legitimate</li>
                <li><strong>Character Voice:</strong> Pierce never loses composure, even when cruel</li>
                <li><strong>Genuine Belief:</strong> He really thinks he's helping people</li>
                <li><strong>Father Issues:</strong> Every interaction traces back to seeking approval</li>
                <li><strong>Environmental Details:</strong> Sterile perfection tells his whole story</li>
                <li><strong>Personal Stakes:</strong> Focus on individual victims, not abstract debates</li>
              </ul>
            </div>
          </div>
        `
      }
    }
  }
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
    audioPlayer.volume = volumeSlider.value / 100;
    
    // Initialize dice display
    initializeDiceDisplay();
    
    // Load correct chapter tabs and update title
    loadChapterTabs();
    const scriptPanelTitle = document.getElementById('scriptPanelTitle');
    if (scriptPanelTitle) {
        scriptPanelTitle.textContent = `Campaign Script - Chapter ${currentChapter}`;
    }
});

function initializeDiceDisplay() {
    diceDisplay.innerHTML = `
        <div class="dice-result">
            <span class="die">Die 1: <span class="die1">-</span></span>
            <span class="die">Die 2: <span class="die2">-</span></span>
            <span class="die">Modifier: <span class="modifier">+0</span></span>
            <span class="die total-display">Total: <span class="total">-</span></span>
        </div>
    `;
}

function initializeEventListeners() {
    // Spotlight System
    addPlayerBtn.addEventListener('click', showPlayerModal);
    confirmPlayerBtn.addEventListener('click', addPlayer);
    cancelPlayerBtn.addEventListener('click', hidePlayerModal);
    
    playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer();
    });
    
    // Scene & Character
    locationSelect.addEventListener('change', updateLocation);
    characterSelect.addEventListener('change', updateCharacter);
    
    // Audio Player
    playBtn.addEventListener('click', playMusic);
    pauseBtn.addEventListener('click', pauseMusic);
    stopBtn.addEventListener('click', stopMusic);
    volumeSlider.addEventListener('input', updateVolume);
    trackSelect.addEventListener('change', changeTrack);
    
    // Music Loop & Playlist
    if (loopBtn) {
        loopBtn.addEventListener('click', toggleLoop);
    }
    if (addToPlaylistBtn) {
        addToPlaylistBtn.addEventListener('click', addToPlaylist);
    }
    
    // Dice Roller
    rollDiceBtn.addEventListener('click', rollDice);
    
    // Panels
    toggleScriptBtn.addEventListener('click', () => togglePanel(scriptPanel));
    toggleMcMovesBtn.addEventListener('click', () => togglePanel(mcMovesPanel));
    openCharMgmtBtn.addEventListener('click', openCharacterManagement);
    closeScriptBtn.addEventListener('click', () => closePanel(scriptPanel));
    closeMcMovesBtn.addEventListener('click', () => closePanel(mcMovesPanel));
    closeCharMgmtModalBtn.addEventListener('click', closeCharacterManagement);
    
    // Campaign Settings
    if (campaignSettingsBtn) {
        campaignSettingsBtn.addEventListener('click', openCampaignSettings);
    }
    if (closeCampaignSettingsBtn) {
        closeCampaignSettingsBtn.addEventListener('click', closeCampaignSettings);
    }
    if (chapterSelect) {
        chapterSelect.addEventListener('change', (e) => changeChapter(parseInt(e.target.value)));
    }
    
    // Script Panel Tabs
    document.querySelectorAll('.panel-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchScriptTab(e.target.dataset.tab));
    });
    
    // Script Search
    const scriptSearch = document.getElementById('scriptSearch');
    if (scriptSearch) {
        scriptSearch.addEventListener('input', (e) => searchScript(e.target.value));
    }
    
    // Modal tabs
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', (e) => switchCharMgmtTab(e.target.dataset.tab));
    });
    
    // Keyboard Shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Close modals on background click
    playerModal.addEventListener('click', (e) => {
        if (e.target === playerModal) hidePlayerModal();
    });
    charMgmtModal.addEventListener('click', (e) => {
        if (e.target === charMgmtModal) closeCharacterManagement();
    });
}

// ===================================
// SPOTLIGHT SYSTEM
// ===================================
function renderPlayers() {
    const existingButtons = spotlightPlayersContainer.querySelectorAll('.player-btn:not(.add-btn)');
    existingButtons.forEach(btn => btn.remove());
    
    players.forEach((playerName, index) => {
        const btn = document.createElement('button');
        btn.className = 'player-btn';
        if (index === activePlayerIndex) {
            btn.classList.add('active');
        }
        btn.textContent = playerName;
        
        const removeSpan = document.createElement('span');
        removeSpan.className = 'remove-player';
        removeSpan.textContent = ' ✕';
        removeSpan.addEventListener('click', (e) => {
            e.stopPropagation();
            removePlayer(index);
        });
        
        btn.appendChild(removeSpan);
        btn.addEventListener('click', () => setActivePlayer(index));
        
        spotlightPlayersContainer.insertBefore(btn, addPlayerBtn);
    });
    
    updateCharacterDisplay();
}

function showPlayerModal() {
    playerModal.classList.remove('hidden');
    playerNameInput.focus();
}

function hidePlayerModal() {
    playerModal.classList.add('hidden');
    playerNameInput.value = '';
    playerCharSelect.value = '';
}

function addPlayer() {
    const charName = playerCharSelect.value;        // ✅ Get dropdown selection
    const customName = playerNameInput.value.trim(); // ✅ Get text input
    
    const playerName = charName || customName;      // ✅ Use whichever has a value
    
    if (!playerName) {
        alert('Please select a character or enter a name');
        return;
    }
    
    // Check for duplicates
    if (players.includes(playerName)) {
        alert('Player already in spotlight');
        return;
    }
    
    players.push(playerName);
    saveToLocalStorage();
    renderPlayers();
    hidePlayerModal();
}

function removePlayer(index) {
    players.splice(index, 1);
    if (activePlayerIndex === index) {
        activePlayerIndex = -1;
    } else if (activePlayerIndex > index) {
        activePlayerIndex--;
    }
    saveToLocalStorage();
    renderPlayers();
}

// COMPREHENSIVE CHARACTER SHEET DISPLAY FIX
// Replace your showCharacterSheet, hideCharacterSheet, and setActivePlayer functions with these

// ===================================
// CHARACTER SHEET DISPLAY - FIXED VERSION
// ===================================

// ===================================
// CHARACTER SHEET DISPLAY FUNCTIONS
// CLEAN WORKING VERSION - NO SYNTAX ERRORS
// ===================================
// Replace lines 1433-1767 in your app.js with this code

function setActivePlayer(index) {
    console.log('setActivePlayer called with index:', index);
    console.log('Current activePlayerIndex:', activePlayerIndex);
    console.log('Player at index:', players[index]);
    
    // Toggle active player (for tracking who's in spotlight)
    if (activePlayerIndex === index) {
        activePlayerIndex = -1;
    } else {
        activePlayerIndex = index;
    }
    renderPlayers();
    
    // Note: Character sheets are now handled by separate Player Companion app
    // MC app only tracks who is active for spotlight purposes
}

function showCharacterSheet(playerName) {
    console.log('=== CHARACTER SHEET LOOKUP ===');
    console.log('Looking for player:', playerName);
    console.log('PC character keys:', Object.keys(characters));
    console.log('NPC character keys:', Object.keys(characterData));
    
    // First try to find in PC characters
    let char = characters[playerName];
    
    if (!char) {
        const trimmedName = playerName.trim();
        char = characters[trimmedName];
    }
    
    if (!char) {
        const charKey = Object.keys(characters).find(
            key => key.toLowerCase() === playerName.toLowerCase()
        );
        if (charKey) {
            char = characters[charKey];
        }
    }
    
    // If not found in PCs, check NPC characterData
    if (!char) {
        // Try exact match
        char = characterData[playerName];
        
        // Try with trim
        if (!char) {
            const trimmedName = playerName.trim();
            char = characterData[trimmedName];
        }
        
        // Try case-insensitive search
        if (!char) {
            const charKey = Object.keys(characterData).find(
                key => key.toLowerCase() === playerName.toLowerCase()
            );
            if (charKey) {
                char = characterData[charKey];
            }
        }
        
        // Try matching by character name (not key)
        if (!char) {
            const charKey = Object.keys(characterData).find(
                key => characterData[key].name.toLowerCase() === playerName.toLowerCase()
            );
            if (charKey) {
                char = characterData[charKey];
            }
        }
    }
    
    console.log('Character found:', !!char);
    console.log('==============================');
    
    characterPanelTitle.textContent = `🌟 ${playerName}'s Character Sheet`;
    characterDisplay.classList.add('hidden');
    characterInfo.classList.add('hidden');
    characterSheetDisplay.classList.remove('hidden');
    
    if (char) {
        // ✨ NEW: Check if character has a sheet image - if so, display it!
        if (char.characterSheet) {
            characterSheetDisplay.innerHTML = `
                <div style="width: 100%; height: 100%; overflow-y: auto;">
                    <img src="${char.characterSheet}" 
                         alt="${char.name}'s Character Sheet" 
                         style="width: 100%; height: auto; display: block;"
                         onerror="this.parentElement.innerHTML = '<p style=\'text-align: center; color: white; padding: 40px;\'>❌ Character sheet image not found:<br>${char.characterSheet}</p>';">
                </div>
            `;
        } else {
            // Fall back to HTML rendering if no image
            characterSheetDisplay.innerHTML = renderCharacterSheetContent(char);
        }
    } else {
        const allCharNames = [...Object.keys(characters), ...Object.keys(characterData)];
        characterSheetDisplay.innerHTML = `
            <div style="text-align: center; padding: 40px; color: white;">
                <p style="font-size: 1.2em; margin-bottom: 20px;">❌ No character data found</p>
                <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 15px;">
                    <strong>Searching for:</strong> "${playerName}"
                </p>
                <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 15px;">
                    <strong>Available PCs:</strong> ${Object.keys(characters).join(', ') || 'None'}
                </p>
                <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 15px;">
                    <strong>Available NPCs:</strong> ${Object.keys(characterData).join(', ') || 'None'}
                </p>
                <hr style="border: 1px solid rgba(255,255,255,0.2); margin: 20px 0;">
                <p style="color: rgba(255, 255, 255, 0.7);">
                    💡 Try: Press C → Character Management → Edit → Save
                </p>
            </div>
        `;
    }
}

function hideCharacterSheet() {
    characterPanelTitle.textContent = 'Character/NPC';
    characterSheetDisplay.classList.add('hidden');
    characterDisplay.classList.remove('hidden');
    characterInfo.classList.remove('hidden');
}

function renderCharacterSheetContent(char) {
    let html = '<div style="padding: 20px; color: white;">';
    
    // Basic Info
    html += `
        <div style="margin-bottom: 20px; background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #ffd700;">📋 Basic Info</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${char.name || 'Unknown'}</p>
            <p style="margin: 5px 0;"><strong>Pronouns:</strong> ${char.pronouns || 'Not specified'}</p>
            <p style="margin: 5px 0;"><strong>Playbook:</strong> ${char.playbook || 'Not specified'}</p>
        </div>
    `;
    
    // Rainbow Themes
    if (char.rainbowThemes && char.rainbowThemes.length > 0) {
        html += '<div style="margin-bottom: 20px;"><h3 style="color: #ff64c8;">🌈 Rainbow Themes</h3>';
        char.rainbowThemes.forEach(function(theme, index) {
            const themeName = theme.name || 'Theme ' + (index + 1);
            const themeType = theme.type || 'Unknown';
            const powerTags = (theme.powerTags && theme.powerTags.length > 0) ? theme.powerTags.join(', ') : 'None';
            const weaknessTags = (theme.weaknessTags && theme.weaknessTags.length > 0) ? theme.weaknessTags.join(', ') : 'None';
            const growth = theme.growth || 0;
            const shade = theme.shade || 0;
            
            html += `
                <div style="background: rgba(255, 100, 200, 0.2); padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid #ff64c8;">
                    <h4 style="margin: 0 0 10px 0; color: #ffd700;">${themeName} <span style="color: rgba(255,255,255,0.6); font-size: 0.85em;">(${themeType})</span></h4>
                    ${theme.runway ? '<p style="margin: 5px 0; font-style: italic;">"' + theme.runway + '"</p>' : ''}
                    <p style="margin: 8px 0;"><strong>Power Tags:</strong> ${powerTags}</p>
                    <p style="margin: 8px 0;"><strong>Weakness Tags:</strong> ${weaknessTags}</p>
                    <p style="margin: 8px 0;"><strong>Growth:</strong> ${'█'.repeat(growth)}${'░'.repeat(5 - growth)} (${growth}/5)</p>
                    <p style="margin: 8px 0;"><strong>Shade:</strong> ${'█'.repeat(shade)}${'░'.repeat(5 - shade)} (${shade}/5)</p>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Realness Themes
    if (char.realnessThemes && char.realnessThemes.length > 0) {
        html += '<div style="margin-bottom: 20px;"><h3 style="color: #64c8ff;">💎 Realness Themes</h3>';
        char.realnessThemes.forEach(function(theme, index) {
            const themeName = theme.name || 'Theme ' + (index + 1);
            const themeType = theme.type || 'Unknown';
            const powerTags = (theme.powerTags && theme.powerTags.length > 0) ? theme.powerTags.join(', ') : 'None';
            const weaknessTags = (theme.weaknessTags && theme.weaknessTags.length > 0) ? theme.weaknessTags.join(', ') : 'None';
            const growth = theme.growth || 0;
            const crack = theme.crack || 0;
            
            html += `
                <div style="background: rgba(100, 200, 255, 0.2); padding: 15px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid #64c8ff;">
                    <h4 style="margin: 0 0 10px 0; color: #ffd700;">${themeName} <span style="color: rgba(255,255,255,0.6); font-size: 0.85em;">(${themeType})</span></h4>
                    ${theme.runway ? '<p style="margin: 5px 0; font-style: italic;">"' + theme.runway + '"</p>' : ''}
                    <p style="margin: 8px 0;"><strong>Power Tags:</strong> ${powerTags}</p>
                    <p style="margin: 8px 0;"><strong>Weakness Tags:</strong> ${weaknessTags}</p>
                    <p style="margin: 8px 0;"><strong>Growth:</strong> ${'█'.repeat(growth)}${'░'.repeat(5 - growth)} (${growth}/5)</p>
                    <p style="margin: 8px 0;"><strong>Crack:</strong> ${'█'.repeat(crack)}${'░'.repeat(5 - crack)} (${crack}/5)</p>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Current Statuses
    if (char.currentStatuses && char.currentStatuses.length > 0) {
        html += '<div style="margin-bottom: 20px;"><h3 style="color: #ffd700;">✨ Current Statuses</h3>';
        char.currentStatuses.forEach(function(status) {
            const color = status.beneficial ? '#4ade80' : '#f87171';
            const icon = status.beneficial ? '✅' : '❌';
            html += `
                <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; margin-bottom: 8px; border-radius: 6px; border-left: 3px solid ${color};">
                    <strong style="color: ${color};">${status.name}</strong>
                    <span style="color: rgba(255,255,255,0.7);"> (Tier ${status.tier})</span>
                    <span style="float: right;">${icon} ${status.beneficial ? 'Beneficial' : 'Detrimental'}</span>
                </div>
            `;
        });
        html += '</div>';
    }
    
    // Burnt Tags
    if (char.burntTags && char.burntTags.length > 0) {
        html += `
            <div style="margin-bottom: 20px; background: rgba(255,100,100,0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #ff6b6b;">
                <h3 style="color: #ff6b6b; margin: 0 0 10px 0;">🔥 Burnt Tags</h3>
                <p style="color: rgba(255, 255, 255, 0.8);">${char.burntTags.join(', ')}</p>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}
function updatePlayerCharacterSelect() {
    playerCharSelect.innerHTML = '<option value="">No character</option>';
    Object.keys(characters).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = characters[key].name || key;
        playerCharSelect.appendChild(option);
    });
}

// ===================================
// SCENE & CHARACTER DISPLAY
// ===================================
function updateLocation() {
    const location = locationSelect.value;
    if (!location) {
        sceneDisplay.innerHTML = '<p class="placeholder-text">Select a location to display</p>';
        return;
    }
    
    const imagePath = locationData[location];
    if (imagePath) {
        sceneDisplay.innerHTML = `<img src="${imagePath}" alt="${location}">`;
    } else {
        sceneDisplay.innerHTML = '<p class="placeholder-text">Location image not found</p>';
    }
}

function updateCharacter() {
    const charKey = characterSelect.value;
    if (!charKey) {
        characterInfo.innerHTML = '<p class="placeholder-text">Select a character to display</p>';
        characterSheetDisplay.innerHTML = '';
        return;
    }
    
    const char = characterData[charKey];
    if (char) {
        characterInfo.innerHTML = `
            <img src="${char.image}" alt="${char.name}" class="character-portrait">
            <h3>${char.name}</h3>
            <p>${char.info}</p>
        `;
    }
}

function updateCharacterDisplay() {
    if (activePlayerIndex === -1 || !players[activePlayerIndex]) {
        characterPanelTitle.textContent = 'Character/NPC';
        characterSheetDisplay.innerHTML = '';
        return;
    }
    
    const playerName = players[activePlayerIndex];
    characterPanelTitle.textContent = `${playerName}'s Character`;
    
    // Try to find character data for this player
    const charKey = Object.keys(characters).find(key => {
        return characters[key].playerName === playerName;
    });
    
    if (charKey && characters[charKey]) {
        displayCharacterSheet(characters[charKey]);
    } else {
        characterSheetDisplay.innerHTML = '<p class="placeholder-text">No character sheet found for this player</p>';
    }
}

function displayCharacterSheet(character) {
    let html = `
        <div class="char-sheet-display">
            <h3>${character.name || 'Unnamed Character'}</h3>
            <p><strong>Pronouns:</strong> ${character.pronouns || 'Not set'}</p>
            <p><strong>Playbook:</strong> ${character.playbook || 'Not set'}</p>
    `;
    
    if (character.rainbowThemes && character.rainbowThemes.length > 0) {
        html += '<h4>Rainbow Themes:</h4>';
        character.rainbowThemes.forEach(theme => {
            html += `
                <div class="theme-display">
                    <strong>${theme.name}</strong> (${theme.type})
                    <p><em>"${theme.runway || ''}"</em></p>
                    <p>Growth: ${theme.growth || 0} | Shade: ${theme.shade || 0}</p>
                </div>
            `;
        });
    }
    
    if (character.realnessThemes && character.realnessThemes.length > 0) {
        html += '<h4>Realness Themes:</h4>';
        character.realnessThemes.forEach(theme => {
            html += `
                <div class="theme-display">
                    <strong>${theme.name}</strong> (${theme.type})
                    <p><em>"${theme.identity || ''}"</em></p>
                    <p>Growth: ${theme.growth || 0} | Crack: ${theme.crack || 0}</p>
                </div>
            `;
        });
    }
    
    html += '</div>';
    characterSheetDisplay.innerHTML = html;
}

// ===================================
// AUDIO PLAYER
// ===================================
function playMusic() {
    if (audioPlayer.src) {
        audioPlayer.play();
        const trackName = trackSelect.options[trackSelect.selectedIndex].text;
        nowPlaying.textContent = `Now Playing: ${trackName}`;
    }
}

function pauseMusic() {
    audioPlayer.pause();
    nowPlaying.textContent = 'Paused';
}

function stopMusic() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    nowPlaying.textContent = 'No track playing';
}

function changeTrack() {
    const track = trackSelect.value;
    if (track) {
        audioPlayer.src = track;
        audioPlayer.load();
        playMusic();
    }
}

function updateVolume() {
    const volume = volumeSlider.value / 100;
    audioPlayer.volume = volume;
    volumeLabel.textContent = `🔊 ${volumeSlider.value}%`;
}

// ===================================
// DICE ROLLER
// ===================================
function rollDice() {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const modifier = parseInt(powerModifier.value) || 0;
    const total = die1 + die2 + modifier;
    
    document.querySelector('.die1').textContent = die1;
    document.querySelector('.die2').textContent = die2;
    document.querySelector('.modifier').textContent = modifier >= 0 ? `+${modifier}` : modifier;
    document.querySelector('.total').textContent = total;
    
    let resultText = '';
    let resultClass = '';
    
    if (total >= 10) {
        resultText = '✅ SUCCESS! Full effect, no complications';
        resultClass = 'result-success';
    } else if (total >= 7) {
        resultText = '⚠️ PARTIAL SUCCESS - Success with complication or cost';
        resultClass = 'result-partial';
    } else {
        resultText = '❌ FAILURE - Miss, MC makes a hard move';
        resultClass = 'result-fail';
    }
    
    rollResult.innerHTML = `<div class="${resultClass}">${resultText}</div>`;
}

// ===================================
// PANELS
// ===================================
function togglePanel(panel) {
    if (panel === scriptPanel) {
        mcMovesPanel.classList.add('hidden');
    } else if (panel === mcMovesPanel) {
        scriptPanel.classList.add('hidden');
    }
    
    panel.classList.toggle('hidden');
    
    if (panel === scriptPanel && !panel.classList.contains('hidden')) {
        loadChapterTabs(); // Load correct tabs for current chapter
        switchScriptTab('overview');
    }
}

function closePanel(panel) {
    panel.classList.add('hidden');
}

// Store current content for search
let currentScriptContent = '';

// Get branching opening content for Chapter 2 based on Chapter 1 outcome
function getBranchingOpening() {
    const outcome = storyOutcomes.chapter1;
    
    if (outcome === 'redeemed') {
        return `
            <h2>☕ Variation A: Danny Was Redeemed</h2>
            <h3>Scene 1: Café Greenwich - One Week Later</h3>
            
            <div class="scene-description">
              <p>Danny sits more comfortably now at his corner table, though he still flinches slightly when new customers enter. His notebook lies open, filled with material that finds humor in shared struggles rather than individual failings. The morning light catches the reading glasses that replaced his Star of Ignorance, making him look more like a college professor than a hardened comedian.</p>
            </div>

            <div class="read-aloud">
              <h3>📖 Read to Players</h3>
              <p>"The morning routine at Café Greenwich has a new rhythm now. Danny's become an unlikely regular, workshopping gentler material with anyone willing to listen. But this morning, something's different. His phone buzzes insistently, and with each message, his expression grows more troubled.</p>
              <p>Mama Jay notices first, the way she notices everything that matters. 'Sugar, you look like someone walked over your grave. What's got you spooked?'"</p>
            </div>

            <div class="npc-dialogue">
              <h3>💬 Danny's Information</h3>
              <blockquote>
                <p>"It's... it's messages from the Ignorant Seven. Well, what's left of them. This Dr. Pierce character - he's been reaching out to my old contacts, the other 'cancelled' folks they recruited. But his approach is different than theirs was with me.</p>
                <p>He's not appealing to anger or nostalgia. He's offering 'evidence-based solutions to cultural degeneracy.' Making it sound scientific, respectable. And some of the people responding... they're not angry burnouts like I was. They're academics, professionals, people who think they're being logical."</p>
              </blockquote>
            </div>

            <div class="story-tags">
              <h3>🏷️ Story Tags Gained</h3>
              <ul>
                <li><strong>"Danny's Network"-2</strong> (ongoing) - Access to Pierce's recruitment targets</li>
                <li><strong>"Understanding the Seven's Methods"</strong> (ongoing) - Insight into their varied approaches</li>
                <li><strong>"Academic Threat Rising"-1</strong> (ongoing) - Pierce is building intellectual credibility</li>
              </ul>
            </div>
        `;
    } else if (outcome === 'partial') {
        return `
            <h2>☕ Variation B: Danny Partially Reformed</h2>
            <h3>Scene 1: Theater District Coffee Cart - Morning</h3>
            
            <div class="scene-description">
              <p>The coffee cart sits in the shadow of Elevated, where Moretti's basement still holds its secrets. The vendor, Maria, has become an unexpected information hub since the "comedy incident" - everyone wants to process what happened, and coffee makes people talkative.</p>
            </div>

            <div class="read-aloud">
              <h3>📖 Read to Players</h3>
              <p>"Maria's coffee cart has developed an unusual morning crowd - not just the usual theater workers and tourists, but social workers, community organizers, and people who look like they're carrying clipboards with Important Purposes. The buzz of conversation has an academic edge today, peppered with terms like 'psychological intervention' and 'corrective therapy.'"</p>
            </div>

            <div class="npc-dialogue">
              <h3>💬 Maria's Warning</h3>
              <blockquote>
                <p>"You know, those Queerz kids who helped with that comedian problem? They should know - there's been this professor type asking questions about 'what went wrong' with Danny's 'rehabilitation process.' Says he's writing a paper about 'failed intervention strategies in ideological correction.'</p>
                <p>But between you and me? I think he's less interested in understanding what you did right and more interested in figuring out how to do it 'better.' Whatever that means."</p>
              </blockquote>
            </div>

            <div class="story-tags">
              <h3>🏷️ Story Tags Gained</h3>
              <ul>
                <li><strong>"Pierce's Research Interest"</strong> (ongoing) - You're on his radar as a case study</li>
                <li><strong>"Community Concern"-1</strong> (ongoing) - People are worried about this new threat</li>
                <li><strong>"Incomplete Victory Haunts"-2</strong> (temporary) - Doubt about your methods with Danny</li>
              </ul>
            </div>
        `;
    } else if (outcome === 'vendetta') {
        return `
            <h2>🚨 Variation C: Danny's Vendetta</h2>
            <h3>Scene 1: House Rainbow Emergency Meeting - Evening</h3>
            
            <div class="scene-description">
              <p>Club Duckie's back room has been converted into an impromptu war room. Maps of the city cover the walls, marked with colored pins showing locations of "incidents." The atmosphere is tense - this isn't the usual pre-show energy, but the focused urgency of a community under siege.</p>
            </div>

            <div class="read-aloud">
              <h3>📖 Read to Players</h3>
              <p>"Mama Jay stands before a map that looks like a disease spreading through the city. Red pins mark Danny's Tough Crowd incidents, but new blue pins are appearing faster than the red ones. Each blue pin represents what witnesses describe as 'educational interventions' - groups of well-dressed people with clipboards 'helping' community members understand their 'cognitive errors.'"</p>
            </div>

            <div class="npc-dialogue">
              <h3>💬 Mama Jay's Briefing</h3>
              <blockquote>
                <p>"Danny's bad enough, sugar, but he's got himself a new best friend. Dr. Jeremiah Pierce - psychology professor at the university. And unlike Danny's emotional approach, this man's got a system. He's treating your failure to 'cure' Danny as a case study in how 'unqualified amateurs' make things worse.</p>
                <p>He's positioning himself as the 'scientific solution' to what he calls 'ideological deviance.' And he's got credentials, publications, the whole nine yards. People listen to him in ways they never listened to Danny."</p>
              </blockquote>
            </div>

            <div class="story-tags">
              <h3>🏷️ Story Tags Gained</h3>
              <ul>
                <li><strong>"Danny's Alliance with Pierce"-2</strong> (ongoing) - Two threats working together</li>
                <li><strong>"Scientific Credibility Gap"</strong> (ongoing) - Pierce has academic authority you lack</li>
                <li><strong>"Community Under Systematic Threat"-3</strong> (ongoing) - Organized, methodical suppression</li>
              </ul>
            </div>
        `;
    } else {
        // Default/none - show all three options
        return `
            <div class="branching-notice" style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
              <h3>⚠️ NO CHAPTER 1 OUTCOME SELECTED</h3>
              <p><strong>You haven't selected a Chapter 1 outcome yet!</strong></p>
              <p>Click the ⚙️ (Campaign Settings) button in the header to choose:</p>
              <ul>
                <li>Danny Redeemed (Success)</li>
                <li>Danny Partially Reformed (Partial Success)</li>
                <li>Danny's Vendetta (Failure)</li>
              </ul>
              <p>Once you select an outcome, this tab will show the appropriate opening scene automatically!</p>
            </div>

            <h2>Preview: Three Possible Openings</h2>
            
            <div style="border: 2px solid #4CAF50; padding: 15px; margin: 20px 0;">
              <h3>✅ If Danny Was Redeemed</h3>
              <p><strong>Location:</strong> Café Greenwich</p>
              <p><strong>Ally:</strong> Danny provides information about Pierce's recruitment methods</p>
              <p><strong>Tone:</strong> Hopeful but concerned - a redeemed ally warns of new danger</p>
            </div>

            <div style="border: 2px solid #FF9800; padding: 15px; margin: 20px 0;">
              <h3>📄 If Danny Was Partially Reformed</h3>
              <p><strong>Location:</strong> Theater District Coffee Cart</p>
              <p><strong>Info Source:</strong> Maria the vendor has overheard Pierce asking about your methods</p>
              <p><strong>Tone:</strong> Uncertain - Pierce is studying your partial success as a "failure"</p>
            </div>

            <div style="border: 2px solid #f44336; padding: 15px; margin: 20px 0;">
              <h3>❌ If Danny's Vendetta Continues</h3>
              <p><strong>Location:</strong> House Rainbow Emergency Meeting</p>
              <p><strong>Threat Level:</strong> Danny and Pierce have formed an alliance</p>
              <p><strong>Tone:</strong> Urgent - Two threats are now working together systemically</p>
            </div>

            <p style="margin-top: 20px;"><strong>→ Choose your outcome in Campaign Settings to see the full scene!</strong></p>
        `;
    }
}

function switchScriptTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.panel-tabs .tab-btn').forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Get the content element
    const content = document.getElementById('scriptContent');
    
    // Access the nested scriptData structure based on currentChapter
    const chapterKey = `chapter${currentChapter}`;
    const chapter = scriptData[chapterKey];
    
    if (!chapter || !chapter.tabs) {
        content.innerHTML = `<p>Script data not found for Chapter ${currentChapter}</p>`;
        return;
    }
    
    // Get the tab content
    const tabContent = chapter.tabs[tabName];
    if (tabContent) {
        // Special handling for Chapter 2 opening tab - generate branching content
        if (currentChapter === 2 && tabName === 'opening') {
            currentScriptContent = getBranchingOpening();
            content.innerHTML = currentScriptContent;
        } else if (tabContent.content) {
            currentScriptContent = tabContent.content;
            content.innerHTML = currentScriptContent;
        } else {
            content.innerHTML = '<p>No content available for this tab</p>';
        }
        
        // Clear search when switching tabs
        const scriptSearch = document.getElementById('scriptSearch');
        if (scriptSearch) {
            scriptSearch.value = '';
        }
    } else {
        content.innerHTML = '<p>No content available for this tab</p>';
    }
}

// ===================================
// SCRIPT SEARCH FUNCTIONALITY
// ===================================
function searchScript(query) {
    const content = document.getElementById('scriptContent');
    
    if (!query || query.trim() === '') {
        // Restore original content
        content.innerHTML = currentScriptContent;
        return;
    }
    
    // Create a temporary div to search through
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = currentScriptContent;
    
    // Highlight matching text
    const searchRegex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    highlightMatches(tempDiv, searchRegex);
    
    content.innerHTML = tempDiv.innerHTML;
    
    // Scroll to first match
    const firstMatch = content.querySelector('.search-highlight');
    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function highlightMatches(element, regex) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const nodesToReplace = [];
    let node;
    
    while (node = walker.nextNode()) {
        if (node.nodeValue.match(regex)) {
            nodesToReplace.push(node);
        }
    }
    
    nodesToReplace.forEach(node => {
        const span = document.createElement('span');
        span.innerHTML = node.nodeValue.replace(regex, '<mark class="search-highlight">$1</mark>');
        node.parentNode.replaceChild(span, node);
    });
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================
function handleKeyboardShortcuts(e) {
    // Don't trigger if typing in input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch(e.key.toLowerCase()) {
        case 's':
            togglePanel(scriptPanel);
            e.preventDefault();
            break;
        case 'm':
            togglePanel(mcMovesPanel);
            e.preventDefault();
            break;
        case 'c':
            openCharacterManagement();
            e.preventDefault();
            break;
        case 'r':
            rollDice();
            e.preventDefault();
            break;
        case ' ':
            if (audioPlayer.paused) {
                playMusic();
            } else {
                pauseMusic();
            }
            e.preventDefault();
            break;
        case 'tab':
            cycleSpotlight();
            e.preventDefault();
            break;
        case 'escape':
            closePanel(scriptPanel);
            closePanel(mcMovesPanel);
            closeCharacterManagement();
            hidePlayerModal();
            e.preventDefault();
            break;
    }
}

// ===================================
// LOCAL STORAGE
// ===================================
function saveToLocalStorage() {
    localStorage.setItem('queerz_players', JSON.stringify(players));
    localStorage.setItem('queerz_activePlayer', activePlayerIndex.toString());
    localStorage.setItem('queerz_characters', JSON.stringify(characters));
    localStorage.setItem('queerz_currentChapter', currentChapter.toString());
    localStorage.setItem('queerz_storyOutcomes', JSON.stringify(storyOutcomes));
}

function loadFromLocalStorage() {
    const storedPlayers = localStorage.getItem('queerz_players');
    const storedActive = localStorage.getItem('queerz_activePlayer');
    const storedChars = localStorage.getItem('queerz_characters');
    const storedChapter = localStorage.getItem('queerz_currentChapter');
    const storedOutcomes = localStorage.getItem('queerz_storyOutcomes');
    
    if (storedPlayers) {
        players = JSON.parse(storedPlayers);
    }
    if (storedActive) {
        activePlayerIndex = parseInt(storedActive);
    }
    if (storedChars) {
        characters = JSON.parse(storedChars);
    }
    if (storedChapter) {
        currentChapter = parseInt(storedChapter);
    }
    if (storedOutcomes) {
        storyOutcomes = JSON.parse(storedOutcomes);
    }
    
    console.log('✅ Loaded campaign data:', { 
        players: players.length, 
        characters: Object.keys(characters).length,
        chapter: currentChapter 
    });
}

console.log('🌈 QUEERZ! MC Companion Loaded');
console.log('Keyboard Shortcuts: S (Script) | M (MC Moves) | C (Characters) | R (Roll) | Space (Play/Pause) | Tab (Cycle Spotlight) | Esc (Close)');
function openCharacterManagement() {
    charMgmtModal.classList.remove('hidden');
    switchCharMgmtTab('list');
}

function closeCharacterManagement() {
    charMgmtModal.classList.add('hidden');
    currentEditingCharacter = null;
}

function openCampaignSettings() {
    campaignSettingsModal.classList.remove('hidden');
    updateCampaignSettingsUI();
}

function closeCampaignSettings() {
    campaignSettingsModal.classList.add('hidden');
}

function updateCampaignSettingsUI() {
    // Update chapter selector
    if (chapterSelect) {
        chapterSelect.value = currentChapter.toString();
    }
    
    // Update outcome radio buttons
    const chapter1Outcome = getStoryOutcome('chapter1');
    const radioButtons = document.querySelectorAll('input[name="outcome-chapter1"]');
    radioButtons.forEach(radio => {
        radio.checked = (radio.value === chapter1Outcome);
    });
    
    // Update export player list
    const exportList = document.getElementById('exportPlayersList');
    if (exportList && players.length > 0) {
        exportList.innerHTML = players.map(playerName => 
            `<button class="btn-primary" onclick="exportPlayerData('${playerName}')" style="margin: 5px;">
                Export ${playerName}'s Data
            </button>`
        ).join('');
    } else if (exportList) {
        exportList.innerHTML = '<p style="color: rgba(255,255,255,0.6);">No players in spotlight yet.</p>';
    }
}

function switchCharMgmtTab(tabName) {
    const tabs = document.querySelectorAll('.modal-tab');
    tabs.forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    const content = document.getElementById('charMgmtContent');
    
    if (tabName === 'list') {
        content.innerHTML = renderCharacterList();
    } else if (tabName === 'edit') {
        content.innerHTML = renderCharacterEditForm();
        initializeCharacterForm();
    } else if (tabName === 'import') {
        content.innerHTML = renderImportExport();
    }
}

function renderCharacterList() {
    const charNames = Object.keys(characters);
    
    if (charNames.length === 0) {
        return `
            <div style="text-align: center; padding: 40px;">
                <p style="font-size: 1.2em; margin-bottom: 20px;">No characters created yet</p>
                <button class="btn-primary" onclick="switchCharMgmtTab('edit')">Create Character</button>
            </div>
        `;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
    
    charNames.forEach(name => {
        const char = characters[name];
        html += `
            <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 10px; border-left: 3px solid #667eea;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <h4 style="color: #ffd700; font-size: 1.3em;">${char.name}</h4>
                        <p style="color: rgba(255, 255, 255, 0.7);">${char.pronouns || ''} | ${char.playbook || 'No playbook'}</p>
                        <p style="color: rgba(255, 255, 255, 0.5); font-size: 0.9em; margin-top: 5px;">
                            ${char.rainbowThemes?.length || 0} Rainbow Themes | ${char.realnessThemes?.length || 0} Realness Themes
                        </p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-secondary" style="padding: 8px 15px;" onclick="editCharacter('${name}')">Edit</button>
                        <button class="btn-secondary" style="padding: 8px 15px; background: rgba(244, 67, 54, 0.3); border-color: #f44336;" onclick="deleteCharacter('${name}')">Delete</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function renderCharacterEditForm() {
    return `
        <div class="char-edit-container">
            <h3 style="margin-bottom: 20px; color: #ffd700;">Full Character Creator</h3>
            
            <!-- BASIC INFO -->
            <div class="form-section">
                <h4>Basic Information</h4>
                <div class="form-group">
                    <label>Character Name *</label>
                    <input type="text" id="editCharName" class="text-input" placeholder="Enter name..." />
                </div>
                
                <div class="form-group">
                    <label>Pronouns</label>
                    <input type="text" id="editCharPronouns" class="text-input" placeholder="they/them, she/her, etc." />
                </div>
                
                <div class="form-group">
                    <label>Playbook</label>
                    <select id="editCharPlaybook" class="styled-select">
                        <option value="">Select Playbook...</option>
                        <option value="The Beacon">The Beacon</option>
                        <option value="The Defender">The Defender</option>
                        <option value="The Revolutionary">The Revolutionary</option>
                        <option value="The Empath">The Empath</option>
                        <option value="The Outcast">The Outcast</option>
                        <option value="The Survivor">The Survivor</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Character Sheet Image Path (Optional)</label>
                    <input type="text" id="editCharSheetImage" class="text-input" placeholder="images/character-sheets/character-name.png" />
                    <p style="color: rgba(255, 255, 255, 0.6); font-size: 0.9em; margin-top: 5px;">
                        💡 Enter the path to your character sheet image file
                    </p>
                </div>
            </div>

            <!-- RAINBOW THEMES -->
            <div class="form-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h4 style="color: #ff6b9d;">Rainbow Themes</h4>
                    <button class="btn-secondary" onclick="addRainbowTheme()" style="padding: 5px 15px;">+ Add Theme</button>
                </div>
                <div id="rainbowThemesContainer"></div>
            </div>

            <!-- REALNESS THEMES -->
            <div class="form-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h4 style="color: #a55eea;">Realness Themes</h4>
                    <button class="btn-secondary" onclick="addRealnessTheme()" style="padding: 5px 15px;">+ Add Theme</button>
                </div>
                <div id="realnessThemesContainer"></div>
            </div>

            <!-- CURRENT STATUSES -->
            <div class="form-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h4>Current Statuses</h4>
                    <button class="btn-secondary" onclick="addStatus()" style="padding: 5px 15px;">+ Add Status</button>
                </div>
                <div id="statusesContainer"></div>
            </div>

            <!-- BURNT TAGS -->
            <div class="form-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h4>Burnt Tags</h4>
                    <button class="btn-secondary" onclick="addBurntTag()" style="padding: 5px 15px;">+ Add Tag</button>
                </div>
                <div id="burntTagsContainer"></div>
            </div>

            <!-- SAVE BUTTON -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid rgba(255, 255, 255, 0.2);">
                <button class="btn-primary" onclick="saveCharacter()" style="width: 100%; padding: 15px; font-size: 1.1em;">Save Character</button>
            </div>
        </div>
    `;
}

function initializeCharacterForm() {
    // If editing existing character, populate form
    if (currentEditingCharacter && characters[currentEditingCharacter]) {
        const char = characters[currentEditingCharacter];
        document.getElementById('editCharName').value = char.name;
        document.getElementById('editCharPronouns').value = char.pronouns || '';
        document.getElementById('editCharPlaybook').value = char.playbook || '';
        document.getElementById('editCharSheetImage').value = char.characterSheet || ''; // NEW: Load sheet image path
        
        // Load themes, statuses, and burnt tags
        if (char.rainbowThemes) {
            char.rainbowThemes.forEach(theme => addRainbowTheme(theme));
        }
        if (char.realnessThemes) {
            char.realnessThemes.forEach(theme => addRealnessTheme(theme));
        }
        if (char.currentStatuses) {
            char.currentStatuses.forEach(status => addStatus(status));
        }
        if (char.burntTags) {
            char.burntTags.forEach(tag => addBurntTag(tag));
        }
    }
}

// ===================================
// RAINBOW THEME MANAGEMENT
// ===================================
function addRainbowTheme(themeData = null) {
    const container = document.getElementById('rainbowThemesContainer');
    const themeId = Date.now();
    
    const themeHTML = `
        <div class="theme-editor rainbow-theme" id="rainbow-${themeId}">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <strong style="color: #ff6b9d;">Rainbow Theme</strong>
                <button class="btn-secondary" onclick="removeElement('rainbow-${themeId}')" style="padding: 3px 10px; font-size: 0.9em;">Remove</button>
            </div>
            
            <div class="form-group">
                <label>Theme Name</label>
                <input type="text" class="text-input rainbow-name" value="${themeData?.name || ''}" placeholder="e.g., Ars Gratis Artis" />
            </div>
            
            <div class="form-group">
                <label>Type</label>
                <select class="styled-select rainbow-type">
                    <option value="Signature" ${themeData?.type === 'Signature' ? 'selected' : ''}>Signature</option>
                    <option value="Extra" ${themeData?.type === 'Extra' ? 'selected' : ''}>Extra</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Runway Quote</label>
                <textarea class="text-input rainbow-runway" placeholder="Your runway statement..." style="min-height: 60px;">${themeData?.runway || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label>Power Tags (comma-separated)</label>
                <input type="text" class="text-input rainbow-power" value="${themeData?.powerTags?.join(', ') || ''}" placeholder="e.g., Rainbow blast, Sparkle Wig, Shock them into silence" />
            </div>
            
            <div class="form-group">
                <label>Weakness Tags (comma-separated)</label>
                <input type="text" class="text-input rainbow-weakness" value="${themeData?.weaknessTags?.join(', ') || ''}" placeholder="e.g., Mean girl" />
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Growth Boxes</label>
                    <input type="number" class="text-input rainbow-growth" value="${themeData?.growth || 0}" min="0" max="5" />
                </div>
                
                <div class="form-group">
                    <label>Shade Boxes</label>
                    <input type="number" class="text-input rainbow-shade" value="${themeData?.shade || 0}" min="0" max="5" />
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', themeHTML);
}

// ===================================
// REALNESS THEME MANAGEMENT
// ===================================
function addRealnessTheme(themeData = null) {
    const container = document.getElementById('realnessThemesContainer');
    const themeId = Date.now();
    
    const themeHTML = `
        <div class="theme-editor realness-theme" id="realness-${themeId}">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <strong style="color: #a55eea;">Realness Theme</strong>
                <button class="btn-secondary" onclick="removeElement('realness-${themeId}')" style="padding: 3px 10px; font-size: 0.9em;">Remove</button>
            </div>
            
            <div class="form-group">
                <label>Theme Name</label>
                <input type="text" class="text-input realness-name" value="${themeData?.name || ''}" placeholder="e.g., Fa-shun!" />
            </div>
            
            <div class="form-group">
                <label>Type</label>
                <select class="styled-select realness-type">
                    <option value="Signature" ${themeData?.type === 'Signature' ? 'selected' : ''}>Signature</option>
                    <option value="Extra" ${themeData?.type === 'Extra' ? 'selected' : ''}>Extra</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Identity Statement</label>
                <textarea class="text-input realness-identity" placeholder="Your identity statement..." style="min-height: 60px;">${themeData?.identity || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label>Power Tags (comma-separated)</label>
                <input type="text" class="text-input realness-power" value="${themeData?.powerTags?.join(', ') || ''}" placeholder="e.g., Haute couture, Make a new costume, An eye for detail" />
            </div>
            
            <div class="form-group">
                <label>Weakness Tags (comma-separated)</label>
                <input type="text" class="text-input realness-weakness" value="${themeData?.weaknessTags?.join(', ') || ''}" placeholder="e.g., Very critical" />
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Growth Boxes</label>
                    <input type="number" class="text-input realness-growth" value="${themeData?.growth || 0}" min="0" max="5" />
                </div>
                
                <div class="form-group">
                    <label>Crack Boxes</label>
                    <input type="number" class="text-input realness-crack" value="${themeData?.crack || 0}" min="0" max="5" />
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', themeHTML);
}

// ===================================
// STATUS MANAGEMENT
// ===================================
function addStatus(statusData = null) {
    const container = document.getElementById('statusesContainer');
    const statusId = Date.now();
    
    const statusHTML = `
        <div class="status-editor" id="status-${statusId}">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 10px; align-items: end;">
                <div class="form-group" style="margin: 0;">
                    <label>Status Name</label>
                    <input type="text" class="text-input status-name" value="${statusData?.name || ''}" placeholder="e.g., empowered, hurt" />
                </div>
                
                <div class="form-group" style="margin: 0;">
                    <label>Tier</label>
                    <input type="number" class="text-input status-tier" value="${statusData?.tier || 1}" min="1" max="5" />
                </div>
                
                <div class="form-group" style="margin: 0;">
                    <label>Type</label>
                    <select class="styled-select status-beneficial">
                        <option value="true" ${statusData?.beneficial ? 'selected' : ''}>Beneficial</option>
                        <option value="false" ${!statusData?.beneficial && statusData !== null ? 'selected' : ''}>Detrimental</option>
                    </select>
                </div>
                
                <button class="btn-secondary" onclick="removeElement('status-${statusId}')" style="padding: 8px 12px; margin-bottom: 0;">X</button>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', statusHTML);
}

// ===================================
// BURNT TAG MANAGEMENT
// ===================================
function addBurntTag(tagValue = '') {
    const container = document.getElementById('burntTagsContainer');
    const tagId = Date.now();
    
    const tagHTML = `
        <div class="burnt-tag-editor" id="burnt-${tagId}" style="display: flex; gap: 10px; margin-bottom: 10px;">
            <input type="text" class="text-input burnt-tag-value" value="${tagValue}" placeholder="Enter burnt tag..." style="flex: 1;" />
            <button class="btn-secondary" onclick="removeElement('burnt-${tagId}')" style="padding: 8px 15px;">Remove</button>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', tagHTML);
}

// ===================================
// HELPER FUNCTIONS
// ===================================
function removeElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.remove();
    }
}

function saveCharacter() {
    const name = document.getElementById('editCharName').value.trim();
    const pronouns = document.getElementById('editCharPronouns').value.trim();
    const playbook = document.getElementById('editCharPlaybook').value;
    
    if (!name) {
        alert('Please enter a character name');
        return;
    }
    
    // Collect Rainbow Themes
    const rainbowThemes = [];
    document.querySelectorAll('.rainbow-theme').forEach(theme => {
        const themeObj = {
            name: theme.querySelector('.rainbow-name').value.trim(),
            type: theme.querySelector('.rainbow-type').value,
            runway: theme.querySelector('.rainbow-runway').value.trim(),
            powerTags: theme.querySelector('.rainbow-power').value.split(',').map(t => t.trim()).filter(t => t),
            weaknessTags: theme.querySelector('.rainbow-weakness').value.split(',').map(t => t.trim()).filter(t => t),
            growth: parseInt(theme.querySelector('.rainbow-growth').value) || 0,
            shade: parseInt(theme.querySelector('.rainbow-shade').value) || 0
        };
        if (themeObj.name) rainbowThemes.push(themeObj);
    });
    
    // Collect Realness Themes
    const realnessThemes = [];
    document.querySelectorAll('.realness-theme').forEach(theme => {
        const themeObj = {
            name: theme.querySelector('.realness-name').value.trim(),
            type: theme.querySelector('.realness-type').value,
            identity: theme.querySelector('.realness-identity').value.trim(),
            powerTags: theme.querySelector('.realness-power').value.split(',').map(t => t.trim()).filter(t => t),
            weaknessTags: theme.querySelector('.realness-weakness').value.split(',').map(t => t.trim()).filter(t => t),
            growth: parseInt(theme.querySelector('.realness-growth').value) || 0,
            crack: parseInt(theme.querySelector('.realness-crack').value) || 0
        };
        if (themeObj.name) realnessThemes.push(themeObj);
    });
    
    // Collect Statuses
    const currentStatuses = [];
    document.querySelectorAll('.status-editor').forEach(status => {
        const statusObj = {
            name: status.querySelector('.status-name').value.trim(),
            tier: parseInt(status.querySelector('.status-tier').value) || 1,
            beneficial: status.querySelector('.status-beneficial').value === 'true'
        };
        if (statusObj.name) currentStatuses.push(statusObj);
    });
    
    // Collect Burnt Tags
    const burntTags = [];
    document.querySelectorAll('.burnt-tag-value').forEach(input => {
        const tag = input.value.trim();
        if (tag) burntTags.push(tag);
    });
    
    // Save character
    const sheetImage = document.getElementById('editCharSheetImage').value.trim();
    
    characters[name] = {
        name: name,
        pronouns: pronouns,
        playbook: playbook,
        characterSheet: sheetImage || null, // NEW: Save character sheet image path
        rainbowThemes: rainbowThemes,
        realnessThemes: realnessThemes,
        currentStatuses: currentStatuses,
        burntTags: burntTags
    };
    
    saveToLocalStorage();
    updatePlayerCharacterSelect();
    currentEditingCharacter = null;
    switchCharMgmtTab('list');
    alert(`Character "${name}" saved successfully!`);
}

function editCharacter(name) {
    currentEditingCharacter = name;
    switchCharMgmtTab('edit');
}

function deleteCharacter(name) {
    if (confirm(`Delete ${name}? This cannot be undone.`)) {
        delete characters[name];
        saveToLocalStorage();
        updatePlayerCharacterSelect();
        switchCharMgmtTab('list');
    }
}

function renderImportExport() {
    return `
        <div>
            <div style="margin-bottom: 30px;">
                <h3 style="margin-bottom: 15px;">Export Characters</h3>
                <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 15px;">
                    Export all character data as JSON for backup or sharing.
                </p>
                <textarea id="exportData" readonly style="width: 100%; min-height: 200px; padding: 10px; background: rgba(0, 0, 0, 0.3); border: 2px solid rgba(255, 255, 255, 0.3); color: white; border-radius: 8px; font-family: monospace;">${JSON.stringify(characters, null, 2)}</textarea>
                <button class="btn-primary" style="margin-top: 10px;" onclick="copyExportData()">Copy to Clipboard</button>
            </div>
            
            <div>
                <h3 style="margin-bottom: 15px;">Import Characters</h3>
                <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 15px;">
                    Paste exported JSON data to import characters.
                </p>
                <textarea id="importData" placeholder="Paste JSON data here..." style="width: 100%; min-height: 150px; padding: 10px; background: rgba(255, 255, 255, 0.1); border: 2px solid rgba(255, 255, 255, 0.3); color: white; border-radius: 8px; font-family: monospace;"></textarea>
                <button class="btn-primary" style="margin-top: 10px;" onclick="importCharacters()">Import Data</button>
            </div>
        </div>
    `;
}

function copyExportData() {
    const textarea = document.getElementById('exportData');
    textarea.select();
    document.execCommand('copy');
    alert('Character data copied to clipboard!');
}

function importCharacters() {
    try {
        const data = document.getElementById('importData').value;
        const imported = JSON.parse(data);
        
        if (confirm('Import these characters? This will merge with existing data.')) {
            characters = { ...characters, ...imported };
            saveToLocalStorage();
            updatePlayerCharacterSelect();
            switchCharMgmtTab('list');
            alert('Characters imported successfully!');
        }
    } catch (e) {
        alert('Invalid JSON data. Please check the format.');
    }
}

function updatePlayerCharacterSelect() {
    const select = document.getElementById('playerCharSelect');
    select.innerHTML = '<option value="">-- Select Character --</option>';
    
    Object.keys(characters).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });
}

// ===================================
// SCENE & CHARACTER DISPLAY
// ===================================
function updateLocation() {
    const location = locationSelect.value;
    if (location && locationData[location]) {
        sceneDisplay.innerHTML = `<img src="${locationData[location]}" alt="${location}">`;
    } else {
        sceneDisplay.innerHTML = '<p class="scene-placeholder">Select a location to begin</p>';
    }
}

function updateCharacter() {
    const characterId = characterSelect.value;
    
    if (characterId && characterData[characterId]) {
        const character = characterData[characterId];
        
        characterDisplay.innerHTML = `<img src="${character.image}" alt="${character.name}">`;
        
        characterInfo.innerHTML = `
            <h4>${character.name}</h4>
            <p>${character.info}</p>
        `;
    } else {
        characterDisplay.innerHTML = '<p class="character-placeholder">Select a character to display</p>';
        characterInfo.innerHTML = '';
    }
}

// ===================================
// AUDIO PLAYER
// ===================================
function playMusic() {
    if (audioPlayer.src) {
        audioPlayer.play();
        const trackName = trackSelect.options[trackSelect.selectedIndex].text;
        nowPlaying.textContent = `♪ ${trackName}`;
    } else {
        alert('Please select a track first');
    }
}

function pauseMusic() {
    audioPlayer.pause();
}

function stopMusic() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    nowPlaying.textContent = 'No track playing';
}

function changeTrack() {
    const track = trackSelect.value;
    if (track) {
        audioPlayer.src = track;
        audioPlayer.load();
        playMusic();
    }
}

function updateVolume() {
    const volume = volumeSlider.value / 100;
    audioPlayer.volume = volume;
    volumeLabel.textContent = `${volumeSlider.value}%`;
}

// ===================================
// DICE ROLLER
// ===================================
function rollDice() {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const modifier = parseInt(powerModifier.value) || 0;
    const total = die1 + die2 + modifier;
    
    document.querySelector('.die1').textContent = die1;
    document.querySelector('.die2').textContent = die2;
    document.querySelector('.modifier').textContent = modifier >= 0 ? `+${modifier}` : modifier;
    document.querySelector('.total').textContent = total;
    
    let resultText = '';
    let resultClass = '';
    
    if (total >= 10) {
        resultText = '✅ SUCCESS! Full effect, no complications';
        resultClass = 'result-success';
    } else if (total >= 7) {
        resultText = '⚠️ PARTIAL SUCCESS - Success with complication or cost';
        resultClass = 'result-partial';
    } else {
        resultText = '❌ FAILURE - Miss, MC makes a hard move';
        resultClass = 'result-fail';
    }
    
    rollResult.innerHTML = `<div class="${resultClass}">${resultText}</div>`;
}

// ===================================
// ===================================
// MUSIC LOOP & PLAYLIST FUNCTIONS
// ===================================
function toggleLoop() {
    isLooping = !isLooping;
    audioPlayer.loop = isLooping;
    
    if (isLooping) {
        loopBtn.style.background = 'rgba(76, 175, 80, 0.5)';
        loopBtn.style.borderColor = '#4caf50';
        loopBtn.textContent = '🔁 Loop ON';
    } else {
        loopBtn.style.background = '';
        loopBtn.style.borderColor = '';
        loopBtn.textContent = '🔁 Loop';
    }
    
    if (audioPlayer.src) {
        const trackName = trackSelect.options[trackSelect.selectedIndex].text;
        nowPlaying.textContent = `♪ ${trackName}${isLooping ? ' 🔁' : ''}`;
    }
}

function addToPlaylist() {
    const track = trackSelect.value;
    const trackName = trackSelect.options[trackSelect.selectedIndex].text;
    
    if (!track) {
        alert('Please select a track first');
        return;
    }
    
    if (playlist.find(item => item.path === track)) {
        alert('Track already in playlist');
        return;
    }
    
    playlist.push({ path: track, name: trackName });
    renderPlaylist();
    playlistElement.style.display = 'block';
}

function renderPlaylist() {
    if (playlist.length === 0) {
        playlistElement.style.display = 'none';
        return;
    }
    
    playlistTracks.innerHTML = '';
    playlist.forEach((track, index) => {
        const trackDiv = document.createElement('div');
        trackDiv.style.cssText = 'padding: 5px; margin: 2px 0; background: rgba(255,255,255,0.1); border-radius: 4px; display: flex; justify-content: space-between; align-items: center;';
        
        const isCurrentTrack = index === currentPlaylistIndex && audioPlayer.src.includes(track.path);
        if (isCurrentTrack) {
            trackDiv.style.background = 'rgba(76, 175, 80, 0.3)';
        }
        
        trackDiv.innerHTML = `
            <span style="flex: 1;">${isCurrentTrack ? '▶ ' : ''}${index + 1}. ${track.name}</span>
            <button onclick="playPlaylistTrack(${index})" style="padding: 2px 8px; margin-right: 5px; background: rgba(33, 150, 243, 0.5); border: 1px solid #2196F3; color: white; border-radius: 3px; cursor: pointer;">Play</button>
            <button onclick="removeFromPlaylist(${index})" style="padding: 2px 8px; background: rgba(244, 67, 54, 0.5); border: 1px solid #f44336; color: white; border-radius: 3px; cursor: pointer;">✕</button>
        `;
        
        playlistTracks.appendChild(trackDiv);
    });
}

function playPlaylistTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    
    currentPlaylistIndex = index;
    const track = playlist[index];
    
    audioPlayer.src = track.path;
    audioPlayer.load();
    playMusic();
    
    trackSelect.value = track.path;
    renderPlaylist();
}

function removeFromPlaylist(index) {
    playlist.splice(index, 1);
    
    if (currentPlaylistIndex >= playlist.length) {
        currentPlaylistIndex = Math.max(0, playlist.length - 1);
    }
    
    renderPlaylist();
}

function playNextInPlaylist() {
    if (playlist.length === 0) return;
    
    currentPlaylistIndex = (currentPlaylistIndex + 1) % playlist.length;
    playPlaylistTrack(currentPlaylistIndex);
}

// Handle track ending
audioPlayer.addEventListener('ended', function() {
    if (playlist.length > 0 && !isLooping) {
        playNextInPlaylist();
    }
});

// ===================================
// CAMPAIGN MANAGEMENT
// ===================================

function changeChapter(chapterNum) {
    currentChapter = chapterNum;
    console.log(`📖 Switched to Chapter ${chapterNum}`);
    
    // Update UI to show current chapter
    const chapterDisplay = document.getElementById('currentChapterDisplay');
    if (chapterDisplay) {
        chapterDisplay.textContent = `Chapter ${chapterNum}`;
    }
    
    // Update script panel title
    const scriptPanelTitle = document.getElementById('scriptPanelTitle');
    if (scriptPanelTitle) {
        scriptPanelTitle.textContent = `Campaign Script - Chapter ${chapterNum}`;
    }
    
    // Reload script panel if it's open
    const scriptPanel = document.getElementById('scriptPanel');
    if (scriptPanel && !scriptPanel.classList.contains('hidden')) {
        loadChapterTabs();
        switchScriptTab('overview'); // Load overview tab for new chapter
    }
    
    saveToLocalStorage();
}

// Function to load tabs for current chapter
function loadChapterTabs() {
    const chapterKey = `chapter${currentChapter}`;
    const chapter = scriptData[chapterKey];
    
    if (!chapter || !chapter.tabs) {
        console.warn(`No script data found for chapter ${currentChapter}`);
        return;
    }
    
    // Get the tabs container
    const tabsContainer = document.querySelector('.panel-tabs');
    if (!tabsContainer) return;
    
    // Clear existing tabs
    tabsContainer.innerHTML = '';
    
    // Create tab buttons for this chapter
    const tabKeys = Object.keys(chapter.tabs);
    tabKeys.forEach((tabKey, index) => {
        const tabData = chapter.tabs[tabKey];
        const button = document.createElement('button');
        button.className = 'tab-btn';
        button.dataset.tab = tabKey;
        button.textContent = tabData.title;
        
        // Make first tab active
        if (index === 0) {
            button.classList.add('active');
        }
        
        // Add click handler
        button.addEventListener('click', () => switchScriptTab(tabKey));
        
        tabsContainer.appendChild(button);
    });
}

function setOutcome(chapter, outcome) {
    storyOutcomes[chapter] = outcome;
    console.log(`Story outcome set: ${chapter} = ${outcome}`);
    
    // Update radio button UI
    const radioButtons = document.querySelectorAll(`input[name="outcome-${chapter}"]`);
    radioButtons.forEach(radio => {
        radio.checked = (radio.value === outcome);
    });
    
    saveToLocalStorage();
}

function getStoryOutcome(chapter) {
    return storyOutcomes[chapter] || 'none';
}

// Export player data for Player Companion App
function exportPlayerData(playerName) {
    const character = characters[playerName];
    if (!character) {
        alert(`No character data found for ${playerName}`);
        return;
    }
    
    const dataStr = JSON.stringify(character, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${playerName.replace(/\s+/g, '-').toLowerCase()}-character.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    console.log(`✅ Exported character data for ${playerName}`);
}



// ===================================
// GLOBAL INITIALIZATION
// ===================================
// All event listeners are initialized in initializeEventListeners() function
// which is called on DOMContentLoaded event (see around line 1282).
// This prevents duplicate event listener registration and ensures proper initialization order.

console.log('✅ QUEERZ! MC Companion script loaded successfully!');

// --- Broadcast wiring (non-invasive) ---
(function(){
  if (window.__broadcast_wired) return;
  window.__broadcast_wired = true;
  function collectBroadcastPayload(){
    const sceneSel = document.getElementById('locationSelect');
    const charSel  = document.getElementById('characterSelect');
    const trackSel = document.getElementById('trackSelect');
    const sceneKey = sceneSel ? sceneSel.value : '';
    const charKey  = charSel ? charSel.value : '';
    const trackUrl = trackSel ? trackSel.value : '';
    let sceneImage = '';
    const img = document.querySelector('#sceneDisplay img');
    if (img && img.src) sceneImage = img.src;
    let characterImage = '';
    const cimg = document.querySelector('#characterDisplay img');
    if (cimg && cimg.src) characterImage = cimg.src;
    return {
      sceneName: sceneKey || (sceneSel && sceneSel.options[sceneSel.selectedIndex]?.text) || '',
      sceneImage, characterKey: charKey, characterImage, musicUrl: trackUrl
    };
  }
  function wire(){
    const btn = document.getElementById('broadcastBtn');
    if (!btn) return;
    btn.addEventListener('click', async ()=>{
      try{
        const payload = collectBroadcastPayload();
        if (window.Broadcast && window.Broadcast.send){
          await window.Broadcast.send(payload);
          btn.classList.add('pulse'); setTimeout(()=>btn.classList.remove('pulse'), 600);
        } else {
          alert('Broadcast module not ready.');
        }
      }catch(e){ console.error(e); alert('Broadcast failed.'); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();