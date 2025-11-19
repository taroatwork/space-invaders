/**
 * Main game class - orchestrates everything
 */

import { Renderer } from '@/rendering/Renderer';
import { Player } from './entities/Player';
import { Bullet } from './entities/Bullet';
import { Invader } from './entities/Invader';
import { INVADER, FRAME_TIME, CANVAS_WIDTH } from './utils/constants';
import { InvaderType, GamePhase, type GameState, type Difficulty } from '@/types';

export class Game {
  private renderer: Renderer;
  private player: Player;
  private bullet: Bullet | null = null;
  private invaders: Invader[] = [];

  private state: GameState;
  private lastFrameTime: number = 0;
  // private animationId: number = 0; // Will be used for pause functionality later
  private invaderDirection: number = 1; // 1 = right, -1 = left
  private invaderMoveCounter: number = 0;
  private invaderAnimFrame: number = 0;
  private aliveInvaderCount: number = 0;

  // Input state
  private keys: Set<string> = new Set();

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

      // Shoot on spacebar
      if (e.key === ' ' || e.key === 'ArrowUp') {
        this.shoot();
        e.preventDefault();
      }
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

    // Update bullet
    if (this.bullet) {
      this.bullet.update();
      if (!this.bullet.active) {
        this.bullet = null;
      }
    }

    // Update invaders
    this.updateInvaders();

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
  }

  /**
   * Shoot bullet (if not already on screen)
   */
  private shoot(): void {
    if (this.bullet === null && this.player.alive) {
      const x = this.player.position.x + 6; // Center of player
      const y = this.player.position.y - 4;
      this.bullet = new Bullet(x, y);
    }
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
    const baseSpeed = 30; // Lower = faster
    const speedFactor = Math.max(1, Math.floor(this.aliveInvaderCount / 5));
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
    if (!this.bullet) return;

    const bulletBox = this.bullet.getCollisionBox();

    // Check bullet vs invaders
    for (const invader of this.invaders) {
      if (!invader.alive) continue;

      const invaderBox = invader.getCollisionBox();

      if (this.isColliding(bulletBox, invaderBox)) {
        invader.kill();
        this.bullet.destroy();
        this.state.score += invader.getPoints();

        if (this.state.score > this.state.hiScore) {
          this.state.hiScore = this.state.score;
        }

        return;
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

    // Draw bullet
    if (this.bullet && this.bullet.active) {
      const bulletBox = this.bullet.getCollisionBox();
      this.renderer.drawRect(bulletBox);
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
