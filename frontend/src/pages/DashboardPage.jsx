import { useState } from 'react';
import GovtHeader from '../components/GovtHeader';
import ChatPane from '../components/ChatPane';
import TaskDashboard from '../components/TaskDashboard';
import SovereigntyPanel from '../components/SovereigntyPanel';
import AuditTrail from '../components/AuditTrail';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeView, setActiveView] = useState('dashboard');  // 'dashboard' | 'audit'

  const handleTaskComplete = () => setRefreshKey(k => k + 1);

  const navItems = [
    { id: 'dashboard', icon: '💬', label: 'AI Chat & Dashboard' },
    { id: 'audit', icon: '📜', label: 'Audit Trail', adminOnly: false },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
      <GovtHeader />

      {/* Role/context banner */}
      <div style={{
        background: 'linear-gradient(90deg, #00214f, var(--navy))',
        color: '#fff', padding: '7px 20px',
        display: 'flex', alignItems: 'center', gap: 12, fontSize: 12,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          width: 26, height: 26, background: 'var(--saffron)',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, flexShrink: 0,
        }}>{user?.avatar}</div>
        <span style={{ fontWeight: 600 }}>{user?.name}</span>
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>·</span>
        <span style={{ color: 'rgba(255,255,255,0.7)' }}>{user?.role}</span>
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>·</span>
        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{user?.department}</span>
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>·</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{user?.employeeId}</span>

        {/* View toggle */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                background: activeView === item.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                border: `1px solid ${activeView === item.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                color: activeView === item.id ? '#fff' : 'rgba(255,255,255,0.6)',
                borderRadius: 6, padding: '4px 10px', fontSize: 11, cursor: 'pointer',
                fontWeight: activeView === item.id ? 600 : 400,
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, fontSize: 11, marginLeft: 6 }}>
          <span style={{ color: '#86efac' }}>🔒 Encrypted</span>
          <span style={{ color: '#86efac' }}>🛡️ Air-Gapped</span>
        </div>
      </div>

      {/* ── Main content ── */}
      {activeView === 'dashboard' ? (
        /* 3-column dashboard */
        <main style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: '1fr 320px 300px',
          height: 'calc(100vh - 116px)',
          overflow: 'hidden',
        }}>
          {/* Left: Chat */}
          <div style={{
            borderRight: '1px solid var(--border-light)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            background: 'var(--surface)',
          }}>
            <div style={{
              padding: '10px 16px', borderBottom: '1px solid var(--border-light)',
              display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)',
            }}>
              <span style={{ fontSize: 16 }}>💬</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)' }}>AI Assistant</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Agentic · Multimodal · On-Premise</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="status-dot live" />
                <span style={{ fontSize: 11, color: 'var(--india-green)', fontWeight: 600 }}>Model Pool Active</span>
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <ChatPane onTaskComplete={handleTaskComplete} />
            </div>
          </div>

          {/* Middle: Task Dashboard */}
          <div style={{
            borderRight: '1px solid var(--border-light)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            background: 'var(--off-white)',
          }}>
            <div style={{
              padding: '10px 16px', borderBottom: '1px solid var(--border-light)',
              display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)',
            }}>
              <span>📋</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)' }}>Task Dashboard</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Plan → Route → Act → Observe → Deliver</div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
              <TaskDashboard refreshKey={refreshKey} />
            </div>
          </div>

          {/* Right: Sovereignty Panel */}
          <div style={{
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            background: 'var(--off-white)',
          }}>
            <div style={{
              padding: '10px 16px', borderBottom: '1px solid var(--border-light)',
              display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)',
            }}>
              <span>🛡️</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)' }}>Sovereignty Monitor</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Live egress · Models · Files</div>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
              <SovereigntyPanel refreshKey={refreshKey} />
            </div>
          </div>
        </main>
      ) : (
        /* Audit Trail full-width view */
        <main style={{ flex: 1, overflowY: 'auto', padding: 24, maxWidth: 900, width: '100%', margin: '0 auto' }}>
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>
              📜 Immutable Audit Trail
            </h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Every agent action, model call, tool invocation, and file generated is recorded here. Hash-chained and append-only.
            </p>
          </div>
          <AuditTrail />
        </main>
      )}

      {/* Footer */}
      <div style={{
        background: 'var(--navy-dark)', color: 'rgba(255,255,255,0.45)',
        padding: '5px 20px', fontSize: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>© 2026 Mangalore Refinery and Petrochemicals Limited · भारत सरकार · Ministry of Petroleum</span>
        <span>SIH26117 · Team Metamorphosis · v1.0 Prototype</span>
        <span>🔒 All data stays on-premise</span>
      </div>
    </div>
  );
}
