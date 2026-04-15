// ── XP Event Categories ────────────────────────────────
export type XPCategory =
  | 'command_executed'
  | 'agent_activated'
  | 'mission_completed'
  | 'story_closed'
  | 'badge_unlocked'
  | 'sector_visited'
  | 'chat_sent';

export interface XPEvent {
  category: XPCategory;
  amount: number;
  reason: string;
  timestamp: Date;
  agentId?: string;
}

// ── XP Rewards ─────────────────────────────────────────
export const XP_REWARDS: Record<XPCategory, number> = {
  command_executed: 25,
  agent_activated: 50,
  mission_completed: 200,
  story_closed: 500,
  badge_unlocked: 100,
  sector_visited: 15,
  chat_sent: 5,
};

// ── Level System ───────────────────────────────────────
export interface LevelInfo {
  level: number;
  title: string;
  icon: string;
  minXP: number;
  color: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 0, title: 'Noob',        icon: '🌱', minXP: 0,     color: '#8b949e' },
  { level: 1, title: 'Apprentice',  icon: '📘', minXP: 100,   color: '#58a6ff' },
  { level: 2, title: 'Operator',    icon: '⚡', minXP: 400,   color: '#3fb950' },
  { level: 3, title: 'Commander',   icon: '🎖️', minXP: 900,   color: '#f0883e' },
  { level: 4, title: 'Architect',   icon: '🏛️', minXP: 1600,  color: '#bc8cff' },
  { level: 5, title: 'Director',    icon: '🎯', minXP: 2500,  color: '#f778ba' },
  { level: 6, title: 'Legend',      icon: '🌟', minXP: 3600,  color: '#ffd700' },
  { level: 7, title: 'Grandmaster', icon: '💎', minXP: 4900,  color: '#79c0ff' },
  { level: 8, title: 'Overlord',    icon: '🔥', minXP: 6400,  color: '#ff7b72' },
  { level: 9, title: 'Orion',       icon: '👑', minXP: 8100,  color: '#ffd700' },
];

export function getLevelForXP(totalXP: number): LevelInfo {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (totalXP >= lvl.minXP) current = lvl;
    else break;
  }
  return current;
}

export function getXPProgress(totalXP: number): { current: number; needed: number; percent: number } {
  const currentLevel = getLevelForXP(totalXP);
  const nextLevelIndex = Math.min(currentLevel.level + 1, LEVELS.length - 1);
  const nextLevel = LEVELS[nextLevelIndex];
  if (currentLevel.level === LEVELS.length - 1) {
    return { current: totalXP - currentLevel.minXP, needed: 1, percent: 100 };
  }
  const current = totalXP - currentLevel.minXP;
  const needed = nextLevel.minXP - currentLevel.minXP;
  return { current, needed, percent: Math.min(100, Math.round((current / needed) * 100)) };
}

// ── Badges ─────────────────────────────────────────────
export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  condition: string;
  category: 'exploration' | 'mastery' | 'social' | 'special';
  color: string;
}

export const BADGES: Badge[] = [
  { id: 'first-command',    name: 'First Steps',        icon: '🚀', description: 'Execute your first command',                     condition: 'commands >= 1',      category: 'exploration', color: '#58a6ff' },
  { id: 'commander-10',     name: 'Commander',           icon: '⚡', description: 'Execute 10 commands',                            condition: 'commands >= 10',     category: 'mastery',     color: '#f0883e' },
  { id: 'commander-50',     name: 'Veteran Operator',    icon: '🎖️', description: 'Execute 50 commands',                            condition: 'commands >= 50',     category: 'mastery',     color: '#bc8cff' },
  { id: 'agent-whisperer',  name: 'Agent Whisperer',     icon: '🤝', description: 'Chat with all 14 agents',                       condition: 'uniqueAgents >= 14', category: 'social',      color: '#3fb950' },
  { id: 'full-squad',       name: 'Full Squad',          icon: '👥', description: 'Activate every agent at least once',             condition: 'activatedAgents >= 14', category: 'mastery', color: '#ffd700' },
  { id: 'explorer',         name: 'Explorer',            icon: '🗺️', description: 'Visit all 6 office sectors',                     condition: 'sectorsVisited >= 6',   category: 'exploration', color: '#79c0ff' },
  { id: 'night-owl',        name: 'Night Owl',           icon: '🦉', description: 'Execute 10 commands after 22:00',                condition: 'nightCommands >= 10',   category: 'special',     color: '#8b5cf6' },
  { id: 'speed-demon',      name: 'Speed Demon',         icon: '💨', description: 'Execute 5 commands in under 1 minute',           condition: 'fastCommands >= 5',     category: 'special',     color: '#f85149' },
  { id: 'chat-guru',        name: 'Chat Guru',           icon: '💬', description: 'Send 100 chat messages',                         condition: 'chatsSent >= 100',      category: 'social',      color: '#f778ba' },
  { id: 'level-5',          name: 'Rising Star',         icon: '⭐', description: 'Reach level 5 (Director)',                       condition: 'level >= 5',            category: 'mastery',     color: '#ffd700' },
  { id: 'mission-master',   name: 'Mission Master',      icon: '🏆', description: 'Complete 10 missions',                           condition: 'missionsCompleted >= 10', category: 'mastery', color: '#ffd700' },
  { id: 'orion-heir',       name: 'Heir of Orion',       icon: '👑', description: 'Reach max level (Orion)',                        condition: 'level >= 9',            category: 'special',     color: '#ffd700' },
];

// ── Missions ───────────────────────────────────────────
export interface Mission {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'daily' | 'weekly';
  target: number;
  xpReward: number;
  trackingKey: string;
}

export const DAILY_MISSIONS: Mission[] = [
  { id: 'daily-commands-5',    name: 'Command Runner',    description: 'Execute 5 commands',              icon: '⚡', type: 'daily',  target: 5,  xpReward: 150,  trackingKey: 'dailyCommands' },
  { id: 'daily-agents-3',     name: 'Agent Rotation',    description: 'Interact with 3 different agents', icon: '🔄', type: 'daily',  target: 3,  xpReward: 100,  trackingKey: 'dailyAgents' },
  { id: 'daily-sectors-3',    name: 'Office Patrol',     description: 'Visit 3 different sectors',        icon: '🗺️', type: 'daily',  target: 3,  xpReward: 75,   trackingKey: 'dailySectors' },
  { id: 'daily-chat-10',      name: 'Chatterbox',        description: 'Send 10 chat messages',            icon: '💬', type: 'daily',  target: 10, xpReward: 50,   trackingKey: 'dailyChats' },
];

export const WEEKLY_MISSIONS: Mission[] = [
  { id: 'weekly-commands-25',  name: 'Power User',        description: 'Execute 25 commands this week',    icon: '🔥', type: 'weekly', target: 25, xpReward: 500,  trackingKey: 'weeklyCommands' },
  { id: 'weekly-all-agents',   name: 'Full Roster',       description: 'Use all 14 agents this week',      icon: '👥', type: 'weekly', target: 14, xpReward: 400,  trackingKey: 'weeklyAgents' },
  { id: 'weekly-all-sectors',  name: 'Grand Tour',        description: 'Visit all 6 sectors this week',    icon: '🏢', type: 'weekly', target: 6,  xpReward: 300,  trackingKey: 'weeklySectors' },
];
