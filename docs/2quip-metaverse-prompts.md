# 2QUIP Metaverse — Prompts de Continuação (Insurance Document)

> **Propósito:** Se os créditos acabarem, copie e cole o prompt da fase atual em qualquer IA (Claude, GPT, Gemini, Codex) para continuar exatamente de onde paramos.
> **Cada prompt é autossuficiente** — contém todo o contexto necessário.

---

## 📋 ÍNDICE DE PROMPTS

| # | Prompt | Descrição | Dependência |
|---|--------|-----------|-------------|
| 1 | Scaffold do Projeto | Criar estrutura base Vite + React + Phaser + Fastify | Nenhuma |
| 2 | Isometric Engine + Tilemap | Motor de coordenadas iso e loader de mapa | Prompt 1 |
| 3 | Player Avatar + Pathfinding | Avatar com movimento e A* | Prompt 2 |
| 4 | Office Layout + Furniture | Mesas, setores, colisão | Prompt 2 |
| 5 | EventBus + Bridge Layer | Comunicação React ↔ Phaser | Prompt 1 |
| 6 | Chat Console Global | UI de chat com comandos | Prompt 5 |
| 7 | Agent NPCs + Status | Agentes no mapa com indicador | Prompt 2 + 5 |
| 8 | Backend API (Fastify) | API que lê o AIOX | Prompt 1 |
| 9 | Chat Direct + Context Menu | Sidebar de chat por agente | Prompt 6 + 7 |
| 10 | Chat Bubbles + Polimento | Balões, animações, HUD | Prompt 7 |
| 11 | Pixel Art Assets | Gerar todos os assets visuais | Independente |
| 12 | Integração Final + Testes | Conectar tudo, testar | Todos |

---

## PROMPT 1 — SCAFFOLD DO PROJETO

```
Você é um desenvolvedor senior TypeScript. Crie o scaffold completo do projeto "2quip Metaverse" — um escritório virtual isométrico 2D estilo Habbo Hotel usando Phaser 3 + React 18 + Vite 5 + TailwindCSS 3.

CONTEXTO:
- O projeto fica em: packages/metaverse/ (dentro de um monorepo existente)
- É uma aplicação local-first (roda em localhost)
- Phaser 3 renderiza o game isométrico, React renderiza overlays de UI (chat, menus)
- Eles se comunicam via EventBus tipado (nunca se importam diretamente)

TAREFAS:
1. Crie o diretório packages/metaverse/ com esta estrutura:
```
packages/metaverse/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── public/
│   └── assets/
│       ├── tilesets/
│       ├── sprites/
│       │   ├── player/
│       │   ├── agents/
│       │   └── objects/
│       └── maps/
├── src/
│   ├── main.tsx
│   ├── game/
│   │   ├── GameBootstrap.ts
│   │   ├── config.ts
│   │   ├── scenes/
│   │   │   ├── BootScene.ts
│   │   │   ├── OfficeScene.ts
│   │   │   └── UIScene.ts
│   │   ├── entities/
│   │   ├── systems/
│   │   ├── map/
│   │   └── types/
│   │       └── game.types.ts
│   ├── ui/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   │       └── ui.types.ts
│   ├── bridge/
│   │   ├── EventBus.ts
│   │   ├── events.ts
│   │   └── store.ts
│   ├── services/
│   │   ├── AIOXClient.ts
│   │   ├── AgentStatePoller.ts
│   │   └── CommandExecutor.ts
│   └── shared/
│       ├── constants.ts
│       └── types.ts
└── server/
    ├── index.ts
    ├── routes/
    ├── services/
    └── types/
