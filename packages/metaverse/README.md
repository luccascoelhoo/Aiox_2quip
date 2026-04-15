# 2quip Metaverse — The Hive 🏢👑

> Escritório virtual interativo e gamificado no estilo Habbo Hotel para o ecossistema 2quip Intelligence Architecture.

## Quick Start

```bash
# Instalar dependências
npm install --ignore-scripts

# Rodar em desenvolvimento (frontend + backend)
npm run dev

# Porta Frontend: http://localhost:5173
# Porta Backend:  http://localhost:3001
```

## Arquitetura

```
┌──────────────────────────────────────────────┐
│              BROWSER (localhost:5173)          │
│                                               │
│  ┌─────────────────┐  ┌───────────────────┐  │
│  │   PHASER 3       │  │    REACT UI       │  │
│  │  Isometric Map   │  │  Chat Console     │  │
│  │  Player Avatar   │  │  Agent Menus      │  │
│  │  Agent NPCs      │  │  HUD + Minimap    │  │
│  └────────┬─────────┘  └──────┬────────────┘  │
│           └─────EventBus──────┘               │
└─────────────────────┬─────────────────────────┘
                      │ HTTP (localhost:3001)
┌─────────────────────▼─────────────────────────┐
│           FASTIFY BACKEND (AIOX Bridge)        │
│  /api/state  /api/agents  /api/command         │
└────────────────────────────────────────────────┘
```

## Controles

| Ação | Controle |
|------|----------|
| Mover player | Click esquerdo em tile |
| Pan câmera | Click direito + arrastar |
| Zoom | Scroll do mouse |
| Focar chat | Enter ou `/` |
| Abrir menu agente | Click no NPC |
| Comando AIOX | Digitar `*comando` no chat |

## Setores do Escritório

| Setor | Cor | Agentes |
|-------|-----|---------|
| Tech Core | 🔵 Azul | Aria, Dev, DevOps, Dara, QA |
| Product | 🟢 Verde | Morgan, Pax, SM, Analyst |
| Creative | 🟣 Roxo | Uma, Versa |
| Strategic | 🟠 Laranja | Stratton |
| Security | 🔴 Vermelho | Cipher |
| Command | 🟡 Dourado | Orion Prime |

## Stack

- **Phaser 3** — Game engine isométrico
- **React 18** — UI overlays
- **TailwindCSS 3** — Styling
- **Zustand** — State management
- **EasyStar.js** — Pathfinding A*
- **Fastify** — Backend API
- **TypeScript** — Type safety

## Roadmap

- [x] Fase 1: Base Environment + Chat + NPCs
- [ ] Fase 2: Intelligence Layer (task animations, learning loop visual)
- [ ] Fase 3: Build Mode (customização de sala)
- [ ] Fase 4: Multiplayer (co-presença em tempo real)

## Documentação

- [PRD](../../docs/2quip-metaverse-prd.md) — Product Requirements Document
- [Architecture](../../docs/2quip-metaverse-architecture.md) — Architecture Decision Records
- [Prompts](../../docs/2quip-metaverse-prompts.md) — Prompts de continuação

---

*Built by 2quip Intelligence Architecture — powered by Orion Prime 👑*
