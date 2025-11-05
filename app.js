import { app } from './mc-firebase-config.js';
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// --- State ---
const state = {
  characters: [],
  moves: [],
  scenes: [],
  activeCharacter: null,
  activeScene: null,
  quick: { image:'', music:'', text:'' }
};

// --- Elements ---
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
const characterListEl = document.getElementById('characterList');
const movesGridEl = document.getElementById('movesGrid');
const sceneTreeEl = document.getElementById('sceneTree');
const sceneDetailsEl = document.getElementById('sceneDetails');
const btnSetActiveScene = document.getElementById('btnSetActiveScene');
const btnBroadcastScene = document.getElementById('btnBroadcastScene');
const activeCharacterCardEl = document.getElementById('activeCharacterCard');
const tagControlsEl = document.getElementById('tagControls');

const previewSceneEl = document.getElementById('previewScene');
const previewTextEl = document.getElementById('previewText');
const previewAudioEl = document.getElementById('previewAudio');

const btnPreview = document.getElementById('btnPreview');
const btnBroadcast = document.getElementById('btnBroadcast');
const statusChip = document.getElementById('firebaseStatus');

const qbImage = document.getElementById('qbImage');
const qbMusic = document.getElementById('qbMusic');
const qbText = document.getElementById('qbText');
const btnQuickPreview = document.getElementById('btnQuickPreview');
const btnQuickBroadcast = document.getElementById('btnQuickBroadcast');

// --- Firebase ---
const db = getDatabase(app);
function setStatus(ok){
  statusChip.textContent = ok ? '🟢 Firebase: Connected' : '🔴 Firebase: Disconnected';
  statusChip.classList.toggle('ok', ok);
  statusChip.classList.toggle('err', !ok);
}
setStatus(true);

