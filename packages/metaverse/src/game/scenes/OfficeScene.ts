import Phaser from 'phaser';
import { GAME_CONFIG } from '../config';
import { IsometricEngine } from '../systems/IsometricEngine';
import { SECTORS, AGENT_DESKS, getSectorForTile } from '../map/SectorManager';
import { SQUAD_COLORS } from '../../shared/constants';
import { eventBus } from '../../bridge/EventBus';

export class OfficeScene extends Phaser.Scene {
  private tileGraphics: Phaser.GameObjects.Graphics[][] = [];
  private hoverHighlight!: Phaser.GameObjects.Graphics;
  private player!: Phaser.GameObjects.Container;
  private playerGlow!: Phaser.GameObjects.Graphics;
  private playerCol = GAME_CONFIG.PLAYER_START_COL;
  private playerRow = GAME_CONFIG.PLAYER_START_ROW;
  private agentSprites: Map<string, Phaser.GameObjects.Container> = new Map();
  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private cameraStart = { x: 0, y: 0 };
  private ambientParticles: Phaser.GameObjects.Graphics[] = [];
  private sectorWalls: Phaser.GameObjects.Graphics[] = [];

  constructor() {
    super({ key: 'OfficeScene' });
  }

  create(): void {
    this.cameras.main.fadeIn(1000, 5, 5, 16);
    this.cameras.main.setBackgroundColor('#050510');

    this.createAmbientGrid();
    this.createTileMap();
    this.createSectorWalls();
    this.createSectorLabels();
    this.createFurniture();
    this.createAgentNPCs();
    this.createPlayer();
    this.createHoverHighlight();
    this.createAmbientParticles();
    this.setupCamera();
    this.setupInput();
    this.setupEventBusListeners();

    console.log('👑 OfficeScene ready — The Hive is live');
  }

  // ── Ambient Grid ──────────────────────────────────────
  private createAmbientGrid(): void {
    const grid = this.add.graphics();
    grid.setDepth(-2);
    grid.setAlpha(0.03);
    const { MAP_COLS, MAP_ROWS, TILE_WIDTH, TILE_HEIGHT } = GAME_CONFIG;

    for (let row = -5; row < MAP_ROWS + 5; row++) {
      for (let col = -5; col < MAP_COLS + 5; col++) {
        if (col >= 0 && col < MAP_COLS && row >= 0 && row < MAP_ROWS) continue;
        const { x, y } = IsometricEngine.cartToIso(col, row);
        const halfW = TILE_WIDTH / 2;
        const halfH = TILE_HEIGHT / 2;
        grid.lineStyle(1, 0x58a6ff, 0.3);
        grid.beginPath();
        grid.moveTo(x, y - halfH);
        grid.lineTo(x + halfW, y);
        grid.lineTo(x, y + halfH);
        grid.lineTo(x - halfW, y);
        grid.closePath();
        grid.strokePath();
      }
    }
  }

  // ── Ambient Particles ─────────────────────────────────
  private createAmbientParticles(): void {
    const { MAP_COLS, MAP_ROWS } = GAME_CONFIG;
    const center = IsometricEngine.getMapCenterIso();

    for (let i = 0; i < 25; i++) {
      const particle = this.add.graphics();
      const colors = [0xffd700, 0x58a6ff, 0xbc8cff, 0x3fb950];
      const color = colors[Phaser.Math.Between(0, colors.length - 1)];
      const size = Phaser.Math.FloatBetween(1, 3);

      const x = center.x + Phaser.Math.Between(-400, 400);
      const y = center.y + Phaser.Math.Between(-300, 300);

      particle.fillStyle(color, Phaser.Math.FloatBetween(0.1, 0.4));
      particle.fillCircle(0, 0, size);
      particle.setPosition(x, y);
      particle.setDepth(999);

      // Float animation
      this.tweens.add({
        targets: particle,
        y: y - Phaser.Math.Between(20, 60),
        alpha: { from: 0.4, to: 0 },
        duration: Phaser.Math.Between(4000, 8000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 5000),
        onRepeat: () => {
          particle.setPosition(
            center.x + Phaser.Math.Between(-400, 400),
            center.y + Phaser.Math.Between(-300, 300)
          );
          particle.setAlpha(Phaser.Math.FloatBetween(0.1, 0.4));
        },
      });

      this.ambientParticles.push(particle);
    }
  }

