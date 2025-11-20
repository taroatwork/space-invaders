/**
 * Core type definitions for Space Invaders
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD';

export enum GamePhase {
  TITLE = 'TITLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  STAGE_CLEAR = 'STAGE_CLEAR',
  GAME_OVER = 'GAME_OVER',
  NAME_ENTRY = 'NAME_ENTRY',
}

export interface DifficultySettings {
  initialLives: number;
  extraLifeAt: number | null;
  invaderSpeedMultiplier: number;
  missileFrequencyMultiplier: number;
}

export interface HighScore {
  name: string;
  score: number;
  difficulty: Difficulty;
  date: string;
}

export enum InvaderType {
  SMALL = 'SMALL',   // Top row - 30 points
  MEDIUM = 'MEDIUM', // Middle rows - 20 points
  LARGE = 'LARGE',   // Bottom rows - 10 points
}

export enum MissileType {
  SLOW_STRAIGHT = 'SLOW_STRAIGHT',
  FAST_STRAIGHT = 'FAST_STRAIGHT',
  WIGGLY = 'WIGGLY',
}

export interface GameState {
  phase: GamePhase;
  score: number;
  hiScore: number;
  lives: number;
  stage: number;
  difficulty: Difficulty;
}

export type ColorZone = 'red' | 'white' | 'green';
