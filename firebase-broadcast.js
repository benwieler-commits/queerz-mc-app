
// firebase-broadcast.js
// Adds Firebase live status pill + broadcastToPlayers(scene, character, music, text)
(function(){

  function inject(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
  async function ensureFirebase(){
    if(window.firebase && window.firebase.app) return;
    await inject("https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js");
    await inject("https://www.gstatic.com/firebasejs/10.12.5/firebase-database-compat.js");
  }

  function ensurePill(){
    let pill = document.getElementById("firebaseStatus");
    if(!pill){
      pill = document.createElement("div");
      pill.id = "firebaseStatus";
      pill.textContent = "● Offline";
      pill.style.position = "fixed";
      pill.style.right = "12px";
      pill.style.bottom = "12px";
      pill.style.padding = "8px 12px";
      pill.style.borderRadius = "999px";
      pill.style.background = "rgba(239,68,68,0.9)";
      pill.style.color = "#fff";
      pill.style.font = "600 12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial";
      pill.style.zIndex = "2147483647";
      document.body.appendChild(pill);
    }
    return pill;
  }

  // Resolve a repo-relative path to a full GitHub Pages URL
  function toFull(url){
    if(!url) return "";
    if(/^https?:\/\//i.test(url)) return url;
    const clean = url.replace(/^\/+/, "");
    return "https://benwieler-commits.github.io/queerz-mc-app/" + clean;
  }

  function setIfImg(el, url){
    if(!el) return;
    el.innerHTML = '<img class="scene-image" alt="" />';
    const img = el.querySelector("img");
    img.src = toFull(url);
  }

  async function init(){
    await ensureFirebase();
    if(!window._MC_FB_READY){
      window._MC_FB_READY = true;
      const config = {
        apiKey: "AIzaSyDOeJQjTm0xuFDAhhLaWP6d_kK_hNwRY58",
        authDomain: "queerz-mc-live.firebaseapp.com",
        databaseURL: "https://queerz-mc-live-default-rtdb.firebaseio.com",
        projectId: "queerz-mc-live",
        storageBucket: "queerz-mc-live.firebasestorage.app",
        messagingSenderId: "155846709409",
        appId: "1:155846709409:web:8c12204dc7d502586a20e0"
      };
      if(!firebase.apps.length) firebase.initializeApp(config);
      const db = firebase.database();
      const pill = ensurePill();
      db.ref(".info/connected").on("value", s=>{
        const on = !!s.val();
        pill.textContent = on ? "● Live Sync" : "● Offline";
        pill.style.background = on ? "rgba(16,185,129,0.9)" : "rgba(239,68,68,0.9)";
      });

      // Global helpers the existing app can set/use (non-destructive)
      window.MC_ASSET_HOST = "https://benwieler-commits.github.io/queerz-mc-app/";
      window.toAssetUrl = function(path){ return toFull(path||""); };

      // Attach to known controls if they exist, to keep window.current* fresh
      function attachSelectors(){
        const locSel = document.getElementById("locationSelect");
        const charSel = document.getElementById("characterSelect");
        const trackSel = document.getElementById("trackSelect");
        if(locSel && !locSel._bound){
          locSel._bound = true;
          locSel.addEventListener("change", ()=>{
            const map = {
              "cafe-greenwich":"images/locations/cafe-greenwich.jpg",
              "theater-district":"images/locations/theater-district.jpg",
              "morettis":"images/locations/morettis-comedy-cellar.webp"
            };
            const path = map[locSel.value] || "";
            window.currentScenePath = path;
            const el = document.getElementById("sceneDisplay");
            setIfImg(el, path);
          });
        }
        if(charSel && !charSel._bound){
          charSel._bound = true;
          charSel.addEventListener("change", ()=>{
            const map = {
              "mama-jay":"images/characters/mama-jay-portrait.png",
              "danny-civilian":"images/characters/danny-civilian.png",
              "danny-justice":"images/characters/danny-justice-knight.png",
              "pawn":"images/characters/pawn-tough-crowd-general.png"
            };
            const path = map[charSel.value] || "";
            window.currentCharacterPath = path;
            const el = document.getElementById("characterDisplay");
            setIfImg(el, path);
          });
        }
        if(trackSel && !trackSel._bound){
          trackSel._bound = true;
          trackSel.addEventListener("change", ()=>{
            const v = trackSel.value || "";
            let path = v;
            if(!/^https?:\/\//i.test(v)) path = toFull(v);
            window.currentTrackPath = path.replace("https://benwieler-commits.github.io/queerz-mc-app/",""); // store relative for broadcast
            const now = document.getElementById("nowPlaying");
            if(now) now.textContent = v ? "Now Playing: " + v : "No track playing";
            const audio = document.getElementById("audioPlayer");
            if(audio){
              audio.src = toFull(window.currentTrackPath);
              audio.play().catch(()=>{});
            }
          });
        }
      }
      attachSelectors();
      // Also run later in case UI builds dynamically
      setTimeout(attachSelectors, 1500);

      // Broadcast button
      const b = document.getElementById("broadcastBtn");
      window.broadcastToPlayers = async function(payload={}){
        const enriched = {
          sceneImagePath: window.currentScenePath || payload.sceneImagePath || "",
          characterImagePath: window.currentCharacterPath || payload.characterImagePath || "",
          musicPath: window.currentTrackPath || payload.musicPath || "",
          sceneText: window.currentSceneText || payload.sceneText || "",
          chapter: (document.getElementById("chapterSelect")||{}).value || ""
        };
        await db.ref("/broadcast/current").set(enriched);
      };
      if(b && !b._bound){
        b._bound = true;
        b.addEventListener("click", ()=>{
          window.broadcastToPlayers().catch(e=>{console.error(e); alert("Broadcast failed (see console).");});
        });
      }
    }
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", init);
  else init();

})();