  // ── EventBus Listeners ────────────────────────────────
  private setupEventBusListeners(): void {
    eventBus.on('camera:focus', (data) => {
      const { x, y } = IsometricEngine.cartToIso(data.col, data.row);
      this.cameras.main.pan(x, y, 500, 'Power2');
    });

    eventBus.on('state:updated', (data) => {
      for (const agent of data.agents) {
        const sprite = this.agentSprites.get(agent.id);
        if (!sprite) continue;

        // Update status dot color
        const children = sprite.getAll();
        const statusDot = children.find(
          (c) => c.getData('role') === 'statusDot'
        ) as Phaser.GameObjects.Graphics | undefined;
        if (!statusDot) continue;

        statusDot.clear();
        const statusColors: Record<string, number> = {
          idle: 0x3fb950,
          working: 0xf0883e,
          error: 0xf85149,
          offline: 0x484f58,
        };
        const color = statusColors[agent.status] || 0x3fb950;
        statusDot.fillStyle(color, 1);
        statusDot.fillCircle(0, 0, 4);
        // Glow ring for working status
        if (agent.status === 'working') {
          statusDot.lineStyle(2, color, 0.3);
          statusDot.strokeCircle(0, 0, 7);
        }
      }
    });
  }

  // ── Tile Map ──────────────────────────────────────────
  private createTileMap(): void {
    const { MAP_COLS, MAP_ROWS, TILE_WIDTH, TILE_HEIGHT } = GAME_CONFIG;
    const halfW = TILE_WIDTH / 2;
    const halfH = TILE_HEIGHT / 2;

    for (let row = 0; row < MAP_ROWS; row++) {
      this.tileGraphics[row] = [];
      for (let col = 0; col < MAP_COLS; col++) {
        const { x, y } = IsometricEngine.cartToIso(col, row);
        const sector = getSectorForTile(col, row);
        const baseColor = sector
          ? Phaser.Display.Color.HexStringToColor(sector.color).color
          : 0x0d1117;

        const gfx = this.add.graphics();

        // 3D tile top face
        const topColor = Phaser.Display.Color.IntegerToColor(baseColor).lighten(15).color;
        gfx.fillStyle(topColor, 1);
        gfx.beginPath();
        gfx.moveTo(x, y - halfH);
        gfx.lineTo(x + halfW, y);
        gfx.lineTo(x, y + halfH);
        gfx.lineTo(x - halfW, y);
        gfx.closePath();
        gfx.fillPath();

        // 3D tile right face (darker)
        const rightColor = Phaser.Display.Color.IntegerToColor(baseColor).darken(20).color;
        gfx.fillStyle(rightColor, 1);
        gfx.beginPath();
        gfx.moveTo(x + halfW, y);
        gfx.lineTo(x, y + halfH);
        gfx.lineTo(x, y + halfH + 6);
        gfx.lineTo(x + halfW, y + 6);
        gfx.closePath();
        gfx.fillPath();

        // 3D tile left face (darkest)
        const leftColor = Phaser.Display.Color.IntegerToColor(baseColor).darken(35).color;
        gfx.fillStyle(leftColor, 1);
        gfx.beginPath();
        gfx.moveTo(x - halfW, y);
        gfx.lineTo(x, y + halfH);
        gfx.lineTo(x, y + halfH + 6);
        gfx.lineTo(x - halfW, y + 6);
        gfx.closePath();
        gfx.fillPath();

        // Subtle grid lines on top
        gfx.lineStyle(1, 0xffffff, 0.06);
        gfx.beginPath();
        gfx.moveTo(x, y - halfH);
        gfx.lineTo(x + halfW, y);
        gfx.lineTo(x, y + halfH);
        gfx.lineTo(x - halfW, y);
        gfx.closePath();
        gfx.strokePath();

        // Inner highlight on edge tiles for sector borders
        if (sector) {
          const b = sector.bounds;
          const isEdge = col === b.fromCol || col === b.toCol || row === b.fromRow || row === b.toRow;
          if (isEdge) {
            const edgeColor = Phaser.Display.Color.HexStringToColor(sector.color).color;
            gfx.lineStyle(1, edgeColor, 0.3);
            gfx.beginPath();
            gfx.moveTo(x, y - halfH);
            gfx.lineTo(x + halfW, y);
            gfx.lineTo(x, y + halfH);
            gfx.lineTo(x - halfW, y);
            gfx.closePath();
            gfx.strokePath();
          }
        }

        gfx.setDepth(0);
        this.tileGraphics[row][col] = gfx;
      }
    }
  }

