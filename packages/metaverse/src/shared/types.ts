export interface AgentState {
  id: string;
  name: string;
  icon: string;
  title: string;
  sector: string;
  status: 'idle' | 'working' | 'error' | 'offline';
  currentTask: string | null;
  desk: { col: number; row: number };
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderIcon: string;
  senderColor: string;
  content: string;
  timestamp: Date;
  type: 'user' | 'agent' | 'system';
  agentContext?: string;
}

export interface SectorInfo {
  id: string;
  name: string;
  color: string;
  bounds: { fromCol: number; toCol: number; fromRow: number; toRow: number };
}

export interface SessionState {
  activeAgent: string;
  timestamp: string;
  agents: Record<string, {
    status: 'idle' | 'working' | 'error' | 'offline';
    currentTask: string | null;
    lastCommand: string | null;
    lastOutput: string | null;
  }>;
  recentCommands: Array<{
    command: string;
    agentId: string;
    timestamp: string;
    success: boolean;
  }>;
}
