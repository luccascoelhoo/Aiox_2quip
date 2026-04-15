import { create } from 'zustand';
import {
  type XPEvent, type XPCategory, type Badge, type Mission,
  XP_REWARDS, BADGES, DAILY_MISSIONS, WEEKLY_MISSIONS,
  getLevelForXP, getXPProgress,
} from '../shared/gamification';

// ── Persistence ────────────────────────────────────────
const STORAGE_KEY = '2quip-metaverse-gamification';

interface MissionProgress {
  [trackingKey: string]: number;
}

interface GamificationState {
  totalXP: number;
  xpHistory: XPEvent[];
  unlockedBadges: string[];
  completedMissions: string[];
  missionProgress: MissionProgress;
  lastDailyReset: string;
  lastWeeklyReset: string;

  // Stats tracking
  totalCommands: number;
  totalChats: number;
  uniqueAgentsUsed: Set<string>;
  uniqueAgentsActivated: Set<string>;
  sectorsVisited: Set<string>;
  nightCommands: number;
  recentCommandTimestamps: number[];

  // Computed
  getLevel: () => ReturnType<typeof getLevelForXP>;
  getProgress: () => ReturnType<typeof getXPProgress>;
  getActiveMissions: () => Array<Mission & { progress: number; completed: boolean }>;
  getUnlockedBadgeObjects: () => Badge[];
  getLockedBadges: () => Badge[];

  // Actions
  addXP: (category: XPCategory, reason: string, agentId?: string) => XPEvent;
  checkBadges: () => Badge[];
  checkMissions: () => Mission[];
  resetDailyMissions: () => void;
  resetWeeklyMissions: () => void;
  trackSectorVisit: (sector: string) => void;
  trackAgentChat: (agentId: string) => void;
  trackAgentActivation: (agentId: string) => void;
}

function loadState(): Partial<GamificationState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    return {
      totalXP: data.totalXP || 0,
      unlockedBadges: data.unlockedBadges || [],
      completedMissions: data.completedMissions || [],
      missionProgress: data.missionProgress || {},
      lastDailyReset: data.lastDailyReset || '',
      lastWeeklyReset: data.lastWeeklyReset || '',
      totalCommands: data.totalCommands || 0,
      totalChats: data.totalChats || 0,
      uniqueAgentsUsed: new Set(data.uniqueAgentsUsed || []),
      uniqueAgentsActivated: new Set(data.uniqueAgentsActivated || []),
      sectorsVisited: new Set(data.sectorsVisited || []),
      nightCommands: data.nightCommands || 0,
    };
  } catch {
    return {};
  }
}