  // ── Sector Walls ──────────────────────────────────────
  private createSectorWalls(): void {
    for (const sector of Object.values(SECTORS)) {
      const b = sector.bounds;
      const color = Phaser.Display.Color.HexStringToColor(sector.color).color;

      // Corner decorations
      const corners = [
        { col: b.fromCol, row: b.fromRow },
        { col: b.toCol, row: b.fromRow },
        { col: b.fromCol, row: b.toRow },
        { col: b.toCol, row: b.toRow },
      ];

      for (const corner of corners) {
        const { x, y } = IsometricEngine.cartToIso(corner.col, corner.row);
        const gfx = this.add.graphics();
        const lighterColor = Phaser.Display.Color.IntegerToColor(color).lighten(30).color;

        // Small glowing pillar at corners
        gfx.fillStyle(lighterColor, 0.6);
        gfx.fillCircle(x, y - 4, 3);
        gfx.fillStyle(lighterColor, 0.2);
        gfx.fillCircle(x, y - 4, 6);
        gfx.setDepth(1);

        // Pulse animation
        this.tweens.add({
          targets: gfx,
          alpha: 0.3,
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.InOut',
          delay: Phaser.Math.Between(0, 1000),
        });

        this.sectorWalls.push(gfx);
      }
    }
  }

