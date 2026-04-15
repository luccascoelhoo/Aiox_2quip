import { useState, useRef, useEffect } from 'react';
import { useMetaverseStore } from '../../../bridge/store';
import { eventBus } from '../../../bridge/EventBus';
import { SQUAD_COLORS } from '../../../shared/constants';
import { AGENT_DESKS } from '../../../game/map/SectorManager';
import type { ChatMessage } from '../../../shared/types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function ChatConsole() {
  const [input, setInput] = useState('');
  const [minimized, setMinimized] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { chatMessages, addChatMessage } = useMetaverseStore();

  // System message on mount
  useEffect(() => {
    addChatMessage({
      id: generateId(),
      sender: 'Orion Prime',
      senderIcon: '👑',
      senderColor: '#ffd700',
      content: 'Welcome to **2quip Metaverse v0.1.0** — The Hive is online. Type `*help` for commands. Right-click + drag to pan. Scroll to zoom.',
      timestamp: new Date(),
      type: 'system',
    });

    const unsub = eventBus.on('command:response', (data) => {
      addChatMessage({
        id: generateId(),
        sender: data.agentId,
        senderIcon: AGENT_DESKS.find(a => a.id === data.agentId)?.icon || '🤖',
        senderColor: SQUAD_COLORS[AGENT_DESKS.find(a => a.id === data.agentId)?.sector || ''] || '#c9d1d9',
        content: data.output,
        timestamp: new Date(),
        type: 'agent',
      });
    });

    return unsub;
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === '/') && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

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
    });

    if (msg.startsWith('*')) {
      eventBus.emit('command:execute', { command: msg });
    }

    setInput('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const unreadCount = chatMessages.length;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        pointerEvents: 'auto',
        zIndex: 200,
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setMinimized(!minimized)}
        className="hive-btn"
        style={{
          position: 'absolute',
          top: -32,
          right: 20,
          background: 'rgba(13, 17, 23, 0.92)',
          borderRadius: '8px 8px 0 0',
          padding: '5px 14px',
          fontSize: 11,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          borderBottom: 'none',
          backdropFilter: 'blur(16px)',
        }}
      >
        <span style={{ color: '#ffd700', fontSize: 10 }}>⚡</span>
        {minimized ? 'Console' : 'Minimize'}
        {minimized && unreadCount > 0 && (
          <span style={{
            background: 'linear-gradient(135deg, #ffd700, #b8960f)',
            color: '#0a0a0f',
            padding: '0 6px',
            borderRadius: 10,
            fontSize: 9,
            fontWeight: 700,
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat container */}
      <div
        className="glass-elevated"
        style={{
          height: minimized ? 52 : 260,
          transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px 12px 0 0',
          margin: '0 10px',
          borderTop: '2px solid rgba(88, 166, 255, 0.2)',
        }}
      >
        {/* Messages */}
        {!minimized && (
          <div
            ref={messagesRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '10px 14px 6px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {chatMessages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} formatTime={formatTime} />
            ))}
          </div>
        )}

        {/* Input area */}
        <div style={{
          padding: '8px 14px 10px',
          borderTop: minimized ? 'none' : '1px solid rgba(48, 54, 61, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontSize: 12, color: isFocused ? '#58a6ff' : '#484f58', transition: 'color 0.2s' }}>❯</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type *help for commands or send a message..."
            className="hive-input"
            style={{ borderRadius: 8, padding: '8px 12px', fontSize: 12 }}
          />
          <button
            onClick={handleSend}
            className="hive-btn"
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              color: input.trim() ? '#ffd700' : '#484f58',
              fontSize: 13,
              fontWeight: 700,
              transition: 'all 0.15s',
            }}
          >
            ⏎
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, formatTime }: { message: ChatMessage; formatTime: (d: Date) => string }) {
  const isSystem = message.type === 'system';
  const isUser = message.type === 'user';

  return (
    <div
      className="chat-message-enter"
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'flex-start',
        padding: '4px 6px',
        borderRadius: 6,
        background: isUser ? 'rgba(0, 255, 136, 0.04)' : isSystem ? 'rgba(255, 215, 0, 0.04)' : 'transparent',
        borderLeft: isSystem ? '2px solid rgba(255, 215, 0, 0.3)' : 'none',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isUser ? 'rgba(0, 255, 136, 0.04)' : isSystem ? 'rgba(255, 215, 0, 0.04)' : 'transparent';
      }}
    >
      <span style={{
        fontSize: 14,
        flexShrink: 0,
        width: 20,
        textAlign: 'center',
        filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.1))',
      }}>
        {message.senderIcon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          color: message.senderColor,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.3,
        }}>
          {message.sender}
        </span>
        <span style={{
          color: '#3d444d',
          fontSize: 9,
          marginLeft: 8,
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          {formatTime(message.timestamp)}
        </span>
        <div style={{
          color: isSystem ? '#c9d1d9' : '#e6edf3',
          fontSize: 12,
          marginTop: 2,
          fontFamily: "'Inter', sans-serif",
          wordBreak: 'break-word',
          lineHeight: 1.5,
        }}>
          {message.content}
        </div>
      </div>
    </div>
  );
}
