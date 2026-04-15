import { useEffect, useState } from 'react';
import { eventBus } from '../../../bridge/EventBus';
import { useMetaverseStore } from '../../../bridge/store';

export function StatusHUD() {
  const [sector, setSector] = useState('Lobby');
  const [fps, setFps] = useState(0);
  const backendConnected = useMetaverseStore((s) => s.backendConnected);
  const agents = useMetaverseStore((s) => s.agents);

  const onlineCount = agents.filter((a) => a.status !== 'offline').length;
  const workingCount = agents.filter((a) => a.status === 'working').length;

  useEffect(() => {
    const unsub = eventBus.on('player:move', (data) => {
      setSector(data.sector);
    });

    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;
    const fpsLoop = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(fpsLoop);
    };
    animId = requestAnimationFrame(fpsLoop);

    return () => {
      unsub();
      cancelAnimationFrame(animId);
    };
  }, []);

  const fpsColor = fps >= 55 ? '#3fb950' : fps >= 30 ? '#f0883e' : '#f85149';

  return (
    <div
      className="glass-elevated breathe"
      style={{
        position: 'fixed',
        top: 14,
        left: 14,
        padding: '12px 16px',
        borderRadius: 12,
        pointerEvents: 'auto',
        minWidth: 220,
        borderTop: '2px solid rgba(255, 215, 0, 0.3)',
      }}
    >
      {/* Title row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
        paddingBottom: 8,
        borderBottom: '1px solid rgba(48, 54, 61, 0.4)',
      }}>
        <span style={{ fontSize: 18 }}>👑</span>
        <div>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffd700, #ffed4a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 1,
          }}>
            2QUIP METAVERSE
          </div>
          <div style={{ fontSize: 9, color: '#484f58', fontFamily: 'JetBrains Mono, monospace' }}>v0.1.0 — The Hive</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
        <StatusRow icon="📍" label="Sector" value={sector} color="#e6edf3" />
        <StatusRow icon="🎮" label="FPS" value={String(fps)} color={fpsColor} />
        <StatusRow
          icon="🤖"
          label="Agents"
          value={`${onlineCount}/14`}
          color="#e6edf3"
          extra={workingCount > 0 ? (
            <span style={{
              color: '#f0883e',
              fontSize: 9,
              background: 'rgba(240, 136, 62, 0.1)',
              padding: '1px 6px',
              borderRadius: 4,
              marginLeft: 4,
            }}>
              {workingCount} working
            </span>
          ) : null}
        />
        <StatusRow
          icon="🔗"
          label="Backend"
          value={backendConnected ? 'Connected' : 'Offline'}
          color={backendConnected ? '#3fb950' : '#f85149'}
          dot={backendConnected ? 'online' : 'error'}
        />
      </div>
    </div>
  );
}

function StatusRow({ icon, label, value, color, extra, dot }: {
  icon: string;
  label: string;
  value: string;
  color: string;
  extra?: React.ReactNode;
  dot?: string;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '3px 0',
    }}>
      <span style={{ color: '#8b949e', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 12, width: 16, textAlign: 'center' }}>{icon}</span>
        {label}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {dot && (
          <span
            className={`status-dot ${dot}`}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              display: 'inline-block',
            }}
          />
        )}
        <span style={{ color, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
          {value}
        </span>
        {extra}
      </span>
    </div>
  );
}
