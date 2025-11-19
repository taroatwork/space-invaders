/**
 * Space Invaders - Main entry point
 */

import { Game } from './game/Game';

// Hide loading message
const loadingEl = document.getElementById('loading');
if (loadingEl) {
  loadingEl.style.display = 'none';
}

// Initialize and start game
const game = new Game('game-canvas');
game.start();