```

2. package.json com estas dependências:
- dependencies: phaser@^3.80.0, react@^18.3.0, react-dom@^18.3.0, zustand@^4.5.0, easystarjs@^0.4.4, fastify@^4.28.0, @fastify/cors@^9.0.0
- devDependencies: typescript@^5.5.0, vite@^5.4.0, @vitejs/plugin-react@^4.3.0, concurrently@^8.2.0, tsx@^4.19.0, tailwindcss@^3.4.0, autoprefixer@^10.4.0, postcss@^8.4.0, @types/react@^18.3.0, @types/react-dom@^18.3.0
- scripts: "dev": "concurrently \"vite\" \"tsx watch server/index.ts\"", "dev:game": "vite", "dev:api": "tsx watch server/index.ts", "build": "tsc && vite build"

3. main.tsx deve:
- Montar o React App
- Dentro do App.tsx, criar um div#game-container para o Phaser canvas
- Instanciar Phaser.Game no useEffect com GameBootstrap config
- Renderizar componentes React de overlay ACIMA do canvas

4. GameBootstrap.ts deve:
- Configurar Phaser.Game com type: Phaser.AUTO, parent: 'game-container'
- Registrar cenas: BootScene, OfficeScene, UIScene
- Configurar resolução: 1280x720 com resize scaling
- Pixel art mode: pixelArt: true, roundPixels: true
- Background cor: #1a1a2e (escuro)

5. BootScene.ts deve:
- Mostrar barra de progresso de loading
- Carregar placeholder assets (gere retângulos coloridos com Phaser.Graphics como placeholder)
- Transicionar para OfficeScene após carregar

6. OfficeScene.ts (scaffold mínimo):
- Renderizar um grid isométrico 20x20 com tiles placeholder (losangos coloridos)
- Colocar um quadrado representando o player no centro
- Log "OfficeScene ready" no console

7. config.ts com constantes:
```typescript
export const GAME_CONFIG = {
  TILE_WIDTH: 64,
  TILE_HEIGHT: 32,
  MAP_COLS: 20,
  MAP_ROWS: 20,
  PLAYER_SPEED: 3,
  POLL_INTERVAL: 3000,
  API_BASE: 'http://localhost:3001',
};
```

8. index.html deve ter:
- Meta tags SEO
- Google Font "Inter"
- div#root para React
- Dark background: #0a0a0f

REGRAS:
- TypeScript strict mode em tudo
- ZERO placeholders que quebrem o build — tudo deve compilar e rodar
- Phaser canvas deve preencher 100% da viewport
- React overlays devem estar posicionados absolutamente COM pointer-events: none (exceto nos componentes interativos)
- Instale as dependências com npm install ao final
- O resultado deve abrir no browser com `npm run dev` mostrando o grid isométrico

NÃO peça confirmação. Execute tudo de uma vez.
```

---

## PROMPT 2 — ISOMETRIC ENGINE + TILEMAP

```
Você está trabalhando no projeto 2quip Metaverse em packages/metaverse/. O scaffold já está criado com Phaser 3 + React + Vite.

CRIE os seguintes arquivos de motor isométrico:

1. src/game/systems/IsometricEngine.ts
```typescript
/**
 * Motor de conversão de coordenadas isométricas.
 * Usa projeção diamante 2:1 (padrão isométrica clássica como Habbo Hotel).
 * 
 * Grid cartesiano (col, row) → Coordenadas de tela (screenX, screenY)
 * O tile (0,0) fica no topo do diamante.
 * 
 * TILE_WIDTH = 64px, TILE_HEIGHT = 32px
 */
export class IsometricEngine {
  static readonly TILE_WIDTH = 64;
  static readonly TILE_HEIGHT = 32;

  static cartToIso(col: number, row: number): { x: number; y: number } {
    return {
      x: (col - row) * (this.TILE_WIDTH / 2),
      y: (col + row) * (this.TILE_HEIGHT / 2),
    };
  }

  static isoToCart(screenX: number, screenY: number): { col: number; row: number } {
    const halfW = this.TILE_WIDTH / 2;
    const halfH = this.TILE_HEIGHT / 2;
    return {
      col: Math.floor((screenX / halfW + screenY / halfH) / 2),
      row: Math.floor((screenY / halfH - screenX / halfW) / 2),
    };
  }

  static getDepth(col: number, row: number, layer: number = 0): number {
    return (col + row) * 10 + layer;
  }

