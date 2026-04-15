import { create } from 'zustand';
import type { AgentState, ChatMessage } from '../shared/types';

interface MetaverseStore {
  playerPosition: { col: number; row: number };
  playerSector: string;
  setPlayerPosition: (col: number, row: number, sector: string) => void;

  agents: AgentState[];
  setAgents: (agents: AgentState[]) => void;
  getAgent: (id: string) => AgentState | undefined;

  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  activeChatAgent: string | null;
  setActiveChatAgent: (id: string | null) => void;

  contextMenu: { visible: boolean; agentId: string; x: number; y: number } | null;
  showContextMenu: (agentId: string, x: number, y: number) => void;
  hideContextMenu: () => void;

  backendConnected: boolean;
  setBackendConnected: (connected: boolean) => void;
}

export const useMetaverseStore = create<MetaverseStore>((set, get) => ({
  playerPosition: { col: 10, row: 10 },
  playerSector: 'tech-core',
  setPlayerPosition: (col, row, sector) =>
    set({ playerPosition: { col, row }, playerSector: sector }),

  agents: [],
  setAgents: (agents) => set({ agents }),
  getAgent: (id) => get().agents.find((a) => a.id === id),

  chatMessages: [],
  addChatMessage: (msg) =>
    set((state) => ({
      chatMessages: [...state.chatMessages.slice(-499), msg],
    })),
  activeChatAgent: null,
  setActiveChatAgent: (id) => set({ activeChatAgent: id }),

  contextMenu: null,
  showContextMenu: (agentId, x, y) =>
    set({ contextMenu: { visible: true, agentId, x, y } }),
  hideContextMenu: () => set({ contextMenu: null }),

  backendConnected: false,
  setBackendConnected: (connected) => set({ backendConnected: connected }),
}));
