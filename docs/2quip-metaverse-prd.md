# 2QUIP Metaverse — Product Requirements Document (PRD)

> **Product:** 2quip Metaverse (Habbo-Style Intelligence Office)
> **Version:** 1.0.0 | **Status:** Draft
> **Author:** @po (Pax) | **Coordinated by:** Orion Prime
> **Date:** 2026-04-14
> **Codename:** The Hive

---

## 1. Vision Statement

Transformar a mente coletiva da 2quip em um **escritório virtual imersivo e gamificado**, onde o operador pode caminhar, interagir com agentes IA em tempo real, enviar comandos, e visualizar o estado do ecossistema AIOX — tudo em uma interface isométrica 2D no estilo pixel-art do Habbo Hotel.

> *"A inteligência precisa de um rosto. O CLI é o cérebro, o Metaverse é o corpo."*

---

## 2. Problem Statement

O ecossistema AIOX opera via CLI com eficiência máxima, mas carece de:
- **Observabilidade visual** — o operador não "vê" o que cada agente está fazendo
- **Imersão** — a interação com agentes é funcional mas não engajante
- **Onboarding** — novos membros do squad não têm representação visual da topologia
- **Memorabilidade** — o CLI é poderoso mas invisível; uma UI gamificada torna a 2quip inesquecível

---

## 3. Target Users

| Persona | Descrição | Necessidade Principal |
|---------|-----------|----------------------|
| **Operador 2quip** | Fundador/Lead que orquestra agentes | Visualizar estado, dar comandos, customizar QG |
| **Squad Member** | Membro humano da equipe (futuro) | Ver seu espaço, interagir com agentes AI |
| **Visitante** | Cliente/Parceiro em demo | Impressionar-se com a tecnologia da 2quip |

---

## 4. Phasing Strategy

### Fase 1 — Foundation (CURRENT SCOPE)
> Movimentação + Chat + Ambiente Base

### Fase 2 — Intelligence Layer
> Agentes NPCs + Animações de Task + Learning Loop Visual

### Fase 3 — Customization
> Build Mode + Catálogo + "Contratar" agentes

### Fase 4 — Multiplayer
> Múltiplos operadores + presença em tempo real

---

## 5. Fase 1 — Detailed Requirements

### 5.1 Epic: MV-E1 — Base Environment

**Objetivo:** Renderizar o escritório isométrico base com tiles clicáveis.

---

#### Story MV-1.1 — Tile Map Rendering

**Como** operador da 2quip,
**Quero** ver um escritório isométrico 2D renderizado no browser,
**Para** ter uma representação visual do QG da 2quip.

**Acceptance Criteria:**
- [ ] Mapa isométrico de no mínimo 20x20 tiles renderizado via Phaser 3
- [ ] Tiles do chão diferenciados por setor (Tech=azul escuro, Creative=roxo, Strategic=laranja, Security=vermelho escuro)
- [ ] Borda visual delimitando cada setor do escritório
- [ ] Z-sorting correto para objetos e avatares sobre os tiles
- [ ] Câmera centralizada no mapa com capacidade de pan (drag) e zoom (scroll)
- [ ] Performance: 60 FPS estáveis em tela 1920x1080
- [ ] Responsividade mínima: funcionar em 1280x720 e 1920x1080

**Technical Notes:**
- Tilemap em formato JSON (Tiled Map Editor export)
- Phaser 3 com plugin de isometria ou cálculo manual de projeção
- Tiles em pixel art 64x32px (padrão isométrico)

**Priority:** P0 (Blocker)
**Story Points:** 8

---

#### Story MV-1.2 — Player Avatar & Movement

**Como** operador da 2quip,
**Quero** ter um avatar pixel-art que se move pelo escritório ao clicar no chão,
**Para** navegar pelo QG e me aproximar dos agentes.

