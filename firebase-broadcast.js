// Simple broadcaster using Firebase Realtime Database (compat SDK)
(function() {
  if (!window._firebaseDb) return;

  function broadcastToPlayers(payload) {
    try {
      const data = {
        sceneImage: payload.sceneImage || "",
        sceneName:  payload.sceneName  || "",
        characterImage: payload.characterImage || "",
        musicUrl:   payload.musicUrl   || "",
        ts: Date.now()
      };
      window._firebaseDb.ref('/broadcast/current').set(data);
      console.log('[Broadcast] sent', data);
    } catch (e) {
      console.error('[Broadcast] failed', e);
    }
  }

  // expose globally but don't attach any UI here
  window.broadcastToPlayers = broadcastToPlayers;
})();