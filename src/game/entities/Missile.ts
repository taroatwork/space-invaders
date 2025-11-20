/**
 * Enemy missile entity
 */

import { MISSILE } from '@/game/utils/constants';
import { MissileType } from '@/types';
import type { Vector2D, Rectangle } from '@/types';

export class Missile {
  public position: Vector2D;
  public active: boolean = true;
  public type: MissileType;
  private frameCounter: number = 0;
  private wigglyOffset: number = 0;

  constructor(x: number, y: number, type: MissileType) {
    this.position = { x, y };
    this.type = type;
  }

  /**
   * Update missile position (moves down)
   */
  update(): void {
    if (!this.active) return;

    this.frameCounter++;

    switch (this.type) {
      case MissileType.SLOW_STRAIGHT:
        if (this.frameCounter % 3 === 0) {
          this.position.y += 4; // ~1.33 pixels per frame average
        }
        break;

      case MissileType.FAST_STRAIGHT:
        if (this.frameCounter % 3 === 0) {
          this.position.y += 5; // ~1.66 pixels per frame average
        }
        break;

      case MissileType.WIGGLY:
        if (this.frameCounter % 3 === 0) {
          this.position.y += 4;
          // Wiggle left and right
          this.wigglyOffset = Math.sin(this.frameCounter * 0.3) * MISSILE.WIGGLY_AMPLITUDE;
        }
        break;
    }

    // Deactivate if off screen
    if (this.position.y > 256) {
      this.active = false;
    }
  }

  /**
   * Get collision box
   */
  getCollisionBox(): Rectangle {
    const x = this.type === MissileType.WIGGLY
      ? this.position.x + this.wigglyOffset
      : this.position.x;

    return {
      x,
      y: this.position.y,
      width: MISSILE.WIDTH,
      height: MISSILE.HEIGHT,
    };
  }

  /**
   * Get render position (includes wiggly offset)
   */
  getRenderPosition(): Vector2D {
    if (this.type === MissileType.WIGGLY) {
      return {
        x: this.position.x + this.wigglyOffset,
        y: this.position.y,
      };
    }
    return this.position;
  }

  /**
   * Deactivate missile (after collision)
   */
  destroy(): void {
    this.active = false;
  }
}