**Acceptance Criteria:**
- [ ] Avatar pixel-art do operador visível no mapa isométrico
- [ ] Click em tile do chão: avatar caminha até o tile via pathfinding (A*)
- [ ] Animação de caminhada suave (4 direções mínimo: NE, NW, SE, SW)
- [ ] Animação de idle quando parado
- [ ] Colisão com paredes e objetos (avatar não atravessa mesas/paredes)
- [ ] Pathfinding contorna obstáculos automaticamente
- [ ] Avatar renderizado com z-sorting correto (atrás de objetos mais altos)

**Technical Notes:**
- EasyStar.js ou equivalente para pathfinding A*
- Spritesheet do avatar: 4 direções × (idle + walk frames)
- Velocidade de movimento: configurável (tiles/segundo)

**Priority:** P0 (Blocker)
**Story Points:** 8

---

#### Story MV-1.3 — Office Furniture & Layout

**Como** operador da 2quip,
**Quero** ver mesas, cadeiras e decoração no escritório,
**Para** sentir que o ambiente é um escritório real e vivo.

**Acceptance Criteria:**
- [ ] Cada setor tem pelo menos 3-5 mesas posicionadas
- [ ] Mesas com computadores pixel-art para cada agente
- [ ] Objetos decorativos de setor (ex: lousa no Tech, plantas no Creative)
- [ ] Paredes/divisórias entre setores
- [ ] Porta de entrada do escritório
- [ ] Placa de identificação visual por setor
- [ ] Objetos possuem collision bounds (avatar não atravessa)

**Technical Notes:**
- Objetos como camadas separadas no tilemap
- Cada objeto: sprite + collision box + z-depth
- Metadata de objeto: `{ type, sectorId, agentId?, interactable }`

**Priority:** P1 (High)
**Story Points:** 5

---

### 5.2 Epic: MV-E2 — Chat System

**Objetivo:** Permitir comunicação via chat global e interação direta com agentes.

---

#### Story MV-2.1 — Global Chat Console

**Como** operador da 2quip,
**Quero** um console de chat estilo MMO no canto inferior da tela,
**Para** digitar comandos AIOX e ver as respostas dos agentes.

**Acceptance Criteria:**
- [ ] Console de chat em overlay React posicionado no bottom da tela
- [ ] Input de texto com suporte a comandos `*` (ex: `*task @devops deploy`)
- [ ] Histórico de mensagens com scroll
- [ ] Mensagens diferenciadas por cor/ícone por agente (ex: 👑 Orion = dourado, 🔓 Cipher = verde)
- [ ] Suporte a menção com `@` (autocomplete lista de agentes)
- [ ] Timestamp em cada mensagem
- [ ] Console retrátil (minimize/maximize)
- [ ] Chat persiste durante navegação pelo mapa
- [ ] Atalho de teclado para focar o input (Enter ou `/`)

**Technical Notes:**
- Componente React separado do canvas Phaser
- Comunicação via EventBus compartilhado (React ↔ Phaser)
- Histórico limitado a 500 mensagens (ring buffer)
- Markdown básico renderizado nas mensagens (bold, code, links)

**Priority:** P0 (Blocker)
**Story Points:** 8

---

#### Story MV-2.2 — Agent Direct Chat (Context Menu)

**Como** operador da 2quip,
**Quero** clicar em um agente no mapa e abrir um chat direto com ele,
**Para** ter conversas focadas com um agente específico.

**Acceptance Criteria:**
- [ ] Clicar em sprite de agente no mapa abre menu de contexto
- [ ] Opção "Conversar" no menu abre painel de chat direto
- [ ] Chat direto aparece como painel lateral (sidebar) no lado direito
- [ ] Histórico separado por agente (cada agente tem seu próprio thread)
- [ ] Ícone e nome do agente visível no header do chat direto
- [ ] Comandos `*` no chat direto são executados no contexto daquele agente
- [ ] Botão "Fechar" retorna ao chat global
- [ ] Avatar do operador se move até próximo do agente ao iniciar chat

