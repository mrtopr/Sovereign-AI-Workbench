import { useState, useEffect, useCallback } from 'react';
import { egressAPI, modelsAPI, knowledgeAPI, systemAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function SovereigntyBanner({ summary, error }) {
  const external = summary?.external_attempts ?? 0;

  return (
    <div style={{
      background: external > 0
        ? 'linear-gradient(135deg, #450a0a, #7f1d1d)'
        : 'linear-gradient(135deg, #052e16, #14532d)',
      border: `1px solid ${external > 0 ? '#991b1b' : '#166534'}`,
      borderRadius: 'var(--radius-lg)',
      padding: '16px 18px',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.015) 20px, rgba(255,255,255,0.015) 40px)',
      }} />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 38, height: 38,
            background: external > 0 ? 'rgba(220,38,38,0.2)' : 'rgba(134,239,172,0.15)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, border: `1px solid ${external > 0 ? 'rgba(220,38,38,0.4)' : 'rgba(134,239,172,0.3)'}`,
          }}>
            {external > 0 ? '⚠️' : '🛡️'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Sovereignty Monitor</div>
            <div style={{ fontSize: 11, color: external > 0 ? '#fca5a5' : '#86efac' }}>
              {error ? 'Backend disconnected' : external > 0 ? 'ALERT: External traffic detected!' : 'Real-time egress verification — SECURE'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: 32, fontWeight: 800, lineHeight: 1,
              color: external > 0 ? '#f87171' : '#4ade80',
            }}>{external}</div>
            <div style={{ fontSize: 10, color: external > 0 ? '#fca5a5' : '#86efac' }}>External Calls</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[
            { label: 'Internal API calls', value: summary?.internal_calls ?? '—' },
            { label: 'Blocked attempts', value: external === 0 ? '0 ✓' : `${external} ⚠️` },
            { label: 'Network scope', value: summary?.network_cidr ?? '192.168.10.0/24' },
            { label: 'Status', value: summary?.sovereignty_status ?? 'CONFIRMED' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.06)', borderRadius: 7,
              padding: '7px 10px', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ fontSize: 10, color: '#86efac', marginBottom: 1 }}>{item.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {summary?.last_checked && (
          <div style={{ marginTop: 8, fontSize: 10, color: 'rgba(134,239,172,0.6)', textAlign: 'center' }}>
            Last verified: {new Date(summary.last_checked).toLocaleTimeString('en-IN')}
          </div>
        )}
      </div>
    </div>
  );
}

