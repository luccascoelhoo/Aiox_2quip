# 2QUIP Metaverse — Architecture Document

> **Product:** 2quip Metaverse (Habbo-Style Intelligence Office)
> **Version:** 1.0.0 | **Status:** Draft
> **Author:** @architect (Aria) | **Coordinated by:** Orion Prime
> **Date:** 2026-04-14
> **PRD Reference:** `docs/2quip-metaverse-prd.md`

---

## 1. Architecture Overview

O 2quip Metaverse é uma aplicação **local-first** que combina um game engine (Phaser 3) para renderização isométrica com uma camada de UI (React) para chat/menus, conectada ao motor Node.js do AIOX que opera no backend local.

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (localhost)                    │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────────┐  │
│  │    PHASER 3 LAYER    │  │     REACT UI LAYER       │  │
│  │                      │  │                           │  │
│  │  ▪ Isometric Map     │  │  ▪ Chat Console (Global)  │  │
│  │  ▪ Player Avatar     │  │  ▪ Chat Direct (Sidebar)  │  │
│  │  ▪ Agent NPCs        │  │  ▪ Agent Context Menu     │  │
│  │  ▪ Pathfinding       │  │  ▪ Status HUD             │  │
│  │  ▪ Chat Bubbles      │  │  ▪ Minimap                │  │
│  │  ▪ Z-Sorting         │  │  ▪ Command Autocomplete   │  │
│  │                      │  │                           │  │
│  └──────────┬───────────┘  └────────────┬──────────────┘  │
│             │         EVENT BUS          │                 │
│             └──────────┬─────────────────┘                 │
│                        │                                   │
│  ┌─────────────────────▼─────────────────────────────────┐│
│  │              BRIDGE LAYER (EventBus)                   ││
│  │  ▪ Phaser → React events (agent:click, player:move)   ││
│  │  ▪ React → Phaser events (chat:send, camera:focus)    ││
│  │  ▪ Both → Backend (command:execute, state:poll)        ││
│  └─────────────────────┬─────────────────────────────────┘│
└────────────────────────┼──────────────────────────────────┘
                         │ HTTP / WebSocket (localhost)
