import { useGamificationStore } from '../../../bridge/gamificationStore';
import { BADGES } from '../../../shared/gamification';

export function BadgePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const unlockedBadges = useGamificationStore(s => s.unlockedBadges);

  if (!open) return null;

  const categories = ['exploration', 'mastery', 'social', 'special'] as const;
  const catLabels: Record<string, { label: string; icon: string }> = {
    exploration: { label: 'Exploration', icon: '🗺️' },
    mastery: { label: 'Mastery', icon: '⚡' },
    social: { label: 'Social', icon: '💬' },
    special: { label: 'Special', icon: '✨' },
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 400 }} />
      <div className="glass-elevated fade-in" style={{
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 500,
        maxHeight: '75vh',
        zIndex: 401,
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderTop: '2px solid rgba(255, 215, 0, 0.3)',
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
            <span style={{ fontSize: 20 }}>🏅</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#ffd700' }}>Badges</div>
              <div style={{ fontSize: 10, color: '#8b949e' }}>{unlockedBadges.length}/{BADGES.length} unlocked</div>
            </div>
          </div>
          <button onClick={onClose} className="hive-btn" style={{ fontSize: 14, padding: '4px 10px' }}>✕</button>
        </div>

        {/* Badges */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {categories.map(cat => {
            const badges = BADGES.filter(b => b.category === cat);
            const catInfo = catLabels[cat];
            return (
              <div key={cat} style={{ marginBottom: 20 }}>
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#8b949e',
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  marginBottom: 10,
                }}>
                  {catInfo.icon} {catInfo.label}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                  {badges.map(badge => {
                    const unlocked = unlockedBadges.includes(badge.id);
                    return (
                      <div
                        key={badge.id}
                        className="glass"
                        style={{
                          padding: '12px 10px',
                          borderRadius: 10,
                          textAlign: 'center',
                          opacity: unlocked ? 1 : 0.4,
                          borderBottom: unlocked ? `2px solid ${badge.color}` : '2px solid transparent',
                          transition: 'all 0.2s',
                          cursor: 'default',
                        }}
                        title={badge.description}
                      >
                        <div style={{
                          fontSize: 24,
                          marginBottom: 4,
                          filter: unlocked ? `drop-shadow(0 0 6px ${badge.color}40)` : 'grayscale(1)',
                        }}>
                          {unlocked ? badge.icon : '🔒'}
                        </div>
                        <div style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: unlocked ? badge.color : '#484f58',
                          marginBottom: 2,
                        }}>
                          {badge.name}
                        </div>
                        <div style={{ fontSize: 8, color: '#484f58', lineHeight: 1.3 }}>
                          {badge.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
