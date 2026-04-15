import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from '../game/GameBootstrap';
import { ChatConsole } from './components/ChatConsole/ChatConsole';
import { StatusHUD } from './components/StatusHUD/StatusHUD';
import { AgentContextMenu } from './components/AgentContextMenu/AgentContextMenu';
import { DirectChat } from './components/DirectChat/DirectChat';
import { Minimap } from './components/Minimap/Minimap';
import { eventBus } from '../bridge/EventBus';
import { useMetaverseStore } from '../bridge/store';
import { agentStatePoller } from '../services/AgentStatePoller';
import { commandExecutor } from '../services/CommandExecutor';
import './App.css';

export function App() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [gameReady, setGameReady] = useState(false);
  const showContextMenu = useMetaverseStore((s) => s.showContextMenu);

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

    return () => {
      unsubClick();
      agentStatePoller.stop();
      commandExecutor.stop();
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
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
          <StatusHUD />
          <Minimap />
          <ChatConsole />
          <AgentContextMenu />
          <DirectChat />
        </div>
      )}
    </div>
  );
}