function saveState(state: GamificationState): void {
  try {
    const data = {
      totalXP: state.totalXP,
      unlockedBadges: state.unlockedBadges,
      completedMissions: state.completedMissions,
      missionProgress: state.missionProgress,
      lastDailyReset: state.lastDailyReset,
      lastWeeklyReset: state.lastWeeklyReset,
      totalCommands: state.totalCommands,
      totalChats: state.totalChats,
      uniqueAgentsUsed: Array.from(state.uniqueAgentsUsed),
      uniqueAgentsActivated: Array.from(state.uniqueAgentsActivated),
      sectorsVisited: Array.from(state.sectorsVisited),
      nightCommands: state.nightCommands,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore storage errors */ }
}

function getToday(): string { return new Date().toISOString().slice(0, 10); }
function getWeek(): string {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((d.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${weekNum}`;
}

const initial = loadState();

export const useGamificationStore = create<GamificationState>((set, get) => ({
  totalXP: initial.totalXP || 0,
  xpHistory: [],
  unlockedBadges: initial.unlockedBadges || [],
  completedMissions: initial.completedMissions || [],
  missionProgress: initial.missionProgress || {},
  lastDailyReset: initial.lastDailyReset || '',
  lastWeeklyReset: initial.lastWeeklyReset || '',
  totalCommands: initial.totalCommands || 0,
  totalChats: initial.totalChats || 0,
  uniqueAgentsUsed: initial.uniqueAgentsUsed || new Set(),
  uniqueAgentsActivated: initial.uniqueAgentsActivated || new Set(),
  sectorsVisited: initial.sectorsVisited || new Set(),
  nightCommands: initial.nightCommands || 0,
  recentCommandTimestamps: [],

  getLevel: () => getLevelForXP(get().totalXP),
  getProgress: () => getXPProgress(get().totalXP),

  getActiveMissions: () => {
    const state = get();
    const today = getToday();
    const week = getWeek();
    if (state.lastDailyReset !== today) get().resetDailyMissions();
    if (state.lastWeeklyReset !== week) get().resetWeeklyMissions();

    const allMissions = [...DAILY_MISSIONS, ...WEEKLY_MISSIONS];
    return allMissions.map(m => {
      const progress = state.missionProgress[m.trackingKey] || 0;
      const completed = state.completedMissions.includes(m.id);
      return { ...m, progress, completed };
    });
  },

  getUnlockedBadgeObjects: () => {
    const ids = get().unlockedBadges;
    return BADGES.filter(b => ids.includes(b.id));
  },

  getLockedBadges: () => {
    const ids = get().unlockedBadges;
    return BADGES.filter(b => !ids.includes(b.id));
  },

  addXP: (category, reason, agentId) => {
    const amount = XP_REWARDS[category];
    const event: XPEvent = { category, amount, reason, timestamp: new Date(), agentId };

    set(s => {
      const newState = {
        totalXP: s.totalXP + amount,
        xpHistory: [...s.xpHistory.slice(-99), event],
      };

      if (category === 'command_executed') {
        const now = Date.now();
        const hour = new Date().getHours();
        const isNight = hour >= 22 || hour < 6;
        Object.assign(newState, {
          totalCommands: s.totalCommands + 1,
          nightCommands: isNight ? s.nightCommands + 1 : s.nightCommands,
          recentCommandTimestamps: [...s.recentCommandTimestamps.filter(t => now - t < 60000), now],
          missionProgress: {
            ...s.missionProgress,
            dailyCommands: (s.missionProgress.dailyCommands || 0) + 1,
            weeklyCommands: (s.missionProgress.weeklyCommands || 0) + 1,
          },
        });
      }

      if (category === 'chat_sent') {
        Object.assign(newState, {
          totalChats: s.totalChats + 1,
          missionProgress: {
            ...s.missionProgress,
            dailyChats: (s.missionProgress.dailyChats || 0) + 1,
          },
        });
      }

      return newState;
    });

    // Save after update
    setTimeout(() => saveState(get()), 0);
    return event;
  },

  checkBadges: () => {
    const state = get();
    const newBadges: Badge[] = [];
    const level = getLevelForXP(state.totalXP).level;

    const checks: Record<string, boolean> = {
      'first-command':    state.totalCommands >= 1,
      'commander-10':     state.totalCommands >= 10,
      'commander-50':     state.totalCommands >= 50,
      'agent-whisperer':  state.uniqueAgentsUsed.size >= 14,
      'full-squad':       state.uniqueAgentsActivated.size >= 14,
      'explorer':         state.sectorsVisited.size >= 6,
      'night-owl':        state.nightCommands >= 10,
      'speed-demon':      state.recentCommandTimestamps.length >= 5,
      'chat-guru':        state.totalChats >= 100,
      'level-5':          level >= 5,
      'mission-master':   state.completedMissions.length >= 10,
      'orion-heir':       level >= 9,
    };

    for (const badge of BADGES) {
      if (!state.unlockedBadges.includes(badge.id) && checks[badge.id]) {
        newBadges.push(badge);
      }
    }

    if (newBadges.length > 0) {
      set(s => ({
        unlockedBadges: [...s.unlockedBadges, ...newBadges.map(b => b.id)],
      }));
      setTimeout(() => saveState(get()), 0);
    }

    return newBadges;
  },

  checkMissions: () => {
    const state = get();
    const completed: Mission[] = [];
    const allMissions = [...DAILY_MISSIONS, ...WEEKLY_MISSIONS];

    for (const mission of allMissions) {
      if (state.completedMissions.includes(mission.id)) continue;
      const progress = state.missionProgress[mission.trackingKey] || 0;
      if (progress >= mission.target) {
        completed.push(mission);
      }
    }

    if (completed.length > 0) {
      set(s => ({
        completedMissions: [...s.completedMissions, ...completed.map(m => m.id)],
        totalXP: s.totalXP + completed.reduce((acc, m) => acc + m.xpReward, 0),
      }));
      setTimeout(() => saveState(get()), 0);
    }

    return completed;
  },

  resetDailyMissions: () => {
    set(s => ({
      lastDailyReset: getToday(),
      missionProgress: {
        ...s.missionProgress,
        dailyCommands: 0, dailyAgents: 0, dailySectors: 0, dailyChats: 0,
      },
      completedMissions: s.completedMissions.filter(id => !DAILY_MISSIONS.some(m => m.id === id)),
    }));
  },

  resetWeeklyMissions: () => {
    set(s => ({
      lastWeeklyReset: getWeek(),
      missionProgress: {
        ...s.missionProgress,
        weeklyCommands: 0, weeklyAgents: 0, weeklySectors: 0,
      },
      completedMissions: s.completedMissions.filter(id => !WEEKLY_MISSIONS.some(m => m.id === id)),
    }));
  },

  trackSectorVisit: (sector) => {
    set(s => {
      const newSet = new Set(s.sectorsVisited);
      newSet.add(sector);
      const dailySectors = new Set<string>();
      newSet.forEach(sec => dailySectors.add(sec));
      return {
        sectorsVisited: newSet,
        missionProgress: {
          ...s.missionProgress,
          dailySectors: Math.min(dailySectors.size, 6),
          weeklySectors: Math.min(newSet.size, 6),
        },
      };
    });
    setTimeout(() => saveState(get()), 0);
  },

  trackAgentChat: (agentId) => {
    set(s => {
      const newSet = new Set(s.uniqueAgentsUsed);
      newSet.add(agentId);
      return {
        uniqueAgentsUsed: newSet,
        missionProgress: {
          ...s.missionProgress,
          dailyAgents: Math.min(newSet.size, 14),
          weeklyAgents: Math.min(newSet.size, 14),
        },
      };
    });
    setTimeout(() => saveState(get()), 0);
  },

  trackAgentActivation: (agentId) => {
    set(s => {
      const newSet = new Set(s.uniqueAgentsActivated);
      newSet.add(agentId);
      return { uniqueAgentsActivated: newSet };
    });
    setTimeout(() => saveState(get()), 0);
  },
}));
