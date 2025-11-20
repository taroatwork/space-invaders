/**
 * Game constants following the authentic 1978 Space Invaders specifications
 */

import { DifficultySettings } from '@/types';

// Canvas dimensions (logical resolution)
export const CANVAS_WIDTH = 224;
export const CANVAS_HEIGHT = 256;
export const ASPECT_RATIO = CANVAS_WIDTH / CANVAS_HEIGHT; // 7:8

// Game loop
export const TARGET_FPS = 60;
export const FRAME_TIME = 1000 / TARGET_FPS;

// Color zones (authentic overlay system)
export const COLOR_ZONES = {
  RED_ZONE_HEIGHT: 38,      // Top ~15% - UFO area
  WHITE_ZONE_HEIGHT: 141,   // Middle ~55% - Invaders
  GREEN_ZONE_HEIGHT: 77,    // Bottom ~30% - Player/shields
} as const;

// Colors
export const COLORS = {
  BACKGROUND: '#000000',
  RED: '#FF0000',
  WHITE: '#FFFFFF',
  GREEN: '#00FF00',
} as const;

// Player settings
export const PLAYER = {
  WIDTH: 13,
  HEIGHT: 8,
  SPEED: 2,                // Pixels per frame
  Y_POSITION: 232,         // Fixed Y position
  LEFT_BOUND: 10,
  RIGHT_BOUND: CANVAS_WIDTH - 23,
} as const;

// Bullet settings
export const BULLET = {
  WIDTH: 1,
  HEIGHT: 4,
  SPEED: 4,               // 4 pixels per frame (240px/sec)
} as const;

// Invader settings
export const INVADER = {
  ROWS: 5,
  COLUMNS: 11,
  TOTAL: 55,              // 5 × 11
  SPACING_X: 16,
  SPACING_Y: 16,
  START_X: 24,
  START_Y: 60,
  MOVE_STEP_X: 2,         // 2 pixels per step
  MOVE_STEP_Y: 8,         // 8 pixels down at edges
  ANIMATION_FRAMES: 2,

  // Sprite sizes
  SMALL: { width: 8, height: 8, points: 30 },
  MEDIUM: { width: 11, height: 8, points: 20 },
  LARGE: { width: 12, height: 8, points: 10 },
} as const;

// Missile settings
export const MISSILE = {
  WIDTH: 1,
  HEIGHT: 4,
  SLOW_SPEED: 1.33,      // ~4 pixels every 3 frames
  FAST_SPEED: 1.66,      // ~5 pixels every 3 frames
  WIGGLY_SPEED: 1.33,
  WIGGLY_AMPLITUDE: 2,
} as const;

// Shield settings
export const SHIELD = {
  WIDTH: 22,
  HEIGHT: 16,
  COUNT: 4,
  Y_POSITION: 200,
  SPACING: 45,
  FIRST_X: 32,
} as const;

// UFO settings
export const UFO = {
  WIDTH: 16,
  HEIGHT: 7,
  SPEED: 1,              // Slow constant speed
  Y_POSITION: 32,
  POINTS: [50, 50, 100, 150, 100, 100, 50, 300, 100, 100, 100, 50, 150, 100, 100],
} as const;

// Scoring
export const SCORING = {
  MAX_SCREEN_POINTS: 990,  // (30 × 11) + (20 × 22) + (10 × 22)
} as const;

// Difficulty presets
export const DIFFICULTY_SETTINGS: Record<string, DifficultySettings> = {
  EASY: {
    initialLives: 5,
    extraLifeAt: 1000,
    invaderSpeedMultiplier: 0.7,
    missileFrequencyMultiplier: 0.8,
  },
  NORMAL: {
    initialLives: 3,
    extraLifeAt: 1500,
    invaderSpeedMultiplier: 1.0,
    missileFrequencyMultiplier: 1.0,
  },
  HARD: {
    initialLives: 3,
    extraLifeAt: null,
    invaderSpeedMultiplier: 1.3,
    missileFrequencyMultiplier: 1.5,
  },
} as const;