  // ── Sector Labels ─────────────────────────────────────
  private createSectorLabels(): void {
    for (const sector of Object.values(SECTORS)) {
      const centerCol = (sector.bounds.fromCol + sector.bounds.toCol) / 2;
      const centerRow = (sector.bounds.fromRow + sector.bounds.toRow) / 2;
      const { x, y } = IsometricEngine.cartToIso(centerCol, centerRow);
      const color = sector.color;

      // Background panel
      const bg = this.add.graphics();
      bg.fillStyle(0x0d1117, 0.6);
      bg.fillRoundedRect(x - 50, y - 18, 100, 28, 6);
      bg.lineStyle(1, Phaser.Display.Color.HexStringToColor(color).color, 0.3);
      bg.strokeRoundedRect(x - 50, y - 18, 100, 28, 6);
      bg.setDepth(1).setAlpha(0.7);

      const label = this.add.text(x, y - 4, sector.name.toUpperCase(), {
        fontFamily: 'Inter',
        fontSize: '10px',
        color,
        fontStyle: 'bold',
        letterSpacing: 2,
      }).setOrigin(0.5).setDepth(1).setAlpha(0.6);

      // Subtle breathing animation
      this.tweens.add({
        targets: [label, bg],
        alpha: { from: 0.5, to: 0.8 },
        duration: 3000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    }
  }

  // ── Furniture ─────────────────────────────────────────
  private createFurniture(): void {
    for (const agent of AGENT_DESKS) {
      // Add ambient desk accessories around each agent
      const surroundTiles = [
        { dc: -1, dr: 0 }, { dc: 1, dr: 0 },
        { dc: 0, dr: -1 }, { dc: 0, dr: 1 },
      ];

      for (const offset of surroundTiles) {
        const tc = agent.col + offset.dc;
        const tr = agent.row + offset.dr;
        if (!IsometricEngine.isValidTile(tc, tr)) continue;

        // Check if another agent is at this tile
        const occupied = AGENT_DESKS.some(a => a.col === tc && a.row === tr);
        if (occupied) continue;

        // Random furniture pieces
        if (Math.random() > 0.6) {
          const { x, y } = IsometricEngine.cartToIso(tc, tr);
          const depth = IsometricEngine.getDepth(tc, tr, 1);
          const furn = this.add.graphics();
          const sectorColor = SQUAD_COLORS[agent.sector] || '#c9d1d9';
          const color = Phaser.Display.Color.HexStringToColor(sectorColor).color;

          if (Math.random() > 0.5) {
            // Small plant
            furn.fillStyle(0x2d4a22, 1);
            furn.fillRoundedRect(-3, -4, 6, 8, 2);
            furn.fillStyle(0x3fb950, 0.8);
            furn.fillCircle(0, -8, 5);
            furn.fillCircle(-3, -6, 3);
            furn.fillCircle(3, -6, 3);
          } else {
            // File cabinet / server rack
            const cabinetColor = Phaser.Display.Color.IntegerToColor(color).darken(40).color;
            furn.fillStyle(cabinetColor, 0.8);
            furn.fillRoundedRect(-5, -10, 10, 14, 2);
            furn.lineStyle(1, color, 0.3);
            furn.strokeRoundedRect(-5, -10, 10, 14, 2);
            // LED indicator
            furn.fillStyle(color, 0.8);
            furn.fillCircle(2, -6, 1.5);
          }

          furn.setPosition(x, y);
          furn.setDepth(depth);
        }
      }
    }
  }

  // ── Agent NPCs ────────────────────────────────────────
  private createAgentNPCs(): void {
    for (const agent of AGENT_DESKS) {
      const { x, y } = IsometricEngine.cartToIso(agent.col, agent.row);
      const depth = IsometricEngine.getDepth(agent.col, agent.row, 2);
      const squadColor = SQUAD_COLORS[agent.sector] || '#c9d1d9';
      const color = Phaser.Display.Color.HexStringToColor(squadColor).color;

      const container = this.add.container(x, y);

      // ── Desk with monitor ──
      const desk = this.add.graphics();
      // Desk surface
      desk.fillStyle(0x3d2f1a, 1);
      desk.fillRoundedRect(-16, 2, 32, 14, 3);
      desk.lineStyle(1, 0x5c451f, 0.8);
      desk.strokeRoundedRect(-16, 2, 32, 14, 3);
      // Desk legs
      desk.fillStyle(0x2a1f0d, 1);
      desk.fillRect(-14, 16, 3, 4);
      desk.fillRect(11, 16, 3, 4);
      // Monitor stand
      desk.fillStyle(0x484f58, 1);
      desk.fillRect(-1, -2, 2, 6);
      // Monitor
      desk.fillStyle(0x0d1117, 1);
      desk.fillRoundedRect(-8, -12, 16, 12, 2);
      desk.lineStyle(1, 0x30363d, 0.8);
      desk.strokeRoundedRect(-8, -12, 16, 12, 2);
      // Monitor screen glow
      desk.fillStyle(color, 0.3);
      desk.fillRoundedRect(-6, -10, 12, 8, 1);
      // Keyboard
      desk.fillStyle(0x21262d, 1);
      desk.fillRoundedRect(-6, 6, 12, 4, 1);
      container.add(desk);

      // ── Agent body ──
      const body = this.add.graphics();
      // Torso
      body.fillStyle(color, 1);
      body.fillRoundedRect(-7, -18, 14, 18, 4);
      // Shoulders
      const darkerColor = Phaser.Display.Color.IntegerToColor(color).darken(15).color;
      body.fillStyle(darkerColor, 1);
      body.fillRoundedRect(-9, -16, 18, 6, 3);
      container.add(body);

      // ── Head ──
      const head = this.add.graphics();
      const skinColor = 0xdeb887;
      // Head circle
      head.fillStyle(skinColor, 1);
      head.fillCircle(0, -24, 7);
      // Hair (agent color)
      const lighterColor = Phaser.Display.Color.IntegerToColor(color).lighten(20).color;
      head.fillStyle(lighterColor, 1);
      head.fillRoundedRect(-6, -32, 12, 8, 4);
      // Eyes
      head.fillStyle(0x1a1a2e, 1);
      head.fillCircle(-3, -24, 1.5);
      head.fillCircle(3, -24, 1.5);
      // Eye shine
      head.fillStyle(0xffffff, 0.8);
      head.fillCircle(-2.5, -24.5, 0.7);
      head.fillCircle(3.5, -24.5, 0.7);
      container.add(head);

      // ── Crown for Orion Prime ──
      if (agent.id === 'aiox-master') {
        const crown = this.add.graphics();
        crown.fillStyle(0xffd700, 1);
        // Main crown body
        crown.fillRect(-6, -38, 12, 5);
        // Crown points
        crown.fillTriangle(-6, -38, -4, -43, -2, -38);
        crown.fillTriangle(-1, -38, 0, -44, 1, -38);
        crown.fillTriangle(2, -38, 4, -43, 6, -38);
        // Jewel
        crown.fillStyle(0xff4444, 1);
        crown.fillCircle(0, -36, 1.5);
        // Glow
        crown.fillStyle(0xffd700, 0.15);
        crown.fillCircle(0, -38, 12);
        container.add(crown);
      }

      // ── Status dot ──
      const statusDot = this.add.graphics();
      statusDot.fillStyle(0x3fb950, 1);
      statusDot.fillCircle(0, 0, 4);
      statusDot.setPosition(10, -28);
      statusDot.setData('role', 'statusDot');
      container.add(statusDot);

      // ── Name tag ──
      const nameTag = this.add.text(0, -50, `${agent.icon} ${agent.name}`, {
        fontFamily: 'Inter',
        fontSize: '9px',
        color: '#e6edf3',
        backgroundColor: '#0d111790',
        padding: { x: 6, y: 3 },
      }).setOrigin(0.5);
      container.add(nameTag);

      // ── Shadow ──
      const shadow = this.add.graphics();
      shadow.fillStyle(0x000000, 0.2);
      shadow.fillEllipse(0, 18, 24, 8);
      container.addAt(shadow, 0); // Add at bottom

      container.setDepth(depth);
      container.setSize(36, 60);
      container.setInteractive({ useHandCursor: true });

      // Idle bob animation
      this.tweens.add({
        targets: container,
        y: y - 2,
        duration: 2000 + Phaser.Math.Between(-300, 300),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });

      // Click handler
      container.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        // Click feedback flash
        this.tweens.add({
          targets: container,
          scaleX: 1.15,
          scaleY: 1.15,
          duration: 100,
          yoyo: true,
          ease: 'Power2',
        });

        eventBus.emit('agent:click', {
          agentId: agent.id,
          screenX: pointer.x,
          screenY: pointer.y,
        });
      });

      // Hover glow
      container.on('pointerover', () => {
        container.setScale(1.08);
        nameTag.setAlpha(1);
        nameTag.setStyle({ color: squadColor });
        eventBus.emit('agent:hover', { agentId: agent.id });
      });

      container.on('pointerout', () => {
        container.setScale(1.0);
        nameTag.setAlpha(1);
        nameTag.setStyle({ color: '#e6edf3' });
        eventBus.emit('agent:hover', { agentId: null });
      });

      this.agentSprites.set(agent.id, container);
    }
  }

