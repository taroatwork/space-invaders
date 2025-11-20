/**
 * UFO (Mystery Ship) entity
 * Flies across the top of the screen for bonus points
 */

import type { Vector2D, Rectangle } from '@/types';
import { CANVAS_WIDTH } from '../utils/constants';

export class UFO {
  position: Vector2D;
  alive: boolean = false;
  private direction: number = 1; // 1 = right, -1 = left
  private speed: number = 1;

  // UFO sprite (16x7 pixels)
  private static SPRITE = [
    [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,1,1,1,0,0,1,1,0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0],
  ];

  // Scoring based on shot count (original arcade behavior)
  private static SCORE_TABLE = [100, 50, 50, 100, 150, 100, 100, 50, 300, 100, 100, 100, 50, 150, 100];

  constructor() {
    this.position = { x: 0, y: 0 };
  }

  /**
   * Spawn UFO from left or right side
   */
  spawn(): void {
    // Randomly choose direction
    this.direction = Math.random() < 0.5 ? 1 : -1;

    if (this.direction === 1) {
      // Start from left
      this.position.x = -16;
    } else {
      // Start from right
      this.position.x = CANVAS_WIDTH;
    }

    this.position.y = 25; // Just below the score display
    this.alive = true;
  }

  /**
   * Update UFO position
   */
  update(): void {
    if (!this.alive) return;

    this.position.x += this.speed * this.direction;

    // Check if UFO has left the screen
    if (this.direction === 1 && this.position.x > CANVAS_WIDTH) {
      this.alive = false;
    } else if (this.direction === -1 && this.position.x < -16) {
      this.alive = false;
    }
  }

  /**
   * Get collision box
   */
  getCollisionBox(): Rectangle {
    return {
      x: this.position.x,
      y: this.position.y,
      width: 16,
      height: 7,
    };
  }

  /**
   * Get sprite data
   */
  getSprite(): number[][] {
    return UFO.SPRITE;
  }

  /**
   * Kill UFO and return score based on shot count
   */
  kill(shotCount: number): number {
    this.alive = false;
    const index = (shotCount - 1) % UFO.SCORE_TABLE.length;
    return UFO.SCORE_TABLE[index];
  }

  /**
   * Check if UFO is active
   */
  isActive(): boolean {
    return this.alive;
  }
}
