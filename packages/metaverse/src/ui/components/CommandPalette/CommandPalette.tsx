import { useState, useRef, useEffect, useMemo } from 'react';
import { eventBus } from '../../../bridge/EventBus';
import { AGENT_DESKS } from '../../../game/map/SectorManager';
import { SQUAD_COLORS } from '../../../shared/constants';

interface CommandDef {
  command: string;
  agentId: string;
  agentName: string;
  agentIcon: string;
  sector: string;
}

const ALL_COMMANDS: CommandDef[] = AGENT_DESKS.flatMap(agent => {
  const manifest = getAgentCommands(agent.id);
  return manifest.map(cmd => ({
    command: cmd,
    agentId: agent.id,
    agentName: agent.name,
    agentIcon: agent.icon,
    sector: agent.sector,
  }));
});

function getAgentCommands(agentId: string): string[] {
  const MAP: Record<string, string[]> = {
    'aiox-master': ['*help', '*status', '*create', '*ids check', '*ids stats', '*ids health'],
    'architect': ['*create-full-stack-architecture', '*analyze-project-structure'],
    'dev': ['*implement', '*refactor', '*debug', '*execute-subtask'],
    'devops': ['*deploy', '*pipeline', '*monitor', '*create-worktree'],
    'data-engineer': ['*schema', '*migrate', '*query'],
    'qa': ['*test', '*create-suite', '*coverage', '*review-build', '*critique-spec'],
    'pm': ['*create-epic', '*create-prd', '*roadmap', '*gather-requirements', '*write-spec'],
    'po': ['*backlog-review', '*validate-story', '*close-story'],
    'sm': ['*draft', '*sprint', '*retrospective'],
    'analyst': ['*research', '*brainstorm', '*analyze', '*extract-patterns'],
    'ux-design-expert': ['*design', '*prototype', '*usability-review'],
    'copywriter': ['*write-landing-copy', '*define-brand-voice', '*rewrite'],
    'strategist': ['*create-growth-strategy', '*create-funnel', '*competitive-analysis'],
    'hacker': ['*threat-model', '*security-audit', '*harden'],
  };
  return MAP[agentId] || [];
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!search) return ALL_COMMANDS.slice(0, 20);
    const q = search.toLowerCase();
    return ALL_COMMANDS.filter(c =>
      c.command.toLowerCase().includes(q) ||
      c.agentName.toLowerCase().includes(q) ||
      c.agentId.toLowerCase().includes(q) ||
      c.sector.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [search]);

  const execute = (cmd: CommandDef) => {
    eventBus.emit('command:execute', { command: cmd.command, agentContext: cmd.agentId });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && filtered[selectedIndex]) { execute(filtered[selectedIndex]); }
  };

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 500 }} />
      <div className="glass-elevated fade-in" style={{
        position: 'fixed',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 520,
        maxHeight: '60vh',
        zIndex: 501,
        borderRadius: 16,
        overflow: 'hidden',
        borderTop: '2px solid rgba(255, 215, 0, 0.3)',
      }}>
        {/* Search input */}
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid rgba(48, 54, 61, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{ color: '#ffd700', fontSize: 14 }}>⚡</span>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, agents..."
            className="hive-input"
            style={{ border: 'none', background: 'transparent', padding: '4px 0', fontSize: 14 }}
          />
          <kbd style={{
            fontSize: 9,
            padding: '2px 6px',
            borderRadius: 4,
            background: 'rgba(48, 54, 61, 0.5)',
            color: '#8b949e',
            border: '1px solid rgba(48, 54, 61, 0.5)',
          }}>ESC</kbd>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 360, overflowY: 'auto', padding: '6px 0' }}>
          {filtered.length === 0 && (
            <div style={{ padding: 20, textAlign: 'center', color: '#484f58', fontSize: 12 }}>
              No commands found
            </div>
          )}
          {filtered.map((cmd, i) => {
            const color = SQUAD_COLORS[cmd.sector] || '#c9d1d9';
            return (
              <button
                key={`${cmd.agentId}-${cmd.command}`}
                onClick={() => execute(cmd)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '10px 18px',
                  background: i === selectedIndex ? 'rgba(255, 215, 0, 0.06)' : 'transparent',
                  border: 'none',
                  color: '#e6edf3',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'left',
                  transition: 'background 0.1s',
                  borderLeft: i === selectedIndex ? `2px solid ${color}` : '2px solid transparent',
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <span style={{ fontSize: 14, width: 22, textAlign: 'center' }}>{cmd.agentIcon}</span>
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 600,
                    color: '#ffd700',
                    fontSize: 12,
                  }}>{cmd.command}</span>
                  <span style={{
                    fontSize: 10,
                    color: '#8b949e',
                    marginLeft: 10,
                  }}>@{cmd.agentId}</span>
                </div>
                <span style={{
                  fontSize: 8,
                  color,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: `${color}15`,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>{cmd.sector}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 18px',
          borderTop: '1px solid rgba(48, 54, 61, 0.3)',
          display: 'flex',
          gap: 16,
          fontSize: 9,
          color: '#484f58',
        }}>
          <span>↑↓ Navigate</span>
          <span>⏎ Execute</span>
          <span>ESC Close</span>
          <span style={{ marginLeft: 'auto' }}>{ALL_COMMANDS.length} commands available</span>
        </div>
      </div>
    </>
  );
}
