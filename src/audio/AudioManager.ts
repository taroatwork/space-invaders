/**
 * Audio Manager - Web Audio API based retro sound effects
 * Recreates authentic 1978 Space Invaders sounds
 */

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private isInitialized: boolean = false;

  // Bass line notes for invader movement (4-note sequence)
  private bassNoteIndex: number = 0;
  private readonly BASS_FREQUENCIES = [55, 49, 44, 41]; // A1, G1, F1, E1

  constructor() {
    // Audio context will be created on first user interaction
  }

  /**
   * Initialize audio context (must be called after user interaction)
   */
  init(): void {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      // Resume AudioContext for iOS - required due to autoplay policy
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  /**
   * Play the 4-note bass line (cycles through notes)
   * Called when invaders move
   */
  playBassNote(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Square wave for authentic 8-bit sound
    oscillator.type = 'square';
    oscillator.frequency.value = this.BASS_FREQUENCIES[this.bassNoteIndex];

    // Short percussive envelope
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);

    // Cycle to next note
    this.bassNoteIndex = (this.bassNoteIndex + 1) % 4;
  }

  /**
   * Play shooting sound
   */
  playShoot(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // High-pitched pew sound
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);

    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  /**
   * Play invader explosion sound
   */
  playInvaderExplosion(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Noise-like explosion using rapid frequency modulation
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.15);

    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    oscillator.start(now);
    oscillator.stop(now + 0.15);
  }

  /**
   * Play player explosion sound
   */
  playPlayerExplosion(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Longer, lower explosion for player death
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(30, this.audioContext.currentTime + 0.5);

    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    oscillator.start(now);
    oscillator.stop(now + 0.5);
  }

  /**
   * Play shield hit sound (lighter than explosion)
   */
  playShieldHit(): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Short, high-pitched crackle for shield damage
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.05);

    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    oscillator.start(now);
    oscillator.stop(now + 0.05);
  }

  /**
   * Play game over melody (descending notes)
   */
  playGameOver(): void {
    if (!this.audioContext) return;

    // Descending melody notes (sad game over tune)
    const notes = [392, 349, 330, 294, 262]; // G4, F4, E4, D4, C4
    const noteDuration = 0.3;

    notes.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.type = 'square';
      oscillator.frequency.value = freq;

      const startTime = this.audioContext!.currentTime + (index * noteDuration);
      const endTime = startTime + noteDuration * 0.8;

      gainNode.gain.setValueAtTime(0.25, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);

      oscillator.start(startTime);
      oscillator.stop(endTime);
    });
  }

  /**
   * Play UFO sound (continuous warbling)
   * Returns a function to stop the sound
   */
  playUFO(): () => void {
    if (!this.audioContext) return () => {};

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();

    // LFO modulates the main oscillator frequency
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Warbling UFO sound
    oscillator.type = 'sine';
    oscillator.frequency.value = 400;
    lfo.type = 'sine';
    lfo.frequency.value = 8;
    lfoGain.gain.value = 100;

    gainNode.gain.value = 0.15;

    oscillator.start();
    lfo.start();

    // Return stop function
    return () => {
      const now = this.audioContext!.currentTime;
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      setTimeout(() => {
        oscillator.stop();
        lfo.stop();
      }, 100);
    };
  }

  /**
   * Reset bass note sequence (for new game/wave)
   */
  resetBassSequence(): void {
    this.bassNoteIndex = 0;
  }

  /**
   * Check if audio is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }
}
