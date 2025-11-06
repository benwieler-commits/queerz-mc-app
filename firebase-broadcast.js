(function(){
  if (!window._firebaseDb){ console.warn('[Broadcast] Firebase not ready'); return; }
  window.broadcastToPlayers = function(payload){
    const data = {
      sceneImage: payload.sceneImage||'', sceneName: payload.sceneName||'',
      characterImage: payload.characterImage||'',
      musicUrl: payload.musicUrl||'', ts: Date.now()
    };
    return window._firebaseDb.ref('/broadcast/current').set(data);
  };
})();