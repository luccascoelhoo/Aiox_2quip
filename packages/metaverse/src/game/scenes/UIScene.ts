import Phaser from 'phaser';

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    // UIScene runs in parallel with OfficeScene
    // Used for in-canvas UI elements: chat bubbles, floating labels
    // React handles main UI overlays
  }
}
