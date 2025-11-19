/**
 * Player bullet entity
 */

import { BULLET } from '@/game/utils/constants';
import type { Vector2D, Rectangle } from '@/types';

export class Bullet {
  public position: Vector2D;
  public active: boolean = true;

  constructor(x: number, y: number) {
    this.position = { x, y };
  }

  /**
   * Update bullet position (moves up)
   */
  update(): void {
    if (!this.active) return;

    this.position.y -= BULLET.SPEED;

    // Deactivate if off screen
    if (this.position.y < 0) {
      this.active = false;
    }
  }

  /**
   * Get collision box
   */
  getCollisionBox(): Rectangle {
    return {
      x: this.position.x,
      y: this.position.y,
      width: BULLET.WIDTH,
      height: BULLET.HEIGHT,
    };
  }

  /**
   * Deactivate bullet (after collision)
   */
  destroy(): void {
    this.active = false;
  }
}