  static isValidTile(col: number, row: number, maxCols: number, maxRows: number): boolean {
    return col >= 0 && col < maxCols && row >= 0 && row < maxRows;
  }
}
```

2. src/game/systems/ZSortingSystem.ts
- Classe que gerencia depth sorting para todos os game objects no mapa
- Método updateDepth(gameObject, col, row, layerOffset) que seta o depth baseado na posição iso
- Método sortGroup(group) que reordena todo um Phaser.Group por depth

3. src/game/systems/CameraSystem.ts
- Configura câmera Phaser com:
  - Pan via drag do mouse (botão esquerdo pressionado + arrastar)
  - Zoom via scroll do mouse (min 0.5, max 2.0)
  - Método followPlayer(player) para câmera seguir o player suavemente
  - Método centerOnTile(col, row) para centralizar em uma coordenada
  - Bounds limitados ao tamanho do mapa
  - Smooth follow com lerp: 0.1

4. src/game/map/TileMapLoader.ts
- Gera um mapa isométrico 20x20 PROCEDURALMENTE (sem arquivo JSON por enquanto)
- Cria tiles como Phaser.GameObjects.Graphics (losangos)
- Cada tile tem cor baseada no setor:
  * Tech Core (cols 0-9, rows 0-9): #1e3a5f (azul escuro)
  * Product (cols 10-19, rows 0-9): #2d4a22 (verde escuro)
  * Creative (cols 0-9, rows 10-14): #4a2d5e (roxo escuro)
  * Strategic (cols 10-19, rows 10-14): #5e4a2d (laranja escuro)
  * Security (cols 10-19, rows 15-19): #5e2d2d (vermelho escuro)
  * Orion Center (cols 0-9, rows 15-19): #3d3d1a (dourado escuro)
- Cada tile tem borda sutil (#ffffff15)
- Tiles são interativos (click emite evento com col, row)
- Retorna a walkability grid (0 = walkable, 1 = blocked)
- Hover no tile mostra highlight sutil

5. src/game/map/SectorManager.ts
- Define os setores e as posições de mesa de cada agente:
```typescript
export const SECTORS = {
  'tech-core':  { name: 'Tech Core',  color: '#1e3a5f', bounds: { fromCol: 0, toCol: 9, fromRow: 0, toRow: 9 } },
  'product':    { name: 'Product',    color: '#2d4a22', bounds: { fromCol: 10, toCol: 19, fromRow: 0, toRow: 9 } },
  'creative':   { name: 'Creative',   color: '#4a2d5e', bounds: { fromCol: 0, toCol: 9, fromRow: 10, toRow: 14 } },
  'strategic':  { name: 'Strategic',  color: '#5e4a2d', bounds: { fromCol: 10, toCol: 19, fromRow: 10, toRow: 14 } },
  'security':   { name: 'Security',   color: '#5e2d2d', bounds: { fromCol: 10, toCol: 19, fromRow: 15, toRow: 19 } },
  'command':    { name: 'Orion Prime', color: '#3d3d1a', bounds: { fromCol: 0, toCol: 9, fromRow: 15, toRow: 19 } },
};

export const AGENT_DESKS = [
  { id: 'aiox-master', name: 'Orion Prime', icon: '👑', sector: 'command', col: 4, row: 17 },
  { id: 'architect', name: 'Aria', icon: '🏛️', sector: 'tech-core', col: 2, row: 2 },
  { id: 'dev', name: 'Dev', icon: '💻', sector: 'tech-core', col: 5, row: 2 },
  { id: 'devops', name: 'DevOps', icon: '🔧', sector: 'tech-core', col: 2, row: 5 },
  { id: 'data-engineer', name: 'Dara', icon: '🗄️', sector: 'tech-core', col: 5, row: 5 },
  { id: 'qa', name: 'QA', icon: '✅', sector: 'tech-core', col: 8, row: 3 },
  { id: 'pm', name: 'Morgan', icon: '📋', sector: 'product', col: 12, row: 2 },
  { id: 'po', name: 'Pax', icon: '📦', sector: 'product', col: 15, row: 2 },
  { id: 'sm', name: 'SM', icon: '📊', sector: 'product', col: 12, row: 5 },
  { id: 'analyst', name: 'Analyst', icon: '🔍', sector: 'product', col: 15, row: 5 },
  { id: 'ux-design-expert', name: 'Uma', icon: '🎨', sector: 'creative', col: 2, row: 12 },
  { id: 'copywriter', name: 'Versa', icon: '✍️', sector: 'creative', col: 5, row: 12 },
  { id: 'strategist', name: 'Stratton', icon: '🎯', sector: 'strategic', col: 14, row: 12 },
  { id: 'hacker', name: 'Cipher', icon: '🔓', sector: 'security', col: 14, row: 17 },
];
```

6. ATUALIZE OfficeScene.ts para:
- Usar TileMapLoader para gerar o mapa procedural
- Usar CameraSystem para pan/zoom
- Permitir click em tiles (log no console: "Clicked tile col:X row:Y sector:NAME")
- Usar IsometricEngine para posicionar tudo corretamente
- Highlight do tile sob o mouse cursor

RESULTADO ESPERADO: Ao rodar `npm run dev`, ver no browser um mapa isométrico diamante 20x20 com 6 setores coloridos, câmera com pan/zoom, tiles clicáveis com hover highlight.
```

---

## PROMPT 3 — PLAYER AVATAR + PATHFINDING

