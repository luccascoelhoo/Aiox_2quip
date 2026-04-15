import { GAME_CONFIG } from '../game/config';

interface StateResponse {
  activeAgent: string;
  timestamp: string;
  agents: Record<string, {
    status: 'idle' | 'working' | 'error' | 'offline';
    currentTask: string | null;
    lastCommand: string | null;
    lastOutput: string | null;
  }>;
}

interface CommandResponse {
  success: boolean;
  output: string;
  agentId: string;
}

interface AgentManifest {
  id: string;
  name: string;
  icon: string;
  title: string;
  sector: string;
  desk: { col: number; row: number };
  commands: string[];
}

interface StoryOverview {
  id: string;
  title: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  criteriaCount: number;
  doneCount: number;
}

interface StoryDetail extends StoryOverview {
  content: string;
  criteria: Array<{ text: string; done: boolean }>;
}

export class AIOXClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = GAME_CONFIG.API_BASE;
  }

  async getState(): Promise<StateResponse> {
    const res = await fetch(`${this.baseUrl}/api/state`);
    if (!res.ok) throw new Error(`State fetch failed: ${res.status}`);
    return res.json();
  }

  async getAgents(): Promise<{ agents: AgentManifest[] }> {
    const res = await fetch(`${this.baseUrl}/api/agents`);
    if (!res.ok) throw new Error(`Agents fetch failed: ${res.status}`);
    return res.json();
  }

  async getStories(): Promise<StoryOverview[]> {
    const response = await fetch(`${this.baseUrl}/api/stories`);
    if (!response.ok) throw new Error('Failed to fetch stories from AIOX backend');
    const data = await response.json();
    return data.stories || [];
  }

  async getStoryDetail(id: string): Promise<StoryDetail> {
    const response = await fetch(`${this.baseUrl}/api/stories/${id}`);
    if (!response.ok) throw new Error('Failed to fetch story detail from AIOX backend');
    const data = await response.json();
    return data.story;
  }

  async executeCommand(command: string, agentContext?: string): Promise<CommandResponse> {
    const res = await fetch(`${this.baseUrl}/api/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command, agentContext }),
    });
    if (!res.ok) throw new Error(`Command failed: ${res.status}`);
    return res.json();
  }

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const aioxClient = new AIOXClient();