┌────────────────────────▼──────────────────────────────────┐
│                  AIOX BACKEND (Node.js)                     │
│                                                             │
│  ┌─────────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Metaverse API  │  │ AIOX Engine  │  │  File System  │  │
│  │  (Express/Fastify)│ │              │  │               │  │
│  │  /api/state     │  │ ▪ Agents     │  │ ▪ session-    │  │
│  │  /api/command   │  │ ▪ Tasks      │  │   state.json  │  │
│  │  /api/agents    │  │ ▪ Workflows  │  │ ▪ agents/*.md │  │
│  │  /ws/events     │  │ ▪ Memory     │  │ ▪ learned-    │  │
│  │                 │  │              │  │   patterns    │  │
│  └─────────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Design Principles

1. **Separation of Concerns** — Phaser handles rendering, React handles UI, Backend handles intelligence
2. **EventBus Decoupling** — Phaser and React never import each other; they communicate via typed events
3. **Local-First** — Everything runs on localhost, no cloud dependency for core operation
4. **Progressive Enhancement** — Fase 1 uses HTTP polling; Fase 2+ upgrades to WebSocket for real-time
5. **AIOX Constitution Compliance** — CLI First: the Metaverse is an observability layer, NEVER a replacement for CLI commands

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Game Engine** | Phaser 3 | ^3.80.x | Isometric rendering, sprites, pathfinding, animations |
| **UI Framework** | React | ^18.x | Chat, menus, overlays, command input |
| **UI Styling** | TailwindCSS | ^3.x | Rapid UI prototyping for overlay components |
| **Build Tool** | Vite | ^5.x | Fast dev server, HMR, bundling |
| **Language** | TypeScript | ^5.x | Type safety across Phaser + React + Backend |
| **Pathfinding** | EasyStar.js | ^0.4.x | A* pathfinding on isometric grid |
| **Backend API** | Fastify | ^4.x | Lightweight HTTP API server for AIOX bridge |
| **Real-time** | WebSocket (ws) | ^8.x | Event streaming (Fase 2, stubbed in Fase 1) |
| **Map Editor** | Tiled | ^1.10.x | Tilemap creation and export (JSON format) |
| **State Management** | Zustand | ^4.x | Global state shared between React and Phaser |

---

## 3. Project Structure

```
packages/metaverse/                    # Monorepo package
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html                         # Entry point
│
├── public/
│   └── assets/
│       ├── tilesets/                   # Isometric tile images
│       │   ├── floor-tech.png
│       │   ├── floor-creative.png
│       │   ├── floor-strategic.png
│       │   └── floor-security.png
│       ├── sprites/
│       │   ├── player/                 # Player avatar spritesheets
│       │   │   ├── walk-ne.png
│       │   │   ├── walk-nw.png
│       │   │   ├── walk-se.png
│       │   │   └── walk-sw.png
│       │   ├── agents/                 # Agent NPC spritesheets
│       │   │   ├── orion-prime.png
│       │   │   ├── aria.png
│       │   │   ├── cipher.png
│       │   │   ├── versa.png
│       │   │   ├── stratton.png
│       │   │   └── ... (one per agent)
│       │   └── objects/                # Furniture & decoration sprites
│       │       ├── desk-tech.png
│       │       ├── desk-creative.png
│       │       ├── chair.png
│       │       ├── computer.png
│       │       └── plant.png
│       └── maps/
│           └── hq-office.json         # Tiled export (tilemap)
│
├── src/
│   ├── main.tsx                       # React + Phaser bootstrap
│   │
│   ├── game/                          # PHASER LAYER
│   │   ├── GameBootstrap.ts           # Phaser.Game config + scene registration
│   │   ├── config.ts                  # Game constants (tile size, map size, speeds)
│   │   ├── scenes/
│   │   │   ├── BootScene.ts           # Asset preloading
│   │   │   ├── OfficeScene.ts         # Main game scene (map + player + NPCs)
│   │   │   └── UIScene.ts             # In-game UI (chat bubbles, name tags)
│   │   ├── entities/
│   │   │   ├── Player.ts              # Player avatar (movement, animation, pathfinding)
│   │   │   ├── AgentNPC.ts            # Agent NPC (idle/working animations, click handler)
│   │   │   └── ChatBubble.ts          # Speech bubble sprite
│   │   ├── systems/
│   │   │   ├── IsometricEngine.ts     # Cart↔Iso coordinate conversion
│   │   │   ├── PathfindingSystem.ts   # EasyStar.js wrapper for iso grid
│   │   │   ├── ZSortingSystem.ts      # Depth sorting for isometric rendering
│   │   │   └── CameraSystem.ts        # Pan, zoom, follow player
│   │   ├── map/
│   │   │   ├── TileMapLoader.ts       # Parse Tiled JSON, create tilemap layers
│   │   │   └── SectorManager.ts       # Sector boundaries, agent desk positions
│   │   └── types/
│   │       └── game.types.ts          # Phaser-specific type definitions
│   │
│   ├── ui/                            # REACT LAYER
│   │   ├── App.tsx                    # React root wrapping Phaser canvas
│   │   ├── components/
│   │   │   ├── ChatConsole/
│   │   │   │   ├── ChatConsole.tsx     # Global chat panel (bottom)
│   │   │   │   ├── ChatInput.tsx       # Input with autocomplete
│   │   │   │   ├── ChatMessage.tsx     # Individual message component
│   │   │   │   └── ChatConsole.css
│   │   │   ├── DirectChat/
│   │   │   │   ├── DirectChat.tsx      # Agent-specific sidebar chat
│   │   │   │   └── DirectChat.css
│   │   │   ├── AgentContextMenu/
│   │   │   │   ├── AgentContextMenu.tsx # Right-click / click context menu
│   │   │   │   └── AgentContextMenu.css
│   │   │   ├── StatusHUD/
│   │   │   │   ├── StatusHUD.tsx       # FPS, agent count, current sector
│   │   │   │   └── StatusHUD.css
│   │   │   └── Minimap/
│   │   │       ├── Minimap.tsx         # Miniature map overview
│   │   │       └── Minimap.css
│   │   ├── hooks/
│   │   │   ├── useAgentState.ts       # Poll agent states from backend
│   │   │   ├── useEventBus.ts         # Subscribe to EventBus events
│   │   │   └── useChat.ts            # Chat state management
│   │   └── types/
│   │       └── ui.types.ts            # React-specific type definitions
│   │
│   ├── bridge/                        # BRIDGE LAYER
│   │   ├── EventBus.ts                # Typed pub/sub event system
│   │   ├── events.ts                  # Event type definitions
│   │   └── store.ts                   # Zustand global store
│   │
│   ├── services/                      # BACKEND COMMUNICATION
│   │   ├── AIOXClient.ts             # HTTP client to AIOX backend API
│   │   ├── AgentStatePoller.ts        # Periodic state polling (3s interval)
│   │   └── CommandExecutor.ts         # Send commands to AIOX engine
│   │
│   └── shared/                        # SHARED
│       ├── constants.ts               # Shared constants
│       └── types.ts                   # Shared type definitions
│
└── server/                            # AIOX METAVERSE API (Backend)
    ├── index.ts                       # Fastify server bootstrap
    ├── routes/
    │   ├── state.ts                   # GET /api/state — read session-state.json
    │   ├── agents.ts                  # GET /api/agents — list agents + positions
    │   └── command.ts                 # POST /api/command — execute AIOX command
    ├── services/
    │   ├── StateReader.ts             # Read/watch .aiox session-state.json
    │   ├── AgentManifestBuilder.ts    # Build agent manifest from .md files
    │   └── CommandBridge.ts           # Bridge commands to AIOX CLI
    └── types/
        └── server.types.ts
```

---

## 4. Core Architecture Decisions

### 4.1 ADR-001: Phaser 3 + React Hybrid (Accepted)

**Context:** Need isometric game rendering + complex UI overlays (chat, menus).

**Decision:** Use Phaser 3 for the game canvas and React for UI overlays, with an EventBus bridge.

**Rationale:**
- Phaser 3 is the industry standard for 2D browser games with isometric support
- React provides superior DX for complex UI (chat, forms, context menus)
- Alternative (pure Phaser UI): Too low-level for complex text input/autocomplete
- Alternative (pure React + Canvas): Would need to rebuild isometric engine from scratch

**Consequences:**
- Two rendering contexts must be coordinated via EventBus
- Z-ordering between Phaser canvas and React overlays needs CSS management
- Bundle size increases (~300KB Phaser + ~100KB React)

---

### 4.2 ADR-002: EventBus Communication Pattern (Accepted)

**Context:** Phaser and React need to communicate without direct imports.

**Decision:** Typed EventBus (pub/sub) singleton shared between both layers.

```typescript
// bridge/events.ts
export type EventMap = {
  // Phaser → React
  'agent:click':      { agentId: string; screenX: number; screenY: number };
  'agent:hover':      { agentId: string };
  'player:move':      { tileX: number; tileY: number; sector: string };
  'player:arrived':   { tileX: number; tileY: number };

  // React → Phaser
  'chat:send':        { message: string; target?: string };
  'chat:bubble':      { agentId: string; text: string; duration: number };
  'camera:focus':     { tileX: number; tileY: number };
  'camera:follow':    { entityId: string };

  // Both → Backend
  'command:execute':  { command: string; agentContext?: string };
  'state:updated':    { agents: AgentState[] };
};

// bridge/EventBus.ts
class TypedEventBus {
  private emitter = new EventTarget();

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    this.emitter.dispatchEvent(
      new CustomEvent(event, { detail: data })
    );
  }

  on<K extends keyof EventMap>(
    event: K,
    handler: (data: EventMap[K]) => void
  ): () => void {
    const listener = (e: Event) =>
      handler((e as CustomEvent).detail);
    this.emitter.addEventListener(event, listener);
    return () => this.emitter.removeEventListener(event, listener);
  }
}

export const eventBus = new TypedEventBus();
```

---

### 4.3 ADR-003: Isometric Coordinate System (Accepted)

**Decision:** Manual isometric projection using 2:1 ratio (standard diamond iso).

```typescript
// game/systems/IsometricEngine.ts
export class IsometricEngine {
  static readonly TILE_WIDTH = 64;
  static readonly TILE_HEIGHT = 32;

  /** Cartesian grid (col, row) → Screen pixels (x, y) */
  static cartToIso(col: number, row: number): { x: number; y: number } {
    return {
      x: (col - row) * (this.TILE_WIDTH / 2),
      y: (col + row) * (this.TILE_HEIGHT / 2),
    };
  }

  /** Screen pixels (x, y) → Cartesian grid (col, row) */
  static isoToCart(screenX: number, screenY: number): { col: number; row: number } {
    return {
      col: Math.floor(
        (screenX / (this.TILE_WIDTH / 2) + screenY / (this.TILE_HEIGHT / 2)) / 2
      ),
      row: Math.floor(
        (screenY / (this.TILE_HEIGHT / 2) - screenX / (this.TILE_WIDTH / 2)) / 2
      ),
    };
  }

  /** Z-depth value for sorting (higher = rendered later = visually in front) */
  static getDepth(col: number, row: number, layer: number = 0): number {
    return (col + row) * 10 + layer;
  }
}
```

---

### 4.4 ADR-004: AIOX Backend API (Accepted)

**Context:** The Metaverse frontend needs to read AIOX state and send commands.

**Decision:** Fastify HTTP server running alongside the Metaverse dev server, reading AIOX filesystem directly.

**API Contract:**

```yaml
# GET /api/state
# Returns current AIOX session state
Response:
  agents:
    - id: "architect"
      name: "Aria"
      icon: "🏛️"
      status: "idle" | "working" | "error" | "offline"
      currentTask: string | null
      sector: "tech-core"
      desk: { col: 5, row: 3 }

