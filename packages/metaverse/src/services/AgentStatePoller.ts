import { aioxClient } from './AIOXClient';
import { eventBus } from '../bridge/EventBus';
import { useMetaverseStore } from '../bridge/store';
import { AGENT_DESKS } from '../game/map/SectorManager';
import { GAME_CONFIG } from '../game/config';
import type { AgentState } from '../shared/types';

export class AgentStatePoller {
  private interval: ReturnType<typeof setInterval> | null = null;
  private running = false;

  start(): void {
    if (this.running) return;
    this.running = true;

    this.poll(); // Initial poll
    this.interval = setInterval(() => this.poll(), GAME_CONFIG.POLL_INTERVAL);
  }

  stop(): void {
    this.running = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private async poll(): Promise<void> {
    try {
      const state = await aioxClient.getState();
      const store = useMetaverseStore.getState();

      const agents: AgentState[] = AGENT_DESKS.map((desk) => {
        const agentState = state.agents[desk.id];
        return {
          id: desk.id,
          name: desk.name,
          icon: desk.icon,
          title: '',
          sector: desk.sector,
          status: agentState?.status || 'idle',
          currentTask: agentState?.currentTask || null,
          desk: { col: desk.col, row: desk.row },
        };
      });

      store.setAgents(agents);
      store.setBackendConnected(true);
      eventBus.emit('state:updated', { agents });
    } catch {
      useMetaverseStore.getState().setBackendConnected(false);
    }
  }
}

export const agentStatePoller = new AgentStatePoller();
