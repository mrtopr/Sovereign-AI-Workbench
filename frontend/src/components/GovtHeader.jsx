import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useCallback } from 'react';
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
        <div className="topbar-emblem" title="MRPL Sovereign AI">
          <img src="/favicon.svg" alt="MRPL" style={{ width: 28, height: 28, display: 'block' }} />
        </div>
        <div className="topbar-titles">
          <div className="topbar-name">MRPL — Sovereign AI Workbench</div>
          <div className="topbar-sub">Mangalore Refinery and Petrochemicals Limited · Autonomous Enterprise Platform</div>
        </div>

        <div className="topbar-sep" />

        {/* Real-Time Egress Badge */}
        <div className={`topbar-badge ${eClass}`}>
          <div className={`dot dot-${eClass === 'safe' ? 'live' : eClass === 'danger' ? 'error' : 'idle'}`} />
          <span>{eText}</span>
        </div>

        {/* Air-Gapped / Sovereign Badge */}
        <div className="topbar-badge saffron">
          <span style={{ fontSize: 13 }}>🛡️</span>
          <span>Air-Gapped Node</span>
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
                <div style={{ textAlign: 'left', minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{user.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.2, whiteSpace: 'nowrap' }}>{user.role}</div>
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
                        🚪 Logout
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
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem('mrpl_sidebar_width');
    return saved ? Math.max(72, Math.min(parseInt(saved, 10), 450)) : 220;
  });
  const [isDragging, setIsDragging] = useState(false);

  const startResizing = useCallback((mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    setIsDragging(true);

    const startX = mouseDownEvent.clientX;
    const startWidth = width;

    const onMouseMove = (mouseMoveEvent) => {
      const newWidth = Math.min(Math.max(startWidth + (mouseMoveEvent.clientX - startX), 72), 450);
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width]);

  useEffect(() => {
    localStorage.setItem('mrpl_sidebar_width', width);
  }, [width]);

  const isCollapsed = width < 130;

  const toggleCollapse = () => {
    if (isCollapsed) {
      setWidth(220);
    } else {
      setWidth(72);
    }
  };

  return (
    <div
      className={`sidebar ${isDragging ? 'resizing' : ''} ${isCollapsed ? 'sidebar-collapsed' : ''}`}
      style={{
        width: `${width}px`,
        minWidth: `${width}px`,
        maxWidth: `${width}px`,
        position: 'relative',
      }}
    >
      {/* Draggable Resizer Edge */}
      <div
        className={`sidebar-resizer ${isDragging ? 'active' : ''}`}
        onMouseDown={startResizing}
        title="Drag with cursor to resize sidebar (double-click to toggle)"
        onDoubleClick={toggleCollapse}
      />

      {/* Collapse / Expand Toggle Button */}
      <div style={{ display: 'flex', justifyContent: isCollapsed ? 'center' : 'flex-end', padding: '6px 8px 0' }}>
        <button
          className="btn btn-ghost btn-xs"
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            padding: '3px 6px',
            fontSize: '11px',
            color: 'var(--text-muted)',
            borderRadius: '4px',
          }}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      <div className="sidebar-section" style={{ paddingTop: 4 }}>
        {!isCollapsed && <div className="sidebar-label">Navigation</div>}
        {NAV.map(item => (
          <button
            key={item.id}
            className={`nav-btn${activeView === item.id ? ' active' : ''}`}
            onClick={() => setActiveView(item.id)}
            title={item.label}
            style={isCollapsed ? { justifyContent: 'center', padding: '10px 0' } : {}}
          >
            <span className="nav-icon" style={{ fontSize: isCollapsed ? 18 : 15 }}>{item.icon}</span>
            {!isCollapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>}
          </button>
        ))}
      </div>

      {!isCollapsed ? (
        <div className="sidebar-section" style={{ marginTop: 14 }}>
          <div className="sidebar-label">System</div>
          <div className="sidebar-system-box">
            <div className="sidebar-status-row">
              <div className="dot dot-live" />
              <span className="status-highlight-green">Models: Active</span>
            </div>
            <div className="sidebar-status-row">
              <span className="status-icon-amber">📍</span>
              <span>On-Premise GPU</span>
            </div>
            <div className="sidebar-status-row">
              <span className="status-icon-emerald">🛡️</span>
              <span>Air-Gapped Network</span>
            </div>
            <div className="sidebar-status-row">
              <span className="status-icon-cyan">🔒</span>
              <span>Zero External Egress</span>
            </div>
            <div className="sidebar-version-tag">
              SIH26117 · v1.0 Production
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <span title="Models Active" style={{ fontSize: 13 }}>🟢</span>
          <span title="On-Premise GPU" style={{ fontSize: 13 }}>📍</span>
          <span title="Air-Gapped Network" style={{ fontSize: 13 }}>🛡️</span>
          <span title="Zero External Egress" style={{ fontSize: 13 }}>🔒</span>
        </div>
      )}

      <div className="sidebar-user" style={{ marginTop: 'auto' }}>
        {user && (
          <div
            className="sidebar-user-card"
            title={`${user.name} (${user.department})`}
            style={isCollapsed ? { justifyContent: 'center', padding: '8px 4px' } : {}}
          >
            <div className="sidebar-user-av">{user.avatar}</div>
            {!isCollapsed && (
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <div className="sidebar-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                <div className="sidebar-user-role" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.department}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