# GET /api/agents
# Returns agent manifest (static data)
Response:
  agents:
    - id: "architect"
      name: "Aria"
      icon: "🏛️"
      title: "Holistic System Architect"
      sector: "tech-core"
      commands: ["*create-full-stack-architecture", ...]
      sprite: "aria"

# POST /api/command
# Execute an AIOX command
Request:
  command: "*task @devops deploy"
  agentContext: "devops"  # optional
Response:
  success: true
  output: "Deploy initiated..."
  agentId: "devops"
```

**State Reading Strategy:**

```typescript
// server/services/StateReader.ts
export class StateReader {
  private readonly AIOX_ROOT: string;
  private readonly STATE_FILE: string;
  private cachedState: AIOXState | null = null;
  private watcher: fs.FSWatcher | null = null;

  constructor(aioxRoot: string) {
    this.AIOX_ROOT = aioxRoot;
    this.STATE_FILE = path.join(aioxRoot, '.aiox', 'session-state.json');
  }

  /** Read current state (with caching) */
  async getState(): Promise<AIOXState> {
    if (this.cachedState) return this.cachedState;
    const raw = await fs.readFile(this.STATE_FILE, 'utf-8');
    this.cachedState = JSON.parse(raw);
    return this.cachedState!;
  }

  /** Watch for state changes (invalidate cache) */
  watch(onChange: (state: AIOXState) => void): void {
    this.watcher = fs.watch(this.STATE_FILE, async () => {
      this.cachedState = null;
      const state = await this.getState();
      onChange(state);
    });
  }
}
```

---

### 4.5 ADR-005: Pathfinding on Isometric Grid (Accepted)

**Decision:** EasyStar.js operating on cartesian grid, with isometric projection for rendering.

```typescript
// game/systems/PathfindingSystem.ts
import EasyStar from 'easystarjs';