**Technical Notes:**
- Phaser emite evento `agent:click` com `agentId`
- React escuta e renderiza o painel de chat direto
- Context switch: chat direto envia comandos com prefixo `@{agentId}`

**Priority:** P1 (High)
**Story Points:** 8

---

#### Story MV-2.3 — Chat Bubble Animation

**Como** operador da 2quip,
**Quero** ver balões de fala sobre os avatares quando enviam mensagens,
**Para** ter feedback visual de quem está falando no escritório.

**Acceptance Criteria:**
- [ ] Ao enviar mensagem no chat global, balão aparece sobre avatar do sender
- [ ] Balão exibe texto truncado (max 60 chars) com reticências se maior
- [ ] Balão desaparece após 5 segundos (fade out)
- [ ] Balão posicionado acima do avatar com z-sorting correto
- [ ] Cor do balão corresponde ao agente (mesmo esquema do chat)
- [ ] Animação de "typing" (três pontinhos) enquanto agente processa

**Technical Notes:**
- Renderizado no canvas Phaser (não React overlay)
- Sprite de balão com text object child
- Tween de fade out ao expirar

**Priority:** P2 (Medium)
**Story Points:** 5

---

### 5.3 Epic: MV-E3 — Agent NPCs (Fase 1 Foundation)

**Objetivo:** Placeholders visuais dos agentes no escritório com presença estática.

---

#### Story MV-3.1 — Agent Avatars & Desk Assignment

**Como** operador da 2quip,
**Quero** ver cada agente sentado em sua mesa no setor correto,
**Para** saber onde cada membro do squad está e ir até ele.

**Acceptance Criteria:**
- [ ] Cada agente definido em `.aiox-core/development/agents/` tem um avatar pixel-art
- [ ] Avatares posicionados em suas mesas nos setores corretos:
  - Tech Core: @architect, @dev, @devops, @data-engineer, @qa
  - Product: @pm, @po, @sm, @analyst
  - Creative: @ux-design-expert, @copywriter
  - Strategic: @strategist
  - Security: @hacker
  - Central: @aiox-master (Orion Prime) — mesa maior/destaque
- [ ] Cada avatar tem animação de idle (sentado, piscando)
- [ ] Nome tag acima do avatar com ícone do agente (ex: "🏛️ Aria")
- [ ] Tooltip ao hover mostra role do agente
- [ ] Avatares são clicáveis (emite evento para chat direto)

**Technical Notes:**
- Dados de agentes carregados de `agents-manifest.json` (gerado de `.aiox-core/development/agents/`)
- Cada agente: `{ id, name, icon, sector, deskPosition: {x, y}, spriteKey }`
- Sprites de agente: variações de cor/roupa por squad
- Orion Prime tem sprite diferenciado (coroa dourada)

**Priority:** P1 (High)
**Story Points:** 8

---

#### Story MV-3.2 — Agent Status Indicator

**Como** operador da 2quip,
**Quero** ver visualmente se um agente está idle, trabalhando, ou offline,
**Para** saber o estado do squad em tempo real.

**Acceptance Criteria:**
- [ ] Indicador de status acima do avatar (dot colorido):
  - 🟢 Verde: Idle (disponível)
  - 🟡 Amarelo: Trabalhando (processando task)
  - 🔴 Vermelho: Erro/Atenção
  - ⚪ Cinza: Offline/Não registrado
- [ ] Quando status = "trabalhando", agente tem animação de teclando
- [ ] Status sincronizado com backend AIOX (leitura de `session-state.json`)
- [ ] Transição de status com animação suave (fade between colors)

**Technical Notes:**
- Status polling: a cada 3s ler `session-state.json` via backend API
- Fallback: se arquivo não existe, todos = idle
- Status enum: `idle | working | error | offline`

**Priority:** P2 (Medium)
**Story Points:** 5

---

