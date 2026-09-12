import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';
import { egressAPI } from '../services/api';

const NAV = [
  { id: 'chat',    icon: '💬', label: 'AI Assistant' },
  { id: 'tasks',   icon: '📋', label: 'My Tasks' },
  { id: 'audit',   icon: '📜', label: 'Audit Trail' },
  { id: 'monitor', icon: '🛡️', label: 'Egress Monitor' },
];

export default function GovtHeader({ activeView, setActiveView }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [egress, setEgress] = useState({ count: 0, online: true });

  useEffect(() => {
    const poll = () =>
      egressAPI.summary()
        .then(d => setEgress({ count: d.external_attempts ?? 0, online: true }))
        .catch(() => setEgress(e => ({ ...e, online: false })));
    poll();
    const t = setInterval(poll, 6000);
    return () => clearInterval(t);
  }, []);

  const eClass = !egress.online ? 'offline' : egress.count > 0 ? 'danger' : 'safe';
  const eText  = !egress.online ? '⚠ Offline'
               : egress.count > 0 ? `🚨 ${egress.count} Ext. Calls`
               : '🔒 Zero Egress';

  return (
    <>
      {/* ── TRICOLOR ACCENT STRIPE AT VERY TOP ── */}
      <div className="tricolor-stripe" />

      {/* ── COMPACT TOPBAR ── */}
      <div className="topbar">
        <div className="topbar-emblem" title="सत्यमेव जयते">🏛️</div>
        <div className="topbar-titles">
          <div className="topbar-name">MRPL — Sovereign AI Workbench</div>
          <div className="topbar-sub">भारत सरकार · Ministry of Petroleum · A Miniratna Govt. of India Enterprise</div>
        </div>

        <div className="topbar-sep" />

        {/* Real-Time Egress Badge */}
        <div className={`topbar-badge ${eClass}`}>
          <div className={`dot dot-${eClass === 'safe' ? 'live' : eClass === 'danger' ? 'error' : 'idle'}`} />
          <span>{eText}</span>
        </div>

        {/* Digital India Badge */}
        <div className="topbar-badge">
          <span style={{ fontSize: 13 }}>🇮🇳</span>
          <span style={{ color: 'var(--text-sec)' }}>Digital India</span>
        </div>

        {/* PM Modi Vision Badge */}
        <div className="topbar-badge">
          <span>🏛️</span>
          <span style={{ color: 'var(--text-sec)' }}>Vision: <strong style={{ color: 'var(--text-primary)' }}>PM Shri Narendra Modi</strong></span>
        </div>

        {/* Topbar Right Actions (Theme Switch + User Profile) */}
        <div className="topbar-right">
          {/* Theme Toggle Button */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode (Executive View)' : 'Switch to Dark Mode (Sovereign Glass)'}
            aria-label="Toggle Theme"
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {user && (
            <div style={{ position: 'relative' }}>
              <button className="user-btn" onClick={() => setMenuOpen(o => !o)}>
                <div className="user-av">{user.avatar}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: 12, lineHeight: 1.2 }}>{user?.name?.split(' ')[0] || user?.name || 'User'}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.2 }}>{user.role}</div>
                </div>
                <span style={{ fontSize: 8, color: 'var(--text-muted)', marginLeft: 2 }}>▼</span>
              </button>

              {menuOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={() => setMenuOpen(false)} />
                  <div className="user-dropdown fade-in">
                    <div className="user-dropdown-head">
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)' }}>{user.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{user.department}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>EMP: {user.employeeId}</div>
                      <div style={{ marginTop: 8 }}><span className="badge badge-blue">{user.role}</span></div>
                    </div>
                    <div className="user-dropdown-body">
                      <button className="logout-btn" onClick={() => { logout(); setMenuOpen(false); }}>
                        🚪 Logout / साइन आउट
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function Sidebar({ activeView, setActiveView, user }) {
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Navigation</div>
        {NAV.map(item => (
          <button
            key={item.id}
            className={`nav-btn${activeView === item.id ? ' active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-section" style={{ marginTop: 14 }}>
        <div className="sidebar-label">System</div>
        <div className="sidebar-system-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div className="dot dot-live" />
            <span style={{ color: 'var(--success)', fontWeight: 700 }}>Models: Active</span>
          </div>
          <div>📍 On-Premise GPU</div>
          <div>🛡️ Air-Gapped Network</div>
          <div>🔒 Zero External Egress</div>
          <div className="sidebar-version-tag">
            SIH26117 · v1.0 Production
          </div>
        </div>
      </div>

      <div className="sidebar-user">
        {user && (
          <div className="sidebar-user-card">
            <div className="sidebar-user-av">{user.avatar}</div>
            <div style={{ minWidth: 0 }}>
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-role">{user.department}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