```
Você está trabalhando no projeto 2quip Metaverse em packages/metaverse/. O mapa isométrico 20x20 já está renderizando com setores coloridos.

IMPLEMENTE o Player Avatar com pathfinding A*:

1. src/game/systems/PathfindingSystem.ts
- Usa EasyStar.js (já instalado) para pathfinding A*
- Recebe a walkability grid do TileMapLoader
- Método assíncrono findPath(startCol, startRow, endCol, endRow) → Promise<{x,y}[]>
- Habilita diagonais
- Método setBlocked(col, row) e setWalkable(col, row) para atualizar grid
- Pathfinding opera em coordenadas CARTESIANAS (col, row), não isométricas

2. src/game/entities/Player.ts
- Classe que estende Phaser.GameObjects.Container (contém sprite + shadow)
- Como ainda não temos spritesheet, use Phaser.GameObjects.Graphics:
  * Corpo: círculo 12px raio, cor #00ff88 (verde neon)
  * Sombra: elipse abaixo do corpo, cor #00000040
- Posição em coordenadas iso (via IsometricEngine.cartToIso)
- Método walkTo(col, row): 
  * Chama PathfindingSystem.findPath
  * Anima o player passo a passo pelos tiles do path
  * Velocidade: 150ms por tile
  * Tween suave entre cada tile (ease: 'Linear')
  * Atualiza depth (Z-sorting) a cada passo
  * Emite evento 'player:move' no EventBus a cada step
  * Emite evento 'player:arrived' ao chegar
- Método setGridPosition(col, row): teleporta o player
- Propriedade currentCol, currentRow para track da posição
- Estado: 'idle' | 'walking'

3. ATUALIZE OfficeScene.ts para:
- Criar Player na posição (10, 10) — centro do mapa
- No click de tile:
  * Se tile é walkable: player.walkTo(col, row)
  * Se tile é blocked: ignorar (ou flash vermelho no tile)
- Marcar as posições de desk dos agentes como BLOCKED no PathfindingSystem
- Câmera segue o player com smooth follow
- Mostrar indicador visual no tile de destino (marcador pulsante)

4. src/game/entities/DestinationMarker.ts
- Marcador visual que aparece no tile de destino quando o player está se movendo
- Losango outline pulsante (tween scale + alpha loop)
- Cor: #00ff8880
- Desaparece quando player chega

RESULTADO ESPERADO: Player (círculo verde) aparece no centro do mapa. Clicar em qualquer tile walkable faz o player caminhar até lá via pathfinding, contornando obstáculos. Marcador pulsante no destino. Câmera segue o player.
```

---

## PROMPT 4 — EVENTBUS + BRIDGE LAYER

```
Você está trabalhando no projeto 2quip Metaverse em packages/metaverse/. Player já se move pelo mapa.

IMPLEMENTE o Bridge Layer completo (EventBus + Zustand Store):

1. src/bridge/events.ts — Definições de tipos de eventos:
```typescript
import type { AgentState } from '../shared/types';

export type EventMap = {
  // Phaser → React
  'agent:click':      { agentId: string; screenX: number; screenY: number };
  'agent:hover':      { agentId: string | null };
  'player:move':      { col: number; row: number; sector: string };
  'player:arrived':   { col: number; row: number };
  'tile:click':       { col: number; row: number; sector: string };
  
  // React → Phaser
  'chat:send':        { message: string; target?: string };
  'chat:bubble':      { agentId: string; text: string; duration?: number };
  'camera:focus':     { col: number; row: number };
  'camera:follow':    { entityId: string };
  
  // Both → Backend
  'command:execute':  { command: string; agentContext?: string };
  'command:response': { output: string; agentId: string; success: boolean };
  
  // Backend → Both
  'state:updated':    { agents: AgentState[] };
};
```

2. src/bridge/EventBus.ts — EventBus tipado singleton:
- Classe TypedEventBus com emit, on, once, off
- Usa EventTarget nativo do browser
- Tipagem forte: emit<K> aceita apenas eventos definidos no EventMap
- Export singleton: export const eventBus = new TypedEventBus()

3. src/bridge/store.ts — Zustand store global:
```typescript
interface MetaverseStore {
  // Player
  playerPosition: { col: number; row: number };
  playerSector: string;
  setPlayerPosition: (col: number, row: number, sector: string) => void;
  
  // Agents
  agents: AgentState[];
  setAgents: (agents: AgentState[]) => void;
  getAgent: (id: string) => AgentState | undefined;
  
  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  activeChatAgent: string | null; // null = global, agentId = direct
  setActiveChatAgent: (id: string | null) => void;
  
  // UI State
  contextMenu: { visible: boolean; agentId: string; x: number; y: number } | null;
  showContextMenu: (agentId: string, x: number, y: number) => void;
  hideContextMenu: () => void;
}
```

4. src/shared/types.ts — Tipos compartilhados:
```typescript
export interface AgentState {
  id: string;
  name: string;
  icon: string;
  title: string;
  sector: string;
  status: 'idle' | 'working' | 'error' | 'offline';
  currentTask: string | null;
  desk: { col: number; row: number };
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderIcon: string;
  senderColor: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'agent' | 'system';
  agentContext?: string;
}

export interface SectorInfo {
  id: string;
  name: string;
  color: string;
  bounds: { fromCol: number; toCol: number; fromRow: number; toRow: number };
}
```

5. ATUALIZE Player.ts e OfficeScene.ts para usar eventBus.emit() em vez de console.log
6. ATUALIZE App.tsx para subscrever eventos relevantes via useEventBus hook

RESULTADO ESPERADO: EventBus funciona. Mover o player emite eventos que o React pode escutar. Console mostra os eventos sendo disparados.
```

