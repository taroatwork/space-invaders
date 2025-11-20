/**
 * Main game class - orchestrates everything
 */

import { Renderer } from '@/rendering/Renderer';
import { Player } from './entities/Player';
import { Bullet } from './entities/Bullet';
import { Invader } from './entities/Invader';
import { Shield } from './entities/Shield';
import { Missile } from './entities/Missile';
import { INVADER, FRAME_TIME, CANVAS_WIDTH, CANVAS_HEIGHT, SHIELD } from './utils/constants';
import { InvaderType, MissileType, GamePhase, type GameState, type Difficulty } from '@/types';

export class Game {
  private renderer: Renderer;
  private player: Player;
  private bullets: Bullet[] = []; // Changed to array for multiple bullets
  private invaders: Invader[] = [];
  private shields: Shield[] = [];
  private missiles: Missile[] = [];

  private state: GameState;
  private lastFrameTime: number = 0;
  // private animationId: number = 0; // Will be used for pause functionality later
  private invaderDirection: number = 1; // 1 = right, -1 = left
  private invaderMoveCounter: number = 0;
  private invaderAnimFrame: number = 0;
  private aliveInvaderCount: number = 0;

  // Input state
  private keys: Set<string> = new Set();
  private shootCooldown: number = 0; // Cooldown counter for continuous shooting
  private readonly SHOOT_COOLDOWN_FRAMES = 15; // Fire every 15 frames (~0.25 seconds)
  private readonly MAX_BULLETS = 3; // Maximum bullets on screen

  constructor(canvasId: string) {
    this.renderer = new Renderer(canvasId);
    this.player = new Player();

    // Initialize game state
    this.state = {
      phase: GamePhase.PLAYING,
      score: 0,
      hiScore: 0,
      lives: 3,
      stage: 1,
      difficulty: 'NORMAL' as Difficulty,
    };

    this.setupInput();
    this.initializeInvaders();
    this.initializeShields();
  }

  /**
   * Initialize shields (4 bunkers)
   */
  private initializeShields(): void {
    this.shields = [];

    for (let i = 0; i < SHIELD.COUNT; i++) {
      const x = SHIELD.FIRST_X + (i * SHIELD.SPACING);
      const y = SHIELD.Y_POSITION;
      this.shields.push(new Shield(x, y));
    }
  }

  /**
   * Initialize invader formation (5 rows × 11 columns)
   */
  private initializeInvaders(): void {
    this.invaders = [];

    for (let row = 0; row < INVADER.ROWS; row++) {
      for (let col = 0; col < INVADER.COLUMNS; col++) {
        // Determine type based on row
        let type: InvaderType;
        if (row === 0) {
          type = InvaderType.SMALL;
        } else if (row === 1 || row === 2) {
          type = InvaderType.MEDIUM;
        } else {
          type = InvaderType.LARGE;
        }

        const x = INVADER.START_X + (col * INVADER.SPACING_X);
        const y = INVADER.START_Y + (row * INVADER.SPACING_Y);

        this.invaders.push(new Invader(row, col, type, x, y));
      }
    }

    this.aliveInvaderCount = this.invaders.filter(inv => inv.alive).length;
  }

  /**
   * Setup keyboard input
   */
  private setupInput(): void {
    // Make sure canvas is focusable
    const canvas = this.renderer.getCanvas();
    canvas.tabIndex = 1;
    canvas.focus();

    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key.toLowerCase());

      // Restart on spacebar when game over
      if (this.state.phase === GamePhase.GAME_OVER && e.key === ' ') {
        this.restart();
      }

