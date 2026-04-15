import type { SectorInfo } from '../../shared/types';

export const SECTORS: Record<string, SectorInfo> = {
  'tech-core': { id: 'tech-core', name: 'Tech Core', color: '#1e3a5f', bounds: { fromCol: 0, toCol: 9, fromRow: 0, toRow: 9 } },
  'product': { id: 'product', name: 'Product', color: '#2d4a22', bounds: { fromCol: 10, toCol: 19, fromRow: 0, toRow: 9 } },
  'creative': { id: 'creative', name: 'Creative', color: '#4a2d5e', bounds: { fromCol: 0, toCol: 9, fromRow: 10, toRow: 14 } },
  'strategic': { id: 'strategic', name: 'Strategic', color: '#5e4a2d', bounds: { fromCol: 10, toCol: 19, fromRow: 10, toRow: 14 } },
  'security': { id: 'security', name: 'Security', color: '#5e2d2d', bounds: { fromCol: 10, toCol: 19, fromRow: 15, toRow: 19 } },
  'command': { id: 'command', name: 'Orion Prime HQ', color: '#3d3d1a', bounds: { fromCol: 0, toCol: 9, fromRow: 15, toRow: 19 } },
};

export interface AgentDesk {
  id: string;
  name: string;
  icon: string;
  sector: string;
  col: number;
  row: number;
}

export const AGENT_DESKS: AgentDesk[] = [
  { id: 'aiox-master', name: 'Orion Prime', icon: '👑', sector: 'command', col: 4, row: 17 },
  { id: 'architect', name: 'Aria', icon: '🏛️', sector: 'tech-core', col: 2, row: 2 },
  { id: 'dev', name: 'Dev', icon: '💻', sector: 'tech-core', col: 5, row: 2 },
  { id: 'devops', name: 'DevOps', icon: '🔧', sector: 'tech-core', col: 2, row: 5 },
  { id: 'data-engineer', name: 'Dara', icon: '🗄️', sector: 'tech-core', col: 5, row: 5 },
  { id: 'qa', name: 'QA', icon: '✅', sector: 'tech-core', col: 8, row: 3 },
  { id: 'pm', name: 'Morgan', icon: '📋', sector: 'product', col: 12, row: 2 },
  { id: 'po', name: 'Pax', icon: '📦', sector: 'product', col: 15, row: 2 },
  { id: 'sm', name: 'SM', icon: '📊', sector: 'product', col: 12, row: 5 },
  { id: 'analyst', name: 'Analyst', icon: '🔍', sector: 'product', col: 15, row: 5 },
  { id: 'ux-design-expert', name: 'Uma', icon: '🎨', sector: 'creative', col: 2, row: 12 },
  { id: 'copywriter', name: 'Versa', icon: '✍️', sector: 'creative', col: 5, row: 12 },
  { id: 'strategist', name: 'Stratton', icon: '🎯', sector: 'strategic', col: 14, row: 12 },
  { id: 'hacker', name: 'Cipher', icon: '🔓', sector: 'security', col: 14, row: 17 },
];

export function getSectorForTile(col: number, row: number): SectorInfo | null {
  for (const sector of Object.values(SECTORS)) {
    const b = sector.bounds;
    if (col >= b.fromCol && col <= b.toCol && row >= b.fromRow && row <= b.toRow) {
      return sector;
    }
  }
  return null;
}