---

## PROMPT 5 — CHAT CONSOLE GLOBAL

```
Você está trabalhando no projeto 2quip Metaverse em packages/metaverse/. O EventBus e Zustand Store já funcionam.

IMPLEMENTE o Chat Console Global (React overlay):

1. src/ui/components/ChatConsole/ChatConsole.tsx
- Painel fixo no bottom da tela, height: 250px, width: 100%
- Background: #0d1117e6 (quase preto, semi-transparente)
- Border-top: 1px solid #30363d
- MINIMIZÁVEL: botão toggle que recolhe para apenas a barra de input
- Quando minimizado: mostrar badge com count de mensagens não lidas

2. src/ui/components/ChatConsole/ChatInput.tsx
- Input de texto estilizado (dark theme, monospace font)
- Placeholder: "Digite um comando (*help) ou mensagem..."
- Ao pressionar Enter: enviar mensagem
- Se mensagem começa com `*`: é um comando AIOX → eventBus.emit('command:execute')
- Se mensagem começa com `@`: autocompletar com lista de agentes
- Autocomplete dropdown aparece acima do input ao digitar `@`
- Focus no input com tecla Enter ou `/`
- Histórico de comandos com seta pra cima/baixo (últimos 50)

3. src/ui/components/ChatConsole/ChatMessage.tsx
- Cada mensagem renderiza:
  - Ícone do agente + Nome (colorido por agente)
  - Timestamp (HH:mm)
  - Conteúdo da mensagem (com markdown básico: **bold**, `code`, ```blocks```)
- Cores por agente:
  * Orion Prime: #ffd700 (gold)
  * Tech Core agents: #58a6ff (blue)
  * Product agents: #3fb950 (green)
  * Creative agents: #bc8cff (purple)
  * Strategic agents: #f0883e (orange)
  * Security agents: #f85149 (red)
  * User: #c9d1d9 (light gray)
  * System: #8b949e (gray)

4. src/ui/hooks/useChat.ts
- Custom hook que gerencia mensagens do chat
- Funcionalidade de addMessage que adiciona ao Zustand store
- Auto-scroll para a última mensagem
- Limitar a 500 mensagens (ring buffer)
- Mensagem de sistema ao iniciar: "👑 2quip Metaverse v0.1.0 initialized. Type *help for commands."

5. Estilização:
- Use TailwindCSS para layout
- CSS custom para scrollbar customizada (dark theme, thin)
- Animação de slide-up ao receber nova mensagem
- Glassmorphism no container (backdrop-blur)

6. INTEGRE no App.tsx:
- ChatConsole renderizado como overlay fixo
- pointer-events: auto apenas no ChatConsole (resto do overlay é invisible ao mouse)

RESULTADO ESPERADO: Chat console visível no bottom. Digitação funciona. Mensagens aparecem com cores. Comandos * são emitidos via EventBus. Autocomplete de @agentes funciona. Console é minimizável.
```

---

## PROMPT 6 — AGENT NPCs NO MAPA

```
Você está trabalhando no projeto 2quip Metaverse em packages/metaverse/. O mapa, player, e chat console já funcionam.

IMPLEMENTE os Agent NPCs no mapa isométrico:

1. src/game/entities/AgentNPC.ts
- Classe que renderiza um agente NPC no mapa
- Como não temos spritesheets ainda, use Phaser.GameObjects.Graphics:
  * Corpo: retângulo arredondado 20x24px
  * Cor do corpo baseada no squad:
    - Tech Core: #58a6ff
    - Product: #3fb950
    - Creative: #bc8cff
    - Strategic: #f0883e
    - Security: #f85149
    - Command (Orion): #ffd700
  * Cabeça: círculo 8px raio acima do corpo, tom mais claro
  * Sombra: elipse embaixo, #00000040
  * Orion Prime tem COROA: pequeno triângulo dourado acima da cabeça

- Nome tag acima do NPC:
  * Text com fontSize 10, fontFamily 'Inter'
  * Formato: "{icon} {name}"
  * Background semi-transparente preto
  * Sempre visível

- Status indicator (dot 6px):
  * Acima do nome tag
  * Cores: idle=#3fb950, working=#f0883e, error=#f85149, offline=#484f58
  * Tween de pulse quando working (escala 0.8-1.2 loop)

- Animação básica:
  * idle: sutil bob up/down (2px, 2s loop, ease: Sine.InOut)
  * working: bob mais rápido (1s loop) + pequenas "partículas" de código (#58a6ff40)
  
- Interação:
  * setInteractive() para click e hover
  * On click: eventBus.emit('agent:click', { agentId, screenX, screenY })
  * On hover: cursor muda para pointer, outline glow aparece
  * On hover out: outline glow desaparece

- Método updateStatus(status): muda cor do indicator e animação

2. ATUALIZE OfficeScene.ts:
- Criar todos os 14 AgentNPCs usando dados de AGENT_DESKS do SectorManager
- Posicionar cada NPC no tile de desk usando IsometricEngine.cartToIso
- Z-sorting correto para cada NPC
- Mesas (retângulos marrons) em frente a cada NPC
- Adicionar colisão nas posições de mesa/NPC

3. Adicione "mesas" simples:
- Para cada agente, renderize um retângulo representando a mesa
- Mesa: retângulo 28x14px, cor #8b6914 (marrom), com borda #6b5210
- Mesa posicionada 1 tile à frente do NPC (entre o NPC e o centro do mapa)
- "Monitor" na mesa: retângulo menor 10x8px, cor #1a1a2e com borda #30363d

4. Labels de setor:
- Em cada setor, renderize o nome do setor como texto grande
- fontSize 14, bold, cor do setor com alpha 0.3
- Posicionado no centro do setor

RESULTADO ESPERADO: 14 NPCs coloridos sentados em seus setores com mesas. Nomes visíveis. Status dots. Hover mostra glow. Click emite evento. Orion Prime tem coroa dourada no centro.
```

