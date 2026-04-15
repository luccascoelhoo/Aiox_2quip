import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;
  private percentText!: Phaser.GameObjects.Text;
  private stars: Phaser.GameObjects.Graphics[] = [];

  preload(): void {
    const { width, height } = this.cameras.main;
    const centerX = width / 2;
    const centerY = height / 2;

    this.cameras.main.setBackgroundColor('#050510');

    // Animated star field
    this.createStarField(width, height);

    // Glowing crown icon (large animated)
    const crown = this.add.text(centerX, centerY - 120, '👑', {
      fontSize: '64px',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: crown,
      alpha: 1,
      scale: { from: 0.5, to: 1 },
      duration: 1000,
      ease: 'Back.Out',
    });

    this.tweens.add({
      targets: crown,
      y: centerY - 125,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });

    // Title with glow
    const title = this.add.text(centerX, centerY - 50, '2QUIP METAVERSE', {
      fontFamily: 'Inter',
      fontSize: '36px',
      color: '#ffd700',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: title,
      alpha: 1,
      duration: 800,
      delay: 400,
    });

    // Subtitle
    const subtitle = this.add.text(centerX, centerY - 20, 'Intelligence Architecture Office', {
      fontFamily: 'Inter',
      fontSize: '14px',
      color: '#58a6ff',
      letterSpacing: 4,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: subtitle,
      alpha: 0.7,
      duration: 800,
      delay: 800,
    });

    // Progress box (outer glow)
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x0d1117, 0.9);
    this.progressBox.fillRoundedRect(centerX - 170, centerY + 30, 340, 34, 10);
    this.progressBox.lineStyle(1, 0x30363d, 0.6);
    this.progressBox.strokeRoundedRect(centerX - 170, centerY + 30, 340, 34, 10);

    // Progress bar
    this.progressBar = this.add.graphics();

    // Loading text
    this.loadingText = this.add.text(centerX, centerY + 80, 'Initializing systems...', {
      fontFamily: 'JetBrains Mono',
      fontSize: '11px',
      color: '#8b949e',
    }).setOrigin(0.5);

    // Percent text
    this.percentText = this.add.text(centerX, centerY + 47, '0%', {
      fontFamily: 'JetBrains Mono',
      fontSize: '11px',
      color: '#ffd700',
    }).setOrigin(0.5);

    // Loading step messages
    const loadingSteps = [
      'Loading sector maps...',
      'Initializing agent NPCs...',
      'Connecting to AIOX backend...',
      'Building isometric grid...',
      'Launching The Hive...',
    ];
    let stepIndex = 0;

    // Progress events
    this.load.on('progress', (value: number) => {
      this.progressBar.clear();

      // Glow effect under the bar
      this.progressBar.fillStyle(0xffd700, 0.15);
      this.progressBar.fillRoundedRect(centerX - 166, centerY + 34, 332 * value, 26, 8);

      // Main bar with gradient feel
      this.progressBar.fillStyle(0xffd700, 1);
      this.progressBar.fillRoundedRect(centerX - 166, centerY + 34, 332 * value, 26, 8);

      // Highlight strip
      this.progressBar.fillStyle(0xffed4a, 0.5);
      this.progressBar.fillRoundedRect(centerX - 166, centerY + 34, 332 * value, 10, 8);

      this.percentText.setText(`${Math.round(value * 100)}%`);

      const newStepIndex = Math.min(Math.floor(value * loadingSteps.length), loadingSteps.length - 1);
      if (newStepIndex !== stepIndex) {
        stepIndex = newStepIndex;
        this.loadingText.setText(loadingSteps[stepIndex]);
      }
    });

    this.load.on('complete', () => {
      this.loadingText.setText('✅ All systems online');
      this.loadingText.setColor('#3fb950');
    });

    // Version tag
    this.add.text(centerX, height - 30, 'v0.1.0 — Built by Orion Prime', {
      fontFamily: 'Inter',
      fontSize: '10px',
      color: '#30363d',
    }).setOrigin(0.5);

    // Generate needed textures
    this.createPlaceholderAssets();
  }

  private createStarField(width: number, height: number): void {
    for (let i = 0; i < 80; i++) {
      const star = this.add.graphics();
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const size = Phaser.Math.FloatBetween(0.5, 2);
      const alpha = Phaser.Math.FloatBetween(0.1, 0.6);
      const colors = [0xffd700, 0x58a6ff, 0xbc8cff, 0xffffff];
      const color = colors[Phaser.Math.Between(0, colors.length - 1)];

      star.fillStyle(color, alpha);
      star.fillCircle(x, y, size);
      this.stars.push(star);

      // Twinkle animation
      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.05, 0.3),
        duration: Phaser.Math.Between(1500, 4000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
        delay: Phaser.Math.Between(0, 2000),
      });
    }
  }

  private createPlaceholderAssets(): void {
    // Player placeholder
    const playerGfx = this.make.graphics({ x: 0, y: 0 }, false);
    playerGfx.fillStyle(0x00ff88, 1);
    playerGfx.fillCircle(16, 12, 12);
    playerGfx.fillStyle(0x000000, 0.25);
    playerGfx.fillEllipse(16, 28, 20, 8);
    playerGfx.generateTexture('player-placeholder', 32, 32);
    playerGfx.destroy();
  }

  create(): void {
    // Dramatic fade out with gold flash
    this.cameras.main.flash(300, 255, 215, 0, false);
    this.time.delayedCall(300, () => {
      this.cameras.main.fadeOut(600, 5, 5, 16);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('OfficeScene');
      });
    });
  }
}
