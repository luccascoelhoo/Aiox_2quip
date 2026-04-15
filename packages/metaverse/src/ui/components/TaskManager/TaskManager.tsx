import { useState, useEffect } from 'react';
import { aioxClient } from '../../../services/AIOXClient';
import { eventBus } from '../../../bridge/EventBus';

export function TaskManager({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [stories, setStories] = useState<any[]>([]);
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadStories();
    }
  }, [open]);

  const loadStories = async () => {
    setLoading(true);
    try {
      const data = await aioxClient.getStories();
      setStories(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const loadStoryDetail = async (id: string) => {
    setLoading(true);
    try {
      const data = await aioxClient.getStoryDetail(id);
      setSelectedStory(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const execCommand = (cmd: string, agent: string) => {
    eventBus.emit('command:execute', { command: cmd, agentContext: agent });
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 450 }} />
      <div className="glass-elevated fade-in" style={{
        position: 'fixed',
        top: '8%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 800,
        height: '80vh',
        zIndex: 451,
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        borderTop: '2px solid rgba(188, 140, 255, 0.4)',
      }}>
        {/* Sidebar: Story List */}
        <div style={{
          width: 300,
          background: 'rgba(13, 17, 23, 0.7)',
          borderRight: '1px solid rgba(48, 54, 61, 0.4)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid rgba(48, 54, 61, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>📋</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#e6edf3' }}>Active Stories</span>
            </div>
            <button onClick={loadStories} className="hive-btn" style={{ padding: '4px' }}>🔄</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
            {loading && !selectedStory && <div style={{ color: '#8b949e', fontSize: 12, textAlign: 'center', margin: 20 }}>Loading...</div>}
            {stories.map(s => {
              const colors = { PENDING: '#8b949e', IN_PROGRESS: '#f0883e', DONE: '#3fb950' };
              const color = colors[s.status as keyof typeof colors];
              const isSelected = selectedStory?.id === s.id;
              return (
                <div key={s.id} onClick={() => loadStoryDetail(s.id)} style={{
                  padding: '12px',
                  borderRadius: 8,
                  marginBottom: 8,
                  background: isSelected ? 'rgba(188, 140, 255, 0.1)' : 'rgba(48, 54, 61, 0.3)',
                  borderLeft: `3px solid ${color}`,
                  cursor: 'pointer',
                  border: isSelected ? '1px solid rgba(188, 140, 255, 0.3)' : '1px solid transparent',
                  borderLeftColor: color,
                }}>
                  <div style={{ fontSize: 10, color, fontWeight: 700, marginBottom: 4 }}>{s.status}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#e6edf3', marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontSize: 9, color: '#8b949e' }}>
                    Criteria: {s.doneCount}/{s.criteriaCount}
                    <div style={{ height: 3, background: 'rgba(48,54,61,0.5)', marginTop: 4, borderRadius: 1 }}>
                      <div style={{ height: '100%', width: `${s.criteriaCount ? (s.doneCount/s.criteriaCount)*100 : 0}%`, background: color, borderRadius: 1 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: 12, borderTop: '1px solid rgba(48, 54, 61, 0.4)' }}>
            <button onClick={() => execCommand('*draft', 'sm')} className="hive-btn" style={{ width: '100%', padding: '8px' }}>
              + Draft New Story (@sm)
            </button>
          </div>
        </div>

        {/* Main Content: Story Detail */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(5, 5, 16, 0.8)' }}>
          {selectedStory ? (
            <>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(48, 54, 61, 0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                   <div style={{ fontSize: 10, color: '#8b949e', marginBottom: 8, fontFamily: 'JetBrains Mono, monospace' }}>{selectedStory.id}.md</div>
                   <h2 style={{ fontSize: 20, margin: 0, color: '#e6edf3' }}>{selectedStory.title}</h2>
                </div>
                <button onClick={onClose} className="hive-btn" style={{ padding: '4px 8px' }}>✕</button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                <h3 style={{ fontSize: 12, textTransform: 'uppercase', color: '#8b949e', letterSpacing: 1, marginBottom: 16 }}>Acceptance Criteria</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 30 }}>
                  {selectedStory.criteria?.map((c: any, i: number) => (
                    <div key={i} className="glass" style={{
                      padding: '12px',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      opacity: c.done ? 0.6 : 1,
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: 4,
                        border: `1px solid ${c.done ? '#3fb950' : '#8b949e'}`,
                        background: c.done ? '#3fb95040' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#3fb950', fontSize: 12,
                        flexShrink: 0, marginTop: 2,
                      }}>{c.done ? '✓' : ''}</div>
                      <div style={{ fontSize: 13, color: c.done ? '#8b949e' : '#e6edf3', textDecoration: c.done ? 'line-through' : 'none', lineHeight: 1.5 }}>
                        {c.text}
                      </div>
                    </div>
                  ))}
                  {(!selectedStory.criteria || selectedStory.criteria.length === 0) && (
                    <div style={{ color: '#8b949e', fontSize: 12 }}>No checklist criteria found.</div>
                  )}
                </div>

                <h3 style={{ fontSize: 12, textTransform: 'uppercase', color: '#8b949e', letterSpacing: 1, marginBottom: 16 }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <button onClick={() => execCommand(`*execute-subtask ${selectedStory.id}`, 'dev')} className="hive-btn" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px' }}>
                    <span style={{ fontSize: 16 }}>💻</span> <span>Implement Story (@dev)</span>
                  </button>
                  <button onClick={() => execCommand(`*validate-story ${selectedStory.id}`, 'po')} className="hive-btn" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px' }}>
                    <span style={{ fontSize: 16 }}>📦</span> <span>Validate (@po)</span>
                  </button>
                  <button onClick={() => execCommand(`*review-build ${selectedStory.id}`, 'qa')} className="hive-btn" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px' }}>
                    <span style={{ fontSize: 16 }}>✅</span> <span>QA Review (@qa)</span>
                  </button>
                  <button onClick={() => execCommand(`*close-story ${selectedStory.id}`, 'po')} className="hive-btn" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(63, 185, 80, 0.1)', borderColor: '#3fb950' }}>
                    <span style={{ fontSize: 16 }}>🎉</span> <span style={{ color: '#3fb950', fontWeight: 600 }}>Close Story (@po)</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b949e', fontSize: 14 }}>
               Select a story from the list to view details
            </div>
          )}
        </div>
      </div>
    </>
  );
}