---

## PROMPT 7 — BACKEND API (FASTIFY)

```
Você está trabalhando no projeto 2quip Metaverse em packages/metaverse/. O frontend funciona com mapa + player + NPCs + chat.

IMPLEMENTE o Backend API Fastify:

1. server/index.ts
- Fastify server na porta 3001
- CORS habilitado para localhost:5173
- Registrar rotas: state, agents, command
- Graceful shutdown
- Log: "2quip Metaverse API running on port 3001"

2. server/routes/state.ts — GET /api/state
- Lê o arquivo .aiox/session-state.json (se existir)
- Se não existir, retorna estado default (todos agentes idle)
- Retorna: { agents: AgentState[], activeAgent: string, timestamp: string }

3. server/routes/agents.ts — GET /api/agents
- Usa AgentManifestBuilder para construir manifest
- Retorna lista de agentes com metadata estática (id, name, icon, sector, desk, commands)

4. server/routes/command.ts — POST /api/command
- Body: { command: string, agentContext?: string }
- Valida que command começa com *
- Por enquanto, retorna mockado: { success: true, output: "Command received: {command}", agentId: agentContext || 'aiox-master' }
- TODO futuro: spawn child process com bin/aiox.js

5. server/services/StateReader.ts
- Lê .aiox/session-state.json com cache de 1s
- Se arquivo não existe, cria um default com todos agentes idle
- Método getState(): Promise<SessionState>
- Watch file changes para invalidar cache

6. server/services/AgentManifestBuilder.ts
- Lê os arquivos .aiox-core/development/agents/*.md
- Extrai de cada um: name, icon, title, id (do YAML block)
- Combina com dados de AGENT_DESKS para posições
- Retorna AgentManifest[]
- Cache resultado (rebuild apenas se arquivos mudaram)

7. server/services/CommandBridge.ts (stub)
- Classe que no futuro vai executar comandos via child_process
- Por agora, retorna mock responses
- Interface preparada para: execute(command, agentContext) → { output, success, agentId }

8. ATUALIZE os services do frontend:
- src/services/AIOXClient.ts: implementar fetch para GET /api/state, GET /api/agents, POST /api/command
- src/services/AgentStatePoller.ts: poll GET /api/state a cada 3s, emitir 'state:updated' via EventBus
- src/services/CommandExecutor.ts: enviar POST /api/command quando EventBus emite 'command:execute'

9. CONECTE tudo:
- OfficeScene subscreve 'state:updated' e atualiza status dos AgentNPCs
- ChatConsole mostra resposta do comando quando retornar
- Mensagem de sistema no chat: "Connected to AIOX Backend ✅" ou "Backend offline ⚠️" (fallback)

RESULTADO ESPERADO: Backend roda em localhost:3001. Frontend conecta e mostra "Connected to AIOX Backend ✅" no chat. Comandos enviados no chat retornam resposta mockada. Status dos agentes atualiza periodicamente.
```

---

## PROMPT 8 — CHAT DIRETO + CONTEXT MENU