## 6. Non-Functional Requirements (NFRs)

| ID | Categoria | Requisito | Target |
|----|-----------|-----------|--------|
| NFR-1 | Performance | 60 FPS em mapa 20x20 com 15 NPCs | 60 FPS |
| NFR-2 | Performance | Tempo de carregamento inicial | < 3s |
| NFR-3 | Responsividade | Resoluções suportadas | 1280x720 a 2560x1440 |
| NFR-4 | Browser | Browsers suportados | Chrome 100+, Firefox 100+, Edge 100+ |
| NFR-5 | Acessibilidade | Teclado | Chat navegável via teclado |
| NFR-6 | Segurança | Dados sensíveis | Nenhum dado sensível trafega no frontend |
| NFR-7 | Escalabilidade | Agentes no mapa | Suportar até 30 agentes simultâneos |

---

## 7. Out of Scope (Fase 1)

- ❌ Build Mode (customização de sala) — Fase 3
- ❌ Drag & Drop de arquivos para learning loop — Fase 2
- ❌ Animações de task em tempo real — Fase 2
- ❌ "Contratar" novos agentes via UI — Fase 3
- ❌ Avatar customization (roupas, estilo) — Fase 3
- ❌ Multiplayer / co-presença — Fase 4
- ❌ Mobile support — futuro

---

## 8. Risks & Mitigations

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Performance do Phaser com muitos sprites | Alto | Média | Object pooling, culling de objetos fora de tela |
| Complexidade de pathfinding isométrico | Médio | Alta | Usar EasyStar.js com grid simplificado |
| Sincronização React ↔ Phaser | Alto | Média | EventBus compartilhado com tipagem forte |
| Criação de assets pixel-art | Médio | Alta | Usar AI generation (Midjourney/DALL-E) + clean up manual |
| Scope creep nas Fases | Alto | Alta | PRD faseado com scope lock por fase |

---

## 9. Success Metrics (Fase 1)

| Métrica | Target |
|---------|--------|
| Avatar navega pelo mapa sem bugs visuais | 100% |
| Chat global processa comandos `*` | 100% |
| Todos os 15 agentes visíveis no mapa | 100% |
| FPS estável em 60 | > 55 FPS |
| Tempo de carga | < 3s |

---

## 10. Dependencies

| Dependência | Status | Owner |
|------------|--------|-------|
| Phaser 3 | Available (npm) | @dev |
| React 18+ | Available (npm) | @dev |
| Pixel art assets (tiles, avatares, objetos) | **TO CREATE** | @ux-design-expert + AI |
| AIOX session-state.json API | **TO CREATE** | @architect + @dev |
| Tilemap design (Tiled Editor) | **TO CREATE** | @ux-design-expert |

---

## 11. Technical Constraints

1. **Local-first:** O Metaverse roda localmente (localhost), não é um serviço cloud
2. **Electron optional:** Pode rodar no browser puro ou empacotado com Electron
3. **AIOX integration:** Lê `session-state.json` e envia comandos via IPC ou REST local
4. **No auth required:** É uma ferramenta local do operador, não um produto SaaS

---

## 12. Story Map Summary

```
MV-E1: Base Environment          MV-E2: Chat System           MV-E3: Agent NPCs
├── MV-1.1 Tile Map Rendering    ├── MV-2.1 Global Chat       ├── MV-3.1 Agent Avatars
├── MV-1.2 Player Movement       ├── MV-2.2 Direct Chat       └── MV-3.2 Status Indicator
└── MV-1.3 Office Furniture      └── MV-2.3 Chat Bubbles

                         ┌────────────────┐
                         │  FASE 1 TOTAL  │
                         │   8 Stories    │
                         │   55 SP Total  │
                         └────────────────┘
```

---

*Documento preparado por @po (Pax) — equilibrando prioridades 🎯*
*Coordenado por Orion Prime — 2quip Intelligence Architecture*
