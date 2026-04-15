interface AgentManifest {
  id: string;
  name: string;
  icon: string;
  title: string;
  sector: string;
  desk: { col: number; row: number };
  commands: string[];
}

const MANIFEST: AgentManifest[] = [
  { id: 'aiox-master', name: 'Orion Prime', icon: '👑', title: '2quip Intelligence Architecture Chief Architect', sector: 'command', desk: { col: 4, row: 17 }, commands: ['*help', '*status', '*create', '*ids check'] },
  { id: 'architect', name: 'Aria', icon: '🏛️', title: 'Holistic System Architect', sector: 'tech-core', desk: { col: 2, row: 2 }, commands: ['*create-full-stack-architecture', '*analyze-project-structure'] },
  { id: 'dev', name: 'Dev', icon: '💻', title: 'Full-Stack Developer', sector: 'tech-core', desk: { col: 5, row: 2 }, commands: ['*implement', '*refactor', '*debug'] },
  { id: 'devops', name: 'DevOps', icon: '🔧', title: 'DevOps Engineer', sector: 'tech-core', desk: { col: 2, row: 5 }, commands: ['*deploy', '*pipeline', '*monitor'] },
  { id: 'data-engineer', name: 'Dara', icon: '🗄️', title: 'Data Engineer', sector: 'tech-core', desk: { col: 5, row: 5 }, commands: ['*schema', '*migrate', '*query'] },
  { id: 'qa', name: 'QA', icon: '✅', title: 'Quality Assurance', sector: 'tech-core', desk: { col: 8, row: 3 }, commands: ['*test', '*create-suite', '*coverage'] },
  { id: 'pm', name: 'Morgan', icon: '📋', title: 'Product Manager', sector: 'product', desk: { col: 12, row: 2 }, commands: ['*create-epic', '*create-prd', '*roadmap'] },
  { id: 'po', name: 'Pax', icon: '📦', title: 'Product Owner', sector: 'product', desk: { col: 15, row: 2 }, commands: ['*backlog-review', '*validate-story', '*close-story'] },
  { id: 'sm', name: 'SM', icon: '📊', title: 'Scrum Master', sector: 'product', desk: { col: 12, row: 5 }, commands: ['*draft', '*sprint', '*retrospective'] },
  { id: 'analyst', name: 'Analyst', icon: '🔍', title: 'Business Analyst', sector: 'product', desk: { col: 15, row: 5 }, commands: ['*research', '*brainstorm', '*analyze'] },
  { id: 'ux-design-expert', name: 'Uma', icon: '🎨', title: 'UX Design Expert', sector: 'creative', desk: { col: 2, row: 12 }, commands: ['*design', '*prototype', '*usability-review'] },
  { id: 'copywriter', name: 'Versa', icon: '✍️', title: 'Intelligence Copywriter', sector: 'creative', desk: { col: 5, row: 12 }, commands: ['*write-landing-copy', '*define-brand-voice', '*rewrite'] },
  { id: 'strategist', name: 'Stratton', icon: '🎯', title: 'Digital Intelligence Strategist', sector: 'strategic', desk: { col: 14, row: 12 }, commands: ['*create-growth-strategy', '*create-funnel', '*competitive-analysis'] },
  { id: 'hacker', name: 'Cipher', icon: '🔓', title: 'Security Intelligence Operator', sector: 'security', desk: { col: 14, row: 17 }, commands: ['*threat-model', '*security-audit', '*harden'] },
];

export class AgentManifestBuilder {
  getManifest(): AgentManifest[] {
    return MANIFEST;
  }

  getAgent(id: string): AgentManifest | undefined {
    return MANIFEST.find(a => a.id === id);
  }
}
