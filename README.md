<div align="center">
  <h1>👑 2quip Metaverse</h1>
  <p><strong>The Operational Command Center for the 2quip Intelligence Architecture</strong></p>
</div>

<br>

## 🚀 Quick Start

To launch the 2quip Metaverse interface locally:

```bash
# Clone the repository
git clone https://github.com/luccascoelhoo/Aiox_2quip.git
cd Aiox_2quip

# Install dependencies
npm install

# Start the Metaverse
cd packages/metaverse
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌟 What is the 2quip Metaverse?

The **2quip Metaverse** (The Hive) is the visual and fully operational command center for the 2quip Intelligence Architecture. It transforms terminal-based AI agent operations into a fully immersive, gamified, and centralized 3D workspace. 

Instead of typing commands in a stark CLI, you assume the role of the Architect within a virtual office where a squad of 14 specialized AI agents execute your orders. 

### 🎮 Gamification & Progression

The system includes a deeply integrated gamification engine designed to reward consistent architecture management and code execution.
- **XP & Levels:** Execute commands to gain XP. Rank up from *Noob* (Level 0) all the way to *Orion* (Level 9).
- **Badges:** Unlock 12 achievement badges for mastery, exploration, and social interactions with your agents (e.g., *Full Squad*, *Night Owl*).
- **Missions:** Complete Daily and Weekly missions (e.g., *Execute 25 commands this week*) to gain massive XP boosts.
- **Persistence:** Your progress is persisted locally.

### 🖥️ Operation Without CLI Dependency

The 2quip Metaverse completely liberates you from the terminal. 
- **Command Palette (`Ctrl+K`):** Instantly search and execute any command from any agent.
- **Agent Squad Panel (`Tab`):** View your entire 14-agent roster, their current tasks, and instantly switch contexts.
- **Story Task Manager (`T`):** Transparently track, read, and manage Project Stories (`docs/stories/*.md`) directly within the UI. One-click execute commands like "Implement Story (@dev)" or "Review QA (@qa)".
- **Badges (`B`) & Missions (`M`):** Quick-access to your progression stats.

---

## 👥 The Agent Squad

Your virtual office is divided into six specialized sectors. 

| Sector | Agent | Description | Key Commands |
|--------|-------|-------------|--------------|
| **Command** | 👑 Orion Prime | Chief Architect | `*status`, `*help`, `*ids check` |
| **Tech Core** | 🏛️ Aria | System Architect | `*analyze-project-structure` |
| | 💻 Dev | Full-Stack Developer | `*implement`, `*refactor`, `*debug` |
| | 🔧 DevOps | DevOps Engineer | `*deploy`, `*pipeline`, `*create-worktree` |
| | 🗄️ Dara | Data Engineer | `*schema`, `*migrate` |
| | ✅ QA | Quality Assurance | `*test`, `*review-build` |
| **Product** | 📋 Morgan | Product Manager | `*create-prd`, `*gather-requirements` |
| | 📦 Pax | Product Owner | `*validate-story`, `*close-story` |
| | 📊 SM | Scrum Master | `*draft`, `*sprint` |
| | 🔍 Analyst | Business Analyst | `*research`, `*analyze` |
| **Creative** | 🎨 Uma | UX Design Expert | `*design`, `*prototype` |
| | ✍️ Versa | Copywriter | `*write-landing-copy`, `*rewrite` |
| **Strategic**| 🎯 Stratton | Digital Strategist | `*create-growth-strategy` |
| **Security** | 🔓 Cipher | Security Operator | `*threat-model`, `*security-audit` |

---

## 🛠️ Technology Stack

- **Graphics & Rendering:** Phaser 3 (Isometric 3D rendering, particle systems, tweens)
- **UI & Interfaces:** React 18, Tailwind CSS, Zustand (State Management)
- **Backend API:** Fastify, TypeScript
- **Build System:** Vite
- **Architecture:** Descoupled EventBus communication bridge between Phaser game engine and React DOM.

---

## 📁 Project Structure

```
Aiox_2quip
├── .aiox-core/         # Core AI rules and memory protocols
├── bin/                # Legacy CLI executables
├── docs/               # Architecture docs & user stories
└── packages/
    └── metaverse/      # 👑 2quip Metaverse Workspace
        ├── src/
        │   ├── bridge/ # EventBus & Gamification Zustand stores
        │   ├── game/   # Phaser 3 ISO Engine & NPCs
        │   ├── ui/     # React 18 Glassmorphism Interface
        │   └── shared/ # Shared Types & Gamification Logic
        ├── server/     # Fastify API (State & Story Management)
        └── public/     # Game assets and sprites
```

---

## 🔮 Roadmap
- **Phase 1: Foundation (Completed)** — Isometric rendering, UI overhaul, base communication.
- **Phase 2: Independence (Completed)** — Complete Gamification, CLI decoupling (Palette, Panels), Stories Reader.
- **Phase 3: Intelligence (Upcoming)** — Real-time execution streams, AI reasoning animations, dynamic code injections visible on screens.

---
*Powered by the 2quip Intelligence Architecture.*
