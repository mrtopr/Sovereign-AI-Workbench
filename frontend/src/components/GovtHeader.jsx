import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { egressAPI } from '../services/api';

export default function GovtHeader() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [egressCount, setEgressCount] = useState(0);
  const [backendOnline, setBackendOnline] = useState(true);

  useEffect(() => {
    const poll = () => {
      egressAPI.summary()
        .then(d => { setEgressCount(d.external_attempts ?? 0); setBackendOnline(true); })
        .catch(() => setBackendOnline(false));
    };
    poll();
    const t = setInterval(poll, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <div className="tricolor-stripe" />
      <header style={{
        background: 'var(--navy)',
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 12px rgba(0,33,79,0.3)',
      }}>
        {/* Main header row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '10px 20px',
          maxWidth: 1600,
          margin: '0 auto',
        }}>
          {/* Emblem */}
          <div style={{
            width: 46, height: 46,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
            border: '1.5px solid rgba(255,255,255,0.2)',
            flexShrink: 0,
          }}>🏛️</div>

          {/* Org title */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              भारत सरकार · Government of India
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              MRPL — Sovereign AI Workbench
            </div>
          </div>

          {/* Sovereignty indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: !backendOnline
              ? 'rgba(100,100,100,0.2)'
              : egressCount > 0
                ? 'rgba(220,38,38,0.2)'
                : 'rgba(19,136,8,0.2)',
            border: `1px solid ${!backendOnline ? 'rgba(150,150,150,0.4)' : egressCount > 0 ? 'rgba(220,38,38,0.4)' : 'rgba(19,136,8,0.4)'}`,
            borderRadius: 20,
            padding: '4px 12px',
            flexShrink: 0,
          }}>
            <span className={`status-dot ${!backendOnline ? 'idle' : egressCount > 0 ? 'error' : 'live'}`} />
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: !backendOnline ? '#aaa' : egressCount > 0 ? '#fca5a5' : '#86efac',
            }}>
              {!backendOnline ? 'Backend Offline' : `${egressCount} External Calls`}
            </span>
          </div>

          {/* User info */}
          {user && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  padding: '6px 12px',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{
                  width: 28, height: 28,
                  background: 'var(--saffron)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                }}>{user.avatar}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{user.name.split(' ')[0]}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>{user.role}</div>
                </div>
                <span style={{ fontSize: 10 }}>▼</span>
              </button>

              {menuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: '#fff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  width: 220,
                  zIndex: 200,
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: '14px 16px', background: 'var(--surface-2)', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 14 }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-sec)', marginTop: 2 }}>{user.department}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>EMP: {user.employeeId}</div>
                    <div style={{ marginTop: 8 }}><span className="badge badge-blue">{user.role}</span></div>
                  </div>
                  <div style={{ padding: 8 }}>
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      style={{
                        width: '100%', padding: '8px 12px',
                        background: 'transparent', border: 'none',
                        color: 'var(--danger)', fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', borderRadius: 6, textAlign: 'left',
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nav bar */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: 0,
          fontSize: 12,
          overflowX: 'auto',
        }}>
          {[
            { icon: '💬', label: 'AI Chat' },
            { icon: '📋', label: 'Tasks' },
            { icon: '📚', label: 'Knowledge Base' },
            { icon: '🤖', label: 'Model Pool' },
            { icon: '🛡️', label: 'Sovereignty Monitor' },
            { icon: '📜', label: 'Audit Trail' },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '8px 14px',
              color: i === 0 ? '#fff' : 'rgba(255,255,255,0.6)',
              fontWeight: i === 0 ? 600 : 400,
              borderBottom: i === 0 ? '2px solid var(--saffron)' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </div>
      </header>
    </>
  );
}
