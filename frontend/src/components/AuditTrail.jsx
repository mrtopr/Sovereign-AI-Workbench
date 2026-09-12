import { useState, useEffect, useCallback } from 'react';
import { auditAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Could not load audit trail: ' + (err?.message || 'Network error'));
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => { fetch(); }, [fetch]);

  const safeEntries = Array.isArray(entries) ? entries : [];
  const filtered = filter === 'all' ? safeEntries : safeEntries.filter(e => e.action === filter);
  const uniqueActions = [...new Set(safeEntries.map(e => e.action))];

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
        <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div className="quantum-loader" style={{ width: 32, height: 32 }}>
            <div className="quantum-ring-outer" />
            <div className="quantum-ring-inner" />
            <div className="quantum-core" style={{ width: 10, height: 10 }} />
          </div>
          <div className="audit-loader-text">Verifying immutable hash-chain blocks…</div>
        </div>
      ) : error ? (
        <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 8, fontSize: 12, color: 'var(--danger)' }}>
          ⚠️ {error}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map((entry, i) => {
            const isFailed = entry.action === 'TASK_FAILED';
            const actionSlug = (entry.action || 'default').toLowerCase().replace(/_/g, '-');
            const icon = ACTION_ICONS[entry.action] || '●';
            return (
              <div key={i} className={`fade-in audit-entry audit-entry-${actionSlug} ${isFailed ? 'audit-entry-failed' : ''}`}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 2 }}>
                    <span className={`audit-action audit-action-${actionSlug} ${isFailed ? 'audit-action-failed' : ''}`}>
                      {entry.action}
                    </span>
                    <span className="audit-actor">
                      👤 {entry.actor}
                    </span>
                    {entry.task_id && (
                      <span className="audit-task-id">
                        🆔 {entry.task_id}
                      </span>
                    )}
                  </div>
                  <div className="audit-resource">
                    {entry.resource}
                  </div>
                </div>
                <div className="audit-time">
                  {entry.time}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Immutability notice */}
      <div className="audit-immutability-notice">
        🔒 Audit log is append-only (hash-chained). Entries cannot be modified after creation.
      </div>
    </div>
  );
}
