interface AgentStatus {
  status: 'idle' | 'working' | 'error' | 'offline';
  currentTask: string | null;
  lastCommand: string | null;
  lastOutput: string | null;
}

interface SessionState {
  activeAgent: string;
  timestamp: string;
  agents: Record<string, AgentStatus>;
  recentCommands: Array<{
    command: string;
    agentId: string;
    timestamp: string;
    success: boolean;
  }>;
}

const AGENT_IDS = [
  'aiox-master', 'architect', 'dev', 'devops', 'data-engineer', 'qa',
  'pm', 'po', 'sm', 'analyst',
  'ux-design-expert', 'copywriter', 'strategist', 'hacker',
];

export class StateReader {
  private cachedState: SessionState | null = null;
  private cacheTime = 0;
  private readonly CACHE_TTL = 1000;

  getState(): SessionState {
    const now = Date.now();
    if (this.cachedState && (now - this.cacheTime) < this.CACHE_TTL) {
      return this.cachedState;
    }

    // Build default state — all agents idle
    const agents: Record<string, AgentStatus> = {};
    for (const id of AGENT_IDS) {
      agents[id] = {
        status: 'idle',
        currentTask: null,
        lastCommand: null,
        lastOutput: null,
      };
    }

    // Simulate some agents working for visual demo
    agents['dev'].status = 'working';
    agents['dev'].currentTask = 'Implementing MV-1.2 Player Movement';
    agents['architect'].status = 'working';
    agents['architect'].currentTask = 'Reviewing Architecture Document';

    this.cachedState = {
      activeAgent: 'aiox-master',
      timestamp: new Date().toISOString(),
      agents,
      recentCommands: [],
    };
    this.cacheTime = now;

    return this.cachedState;
  }
}
