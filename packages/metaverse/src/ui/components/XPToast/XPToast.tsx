import { useEffect, useState } from 'react';
import type { XPEvent, Badge, Mission } from '../../../shared/gamification';

interface ToastItem {
  id: string;
  type: 'xp' | 'badge' | 'mission' | 'levelup';
  event?: XPEvent;
  badge?: Badge;
  mission?: Mission;
  newLevel?: { title: string; icon: string };
}

let toastQueue: ToastItem[] = [];
let toastListener: ((items: ToastItem[]) => void) | null = null;

export function pushXPToast(event: XPEvent) {
  toastQueue.push({ id: Date.now().toString(36) + 'xp', type: 'xp', event });
  toastListener?.([...toastQueue]);
}

export function pushBadgeToast(badge: Badge) {
  toastQueue.push({ id: Date.now().toString(36) + 'badge', type: 'badge', badge });
  toastListener?.([...toastQueue]);
}

export function pushMissionToast(mission: Mission) {
  toastQueue.push({ id: Date.now().toString(36) + 'mission', type: 'mission', mission });
  toastListener?.([...toastQueue]);
}

export function pushLevelUpToast(title: string, icon: string) {
  toastQueue.push({ id: Date.now().toString(36) + 'lvl', type: 'levelup', newLevel: { title, icon } });
  toastListener?.([...toastQueue]);
}

export function XPToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    toastListener = setToasts;
    return () => { toastListener = null; };
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      toastQueue = toastQueue.slice(1);
      setToasts([...toastQueue]);
    }, 2500);
    return () => clearTimeout(timer);
  }, [toasts]);

  if (toasts.length === 0) return null;
  const toast = toasts[0];

  return (
    <div style={{
      position: 'fixed',
      top: 80,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 999,
      pointerEvents: 'none',
      animation: 'slideUp 0.3s ease-out',
    }}>
      {toast.type === 'xp' && toast.event && (
        <div className="glass-elevated" style={{
          padding: '10px 20px',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderTop: '2px solid rgba(255, 215, 0, 0.4)',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ fontSize: 18 }}>⚡</span>
          <span style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#ffd700',
            fontFamily: 'JetBrains Mono, monospace',
          }}>
            +{toast.event.amount} XP
          </span>
          <span style={{ fontSize: 11, color: '#8b949e' }}>
            {toast.event.reason}
          </span>
        </div>
      )}

      {toast.type === 'badge' && toast.badge && (
        <div className="glass-elevated" style={{
          padding: '12px 24px',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderTop: `2px solid ${toast.badge.color}`,
        }}>
          <span style={{ fontSize: 24 }}>{toast.badge.icon}</span>
          <div>
            <div style={{ fontSize: 10, color: '#8b949e', fontWeight: 600, letterSpacing: 1 }}>
              BADGE UNLOCKED
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: toast.badge.color }}>
              {toast.badge.name}
            </div>
          </div>
        </div>
      )}

      {toast.type === 'mission' && toast.mission && (
        <div className="glass-elevated" style={{
          padding: '12px 24px',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderTop: '2px solid rgba(63, 185, 80, 0.5)',
        }}>
          <span style={{ fontSize: 24 }}>🏆</span>
          <div>
            <div style={{ fontSize: 10, color: '#3fb950', fontWeight: 600, letterSpacing: 1 }}>
              MISSION COMPLETE
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#e6edf3' }}>
              {toast.mission.name} (+{toast.mission.xpReward} XP)
            </div>
          </div>
        </div>
      )}

      {toast.type === 'levelup' && toast.newLevel && (
        <div className="glass-elevated" style={{
          padding: '14px 28px',
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          borderTop: '2px solid rgba(255, 215, 0, 0.6)',
          boxShadow: '0 0 40px rgba(255, 215, 0, 0.15)',
        }}>
          <span style={{ fontSize: 28, filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.4))' }}>
            {toast.newLevel.icon}
          </span>
          <div>
            <div style={{ fontSize: 10, color: '#ffd700', fontWeight: 700, letterSpacing: 2 }}>
              LEVEL UP!
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#ffd700' }}>
              {toast.newLevel.title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
