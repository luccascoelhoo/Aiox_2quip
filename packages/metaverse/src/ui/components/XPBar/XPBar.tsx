import { useGamificationStore } from '../../../bridge/gamificationStore';

export function XPBar() {
  const totalXP = useGamificationStore(s => s.totalXP);
  const getLevel = useGamificationStore(s => s.getLevel);
  const getProgress = useGamificationStore(s => s.getProgress);
  const unlockedBadges = useGamificationStore(s => s.unlockedBadges);

  const level = getLevel();
  const progress = getProgress();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      marginTop: 10,
      paddingTop: 8,
      borderTop: '1px solid rgba(48, 54, 61, 0.4)',
    }}>
      {/* Level row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 14,
            filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.3))',
          }}>{level.icon}</span>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: level.color,
            letterSpacing: 0.5,
          }}>
            Lv.{level.level} {level.title}
          </span>
        </div>
        <span style={{
          fontSize: 9,
          color: '#8b949e',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          {totalXP} XP
        </span>
      </div>

      {/* XP bar */}
      <div style={{
        height: 6,
        borderRadius: 3,
        background: 'rgba(48, 54, 61, 0.5)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          height: '100%',
          width: `${progress.percent}%`,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${level.color}cc, ${level.color})`,
          transition: 'width 0.5s ease-out',
          boxShadow: `0 0 8px ${level.color}40`,
        }} />
      </div>

      {/* Progress text */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 8,
        color: '#484f58',
        fontFamily: 'JetBrains Mono, monospace',
      }}>
        <span>{progress.current}/{progress.needed} XP</span>
        <span>🏅 {unlockedBadges.length}/{12}</span>
      </div>
    </div>
  );
}