function ModelPoolPanel({ models, loading }) {
  return (
    <div className="card">
      <div className="card-header">
        <span>🤖</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)' }}>Model Pool</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {loading ? 'Loading…' : `${models.length} models on-premise`}
          </div>
        </div>
        <span className="badge badge-green">All Active</span>
      </div>
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: 12 }}>
            <span className="spinner" style={{ display: 'inline-block', marginRight: 8 }} />Loading models…
          </div>
        ) : models.map(m => (
          <div key={m.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px', background: 'var(--surface-2)',
            borderRadius: 8, border: '1px solid var(--border-light)',
          }}>
            <span className="status-dot live" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.model}</div>
              <div style={{ display: 'flex', gap: 4, marginTop: 3, flexWrap: 'wrap' }}>
                {m.task_tags?.map(t => <span key={t} className="tag" style={{ fontSize: 9, padding: '1px 5px' }}>{t}</span>)}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-sec)' }}>{m.calls} calls</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>~{m.avg_latency}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.vram}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EgressLogPanel({ log, loading }) {
  return (
    <div className="card">
      <div className="card-header">
        <span>📡</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)' }}>Network Activity</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>All internal — no external traffic</div>
        </div>
        <span className="badge badge-green">{log.length} entries</span>
      </div>
      <div style={{ maxHeight: 200, overflowY: 'auto', padding: '8px 14px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: 12 }}>Loading…</div>
        ) : log.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: 12 }}>No entries yet.</div>
        ) : log.map((entry, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '4px 0', fontSize: 11,
            borderBottom: i < log.length - 1 ? '1px dashed var(--border-light)' : 'none',
          }}>
            <span style={{ color: entry.allowed ? 'var(--india-green)' : 'var(--danger)', fontWeight: 700, flexShrink: 0 }}>
              {entry.allowed ? '✓' : '✗'}
            </span>
            <span style={{ color: 'var(--text-muted)', flexShrink: 0, minWidth: 46 }}>{entry.time}</span>
            <span style={{ color: 'var(--text-sec)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {entry.source} → {entry.destination}
            </span>
            <span className={`badge ${entry.allowed ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 9, flexShrink: 0 }}>
              {entry.allowed ? 'INTERNAL' : 'BLOCKED'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeliverablesPanel() {
  const allDeliverables = [
    { name: 'approval_note_CDU-2891.docx', taskId: 'task-001', size: '42 KB' },
    { name: 'mass_balance.py', taskId: 'task-002', size: '3 KB' },
    { name: 'execution_log.txt', taskId: 'task-002', size: '1 KB' },
  ];
  const icons = { docx: '📄', xlsx: '📊', pptx: '📋', py: '🐍', txt: '📝' };

  return (
    <div className="card">
      <div className="card-header">
        <span>📥</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)' }}>Generated Deliverables</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Stored on MRPL MinIO object store</div>
        </div>
      </div>
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {allDeliverables.map((d, i) => {
          const ext = d.name.split('.').pop();
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
              background: 'var(--surface-2)', borderRadius: 8, border: '1px solid var(--border-light)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 20 }}>{icons[ext] || '📄'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Task {d.taskId} · {d.size}</div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ fontSize: 10, padding: '3px 8px', flexShrink: 0 }}>⬇</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KnowledgePanel({ collections, loading }) {
  return (
    <div className="card">
      <div className="card-header">
        <span>📚</span>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)' }}>Your Knowledge Collections</div>
      </div>
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: 12 }}>Loading…</div>
        ) : collections.map(kc => (
          <div key={kc.id} style={{
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 11,
            padding: '6px 8px', background: 'var(--surface-2)', borderRadius: 6,
            border: '1px solid var(--border-light)',
          }}>
            <span>📖</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{kc.name}</div>
              <div style={{ color: 'var(--text-muted)' }}>{kc.documents} docs · {kc.chunks?.toLocaleString()} chunks · {kc.size}</div>
            </div>
            <span className="badge badge-blue" style={{ fontSize: 9, flexShrink: 0 }}>{kc.last_updated}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SovereigntyPanel({ refreshKey }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('sovereignty');
  const [egressSummary, setEgressSummary] = useState(null);
  const [egressLog, setEgressLog] = useState([]);
  const [models, setModels] = useState([]);
  const [collections, setCollections] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState({ egress: true, models: true, knowledge: true });
  const [summaryError, setSummaryError] = useState(null);

  const fetchAll = useCallback(async () => {
    // Fetch egress summary
    egressAPI.summary()
      .then(d => { setEgressSummary(d); setSummaryError(null); })
      .catch(() => setSummaryError('Backend offline'))
      .finally(() => setLoading(p => ({ ...p, egress: false })));

    egressAPI.log().then(d => setEgressLog(d)).catch(() => {});
    systemAPI.status().then(d => setSystemStatus(d)).catch(() => {});

    modelsAPI.list()
      .then(d => setModels(d))
      .catch(() => {})
      .finally(() => setLoading(p => ({ ...p, models: false })));

    knowledgeAPI.collections(user?.username)
      .then(d => setCollections(d))
      .catch(() => {})
      .finally(() => setLoading(p => ({ ...p, knowledge: false })));
  }, [user?.username]);

  useEffect(() => { fetchAll(); }, [fetchAll, refreshKey]);

  // Auto-refresh egress summary every 5s
  useEffect(() => {
    const t = setInterval(() => {
      egressAPI.summary().then(d => setEgressSummary(d)).catch(() => {});
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'sovereignty' ? 'active' : ''}`} onClick={() => setActiveTab('sovereignty')}>🛡️ Monitor</button>
        <button className={`tab ${activeTab === 'models' ? 'active' : ''}`} onClick={() => setActiveTab('models')}>🤖 Models</button>
        <button className={`tab ${activeTab === 'files' ? 'active' : ''}`} onClick={() => setActiveTab('files')}>📥 Files</button>
      </div>

      {activeTab === 'sovereignty' && (
        <>
          <SovereigntyBanner summary={egressSummary} error={summaryError} />
          <EgressLogPanel log={egressLog} loading={loading.egress} />

          {/* System stats */}
          {systemStatus && (
            <div className="card">
              <div className="card-header">
                <span>📊</span>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--navy)' }}>System Status</div>
              </div>
              <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                {[
                  { label: 'Models Loaded', value: systemStatus.models_loaded, icon: '🤖' },
                  { label: 'Active Users', value: systemStatus.active_users, icon: '👤' },
                  { label: 'Tasks Today', value: systemStatus.total_tasks, icon: '📋' },
                  { label: 'Completed', value: systemStatus.completed_tasks, icon: '✅' },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: 'var(--surface-2)', borderRadius: 8, padding: '8px 10px',
                    border: '1px solid var(--border-light)',
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.icon} {s.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginTop: 2 }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'models' && (
        <>
          <ModelPoolPanel models={models} loading={loading.models} />
          <KnowledgePanel collections={collections} loading={loading.knowledge} />
        </>
      )}

      {activeTab === 'files' && <DeliverablesPanel />}
    </div>
  );
}
