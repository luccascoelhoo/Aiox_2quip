import { useGamificationStore } from '../../../bridge/gamificationStore';

export function MissionBoard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const getActiveMissions = useGamificationStore(s => s.getActiveMissions);

  if (!open) return null;

  const missions = getActiveMissions();
  const daily = missions.filter(m => m.type === 'daily');
  const weekly = missions.filter(m => m.type === 'weekly');

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 400 }} />
      <div className="glass-elevated fade-in" style={{
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 460,
        maxHeight: '75vh',
        zIndex: 401,
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderTop: '2px solid rgba(63, 185, 80, 0.3)',
      }}>
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(48, 54, 61, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🎯</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#3fb950' }}>Missions</div>
              <div style={{ fontSize: 10, color: '#8b949e' }}>
                {missions.filter(m => m.completed).length}/{missions.length} completed
              </div>
            </div>
          </div>
          <button onClick={onClose} className="hive-btn" style={{ fontSize: 14, padding: '4px 10px' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {/* Daily */}
          <MissionSection title="Daily Missions" icon="📅" missions={daily} />
          {/* Weekly */}
          <MissionSection title="Weekly Missions" icon="📆" missions={weekly} />
        </div>
      </div>
    </>
  );
}

function MissionSection({ title, icon, missions }: {
  title: string;
  icon: string;
  missions: Array<{ id: string; name: string; description: string; icon: string; target: number; xpReward: number; progress: number; completed: boolean }>;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        color: '#8b949e',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 10,
      }}>
        {icon} {title}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {missions.map(m => {
          const percent = Math.min(100, Math.round((m.progress / m.target) * 100));
          return (
            <div key={m.id} className="glass" style={{
              padding: '12px 16px',
              borderRadius: 10,
              opacity: m.completed ? 0.6 : 1,
              borderLeft: m.completed ? '3px solid #3fb950' : '3px solid rgba(48, 54, 61, 0.4)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14 }}>{m.icon}</span>
                  <div>
                    <div style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: m.completed ? '#3fb950' : '#e6edf3',
                      textDecoration: m.completed ? 'line-through' : 'none',
                    }}>{m.name}</div>
                    <div style={{ fontSize: 9, color: '#8b949e' }}>{m.description}</div>
                  </div>
                </div>
                <span style={{
                  fontSize: 10,
                  color: '#ffd700',
                  fontWeight: 600,
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  +{m.xpReward} XP
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: 'rgba(48, 54, 61, 0.5)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${percent}%`,
                    borderRadius: 2,
                    background: m.completed ? '#3fb950' : 'linear-gradient(90deg, #58a6ff, #3fb950)',
                    transition: 'width 0.3s ease-out',
                  }} />
                </div>
                <span style={{
                  fontSize: 9,
                  color: m.completed ? '#3fb950' : '#8b949e',
                  fontFamily: 'JetBrains Mono, monospace',
                  minWidth: 40,
                  textAlign: 'right',
                }}>
                  {m.completed ? '✓' : `${m.progress}/${m.target}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
