import { useEffect, useRef } from 'react';
import { SECTORS, AGENT_DESKS } from '../../../game/map/SectorManager';
import { SQUAD_COLORS } from '../../../shared/constants';
import { eventBus } from '../../../bridge/EventBus';
import { useMetaverseStore } from '../../../bridge/store';

const MINIMAP_SIZE = 150;
const SCALE = MINIMAP_SIZE / 20;

export function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerPos = useMetaverseStore((s) => s.playerPosition);

  useEffect(() => {
    drawMinimap();
  }, [playerPos]);

  useEffect(() => {
    const unsub = eventBus.on('state:updated', () => drawMinimap());
    return unsub;
  }, []);

  const drawMinimap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

    // Background
    ctx.fillStyle = 'rgba(5, 5, 16, 0.6)';
    ctx.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

    // Draw sectors with gradient-like fills
    for (const sector of Object.values(SECTORS)) {
      const b = sector.bounds;
      const x = b.fromCol * SCALE;
      const y = b.fromRow * SCALE;
      const w = (b.toCol - b.fromCol + 1) * SCALE;
      const h = (b.toRow - b.fromRow + 1) * SCALE;

      // Sector fill
      ctx.fillStyle = sector.color + '60';
      ctx.fillRect(x, y, w, h);

      // Sector border with glow
      ctx.strokeStyle = sector.color + '40';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

      // Inner highlight
      ctx.strokeStyle = sector.color + '15';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
    }

    // Draw agent dots with glow
    for (const agent of AGENT_DESKS) {
      const color = SQUAD_COLORS[agent.sector] || '#c9d1d9';
      const cx = agent.col * SCALE + SCALE / 2;
      const cy = agent.row * SCALE + SCALE / 2;

      // Glow ring
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = color + '20';
      ctx.fill();

      // Dot
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Draw player position with animated glow
    const px = playerPos.col * SCALE + SCALE / 2;
    const py = playerPos.row * SCALE + SCALE / 2;

    // Outer glow
    const glowSize = 8 + Math.sin(Date.now() / 500) * 2;
    ctx.beginPath();
    ctx.arc(px, py, glowSize, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 255, 136, 0.08)';
    ctx.fill();

    // Mid ring
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Player dot
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#00ff88';
    ctx.fill();

    // Center bright point
    ctx.beginPath();
    ctx.arc(px, py, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const col = Math.floor((e.clientX - rect.left) / SCALE);
    const row = Math.floor((e.clientY - rect.top) / SCALE);
    if (col >= 0 && col < 20 && row >= 0 && row < 20) {
      eventBus.emit('camera:focus', { col, row });
    }
  };

  return (
    <div
      className="glass-elevated"
      style={{
        position: 'fixed',
        top: 14,
        right: 14,
        padding: 8,
        borderRadius: 12,
        pointerEvents: 'auto',
        borderTop: '2px solid rgba(88, 166, 255, 0.2)',
      }}
    >
      {/* Title */}
      <div style={{
        fontSize: 9,
        color: '#58a6ff',
        marginBottom: 6,
        textAlign: 'center',
        fontWeight: 700,
        letterSpacing: 2,
        fontFamily: 'JetBrains Mono, monospace',
      }}>
        MINIMAP
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={MINIMAP_SIZE}
        height={MINIMAP_SIZE}
        onClick={handleClick}
        style={{
          cursor: 'crosshair',
          borderRadius: 6,
          border: '1px solid rgba(48, 54, 61, 0.4)',
          display: 'block',
        }}
      />

      {/* Legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 6,
        justifyContent: 'center',
      }}>
        {Object.values(SECTORS).slice(0, 4).map((sector) => (
          <div
            key={sector.id}
            style={{
              fontSize: 7,
              color: '#8b949e',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <span style={{
              width: 5,
              height: 5,
              borderRadius: 2,
              background: sector.color,
              display: 'inline-block',
            }} />
            {sector.name.split(' ')[0]}
          </div>
        ))}
      </div>
    </div>
  );
}
