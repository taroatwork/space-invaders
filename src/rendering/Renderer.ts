/**
 * Canvas rendering engine with authentic 1978 color overlay system
 */

import { CANVAS_WIDTH, CANVAS_HEIGHT, COLOR_ZONES, COLORS } from '@/game/utils/constants';
import type { Rectangle } from '@/types';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scale: number = 1;

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }

    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D rendering context');
    }
    this.ctx = ctx;

    this.setupCanvas();
    this.setupColorZones();
  }

  private setupCanvas(): void {
    // Calculate scale to fit screen first
    this.calculateScale();

    // Set high-resolution canvas (5x for crisp graphics)
    const pixelRatio = 5;
    this.canvas.width = CANVAS_WIDTH * pixelRatio;
    this.canvas.height = CANVAS_HEIGHT * pixelRatio;

    // Scale the context to draw at 1:1
    this.ctx.scale(pixelRatio, pixelRatio);

    // Apply pixel-perfect rendering
    this.ctx.imageSmoothingEnabled = false;

    // Listen for window resize
    window.addEventListener('resize', () => this.calculateScale());
  }

  private calculateScale(): void {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate scale to fit vertically (portrait mode)
    const scaleX = windowWidth / CANVAS_WIDTH;
    const scaleY = windowHeight / CANVAS_HEIGHT;

    // Use smaller scale to fit both dimensions
    this.scale = Math.min(scaleX, scaleY) * 0.95; // 95% to leave some margin

    // Apply CSS transform for scaling
    this.canvas.style.width = `${CANVAS_WIDTH * this.scale}px`;
    this.canvas.style.height = `${CANVAS_HEIGHT * this.scale}px`;
  }

  private setupColorZones(): void {
    // Color zones are applied during rendering, not as overlay
    // This allows for pixel-perfect color control
  }

  /**
   * Clear the entire canvas
   */
  clear(): void {
    this.ctx.fillStyle = COLORS.BACKGROUND;
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  /**
   * Get color based on Y position (authentic color overlay zones)
   */
  private getColorForZone(y: number): string {
    if (y < COLOR_ZONES.RED_ZONE_HEIGHT) {
      return COLORS.RED;
    } else if (y < COLOR_ZONES.RED_ZONE_HEIGHT + COLOR_ZONES.WHITE_ZONE_HEIGHT) {
      return COLORS.WHITE;
    } else {
      return COLORS.GREEN;
    }
  }

  /**
   * Draw a filled rectangle with automatic color zone detection
   */
  drawRect(rect: Rectangle, forceColor?: string): void {
    const color = forceColor || this.getColorForZone(rect.y);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  /**
   * Draw a sprite (simple pixel-based)
   */
  drawSprite(x: number, y: number, pixelData: number[][], forceColor?: string): void {
    const color = forceColor || this.getColorForZone(y);
    this.ctx.fillStyle = color;

    for (let row = 0; row < pixelData.length; row++) {
      for (let col = 0; col < pixelData[row].length; col++) {
        if (pixelData[row][col] === 1) {
          this.ctx.fillRect(x + col, y + row, 1, 1);
        }
      }
    }
  }

  /**
   * Draw text (for HUD, scores, etc.)
   * Using pixel font for crisp rendering
   */
  drawText(text: string, x: number, y: number, color: string = COLORS.WHITE): void {
    this.ctx.fillStyle = color;
    // Use a pixel-perfect font setting
    this.ctx.font = 'bold 6px monospace';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText(text, x, y);
  }

  /**
   * Draw text centered
   */
  drawTextCentered(text: string, y: number, color: string = COLORS.WHITE): void {
    this.ctx.fillStyle = color;
    this.ctx.font = 'bold 6px monospace';
    this.ctx.textBaseline = 'top';
    const metrics = this.ctx.measureText(text);
    const x = (CANVAS_WIDTH - metrics.width) / 2;
    this.ctx.fillText(text, x, y);
  }

  /**
   * Get canvas for external access
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Get 2D context for external access
   */
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  /**
   * Get current scale factor
   */
  getScale(): number {
    return this.scale;
  }
}