```
Você está trabalhando no projeto 2quip Metaverse em packages/metaverse/. Chat global, NPCs, e backend funcionam.

IMPLEMENTE o Chat Direto por agente e o Context Menu:

1. src/ui/components/AgentContextMenu/AgentContextMenu.tsx
- Menu que aparece ao clicar em um NPC no mapa
- Recebe dados via Zustand store (contextMenu state)
- Opções:
  * 💬 Conversar (abre chat direto)
  * 📋 Ver Status (abre tooltip com info)
  * ❌ Fechar
- Estilo: floating card com background #161b22, border #30363d, border-radius 8px
- Posicionado nas coordenadas screenX, screenY do click
- Clamp para não sair da tela
- Fechar ao clicar fora

2. src/ui/components/DirectChat/DirectChat.tsx
- Sidebar no lado direito da tela, width: 380px
- Header: ícone + nome do agente + role + status dot
- Body: histórico de mensagens (filtrado por agentId)
- Input: mesmo estilo do ChatInput, mas prefixo "@{agentId}" automático
- Botão de fechar no header
- Animação de slide-in da direita ao abrir
- Animação de slide-out ao fechar
- Background: #0d1117e6 com glassmorphism

3. Lógica de Direct Chat:
- Ao abrir chat direto, player caminha até tile adjacente ao agente (se não estiver perto)
- Mensagens no chat direto são enviadas com agentContext = agentId
- Respostas voltam filtradas para o mesmo thread
- No chat global, mostrar: "[Direct] @{agent}: mensagem..." em itálico

4. INTEGRE no App.tsx:
- AgentContextMenu renderiza quando contextMenu !== null no store
- DirectChat renderiza quando activeChatAgent !== null
- Ambos acima do ChatConsole (z-index)

5. CONECTE eventos:
- Ao receber 'agent:click' no EventBus → store.showContextMenu()
- Ao selecionar "Conversar" → store.setActiveChatAgent(agentId) + store.hideContextMenu()
- Ao fechar DirectChat → store.setActiveChatAgent(null)

RESULTADO ESPERADO: Clicar em NPC mostra context menu flutuante. "Conversar" abre sidebar de chat direto com slide-in. Player caminha até o agente. Mensagens são isoladas por thread. Fechar faz slide-out.
```

---

## PROMPT 9 — CHAT BUBBLES + POLIMENTO VISUAL

```
Você está trabalhando no projeto 2quip Metaverse em packages/metaverse/. Tudo funciona: mapa, player, NPCs, chat global, chat direto.

IMPLEMENTE polimento visual final:

1. src/game/entities/ChatBubble.ts
- Sprite de balão de fala que aparece sobre avatares
- Background: retângulo arredondado branco com borda
- Texto: fontSize 9, cor preta, max 60 chars (trunca com ...)
- Triângulo apontando para baixo (tail do balão)
- Posição: acima do nome tag do NPC
- Tween de entrada: scale 0→1 com bounce
- Tween de saída: fade out após 5s
- Animação de "typing" (3 dots pulsando) quando agente está processando

2. src/ui/components/StatusHUD/StatusHUD.tsx
- HUD no canto superior esquerdo
- Info mostrada:
  * 👑 2quip Metaverse v0.1.0
  * Setor atual do player
  * FPS (atualizado a cada 500ms)
  * Numero de agentes online/total
  * Status da conexão backend
- Estilo: compacto, semi-transparente, border-radius, backdrop-blur

3. src/ui/components/Minimap/Minimap.tsx
- Minimap no canto superior direito, 150x150px
- Renderiza representação simplificada do mapa (retângulos coloridos por setor)
- Dots coloridos para cada agente
- Indicador de posição do player (dot pulsante branco)
- Clicável: clicar no minimap move a câmera para aquela posição
- Background semi-transparente, border sutil

4. Efeitos visuais adicionais:
- Partículas ambientais sutis no mapa (flutuantes, como poeira, muito transparentes)
- Iluminação: tiles próximos do player são levemente mais claros
- Transição suave ao mudar de setor (cor do ambiente gradualmente muda)
- Ao enviar comando, flash sutil na tela do agente-alvo

5. Tela de Loading (melhore o BootScene):
- Logo "2quip" em pixel art (ou texto estilizado)
- Barra de progresso com gradiente dourado
- Texto "Initializing Intelligence Architecture..."
- Fade out para OfficeScene

RESULTADO ESPERADO: Experiência polida. Chat bubbles aparecem sobre NPCs. HUD mostra info útil. Minimap funcional. Efeitos visuais sutis. Loading screen profissional.
```

---

## PROMPT 10 — GERAR PIXEL ART ASSETS

