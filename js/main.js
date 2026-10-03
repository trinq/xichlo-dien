// main.js — entry point. Boots Game on DOMContentLoaded.
import { Game } from './game.js';

// Global error handler — visible red banner
window.addEventListener('error', (e) => {
  console.error('[main][window.error]', e.error || e.message);
  document.body.innerHTML += `<div style="position:fixed;top:8px;left:8px;background:red;color:white;padding:8px;z-index:9999;max-width:90%;font-family:monospace;font-size:12px;">ERR: ${e.message || e.error?.message || 'unknown'}<br>at ${e.filename}:${e.lineno}</div>`;
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('[main][unhandled]', e.reason);
  document.body.innerHTML += `<div style="position:fixed;top:8px;left:8px;background:darkred;color:white;padding:8px;z-index:9999;max-width:90%;font-family:monospace;font-size:12px;">PROMISE: ${e.reason?.message || e.reason}</div>`;
});

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  const startBtn = document.getElementById('start-btn');
  const menu = document.getElementById('menu');

  let game;
  try {
    game = new Game(canvas);
    game.start();
    console.log('[main] Game initialized OK');
  } catch (err) {
    console.error('[main] Game init FAILED:', err);
    document.body.innerHTML += `<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:red;color:white;padding:20px;z-index:9999;max-width:80%;font-family:monospace;">GAME INIT FAILED: ${err.message}<br><br>${err.stack || ''}</div>`;
    return;
  }

  startBtn.addEventListener('click', () => {
    menu.style.display = 'none';
    document.getElementById('hud').style.display = 'block';
    game.startGameplay();
  });

// Ticket 02: expose asset loader for testing
import('./assets.js').then((mod) => {
    window.__assets = mod;
    console.log('[main] assets.js loaded, window.__assets ready');
  }).catch((err) => {
    console.error('[main] assets.js FAILED to load:', err);
    document.body.innerHTML += `<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:red;color:white;padding:20px;z-index:9999;">ASSETS.JS FAILED: ${err.message}</div>`;
  });

  // Expose for smoke test
  window.__game = game;
});
