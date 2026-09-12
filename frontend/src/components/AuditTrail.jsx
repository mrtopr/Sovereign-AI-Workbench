import { useState, useEffect, useCallback } from 'react';
import { auditAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ACTION_COLORS = {
  TASK_CREATED: '#3b82f6',
  MODEL_CALL: '#8b5cf6',
  TOOL_CALL: '#f59e0b',
  TASK_COMPLETE: '#10b981',
  TASK_FAILED: '#ef4444',
};

const ACTION_ICONS = {
  TASK_CREATED: '📋',
  MODEL_CALL: '🤖',
  TOOL_CALL: '🔧',
  TASK_COMPLETE: '✅',
  TASK_FAILED: '❌',
};

export default function AuditTrail({ taskId = null }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await auditAPI.list(taskId);
      setEntries(data);
    } catch (err) {
      setError('Could not load audit trail: ' + (err?.message || 'Network error'));
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = filter === 'all' ? entries : entries.filter(e => e.action === filter);
  const uniqueActions = [...new Set(entries.map(e => e.action))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <select
          className="input"
          style={{ width: 'auto', flex: 1, minWidth: 160 }}
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All Actions</option>
          {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <button className="btn btn-ghost btn-sm" onClick={fetch}>↻ Refresh</button>
        <span className="badge badge-blue">{filtered.length} entries</span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
          <span className="spinner" style={{ display: 'inline-block', marginRight: 8 }} />Loading audit trail…
        </div>
      ) : error ? (
        <div style={{ padding: '12px', background: '#fee2e2', borderRadius: 8, fontSize: 12, color: '#b91c1c' }}>⚠️ {error}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filtered.map((entry, i) => {
            const color = ACTION_COLORS[entry.action] || '#94a3b8';
            const icon = ACTION_ICONS[entry.action] || '●';
            return (
              <div key={i} className="fade-in" style={{
                display: 'flex', gap: 10, padding: '9px 12px',
                background: 'var(--surface)', border: '1px solid var(--border-light)',
                borderRadius: 8, borderLeft: `3px solid ${color}`,
                alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color }}>{entry.action}</span>
                    <span className="tag" style={{ fontSize: 10 }}>👤 {entry.actor}</span>
                    {entry.task_id && <span className="tag" style={{ fontSize: 10 }}>🆔 {entry.task_id}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-sec)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.resource}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0, fontFamily: 'monospace' }}>
                  {entry.time}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Immutability notice */}
      <div style={{
        fontSize: 11, color: 'var(--text-muted)', textAlign: 'center',
        padding: '8px', background: 'var(--surface-2)', borderRadius: 6,
        border: '1px solid var(--border-light)',
      }}>
        🔒 Audit log is append-only (hash-chained). Entries cannot be modified after creation.
      </div>
    </div>
  );
}
