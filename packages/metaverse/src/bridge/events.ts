export type EventMap = {
  // Phaser → React
  'agent:click': { agentId: string; screenX: number; screenY: number };
  'agent:hover': { agentId: string | null };
  'player:move': { col: number; row: number; sector: string };
  'player:arrived': { col: number; row: number };
  'tile:click': { col: number; row: number; sector: string };

  // React → Phaser
  'chat:send': { message: string; target?: string };
  'chat:bubble': { agentId: string; text: string; duration?: number };
  'camera:focus': { col: number; row: number };
  'camera:follow': { entityId: string };

  // Both → Backend
  'command:execute': { command: string; agentContext?: string };
  'command:response': { output: string; agentId: string; success: boolean };

  // Backend → Both
  'state:updated': { agents: import('../shared/types').AgentState[] };
};