// --- Tabs ---
tabs.forEach(t => {
  t.addEventListener('click', () => {
    tabs.forEach(tt => tt.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    t.classList.add('active');
    document.getElementById(t.dataset.tab).classList.add('active');
  });
});

// --- Load Data ---
async function loadAll(){
  const [characters, moves, scenes] = await Promise.all([
    fetch('data/characters.json').then(r=>r.json()).catch(()=>({characters:[]})),
    fetch('data/moves.json').then(r=>r.json()).catch(()=>({moves:[]})),
    fetch('data/scenes.json').then(r=>r.json()).catch(()=>({scenes:[]}))
  ]);
  state.characters = characters.characters || [];
  state.moves = moves.moves || [];
  state.scenes = scenes.scenes || [];

  renderCharacters();
  renderMoves();
  renderScenes();
}
loadAll();

// --- Render Characters ---
function renderCharacters(){
  characterListEl.innerHTML = '';
  state.characters.forEach((c, idx) => {
    const item = document.createElement('div');
    item.className = 'character-item';
    item.innerHTML = \`
      <img src="\${c.portrait || ''}" alt="\${c.name}"/>
      <div class="meta">
        <div><strong>\${c.name}</strong></div>
        <div class="muted">\${c.pronouns || ''}</div>
      </div>
    \`;
    item.addEventListener('click', () => {
      document.querySelectorAll('.character-item').forEach(el=>el.classList.remove('active'));
      item.classList.add('active');
      state.activeCharacter = c;
      renderActiveCharacter();
    });
    characterListEl.appendChild(item);
  });
}

function renderActiveCharacter(){
  const c = state.activeCharacter;
  if(!c){
    activeCharacterCardEl.innerHTML = '<div class="muted">Select a character.</div>';
    tagControlsEl.innerHTML = '<div class="muted">Select a character from the sidebar first.</div>';
    return;
  }
  activeCharacterCardEl.innerHTML = \`
    <div class="header">
      <img src="\${c.portrait || ''}" alt="\${c.name}"/>
      <div>
        <div><strong>\${c.name}</strong></div>
        <div class="muted">\${c.pronouns || ''}</div>
      </div>
    </div>
    <div class="section">
      <div class="muted">Power Tags</div>
      <div class="tag-list">\${(c.powerTags||[]).map(t=>\`<span class="tag power">\${t}</span>\`).join('')}</div>
    </div>
    <div class="section">
      <div class="muted">Weakness Tags</div>
      <div class="tag-list">\${(c.weaknessTags||[]).map(t=>\`<span class="tag weak">\${t}</span>\`).join('')}</div>
    </div>
  \`;

  // Simple tag controls: burn & story tags
  tagControlsEl.innerHTML = \`
    <div class="field">
      <label>Add Story Tag</label>
      <input id="storyTagName" type="text" placeholder="e.g., Inspired"/>
      <button id="btnAddStoryTag" class="btn small secondary" style="margin-top:6px;">Add</button>
    </div>
    <div class="field">
      <label>Burn a Power Tag</label>
      <select id="burnSelect">\${(c.powerTags||[]).map(t=>\`<option>\${t}</option>\`).join('')}</select>
      <button id="btnBurn" class="btn small">Burn</button>
    </div>
    <div class="muted" id="charNotes">Use Moves tab for outcomes / guidance.</div>
  \`;
  document.getElementById('btnAddStoryTag').onclick = () => alert('Story tag added (local UI only).');
  document.getElementById('btnBurn').onclick = () => alert('Power tag burnt (local UI only).');
}

// --- Render Moves ---
function renderMoves(){
  movesGridEl.innerHTML = '';
  state.moves.forEach(m => {
    const el = document.createElement('div');
    el.className = 'move';
    el.innerHTML = \`
      <h4>\${m.name}</h4>
      <div class="muted">\${m.trigger || ''}</div>
      <div style="margin-top:8px;white-space:pre-wrap;">\${m.text || ''}</div>
    \`;
    movesGridEl.appendChild(el);
  });
}

// --- Render Scenes / Branching ---
function renderScenes(){
  sceneTreeEl.innerHTML = '';
  state.scenes.forEach(s => {
    const node = document.createElement('div');
    node.className = 'scene-node';
    node.textContent = s.title;
    node.addEventListener('click', ()=>selectScene(s, node));
    sceneTreeEl.appendChild(node);
  });
}

function selectScene(scene, node){
  document.querySelectorAll('.scene-node').forEach(n=>n.classList.remove('active'));
  node.classList.add('active');
  state.activeScene = scene;
  sceneDetailsEl.innerHTML = \`
    <div><strong>Title:</strong> \${scene.title}</div>
    <div><strong>ID:</strong> \${scene.id}</div>
    <div><strong>Next:</strong> \${(scene.next||[]).join(', ') || '(end)'}</div>
    <div class="field" style="margin-top:10px;">
      <label>Image URL</label>
      <input id="sceneImg" type="text" value="\${scene.image||''}"/>
    </div>
    <div class="field">
      <label>Music URL</label>
      <input id="sceneMusic" type="text" value="\${scene.music||''}"/>
    </div>
    <div class="field">
      <label>Text</label>
      <textarea id="sceneTextArea">\${scene.text||''}</textarea>
    </div>
  \`;
  btnSetActiveScene.disabled = false;
  btnBroadcastScene.disabled = false;
}

btnSetActiveScene.addEventListener('click', ()=>{
  if(!state.activeScene) return;
  const img = document.getElementById('sceneImg').value;
  const mus = document.getElementById('sceneMusic').value;
  const txt = document.getElementById('sceneTextArea').value;
  // Preview
  showPreview(img, txt, mus);
});

btnBroadcastScene.addEventListener('click', async ()=>{
  if(!state.activeScene) return;
  const img = document.getElementById('sceneImg').value;
  const mus = document.getElementById('sceneMusic').value;
  const txt = document.getElementById('sceneTextArea').value;
  await broadcast({image:img, music:mus, text:txt});
});

// --- Quick broadcast ---
[qbImage,qbMusic,qbText].forEach((el)=>{
  el.addEventListener('input', ()=>{
    state.quick.image = qbImage.value;
    state.quick.music = qbMusic.value;
    state.quick.text = qbText.value;
  });
});
btnQuickPreview.addEventListener('click', ()=>{
  showPreview(state.quick.image, state.quick.text, state.quick.music);
});
btnQuickBroadcast.addEventListener('click', async ()=>{
  await broadcast({image:state.quick.image, music:state.quick.music, text:state.quick.text});
});

// --- Global buttons ---
btnPreview.addEventListener('click', ()=>{
  // If a scene is active, preview it; else use quick area
  if(state.activeScene){
    const img = document.getElementById('sceneImg')?.value || '';
    const mus = document.getElementById('sceneMusic')?.value || '';
    const txt = document.getElementById('sceneTextArea')?.value || '';
    showPreview(img, txt, mus);
  } else {
    showPreview(state.quick.image, state.quick.text, state.quick.music);
  }
});

btnBroadcast.addEventListener('click', async ()=>{
  if(state.activeScene){
    const img = document.getElementById('sceneImg')?.value || '';
    const mus = document.getElementById('sceneMusic')?.value || '';
    const txt = document.getElementById('sceneTextArea')?.value || '';
    await broadcast({image:img, music:mus, text:txt});
  } else {
    await broadcast({image:state.quick.image, music:state.quick.music, text:state.quick.text});
  }
});

// --- Preview ---
function showPreview(image, text, music){
  if(image){
    previewSceneEl.innerHTML = `<img src="${image}" alt="scene"/>`;
  }else{
    previewSceneEl.innerHTML = `<div class="placeholder">No image</div>`;
  }
  previewTextEl.textContent = text || '';
  previewAudioEl.src = music || '';
  previewAudioEl.load();
  if(music) { try{ previewAudioEl.play(); }catch{} }
}

// --- Broadcast ---
async function broadcast(payload){
  const full = {
    ...payload,
    character: state.activeCharacter ? {
      name: state.activeCharacter.name || '',
      portrait: state.activeCharacter.portrait || ''
    } : null,
    sceneId: state.activeScene?.id || null,
    timestamp: Date.now()
  };
  try {
    await set(ref(db, 'broadcast/current'), full);
    flashBtn(btnBroadcast);
    flashBtn(btnQuickBroadcast);
    flashBtn(btnBroadcastScene);
  } catch (e){
    console.error('Broadcast failed', e);
    setStatus(false);
  }
}
function flashBtn(btn){
  if(!btn) return;
  const original = btn.textContent;
  btn.textContent = '✅ Sent!';
  setTimeout(()=>btn.textContent = original, 1200);
}