export class PathfindingSystem {
  private finder: EasyStar.js;
  private grid: number[][]; // 0 = walkable, 1 = blocked

  constructor(mapData: TiledMapJSON) {
    this.finder = new EasyStar.js();
    this.grid = this.buildWalkabilityGrid(mapData);
    this.finder.setGrid(this.grid);
    this.finder.setAcceptableTiles([0]);
    this.finder.enableDiagonals();
    this.finder.enableCornerCutting();
  }

  /** Find path from (startCol, startRow) to (endCol, endRow) in cartesian */
  async findPath(
    startCol: number, startRow: number,
    endCol: number, endRow: number
  ): Promise<Array<{x: number, y: number}>> {
    return new Promise((resolve, reject) => {
      this.finder.findPath(startCol, startRow, endCol, endRow, (path) => {
        if (path === null) {
          reject(new Error('No path found'));
        } else {
          resolve(path);
        }
      });
      this.finder.calculate();
    });
  }

  /** Mark tile as blocked (furniture, agent desk) */
  setBlocked(col: number, row: number): void {
    this.grid[row][col] = 1;
    this.finder.setGrid(this.grid);
  }
}
```

---

## 5. Data Flow Architecture

### 5.1 Player Movement Flow

```
User clicks tile on canvas
        │
        ▼
