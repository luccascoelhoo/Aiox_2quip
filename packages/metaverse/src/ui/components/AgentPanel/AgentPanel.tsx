import { useMetaverseStore } from '../../../bridge/store';
import { SQUAD_COLORS } from '../../../shared/constants';
import { AGENT_DESKS } from '../../../game/map/SectorManager';
import { eventBus } from '../../../bridge/EventBus';

const SECTORS_ORDER = ['command', 'tech-core', 'product', 'creative', 'strategic', 'security'];

export function AgentPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const agents = useMetaverseStore(s => s.agents);
  const setActiveChatAgent = useMetaverseStore(s => s.setActiveChatAgent);

  if (!open) return null;

  const grouped = SECTORS_ORDER.map(sectorId => ({
    sectorId,
    sectorName: sectorId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    color: SQUAD_COLORS[sectorId] || '#c9d1d9',
    agents: AGENT_DESKS.filter(a => a.sector === sectorId).map(desk => {
      const state = agents.find(a => a.id === desk.id);
      return { ...desk, status: state?.status || 'idle', currentTask: state?.currentTask || null };
    }),
  })).filter(g => g.agents.length > 0);

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 400 }} />
      <div className="glass-elevated fade-in" style={{
        position: 'fixed',
        top: '5%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 700,
        maxHeight: '85vh',
        zIndex: 401,
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderTop: '2px solid rgba(88, 166, 255, 0.3)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(48, 54, 61, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🤖</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#e6edf3' }}>Agent Squad</div>
              <div style={{ fontSize: 10, color: '#8b949e' }}>{agents.length} agents • {agents.filter(a => a.status === 'working').length} working</div>
            </div>
          </div>
          <button onClick={onClose} className="hive-btn" style={{ fontSize: 14, padding: '4px 10px' }}>✕</button>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 16px' }}>
          {grouped.map(group => (
            <div key={group.sectorId} style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                color: group.color,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginBottom: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <span style={{ width: 12, height: 2, background: group.color, borderRadius: 1, display: 'inline-block' }} />
                {group.sectorName}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                {group.agents.map(agent => {
                  const statusColors: Record<string, string> = { idle: '#3fb950', working: '#f0883e', error: '#f85149', offline: '#484f58' };
                  const statusColor = statusColors[agent.status] || '#3fb950';
                  return (
                    <div key={agent.id} className="glass" style={{
                      padding: '10px 14px',
                      borderRadius: 10,
                      cursor: 'pointer',
                      borderLeft: `3px solid ${group.color}60`,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderLeftColor = group.color; e.currentTarget.style.transform = 'translateX(2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderLeftColor = group.color + '60'; e.currentTarget.style.transform = 'none'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 16 }}>{agent.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#e6edf3' }}>{agent.name}</div>
                          <div style={{ fontSize: 9, color: '#8b949e', fontFamily: 'JetBrains Mono, monospace' }}>@{agent.id}</div>
                        </div>
                        <span className={agent.status === 'working' ? 'status-pulse' : ''} style={{
                          width: 7, height: 7, borderRadius: '50%',
                          background: statusColor,
                          boxShadow: `0 0 6px ${statusColor}`,
                        }} />
                      </div>

                      {agent.currentTask && (
                        <div style={{ fontSize: 9, color: '#f0883e', marginBottom: 6, fontStyle: 'italic' }}>
                          📋 {agent.currentTask}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveChatAgent(agent.id); onClose(); }}
                          className="hive-btn"
                          style={{ fontSize: 9, padding: '3px 8px' }}
                        >💬 Chat</button>
                        <button
                          onClick={(e) => { e.stopPropagation(); eventBus.emit('camera:focus', { col: agent.col, row: agent.row }); onClose(); }}
                          className="hive-btn"
                          style={{ fontSize: 9, padding: '3px 8px' }}
                        >🎯 Focus</button>
                        <button
                          onClick={(e) => { e.stopPropagation(); eventBus.emit('command:execute', { command: '*help', agentContext: agent.id }); }}
                          className="hive-btn"
                          style={{ fontSize: 9, padding: '3px 8px' }}
                        >⚡ Help</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
