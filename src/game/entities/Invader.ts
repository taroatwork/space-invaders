/**
 * Invader entity (alien)
 */

import { INVADER } from '@/game/utils/constants';
import { InvaderType } from '@/types';
import type { Vector2D, Rectangle } from '@/types';

export class Invader {
  public position: Vector2D;
  public type: InvaderType;
  public alive: boolean = true;
  public row: number;
  public column: number;
  private animationFrame: number = 0;

  // Sprite data for each type (2 animation frames each)
  private static SPRITES = {
    [InvaderType.SMALL]: [
      // Frame 0
      [[0,0,1,0,0,0,0,0,1,0,0],
       [0,0,0,1,0,0,0,1,0,0,0],
       [0,0,1,1,1,1,1,1,1,0,0],
       [0,1,1,0,1,1,1,0,1,1,0],
       [1,1,1,1,1,1,1,1,1,1,1],
       [1,0,1,1,1,1,1,1,1,0,1],
       [1,0,1,0,0,0,0,0,1,0,1],
       [0,0,0,1,1,0,1,1,0,0,0]],
      // Frame 1
      [[0,0,1,0,0,0,0,0,1,0,0],
       [1,0,0,1,0,0,0,1,0,0,1],
       [1,0,1,1,1,1,1,1,1,0,1],
       [1,1,1,0,1,1,1,0,1,1,1],
       [1,1,1,1,1,1,1,1,1,1,1],
       [0,1,1,1,1,1,1,1,1,1,0],
       [0,0,1,0,0,0,0,0,1,0,0],
       [0,1,0,0,0,0,0,0,0,1,0]]
    ],
    [InvaderType.MEDIUM]: [
      // Frame 0
      [[0,0,0,1,0,0,0,0,0,1,0,0,0],
       [0,0,0,0,1,0,0,0,1,0,0,0,0],
       [0,0,0,1,1,1,1,1,1,1,0,0,0],
       [0,0,1,1,0,1,1,1,0,1,1,0,0],
       [0,1,1,1,1,1,1,1,1,1,1,1,0],
       [0,1,0,1,1,1,1,1,1,1,0,1,0],
       [0,1,0,1,0,0,0,0,0,1,0,1,0],
       [0,0,0,0,1,1,0,1,1,0,0,0,0]],
      // Frame 1
      [[0,0,0,1,0,0,0,0,0,1,0,0,0],
       [0,0,0,0,1,0,0,0,1,0,0,0,0],
       [0,0,0,1,1,1,1,1,1,1,0,0,0],
       [0,0,1,1,0,1,1,1,0,1,1,0,0],
       [0,1,1,1,1,1,1,1,1,1,1,1,0],
       [0,0,1,1,1,1,1,1,1,1,1,0,0],
       [0,0,1,0,0,0,0,0,0,0,1,0,0],
       [0,0,0,1,0,0,0,0,0,1,0,0,0]]
    ],
    [InvaderType.LARGE]: [
      // Frame 0
      [[0,0,0,0,1,1,1,1,0,0,0,0],
       [0,1,1,1,1,1,1,1,1,1,1,0],
       [1,1,1,1,1,1,1,1,1,1,1,1],
       [1,1,1,0,0,1,1,0,0,1,1,1],
       [1,1,1,1,1,1,1,1,1,1,1,1],
       [0,0,1,1,1,0,0,1,1,1,0,0],
       [0,1,1,0,0,1,1,0,0,1,1,0],
       [0,0,1,1,0,0,0,0,1,1,0,0]],
      // Frame 1
      [[0,0,0,0,1,1,1,1,0,0,0,0],
       [0,1,1,1,1,1,1,1,1,1,1,0],
       [1,1,1,1,1,1,1,1,1,1,1,1],
       [1,1,1,0,0,1,1,0,0,1,1,1],
       [1,1,1,1,1,1,1,1,1,1,1,1],
       [0,0,0,1,1,0,0,1,1,0,0,0],
       [0,0,1,1,0,1,1,0,1,1,0,0],
       [1,1,0,0,0,0,0,0,0,0,1,1]]
    ]
  };

  constructor(row: number, column: number, type: InvaderType, x: number, y: number) {
    this.row = row;
    this.column = column;
    this.type = type;
    this.position = { x, y };
  }

  /**
   * Update animation frame
   */
  updateAnimation(frame: number): void {
    this.animationFrame = frame;
  }

  /**
   * Get collision box
   */
  getCollisionBox(): Rectangle {
    const size = this.getSize();
    return {
      x: this.position.x,
      y: this.position.y,
      width: size.width,
      height: size.height,
    };
  }

  /**
   * Get size based on type
   */
  getSize(): { width: number; height: number } {
    switch (this.type) {
      case InvaderType.SMALL:
        return { width: INVADER.SMALL.width, height: INVADER.SMALL.height };
      case InvaderType.MEDIUM:
        return { width: INVADER.MEDIUM.width, height: INVADER.MEDIUM.height };
      case InvaderType.LARGE:
        return { width: INVADER.LARGE.width, height: INVADER.LARGE.height };
    }
  }

  /**
   * Get points value
   */
  getPoints(): number {
    switch (this.type) {
      case InvaderType.SMALL:
        return INVADER.SMALL.points;
      case InvaderType.MEDIUM:
        return INVADER.MEDIUM.points;
      case InvaderType.LARGE:
        return INVADER.LARGE.points;
    }
  }

  /**
   * Get current sprite
   */
  getSprite(): number[][] {
    return Invader.SPRITES[this.type][this.animationFrame % 2];
  }

  /**
   * Kill invader
   */
  kill(): void {
    this.alive = false;
  }
}
