/**
 * Shield entity (bunker/shelter with pixel-based destruction)
 */

import { SHIELD } from '@/game/utils/constants';
import type { Vector2D, Rectangle } from '@/types';

export class Shield {
  public position: Vector2D;
  private pixels: boolean[][]; // true = solid, false = destroyed

  // Shield sprite pattern (22x16 pixels - authentic arcade design)
  private static readonly SHIELD_PATTERN = [
    [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1],
    [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
    [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
    [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
    [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
  ];

  constructor(x: number, y: number) {
    this.position = { x, y };
    this.pixels = Shield.SHIELD_PATTERN.map(row => row.map(pixel => pixel === 1));
  }

  /**
   * Check if a point collides with the shield and destroy pixels in that area
   * Returns true if collision occurred
   */
  checkCollision(x: number, y: number, damageRadius: number = 2): boolean {
    const relX = Math.floor(x - this.position.x);
    const relY = Math.floor(y - this.position.y);

    // Check if point is within shield bounds
    if (relX < 0 || relX >= SHIELD.WIDTH || relY < 0 || relY >= SHIELD.HEIGHT) {
      return false;
    }

    let hitSomething = false;

    // Destroy pixels in radius around impact point
    for (let dy = -damageRadius; dy <= damageRadius; dy++) {
      for (let dx = -damageRadius; dx <= damageRadius; dx++) {
        const pixelX = relX + dx;
        const pixelY = relY + dy;

        if (pixelX >= 0 && pixelX < SHIELD.WIDTH &&
            pixelY >= 0 && pixelY < SHIELD.HEIGHT) {
          if (this.pixels[pixelY][pixelX]) {
            // Only destroy if within circular radius
            if (dx * dx + dy * dy <= damageRadius * damageRadius) {
              this.pixels[pixelY][pixelX] = false;
              hitSomething = true;
            }
          }
        }
      }
    }

    return hitSomething;
  }

  /**
   * Check if shield has any pixels left
   */
  hasPixelsLeft(): boolean {
    for (let y = 0; y < SHIELD.HEIGHT; y++) {
      for (let x = 0; x < SHIELD.WIDTH; x++) {
        if (this.pixels[y][x]) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Get collision box for broad-phase collision detection
   */
  getCollisionBox(): Rectangle {
    return {
      x: this.position.x,
      y: this.position.y,
      width: SHIELD.WIDTH,
      height: SHIELD.HEIGHT,
    };
  }

  /**
   * Get pixel data for rendering
   */
  getPixels(): boolean[][] {
    return this.pixels;
  }

  /**
   * Get pixel at specific position (for precise collision)
   */
  getPixelAt(x: number, y: number): boolean {
    const relX = Math.floor(x - this.position.x);
    const relY = Math.floor(y - this.position.y);

    if (relX < 0 || relX >= SHIELD.WIDTH || relY < 0 || relY >= SHIELD.HEIGHT) {
      return false;
    }

    return this.pixels[relY][relX];
  }

  /**
   * Render shield (returns pixel array for renderer)
   */
  getVisiblePixels(): Array<{ x: number; y: number }> {
    const visiblePixels: Array<{ x: number; y: number }> = [];

    for (let y = 0; y < SHIELD.HEIGHT; y++) {
      for (let x = 0; x < SHIELD.WIDTH; x++) {
        if (this.pixels[y][x]) {
          visiblePixels.push({
            x: this.position.x + x,
            y: this.position.y + y,
          });
        }
      }
    }

    return visiblePixels;
  }
}