```
Preciso que você gere os seguintes assets pixel art para o projeto 2quip Metaverse (escritório virtual isométrico estilo Habbo Hotel):

ASSETS NECESSÁRIOS (gere cada um como imagem):

1. TILESET DO CHÃO (64x32px cada tile, isométrico diamante):
   - floor-tech.png: piso azul escuro moderno (tipo sala de servidor)
   - floor-creative.png: piso roxo/violeta com textura artística
   - floor-strategic.png: piso laranja/amber com textura executiva
   - floor-security.png: piso vermelho escuro com textura industrial
   - floor-product.png: piso verde escuro com textura natural
   - floor-command.png: piso dourado/preto com textura premium

2. AVATAR DO PLAYER (spritesheet 4 frames por direção):
   - player.png: personagem humanóide pixel art, 32x48px, estilo Habbo
   - 4 direções: NE, NW, SE, SW
   - 2 estados: idle (1 frame) e walk (4 frames)
   - Visual: roupas modernas, headset, estilo tech

3. AVATARES DOS AGENTES (32x48px cada, sentados):
   - Orion Prime: traje dourado/preto, coroa dourada
   - Aria (architect): traje azul royal, óculos
   - Dev: hoodie azul, headset
   - DevOps: camisa xadrez, barba
   - Cipher (hacker): hoodie preto com capuz, óculos verdes
   - Versa (copywriter): blusa roxa elegante, cabelo estilizado  
   - Stratton (strategist): terno laranja/escuro
   - (demais podem usar variações de cor dos acima)

4. MOBILIÁRIO (isométrico, 64x48px):
   - desk-tech.png: mesa de escritório moderna preta
   - desk-creative.png: mesa colorida com materiais artísticos
   - chair.png: cadeira de escritório preta
   - computer.png: monitor + teclado na mesa
   - plant.png: vaso com planta decorativa
   - whiteboard.png: quadro branco com anotações
   - server-rack.png: rack de servidor (setor tech)
   - lock-terminal.png: terminal de segurança (setor security)

5. UI ELEMENTS:
   - chat-bubble.png: 9-slice do balão de fala
   - status-dots.png: dots de status (verde, amarelo, vermelho, cinza) 8x8px

ESTILO VISUAL:
- Pixel art autêntico, estilo Habbo Hotel (2003-2010)
- Paleta limitada por asset (max 16 cores por sprite)
- Sem anti-aliasing (bordas duras)
- Isométrico 2:1 para todos os objetos do mapa
- Sombras projetadas sutis

Gere os assets um a um usando a ferramenta de geração de imagem. Comece pelos tiles do chão, depois avatares, depois mobiliário.
```

---

## PROMPT 11 — INTEGRAÇÃO FINAL + TESTES

```
Você está trabalhando no projeto 2quip Metaverse em packages/metaverse/. Todos os sistemas estão implementados individualmente. 

REALIZE A INTEGRAÇÃO FINAL:

1. VERIFICAÇÃO DE BUILD:
```bash
cd packages/metaverse
npm run build
```
- Corrija qualquer erro de TypeScript
- Corrija qualquer erro de import

2. TESTE MANUAL DE FLUXO COMPLETO:
Abra o browser e verifique:
- [ ] Tela de loading aparece com barra de progresso
- [ ] Mapa isométrico renderiza com 6 setores coloridos
- [ ] 14 NPCs posicionados nos setores corretos
- [ ] Player aparece no centro
- [ ] Click em tile: player caminha via pathfinding
- [ ] Click em NPC: context menu aparece
- [ ] "Conversar" abre chat direto com slide-in
- [ ] Chat global aceita mensagens e comandos *
- [ ] Balões de fala aparecem sobre NPCs
- [ ] HUD mostra FPS, setor, conexão
- [ ] Minimap mostra posições
- [ ] Zoom e pan da câmera funcionam
- [ ] Backend retorna respostas mockadas

3. TESTES UNITÁRIOS (src/__tests__/):
- IsometricEngine.test.ts: testar cartToIso, isoToCart, getDepth
- EventBus.test.ts: testar emit, on, off
- PathfindingSystem.test.ts: testar findPath, setBlocked

4. PERFORMANCE CHECK:
- Verificar que FPS > 55 em resolução 1920x1080
- Verificar que não há memory leaks (abrir DevTools > Memory)
- Verificar que bundle size < 2MB

5. README do package:
- Criar packages/metaverse/README.md com:
  - Descrição do projeto
  - Como rodar: npm install && npm run dev
  - Arquitetura em diagrama ASCII
  - Screenshots (placeholder)
  - Roadmap (Fases 2-4)

RESULTADO ESPERADO: Projeto compila sem erros, roda sem bugs, testes passam. README documentado. Pronto para demo.
```

---

## ⚡ DICA DE USO

1. **Execute os prompts na ordem** (1 → 2 → 3 → ...)
2. **Cada prompt é autocontido** — pode ser usado em qualquer IA
3. **Se um prompt falhar**, corrija os erros e tente novamente antes de avançar
4. **O Prompt 10 (Pixel Art)** pode ser executado em paralelo — é independente
5. **Sempre rode `npm run dev`** após cada prompt para verificar que não quebrou

---

*Documento preparado por Orion Prime — 2quip Intelligence Architecture*
*Seguro contra perda de créditos. Cada prompt é uma munição autossuficiente.*
