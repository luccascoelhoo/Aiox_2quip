import { useMetaverseStore } from '../../../bridge/store';
import { AGENT_DESKS } from '../../../game/map/SectorManager';
import { SQUAD_COLORS } from '../../../shared/constants';
import { eventBus } from '../../../bridge/EventBus';

export function AgentContextMenu() {
  const { contextMenu, hideContextMenu, setActiveChatAgent } = useMetaverseStore();

  if (!contextMenu) return null;

  const agent = AGENT_DESKS.find((a) => a.id === contextMenu.agentId);
  if (!agent) return null;

  const squadColor = SQUAD_COLORS[agent.sector] || '#c9d1d9';

  const handleChat = () => {
    setActiveChatAgent(contextMenu.agentId);
    hideContextMenu();
  };

  const handleFocus = () => {
    eventBus.emit('camera:focus', { col: agent.col, row: agent.row });
    hideContextMenu();
  };

  const handleClose = () => {
    hideContextMenu();
  };

  // Clamp position to viewport
  const x = Math.min(contextMenu.x, window.innerWidth - 240);
  const y = Math.min(contextMenu.y, window.innerHeight - 260);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 299,
          pointerEvents: 'auto',
          background: 'rgba(0, 0, 0, 0.2)',
        }}
      />

      {/* Menu card */}
      <div
        className="glass-elevated fade-in"
        style={{
          position: 'fixed',
          left: x,
          top: y,
          zIndex: 300,
          borderRadius: 14,
          padding: 0,
          minWidth: 220,
          pointerEvents: 'auto',
          borderTop: `2px solid ${squadColor}60`,
          overflow: 'hidden',
        }}
      >
        {/* Agent header with gradient */}
        <div style={{
          padding: '14px 18px 12px',
          borderBottom: '1px solid rgba(48, 54, 61, 0.3)',
          background: `linear-gradient(135deg, ${squadColor}10, transparent)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontSize: 24,
              filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.2))',
            }}>
              {agent.icon}
            </span>
            <div>
              <div style={{
                fontSize: 15,
                fontWeight: 700,
                color: squadColor,
                letterSpacing: 0.3,
              }}>
                {agent.name}
              </div>
              <div style={{
                fontSize: 10,
                color: '#8b949e',
                marginTop: 1,
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                @{agent.id}
              </div>
            </div>
          </div>
          <div style={{
            fontSize: 10,
            color: '#8b949e',
            marginTop: 6,
            padding: '3px 8px',
            background: 'rgba(48, 54, 61, 0.3)',
            borderRadius: 4,
            display: 'inline-block',
          }}>
            {agent.sector.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Squad
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: '6px 0' }}>
          <MenuItem
            icon="💬"
            label="Conversar"
            hint="Abrir chat direto"
            accentColor={squadColor}
            onClick={handleChat}
          />
          <MenuItem
            icon="🎯"
            label="Focar Câmera"
            hint="Centralizar no agente"
            accentColor={squadColor}
            onClick={handleFocus}
          />
          <MenuItem
            icon="⚡"
            label="Executar Comando"
            hint={`*help @${agent.id}`}
            accentColor={squadColor}
            onClick={() => {
              eventBus.emit('command:execute', { command: '*help', agentContext: agent.id });
              handleClose();
            }}
          />
          <div style={{ height: 1, background: 'rgba(48, 54, 61, 0.3)', margin: '4px 0' }} />
          <MenuItem icon="✕" label="Fechar" accentColor="#8b949e" onClick={handleClose} />
        </div>
      </div>
    </>
  );
}

function MenuItem({ icon, label, hint, accentColor, onClick }: {
  icon: string;
  label: string;
  hint?: string;
  accentColor: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '9px 18px',
        background: 'transparent',
        border: 'none',
        color: '#e6edf3',
        cursor: 'pointer',
        fontSize: 12,
        fontFamily: 'Inter, sans-serif',
        textAlign: 'left',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${accentColor}10`;
        e.currentTarget.style.paddingLeft = '22px';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.paddingLeft = '18px';
      }}
    >
      <span style={{
        fontSize: 14,
        width: 22,
        textAlign: 'center',
        filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.1))',
      }}>
        {icon}
      </span>
      <div>
        <div style={{ fontWeight: 600, letterSpacing: 0.2 }}>{label}</div>
        {hint && (
          <div style={{
            fontSize: 10,
            color: '#8b949e',
            marginTop: 1,
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            {hint}
          </div>
        )}
      </div>
    </button>
  );
}
