import { useState, useEffect, useCallback } from 'react';
import { egressAPI, modelsAPI, knowledgeAPI, systemAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function SovereigntyBanner({ summary, error }) {
  const external = summary?.external_attempts ?? 0;

  return (
    <div className={`sovereignty-banner-card ${external > 0 ? 'alert' : ''}`}>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div className="sovereignty-icon-box">
            {external > 0 ? '⚠️' : '🛡️'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: '#fff' }}>Sovereignty &amp; Egress Boundary</div>
            <div style={{ fontSize: 11.5, color: external > 0 ? '#fca5a5' : '#cbd5e1', marginTop: 1 }}>
              {error ? 'Backend disconnected' : external > 0 ? 'ALERT: External traffic detected!' : 'Real-time air-gap network monitoring — Zero External Calls'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={`sovereignty-external-counter ${external > 0 ? 'danger' : 'safe'}`}>{external}</div>
            <div style={{ fontSize: 10.5, color: '#cbd5e1', marginTop: 2, fontWeight: 600 }}>External Calls</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: 'Internal API Calls', value: summary?.internal_calls ?? '—', color: '#93c5fd' },
            { label: 'Blocked Attempts', value: external === 0 ? '0' : `${external} ⚠️`, color: '#38bdf8' },
            { label: 'Network Scope', value: summary?.network_cidr ?? '192.168.10.0/24', color: '#ffffff' },
            { label: 'Sovereignty', value: summary?.sovereignty_status ?? 'CONFIRMED ✓', color: '#4ade80' },
          ].map((item, i) => (
            <div key={i} className="sovereignty-stat-box">
              <div style={{ fontSize: 10.5, color: '#e2e8f0', marginBottom: 2, fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {summary?.last_checked && (
          <div style={{ marginTop: 10, fontSize: 10.5, color: '#cbd5e1', textAlign: 'right', fontWeight: 500 }}>
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
      <div className="card-head">
        <span>🤖</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>Model Pool</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {loading ? 'Loading…' : `${models.length} models on-premise`}
          </div>
        </div>
        <span className="badge badge-green">All Active</span>
      </div>
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div className="quantum-loader" style={{ width: 28, height: 28 }}>
              <div className="quantum-ring-outer" />
              <div className="quantum-ring-inner" />
              <div className="quantum-core" style={{ width: 8, height: 8 }} />
            </div>
            <div className="audit-loader-text">Enumerating GPU model weights…</div>
          </div>
        ) : models.map(m => (
          <div key={m.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px', background: 'var(--bg-surface-2)',
            borderRadius: 8, border: '1px solid var(--border)',
          }}>
            <span className="status-dot live" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
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
      <div className="card-head">
        <span>📡</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>Network Activity</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>All internal — zero external traffic</div>
        </div>
        <span className="badge badge-green">{log.length} entries</span>
      </div>
      <div style={{ maxHeight: 220, overflowY: 'auto', padding: '8px 14px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: 12 }}>Loading…</div>
        ) : log.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: 12 }}>No entries yet.</div>
        ) : log.map((entry, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '5px 0', fontSize: 11,
            borderBottom: i < log.length - 1 ? '1px dashed var(--border)' : 'none',
          }}>
            <span style={{ color: entry.allowed ? 'var(--success)' : 'var(--danger)', fontWeight: 700, flexShrink: 0 }}>
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
      <div className="card-head">
        <span>📥</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>Generated Deliverables</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Stored on MRPL MinIO on-premise object store</div>
        </div>
      </div>
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {allDeliverables.map((d, i) => {
          const ext = d.name.split('.').pop();
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
              background: 'var(--bg-surface-2)', borderRadius: 8, border: '1px solid var(--border)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 20 }}>{icons[ext] || '📄'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
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
      <div className="card-head">
        <span>📚</span>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>Your Knowledge Collections</div>
      </div>
      <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: 12 }}>Loading…</div>
        ) : collections.map(kc => (
          <div key={kc.id} style={{
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 11,
            padding: '6px 8px', background: 'var(--bg-surface-2)', borderRadius: 6,
            border: '1px solid var(--border)',
          }}>
            <span>📖</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{kc.name}</div>
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
    egressAPI.summary()
      .then(d => { setEgressSummary(d); setSummaryError(null); })
      .catch(() => setSummaryError('Backend offline'))
      .finally(() => setLoading(p => ({ ...p, egress: false })));

    egressAPI.log().then(d => setEgressLog(Array.isArray(d) ? d : [])).catch(() => setEgressLog([]));
    systemAPI.status().then(d => setSystemStatus(d)).catch(() => {});

    modelsAPI.list()
      .then(d => setModels(Array.isArray(d) ? d : []))
      .catch(() => setModels([]))
      .finally(() => setLoading(p => ({ ...p, models: false })));

    knowledgeAPI.collections(user?.username)
      .then(d => setCollections(Array.isArray(d) ? d : []))
      .catch(() => setCollections([]))
      .finally(() => setLoading(p => ({ ...p, knowledge: false })));
  }, [user?.username]);

  useEffect(() => { fetchAll(); }, [fetchAll, refreshKey]);

  useEffect(() => {
    const t = setInterval(() => {
      egressAPI.summary().then(d => setEgressSummary(d)).catch(() => {});
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
        <button
          className={`btn btn-sm ${activeTab === 'sovereignty' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('sovereignty')}
        >
          🛡️ Monitor
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'models' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('models')}
        >
          🤖 Models
        </button>
        <button
          className={`btn btn-sm ${activeTab === 'files' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('files')}
        >
          📥 Files
        </button>
      </div>

      {activeTab === 'sovereignty' && (
        <>
          <SovereigntyBanner summary={egressSummary} error={summaryError} />
          <EgressLogPanel log={egressLog} loading={loading.egress} />

          {/* System stats */}
          {systemStatus && (
            <div className="card">
              <div className="card-head">
                <span>📊</span>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>System Status</div>
              </div>
              <div style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                {[
                  { label: 'Models Loaded', value: systemStatus.models_loaded, icon: '🤖' },
                  { label: 'Active Users', value: systemStatus.active_users, icon: '👤' },
                  { label: 'Tasks Today', value: systemStatus.total_tasks, icon: '📋' },
                  { label: 'Completed', value: systemStatus.completed_tasks, icon: '✅' },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-surface-2)', borderRadius: 8, padding: '8px 10px',
                    border: '1px solid var(--border)',
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.icon} {s.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{s.value}</div>
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
