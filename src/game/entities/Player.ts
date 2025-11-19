/**
 * Player entity (laser cannon)
 */

import { PLAYER, CANVAS_WIDTH } from '@/game/utils/constants';
import type { Vector2D, Rectangle } from '@/types';

export class Player {
  public position: Vector2D;
  private velocity: number = 0;
  public alive: boolean = true;

  // Sprite data (13x8 pixels - authentic)
  private static SPRITE = [
    [0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
  ];

  constructor() {
    this.position = {
      x: (CANVAS_WIDTH - PLAYER.WIDTH) / 2,
      y: PLAYER.Y_POSITION,
    };
  }

  /**
   * Move left
   */
  moveLeft(): void {
    this.velocity = -PLAYER.SPEED;
  }

  /**
   * Move right
   */
  moveRight(): void {
    this.velocity = PLAYER.SPEED;
  }

  /**
   * Stop moving
   */
  stop(): void {
    this.velocity = 0;
  }

  /**
   * Update player position
   */
  update(): void {
    if (!this.alive) return;

    this.position.x += this.velocity;

    // Constrain to bounds
    if (this.position.x < PLAYER.LEFT_BOUND) {
      this.position.x = PLAYER.LEFT_BOUND;
    } else if (this.position.x > PLAYER.RIGHT_BOUND) {
      this.position.x = PLAYER.RIGHT_BOUND;
    }
  }

  /**
   * Get collision box
   */
  getCollisionBox(): Rectangle {
    return {
      x: this.position.x,
      y: this.position.y,
      width: PLAYER.WIDTH,
      height: PLAYER.HEIGHT,
    };
  }

  /**
   * Get sprite data
   */
  getSprite(): number[][] {
    return Player.SPRITE;
  }

  /**
   * Kill player (for collision)
   */
  kill(): void {
    this.alive = false;
  }

  /**
   * Reset player (new life)
   */
  reset(): void {
    this.position.x = (CANVAS_WIDTH - PLAYER.WIDTH) / 2;
    this.position.y = PLAYER.Y_POSITION;
    this.velocity = 0;
    this.alive = true;
  }
}
