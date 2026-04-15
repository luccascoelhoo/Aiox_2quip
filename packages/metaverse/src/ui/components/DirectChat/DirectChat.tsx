import { useState, useRef, useEffect } from 'react';
import { useMetaverseStore } from '../../../bridge/store';
import { eventBus } from '../../../bridge/EventBus';
import { AGENT_DESKS } from '../../../game/map/SectorManager';
import { SQUAD_COLORS } from '../../../shared/constants';
import type { ChatMessage } from '../../../shared/types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function DirectChat() {
  const { activeChatAgent, setActiveChatAgent, chatMessages, addChatMessage } = useMetaverseStore();
  const [input, setInput] = useState('');
  const [closing, setClosing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const agent = AGENT_DESKS.find((a) => a.id === activeChatAgent);
  const squadColor = agent ? (SQUAD_COLORS[agent.sector] || '#c9d1d9') : '#c9d1d9';

  const directMessages = chatMessages.filter(
    (m) => m.agentContext === activeChatAgent || (m.type === 'agent' && m.sender === activeChatAgent)
  );

  // Auto-scroll
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [directMessages.length]);

  // Focus input
  useEffect(() => {
    if (activeChatAgent) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [activeChatAgent]);

  // Listen for responses
  useEffect(() => {
    const unsub = eventBus.on('command:response', (data) => {
      if (data.agentId === activeChatAgent) {
        setIsTyping(false);
        addChatMessage({
          id: generateId(),
          sender: data.agentId,
          senderIcon: agent?.icon || '🤖',
          senderColor: squadColor,
          content: data.output,
          timestamp: new Date(),
          type: 'agent',
          agentContext: activeChatAgent || undefined,
        });
      }
    });
    return unsub;
  }, [activeChatAgent]);

  if (!activeChatAgent || !agent) return null;

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setActiveChatAgent(null);
      setClosing(false);
    }, 250);
  };

  const handleSend = () => {
    const msg = input.trim();
    if (!msg) return;

    addChatMessage({
      id: generateId(),
      sender: 'You',
      senderIcon: '🧑',
      senderColor: '#00ff88',
      content: msg,
      timestamp: new Date(),
      type: 'user',
      agentContext: activeChatAgent,
    });

    if (msg.startsWith('*')) {
      setIsTyping(true);
      eventBus.emit('command:execute', { command: msg, agentContext: activeChatAgent });
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addChatMessage({
          id: generateId(),
          sender: activeChatAgent,
          senderIcon: agent.icon,
          senderColor: squadColor,
          content: `Understood. Use \`*\` prefix for commands. Try: \`*help\``,
          timestamp: new Date(),
          type: 'agent',
          agentContext: activeChatAgent,
        });
      }, 600);
    }

    setInput('');
  };

  const formatTime = (date: Date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="glass-elevated"
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: 380,
        zIndex: 250,
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        animation: closing ? 'slideOutRight 0.25s ease-in' : 'slideInRight 0.3s ease-out',
        borderLeft: `2px solid ${squadColor}40`,
      }}
    >
      {/* Header with gradient */}
      <div style={{
        padding: '16px 20px 14px',
        borderBottom: '1px solid rgba(48, 54, 61, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: `linear-gradient(135deg, ${squadColor}12, transparent)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontSize: 22,
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.15))',
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
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span className="status-dot online" style={{ width: 5, height: 5 }} />
              Direct Chat • {agent.sector.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </div>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="hive-btn"
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 14,
            color: '#8b949e',
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {/* Welcome message */}
        <div style={{
          textAlign: 'center',
          padding: '24px 0 16px',
          color: '#8b949e',
          fontSize: 11,
        }}>
          <div style={{
            fontSize: 32,
            marginBottom: 8,
            filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.1))',
          }}>
            {agent.icon}
          </div>
          <div>
            Chat direto com{' '}
            <span style={{ color: squadColor, fontWeight: 700 }}>{agent.name}</span>
          </div>
          <div style={{
            fontSize: 10,
            color: '#484f58',
            marginTop: 4,
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            @{agent.id} • Use *commands
          </div>
        </div>

        {directMessages.map((msg) => {
          const isUser = msg.sender === 'You';
          return (
            <div
              key={msg.id}
              className="chat-message-enter"
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
                padding: '6px 8px',
                borderRadius: 8,
                background: isUser ? 'rgba(0, 255, 136, 0.04)' : 'rgba(255, 255, 255, 0.02)',
              }}
            >
              <span style={{
                fontSize: 13,
                flexShrink: 0,
                width: 20,
                textAlign: 'center',
              }}>
                {msg.senderIcon}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  color: msg.senderColor,
                  fontSize: 11,
                  fontWeight: 700,
                }}>
                  {msg.sender === activeChatAgent ? agent.name : msg.sender}
                </span>
                <span style={{
                  color: '#3d444d',
                  fontSize: 9,
                  marginLeft: 6,
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {formatTime(msg.timestamp)}
                </span>
                <div style={{
                  color: '#e6edf3',
                  fontSize: 12,
                  marginTop: 3,
                  wordBreak: 'break-word',
                  lineHeight: 1.5,
                }}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-message-enter" style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            padding: '6px 8px',
            color: '#8b949e',
            fontSize: 11,
          }}>
            <span style={{ fontSize: 13 }}>{agent.icon}</span>
            <div style={{ display: 'flex', gap: 3 }}>
              <span className="pulse" style={{ animation: 'pulse 1s infinite 0s' }}>●</span>
              <span className="pulse" style={{ animation: 'pulse 1s infinite 0.2s' }}>●</span>
              <span className="pulse" style={{ animation: 'pulse 1s infinite 0.4s' }}>●</span>
            </div>
            <span style={{ fontSize: 10 }}>{agent.name} is typing...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px 14px',
        borderTop: '1px solid rgba(48, 54, 61, 0.3)',
        background: 'rgba(13, 17, 23, 0.4)',
      }}>
        <div style={{
          fontSize: 10,
          color: squadColor,
          fontWeight: 600,
          marginBottom: 6,
          fontFamily: 'JetBrains Mono, monospace',
          opacity: 0.7,
        }}>
          @{agent.id}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${agent.name}...`}
            className="hive-input"
            style={{ fontSize: 12 }}
          />
          <button
            onClick={handleSend}
            className="hive-btn"
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              color: input.trim() ? squadColor : '#484f58',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            ⏎
          </button>
        </div>
      </div>
    </div>
  );
}
