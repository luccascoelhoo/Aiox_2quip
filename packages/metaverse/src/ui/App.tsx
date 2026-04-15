import { useEffect, useRef, useState, useCallback } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from '../game/GameBootstrap';
import { ChatConsole } from './components/ChatConsole/ChatConsole';
import { StatusHUD } from './components/StatusHUD/StatusHUD';
import { AgentContextMenu } from './components/AgentContextMenu/AgentContextMenu';
import { DirectChat } from './components/DirectChat/DirectChat';
import { Minimap } from './components/Minimap/Minimap';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { AgentPanel } from './components/AgentPanel/AgentPanel';
import { BadgePanel } from './components/BadgePanel/BadgePanel';
import { MissionBoard } from './components/MissionBoard/MissionBoard';
import { TaskManager } from './components/TaskManager/TaskManager';
import { XPToast, pushXPToast, pushBadgeToast, pushMissionToast, pushLevelUpToast } from './components/XPToast/XPToast';
import { eventBus } from '../bridge/EventBus';
import { useMetaverseStore } from '../bridge/store';
import { useGamificationStore } from '../bridge/gamificationStore';
import { agentStatePoller } from '../services/AgentStatePoller';
import { commandExecutor } from '../services/CommandExecutor';
import { getLevelForXP } from '../shared/gamification';
import './App.css';

export function App() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [gameReady, setGameReady] = useState(false);
  const showContextMenu = useMetaverseStore((s) => s.showContextMenu);

  // Panel states
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [agentPanelOpen, setAgentPanelOpen] = useState(false);
  const [badgePanelOpen, setBadgePanelOpen] = useState(false);
  const [missionBoardOpen, setMissionBoardOpen] = useState(false);
  const [taskManagerOpen, setTaskManagerOpen] = useState(false);

  const gamificationStore = useGamificationStore;

  // Gamification hooks
  const handleCommandResponse = useCallback(() => {
    const store = gamificationStore.getState();
    const prevLevel = getLevelForXP(store.totalXP).level;

    const event = store.addXP('command_executed', 'Command executed');
    pushXPToast(event);

    // Check for level up
    const newLevel = getLevelForXP(gamificationStore.getState().totalXP);
    if (newLevel.level > prevLevel) {
      pushLevelUpToast(newLevel.title, newLevel.icon);
    }

    // Check badges
    const newBadges = store.checkBadges();
    for (const badge of newBadges) {
      pushBadgeToast(badge);
      store.addXP('badge_unlocked', `Badge: ${badge.name}`);
    }

    // Check missions
    const completedMissions = store.checkMissions();
    for (const mission of completedMissions) {
      pushMissionToast(mission);
    }
  }, []);

  const handleSectorVisit = useCallback((sector: string) => {
    const store = gamificationStore.getState();
    store.trackSectorVisit(sector);
    store.addXP('sector_visited', `Visited ${sector}`);
    store.checkBadges();
  }, []);

  useEffect(() => {
    if (gameRef.current) return;

    const config = createGameConfig('game-container');
    gameRef.current = new Phaser.Game(config);

    setTimeout(() => setGameReady(true), 500);

    // Start backend services
    agentStatePoller.start();
    commandExecutor.start();

    // Listen for agent clicks from Phaser
    const unsubClick = eventBus.on('agent:click', (data) => {
      showContextMenu(data.agentId, data.screenX, data.screenY);
    });

    // Track command responses for gamification
    const unsubResponse = eventBus.on('command:response', () => {
      handleCommandResponse();
    });

    // Track sector visits
    const unsubMove = eventBus.on('player:move', (data) => {
      handleSectorVisit(data.sector);
    });

    return () => {
      unsubClick();
      unsubResponse();
      unsubMove();
      agentStatePoller.stop();
      commandExecutor.stop();
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(v => !v);
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'tab':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            setAgentPanelOpen(v => !v);
          }
          break;
        case 'b':
          setBadgePanelOpen(v => !v);
          break;
        case 'm':
          setMissionBoardOpen(v => !v);
          break;
        case 't':
          if (!e.ctrlKey && !e.metaKey) {
             setTaskManagerOpen(v => !v);
          }
          break;
        case 'escape':
          setPaletteOpen(false);
          setAgentPanelOpen(false);
          setBadgePanelOpen(false);
          setMissionBoardOpen(false);
          setTaskManagerOpen(false);
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Phaser Canvas */}
      <div
        id="game-container"
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      />

      {/* React UI Overlay */}
      {gameReady && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 100,
          }}
        >
          <StatusHUD
            onOpenBadges={() => setBadgePanelOpen(true)}
            onOpenMissions={() => setMissionBoardOpen(true)}
          />
          <Minimap />
          <ChatConsole />
          <AgentContextMenu />
          <DirectChat />
          <XPToast />

          {/* Keyboard shortcut hints */}
          <div style={{
            position: 'fixed',
            bottom: 270,
            right: 14,
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}>
            <ShortcutButton icon="⚡" label="Commands" shortcut="Ctrl+K" onClick={() => setPaletteOpen(true)} />
            <ShortcutButton icon="🤖" label="Agents" shortcut="Tab" onClick={() => setAgentPanelOpen(true)} />
            <ShortcutButton icon="📋" label="Tasks" shortcut="T" onClick={() => setTaskManagerOpen(true)} />
          </div>

          {/* Modals / Overlays */}
          <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
          <AgentPanel open={agentPanelOpen} onClose={() => setAgentPanelOpen(false)} />
          <BadgePanel open={badgePanelOpen} onClose={() => setBadgePanelOpen(false)} />
          <MissionBoard open={missionBoardOpen} onClose={() => setMissionBoardOpen(false)} />
          <TaskManager open={taskManagerOpen} onClose={() => setTaskManagerOpen(false)} />
        </div>
      )}
    </div>
  );
}

function ShortcutButton({ icon, label, shortcut, onClick }: {
  icon: string;
  label: string;
  shortcut: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="glass hive-btn"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        fontSize: 10,
        borderRadius: 8,
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
      <kbd style={{
        fontSize: 8,
        padding: '1px 5px',
        borderRadius: 3,
        background: 'rgba(48, 54, 61, 0.5)',
        color: '#8b949e',
        border: '1px solid rgba(48, 54, 61, 0.3)',
      }}>{shortcut}</kbd>
    </button>
  );
}