OfficeScene.onTileClick(screenX, screenY)
        │
        ▼
IsometricEngine.isoToCart(screenX, screenY) → {col, row}
        │
        ▼
PathfindingSystem.findPath(playerPos, targetPos) → path[]
        │
        ▼
Player.walkPath(path)
  ├── For each step: animate walk sprite
  ├── IsometricEngine.cartToIso(col, row) → screen position
  ├── ZSortingSystem.getDepth(col, row) → set depth
  └── On arrival: eventBus.emit('player:arrived', {tileX, tileY})
```

### 5.2 Chat Command Flow

```
User types "*task @devops deploy" in ChatInput
        │
        ▼
ChatInput.onSubmit(message)
        │
        ▼
eventBus.emit('command:execute', { command, agentContext })
        │
        ▼
AIOXClient.executeCommand(command, agentContext)
  → POST /api/command { command, agentContext }
        │
        ▼
Backend: CommandBridge.execute(command)
  → Spawn child process: `node bin/aiox.js ${command}`
  → Capture stdout/stderr
  → Return response
        │
        ▼
Response received in frontend
  ├── ChatConsole: append agent response message
  ├── eventBus.emit('chat:bubble', { agentId, text })
  └── AgentNPC: play "talking" animation
```

### 5.3 Agent State Polling Flow

```
AgentStatePoller (3000ms interval)
        │
        ▼
AIOXClient.getState()
  → GET /api/state
        │
        ▼