  // ── Player ────────────────────────────────────────────
  private createPlayer(): void {
    const { x, y } = IsometricEngine.cartToIso(this.playerCol, this.playerRow);

    this.player = this.add.container(x, y);

    // Ground glow ring
    this.playerGlow = this.add.graphics();
    this.playerGlow.fillStyle(0x00ff88, 0.12);
    this.playerGlow.fillEllipse(0, 6, 28, 12);
    this.playerGlow.lineStyle(1.5, 0x00ff88, 0.4);
    this.playerGlow.strokeEllipse(0, 6, 28, 12);
    this.player.add(this.playerGlow);

    // Pulse animation for glow
    this.tweens.add({
      targets: this.playerGlow,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 0.5,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });

    // Shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillEllipse(0, 6, 18, 7);
    this.player.add(shadow);

    // Body
    const body = this.add.graphics();
    // Torso
    body.fillStyle(0x00cc66, 1);
    body.fillRoundedRect(-6, -14, 12, 16, 3);
    // Shoulders
    body.fillStyle(0x00aa55, 1);
    body.fillRoundedRect(-8, -12, 16, 5, 3);
    this.player.add(body);

    // Head
    const head = this.add.graphics();
    head.fillStyle(0xdeb887, 1);
    head.fillCircle(0, -20, 6);
    // Hair
    head.fillStyle(0x2d1b00, 1);
    head.fillRoundedRect(-5, -27, 10, 7, 3);
    // Eyes
    head.fillStyle(0x1a1a2e, 1);
    head.fillCircle(-2, -20, 1.2);
    head.fillCircle(2, -20, 1.2);
    // Smile
    head.lineStyle(1, 0x1a1a2e, 0.6);
    head.beginPath();
    head.arc(0, -18, 3, 0.2, Math.PI - 0.2);
    head.strokePath();
    this.player.add(head);

    // "YOU" indicator
    const youTag = this.add.text(0, -34, '▼ YOU', {
      fontFamily: 'Inter',
      fontSize: '8px',
      color: '#00ff88',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.player.add(youTag);

    // Bounce animation for indicator
    this.tweens.add({
      targets: youTag,
      y: -38,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.InOut',
    });

    const depth = IsometricEngine.getDepth(this.playerCol, this.playerRow, 3);
    this.player.setDepth(depth);
  }

  // ── Hover Highlight ───────────────────────────────────
  private createHoverHighlight(): void {
    this.hoverHighlight = this.add.graphics();
    this.hoverHighlight.setDepth(1);
  }

  private drawTileHighlight(col: number, row: number): void {
    const { TILE_WIDTH, TILE_HEIGHT } = GAME_CONFIG;
    const halfW = TILE_WIDTH / 2;
    const halfH = TILE_HEIGHT / 2;
    const { x, y } = IsometricEngine.cartToIso(col, row);

    this.hoverHighlight.clear();

    // Glow fill
    this.hoverHighlight.fillStyle(0x00ff88, 0.12);
    this.hoverHighlight.beginPath();
    this.hoverHighlight.moveTo(x, y - halfH);
    this.hoverHighlight.lineTo(x + halfW, y);
    this.hoverHighlight.lineTo(x, y + halfH);
    this.hoverHighlight.lineTo(x - halfW, y);
    this.hoverHighlight.closePath();
    this.hoverHighlight.fillPath();

    // Border glow
    this.hoverHighlight.lineStyle(2, 0x00ff88, 0.5);
    this.hoverHighlight.beginPath();
    this.hoverHighlight.moveTo(x, y - halfH);
    this.hoverHighlight.lineTo(x + halfW, y);
    this.hoverHighlight.lineTo(x, y + halfH);
    this.hoverHighlight.lineTo(x - halfW, y);
    this.hoverHighlight.closePath();
    this.hoverHighlight.strokePath();

    // Corner dots
    this.hoverHighlight.fillStyle(0x00ff88, 0.7);
    this.hoverHighlight.fillCircle(x, y - halfH, 2);
    this.hoverHighlight.fillCircle(x + halfW, y, 2);
    this.hoverHighlight.fillCircle(x, y + halfH, 2);
    this.hoverHighlight.fillCircle(x - halfW, y, 2);
  }

  // ── Camera ────────────────────────────────────────────
  private setupCamera(): void {
    const center = IsometricEngine.getMapCenterIso();
    const cam = this.cameras.main;

    cam.centerOn(center.x, center.y);
    cam.setZoom(1);

    this.input.on('wheel', (_pointer: Phaser.Input.Pointer, _gameObjects: unknown[], _deltaX: number, deltaY: number) => {
      const newZoom = Phaser.Math.Clamp(
        cam.zoom + (deltaY > 0 ? -GAME_CONFIG.CAMERA_ZOOM_STEP : GAME_CONFIG.CAMERA_ZOOM_STEP),
        GAME_CONFIG.CAMERA_ZOOM_MIN,
        GAME_CONFIG.CAMERA_ZOOM_MAX
      );
      // Smooth zoom
      this.tweens.add({
        targets: cam,
        zoom: newZoom,
        duration: 150,
        ease: 'Power2',
      });
    });
  }

  // ── Input ─────────────────────────────────────────────
  private setupInput(): void {
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown() || pointer.middleButtonDown()) {
        this.isDragging = true;
        this.dragStart = { x: pointer.x, y: pointer.y };
        this.cameraStart = { x: this.cameras.main.scrollX, y: this.cameras.main.scrollY };
      }
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging) {
        const dx = pointer.x - this.dragStart.x;
        const dy = pointer.y - this.dragStart.y;
        this.cameras.main.scrollX = this.cameraStart.x - dx / this.cameras.main.zoom;
        this.cameras.main.scrollY = this.cameraStart.y - dy / this.cameras.main.zoom;
        return;
      }

      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const { col, row } = IsometricEngine.isoToCart(worldPoint.x, worldPoint.y);
      if (IsometricEngine.isValidTile(col, row)) {
        this.drawTileHighlight(col, row);
      } else {
        this.hoverHighlight.clear();
      }
    });

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging) {
        this.isDragging = false;
        return;
      }

      if (pointer.button === 0) {
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const { col, row } = IsometricEngine.isoToCart(worldPoint.x, worldPoint.y);

        if (IsometricEngine.isValidTile(col, row)) {
          this.movePlayerTo(col, row);
        }
      }
    });
  }

  // ── Player Movement ───────────────────────────────────
  private movePlayerTo(targetCol: number, targetRow: number): void {
    const { x, y } = IsometricEngine.cartToIso(targetCol, targetRow);
    const depth = IsometricEngine.getDepth(targetCol, targetRow, 3);

    // Movement trail effect
    const trail = this.add.graphics();
    trail.fillStyle(0x00ff88, 0.3);
    trail.fillEllipse(this.player.x, this.player.y + 6, 16, 6);
    trail.setDepth(0);
    this.tweens.add({
      targets: trail,
      alpha: 0,
      scaleX: 2,
      scaleY: 2,
      duration: 600,
      onComplete: () => trail.destroy(),
    });

    this.tweens.add({
      targets: this.player,
      x,
      y,
      duration: 300 + Math.abs(targetCol - this.playerCol) * 60 + Math.abs(targetRow - this.playerRow) * 60,
      ease: 'Power2',
      onUpdate: () => {
        const currentIso = IsometricEngine.isoToCart(this.player.x, this.player.y);
        this.player.setDepth(IsometricEngine.getDepth(currentIso.col, currentIso.row, 3));
      },
      onComplete: () => {
        this.playerCol = targetCol;
        this.playerRow = targetRow;
        this.player.setDepth(depth);

        // Arrival bounce
        this.tweens.add({
          targets: this.player,
          scaleY: 0.9,
          duration: 80,
          yoyo: true,
          ease: 'Power2',
        });

        const sector = getSectorForTile(targetCol, targetRow);
        eventBus.emit('player:arrived', { col: targetCol, row: targetRow });
        eventBus.emit('player:move', {
          col: targetCol,
          row: targetRow,
          sector: sector?.name || 'Unknown',
        });
      },
    });
  }
}