      e.preventDefault();
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.key.toLowerCase());
    });

    // Also listen on canvas directly
    canvas.addEventListener('keydown', (e) => {
      e.preventDefault();
    });
  }

  /**
   * Start the game loop
   */
  start(): void {
    this.lastFrameTime = performance.now();
    this.gameLoop(this.lastFrameTime);
  }

  /**
   * Restart the game (reset to initial state)
   */
  private restart(): void {
    // Reset game state
    this.state.phase = GamePhase.PLAYING;
    this.state.score = 0;
    this.state.lives = 3;
    this.state.stage = 1;

    // Reset player
    this.player.reset();

    // Clear bullets and missiles
    this.bullets = [];
    this.missiles = [];

    // Reset shooting cooldown
    this.shootCooldown = 0;

    // Reinitialize invaders and shields
    this.initializeInvaders();
    this.initializeShields();

    // Reset invader movement
    this.invaderDirection = 1;
    this.invaderMoveCounter = 0;
    this.invaderAnimFrame = 0;
  }

  /**
   * Main game loop (60 FPS target)
   */
  private gameLoop(timestamp: number): void {
    const deltaTime = timestamp - this.lastFrameTime;

    if (deltaTime >= FRAME_TIME) {
      this.update();
      this.render();
      this.lastFrameTime = timestamp;
    }

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  /**
   * Update game state
   */
  private update(): void {
    if (this.state.phase !== GamePhase.PLAYING) return;

    // Handle player input
    this.handleInput();

    // Update player
    this.player.update();

    // Update bullets
    for (const bullet of this.bullets) {
      bullet.update();
    }
    // Remove inactive bullets
    this.bullets = this.bullets.filter(b => b.active);

    // Update invaders
    this.updateInvaders();

    // Update missiles
    this.updateMissiles();

    // Randomly fire missiles from invaders
    this.fireRandomMissile();

    // Check collisions
    this.checkCollisions();

    // Check game over
    if (this.state.lives <= 0) {
      this.state.phase = GamePhase.GAME_OVER;
    }
  }

  /**
   * Handle keyboard input
   */
  private handleInput(): void {
    if (this.keys.has('arrowleft') || this.keys.has('a')) {
      this.player.moveLeft();
    } else if (this.keys.has('arrowright') || this.keys.has('d')) {
      this.player.moveRight();
    } else {
      this.player.stop();
    }

    // Handle continuous shooting when spacebar or ArrowUp is held
    if (this.keys.has(' ') || this.keys.has('arrowup')) {
      if (this.shootCooldown === 0) {
        this.shoot();
        this.shootCooldown = this.SHOOT_COOLDOWN_FRAMES;
      }
    }

    // Decrease cooldown
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }
  }

  /**
   * Shoot bullet (if less than max bullets on screen)
   */
  private shoot(): void {
    if (this.bullets.length < this.MAX_BULLETS && this.player.alive) {
      const x = this.player.position.x + 6; // Center of player
      const y = this.player.position.y - 4;
      this.bullets.push(new Bullet(x, y));
    }
  }

  /**
   * Update missiles
   */
  private updateMissiles(): void {
    for (const missile of this.missiles) {
      missile.update();
    }

    // Remove inactive missiles
    this.missiles = this.missiles.filter(m => m.active);
  }

  /**
   * Fire random missile from invaders
   */
  private fireRandomMissile(): void {
    // Fire approximately every 30 frames (about every 0.5 seconds)
    if (Math.random() > 0.02) return;

    // Get alive invaders
    const aliveInvaders = this.invaders.filter(inv => inv.alive);
    if (aliveInvaders.length === 0) return;

    // Pick random invader
    const randomInvader = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];

    // Pick random missile type
    const missileTypes = [
      MissileType.SLOW_STRAIGHT,
      MissileType.FAST_STRAIGHT,
      MissileType.WIGGLY,
    ];
    const randomType = missileTypes[Math.floor(Math.random() * missileTypes.length)];

    // Create missile from invader position
    const size = randomInvader.getSize();
    const x = randomInvader.position.x + size.width / 2;
    const y = randomInvader.position.y + size.height;

    this.missiles.push(new Missile(x, y, randomType));
  }

  /**
   * Update invader formation
   * CRITICAL: Authentic 1978 acceleration bug-turned-feature
   */
  private updateInvaders(): void {
    this.aliveInvaderCount = this.invaders.filter(inv => inv.alive).length;

    if (this.aliveInvaderCount === 0) {
      // All invaders destroyed - next stage
      this.state.stage++;
      this.initializeInvaders();
      return;
    }

    // Speed increases as invaders die (authentic acceleration)
    const baseSpeed = 8; // Lower = faster (was 30, too slow)
    const speedFactor = Math.max(1, Math.floor(this.aliveInvaderCount / 11));
    const moveSpeed = baseSpeed * speedFactor;

    this.invaderMoveCounter++;

    if (this.invaderMoveCounter >= moveSpeed) {
      this.invaderMoveCounter = 0;
      this.moveInvaderFormation();

      // Toggle animation frame
      this.invaderAnimFrame = (this.invaderAnimFrame + 1) % 2;
      this.invaders.forEach(inv => inv.updateAnimation(this.invaderAnimFrame));
    }
  }

  /**
   * Move entire invader formation
   */
  private moveInvaderFormation(): void {
    // Check if any invader reached edge
    let hitEdge = false;
    let lowestY = 0;

    for (const invader of this.invaders) {
      if (!invader.alive) continue;

      if (this.invaderDirection > 0 && invader.position.x >= CANVAS_WIDTH - 30) {
        hitEdge = true;
      } else if (this.invaderDirection < 0 && invader.position.x <= 10) {
        hitEdge = true;
      }

      if (invader.position.y > lowestY) {
        lowestY = invader.position.y;
      }
    }

    if (hitEdge) {
      // Move down and reverse direction
      for (const invader of this.invaders) {
        if (invader.alive) {
          invader.position.y += INVADER.MOVE_STEP_Y;
        }
      }
      this.invaderDirection *= -1;

      // Check if invaders reached player level
      if (lowestY > this.player.position.y - 20) {
        this.state.phase = GamePhase.GAME_OVER;
      }
    } else {
      // Move horizontally
      for (const invader of this.invaders) {
        if (invader.alive) {
          invader.position.x += INVADER.MOVE_STEP_X * this.invaderDirection;
        }
      }
    }
  }

  /**
   * Check all collisions
   */
  private checkCollisions(): void {
    // Check player bullet collisions
    for (const bullet of this.bullets) {
      if (!bullet.active) continue;

      const bulletBox = bullet.getCollisionBox();
      const bulletCenterX = bulletBox.x + bulletBox.width / 2;
      const bulletCenterY = bulletBox.y + bulletBox.height / 2;

      // Check bullet vs shields (before checking invaders)
      for (const shield of this.shields) {
        const shieldBox = shield.getCollisionBox();

        if (this.isColliding(bulletBox, shieldBox)) {
          // Pixel-perfect collision with shield
          if (shield.checkCollision(bulletCenterX, bulletCenterY, 2)) {
            bullet.destroy();
            break;
          }
        }
      }

      // Check bullet vs invaders
      if (bullet.active) {
        for (const invader of this.invaders) {
          if (!invader.alive) continue;

          const invaderBox = invader.getCollisionBox();

          if (this.isColliding(bulletBox, invaderBox)) {
            invader.kill();
            bullet.destroy();
            this.state.score += invader.getPoints();

            if (this.state.score > this.state.hiScore) {
              this.state.hiScore = this.state.score;
            }

            break;
          }
        }
      }
    }

    // Check missile collisions
    for (const missile of this.missiles) {
      if (!missile.active) continue;

      const missileBox = missile.getCollisionBox();
      const missileCenterX = missileBox.x + missileBox.width / 2;
      const missileCenterY = missileBox.y + missileBox.height / 2;

      // Check missile vs player
      const playerBox = this.player.getCollisionBox();
      if (this.isColliding(missileBox, playerBox)) {
        this.player.kill();
        missile.destroy();
        this.state.lives--;

        // Reset player after short delay (simplified - just reset immediately)
        if (this.state.lives > 0) {
          setTimeout(() => this.player.reset(), 1000);
        }
        continue;
      }

      // Check missile vs shields
      for (const shield of this.shields) {
        const shieldBox = shield.getCollisionBox();

        if (this.isColliding(missileBox, shieldBox)) {
          // Pixel-perfect collision with shield (larger damage for missiles)
          if (shield.checkCollision(missileCenterX, missileCenterY, 3)) {
            missile.destroy();
            break;
          }
        }
      }
    }

    // Check invader vs shield collisions
    for (const invader of this.invaders) {
      if (!invader.alive) continue;

      const invaderBox = invader.getCollisionBox();
      const invaderCenterX = invaderBox.x + invaderBox.width / 2;
      const invaderBottomY = invaderBox.y + invaderBox.height;

      for (const shield of this.shields) {
        const shieldBox = shield.getCollisionBox();

        if (this.isColliding(invaderBox, shieldBox)) {
          // Invaders destroy shields on contact (damage at bottom edge)
          shield.checkCollision(invaderCenterX, invaderBottomY, 4);
        }
      }
    }
  }

  /**
   * Simple AABB collision detection
   */
  private isColliding(a: { x: number; y: number; width: number; height: number },
                      b: { x: number; y: number; width: number; height: number }): boolean {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
  }

  /**
   * Render everything
   */
  private render(): void {
    // Clear screen
    this.renderer.clear();

    // Draw HUD
    this.drawHUD();

    // Draw player
    if (this.player.alive) {
      this.renderer.drawSprite(
        this.player.position.x,
        this.player.position.y,
        this.player.getSprite()
      );
    }

    // Draw bullets
    for (const bullet of this.bullets) {
      if (bullet.active) {
        const bulletBox = bullet.getCollisionBox();
        this.renderer.drawRect(bulletBox);
      }
    }

    // Draw missiles
    for (const missile of this.missiles) {
      if (missile.active) {
        const box = missile.getCollisionBox();
        this.renderer.drawRect(box);
      }
    }

    // Draw shields
    for (const shield of this.shields) {
      const pixels = shield.getVisiblePixels();
      for (const pixel of pixels) {
        this.renderer.drawRect({
          x: pixel.x,
          y: pixel.y,
          width: 1,
          height: 1,
        });
      }
    }

    // Draw invaders
    for (const invader of this.invaders) {
      if (invader.alive) {
        this.renderer.drawSprite(
          invader.position.x,
          invader.position.y,
          invader.getSprite()
        );
      }
    }

    // Draw game over
    if (this.state.phase === GamePhase.GAME_OVER) {
      // Draw semi-transparent background overlay
      this.renderer.drawRect({
        x: 0,
        y: 0,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
      }, 'rgba(0, 0, 0, 0.7)');

      this.renderer.drawTextCentered('GAME OVER', 120, '#FF0000');
      this.renderer.drawTextCentered('PRESS SPACE TO RESTART', 140, '#FFFFFF');
    }
  }

  /**
   * Draw HUD (score, lives, etc.)
   */
  private drawHUD(): void {
    // Score
    this.renderer.drawText(`SCORE: ${this.state.score}`, 10, 10, '#FFFFFF');

    // Hi-Score
    this.renderer.drawText(`HI-SCORE: ${this.state.hiScore}`, 80, 10, '#FFFFFF');

    // Lives
    this.renderer.drawText(`LIVES: ${this.state.lives}`, 10, 246, '#00FF00');

    // Stage
    this.renderer.drawText(`STAGE: ${this.state.stage}`, 180, 246, '#00FF00');
  }
}