Backend: StateReader.getState()
  → Read .aiox/session-state.json
  → Parse agent statuses
  → Read .aiox-core/development/agents/*.md for metadata
  → Return merged state
        │
        ▼
eventBus.emit('state:updated', { agents })
        │
  ┌─────┴──────┐
  ▼            ▼
React:       Phaser:
useAgentState  AgentNPC.updateStatus()
updates HUD    change animation (idle/working/error)
               change status dot color
```

---

## 6. Rendering Architecture

### 6.1 Layer System (Z-Order)

```
Layer 5: React UI Overlay     (CSS z-index: 100+)
  ├── Chat Console
  ├── Direct Chat Sidebar
  ├── Context Menu
  └── Status HUD

Layer 4: Phaser UIScene        (Phaser depth: 1000+)
  ├── Chat Bubbles
  ├── Name Tags
  └── Status Indicators

Layer 3: Entities              (Phaser depth: dynamic via ZSorting)
  ├── Player Avatar
  └── Agent NPCs

Layer 2: Objects               (Phaser depth: dynamic via ZSorting)
  ├── Desks
  ├── Chairs
  ├── Computers
  └── Decorations

Layer 1: Floor                 (Phaser depth: 0)
  ├── Sector Tiles
  └── Grid Lines
```

### 6.2 Z-Sorting Algorithm

```typescript
// Isometric Z-sorting: objects with higher (col + row) are "in front"
// Objects on the same tile: layer determines order (floor < object < entity)

entity.setDepth(IsometricEngine.getDepth(col, row, layerOffset));

// Updated every frame for moving entities (player)
// Static entities set depth once on placement
```

---

## 7. Sector Layout (Floor Plan)

```
         ┌─────────────────────────────────────────┐
         │              ENTRANCE                     │
         │                  🚪                       │
         ├──────────────────┬────────────────────────┤
         │                  │                        │
         │   TECH CORE      │     PRODUCT            │
         │   ██████████     │     ██████████         │
         │  🏛Aria  💻Dev   │  📋Morgan  📦PO        │
         │  🔧DevOps 🗄Dara │  📊SM      🔍Analyst   │
         │  ✅QA            │                        │
         │                  │                        │
         ├──────────────────┼────────────────────────┤
         │                  │                        │
         │   CREATIVE       │     STRATEGIC          │
         │   ██████████     │     ██████████         │
         │  🎨Uma  ✍Versa  │  🎯Stratton            │
         │                  │                        │
         ├──────────────────┤                        │
         │                  │     SECURITY           │
         │   ORION PRIME    │     ██████████         │
         │   👑 CENTER      │  🔓Cipher              │
         │   ██████████     │                        │
         │                  │                        │
         └──────────────────┴────────────────────────┘
```

**Orion Prime** sits at the center — the orchestrator sees all sectors.

---

## 8. Integration Points with AIOX

### 8.1 Files the Metaverse Reads

| File | Purpose | Read Frequency |
|------|---------|----------------|
| `.aiox/session-state.json` | Agent activity status | Poll every 3s |
| `.aiox-core/development/agents/*.md` | Agent metadata (name, icon, role) | On boot |
| `.aiox-core/data/learned-patterns.yaml` | Memory state (for visual indicators) | On demand |
| `.aiox-core/data/entity-registry.yaml` | Component registry (for "hire" feature) | On demand |

### 8.2 Actions the Metaverse Triggers

| Action | Backend Mechanism | AIOX Effect |
|--------|-------------------|-------------|
| Execute `*` command | `POST /api/command` → spawn `aiox.js` | Runs AIOX command |
| Activate agent | `POST /api/command { @agent }` | Switches AIOX persona |
| Chat message | Same as command if starts with `*`, else display-only | Conditional |
| Drag file to agent | `POST /api/ingest { file, agentId }` | Triggers Memory Protocol (Fase 2) |

### 8.3 Session State JSON Schema

```typescript
// .aiox/session-state.json
interface SessionState {
  activeAgent: string;          // Currently active agent ID
  timestamp: string;            // ISO timestamp of last update
  agents: {
    [agentId: string]: {
      status: 'idle' | 'working' | 'error' | 'offline';
      currentTask: string | null;
      lastCommand: string | null;
      lastOutput: string | null;
    };
  };
  recentCommands: Array<{
    command: string;
    agentId: string;
    timestamp: string;
    success: boolean;
  }>;
}
```

---

## 9. Development Environment

### 9.1 Setup Commands

```bash
# From repo root
cd packages/metaverse

# Install dependencies
npm install

# Start dev server (Vite + Fastify concurrently)
npm run dev
# → Vite: http://localhost:5173 (frontend)
# → Fastify: http://localhost:3001 (backend API)

# Build for production
npm run build
```

### 9.2 Dev Dependencies Configuration

```json
{
  "name": "@2quip/metaverse",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "concurrently \"vite\" \"tsx server/index.ts\"",
    "dev:game": "vite",
    "dev:api": "tsx watch server/index.ts",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "phaser": "^3.80.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "zustand": "^4.5.0",
    "easystarjs": "^0.4.4",
    "fastify": "^4.28.0",
    "@fastify/cors": "^9.0.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "concurrently": "^8.2.0",
    "tsx": "^4.19.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 10. Risk Mitigation Architecture

| Risk | Architectural Mitigation |
|------|--------------------------|
| Phaser ↔ React desync | Typed EventBus with strict event contracts |
| session-state.json not found | Graceful fallback: all agents show as "idle" |
| AIOX command failure | CommandBridge catches stderr, returns error to chat |
| Pathfinding on large maps | EasyStar async calculation, grid max 40x40 |
| Asset loading performance | BootScene preloads all assets with progress bar |
| Memory leaks | Phaser scene cleanup on destroy, React unmount hooks |

---

## 11. Verification Plan

### 11.1 Automated

```bash
npm run lint          # ESLint on all TypeScript
npm run typecheck     # tsc --noEmit
npm test              # Vitest unit tests (EventBus, IsometricEngine, PathfindingSystem)
```

### 11.2 Manual (Fase 1 Acceptance)

- [ ] Mapa isométrico renderiza com 4 setores coloridos
- [ ] Avatar anda até tile clicado com pathfinding
- [ ] 15 agentes NPCs posicionados nos setores corretos
- [ ] Chat global aceita input e renderiza mensagens
- [ ] Click em agente abre chat direto
- [ ] Status indicator reflete estado do backend
- [ ] 60 FPS estáveis

---

*Documento preparado por @architect (Aria) — arquitetando o futuro 🏗️*
*Coordenado por Orion Prime — 2quip Intelligence Architecture*
