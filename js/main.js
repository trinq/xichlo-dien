// main.js — entry point. Boots Game on DOMContentLoaded.
import { Game } from './game.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  const startBtn = document.getElementById('start-btn');
  const menu = document.getElementById('menu');

  const game = new Game(canvas);
  game.start();

  startBtn.addEventListener('click', () => {
    menu.style.display = 'none';
    document.getElementById('hud').style.display = 'block';
    game.startGameplay();
  });

  // Expose for smoke test
  window.__game = game;
});
