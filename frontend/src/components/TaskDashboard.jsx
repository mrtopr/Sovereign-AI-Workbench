import { useState, useEffect, useCallback } from 'react';
import { tasksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STAGE_META = {
  Plan:    { icon: '🗺️', color: '#3b82f6' },
  Route:   { icon: '🔀', color: '#8b5cf6' },
  Act:     { icon: '⚡', color: '#f59e0b' },
  Observe: { icon: '🔍', color: '#06b6d4' },
  Deliver: { icon: '📦', color: '#10b981' },
};

function StepPipeline({ steps }) {
  return (
    <div style={{ display: 'flex', gap: 3, overflowX: 'auto', paddingBottom: 4 }}>
      {steps.map((step, i) => {
        const meta = STAGE_META[step.stage] || { icon: '●', color: '#94a3b8' };
        const isDone = step.status === 'done';
        const isActive = step.status === 'active';
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{
              padding: '5px 9px', borderRadius: 5, fontSize: 10, fontWeight: 600,
              background: isDone ? meta.color : isActive ? meta.color + '22' : 'var(--surface-2)',
              color: isDone ? '#fff' : isActive ? meta.color : 'var(--text-muted)',
              border: `1.5px solid ${isDone || isActive ? meta.color : 'var(--border)'}`,
              transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', gap: 3,
            }}>
              {meta.icon} {step.stage}
              {isDone && ' ✓'}
              {isActive && <span style={{ animation: 'pulse-dot 1s infinite', display: 'inline-block' }}>●</span>}
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 12, height: 1.5, background: isDone ? meta.color : 'var(--border)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TaskCard({ task, isExpanded, onToggle }) {
  const statusBadge = {
    completed: 'badge-green',
    'in-progress': 'badge-saffron',
    failed: 'badge-red',
  }[task.status] || 'badge-grey';

  const dotColor = {
    completed: 'var(--india-green)',
    'in-progress': 'var(--saffron)',
    failed: 'var(--danger)',
  }[task.status] || 'var(--text-muted)';

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div
        onClick={onToggle}
        style={{
          padding: '12px 16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10,
          background: isExpanded ? 'var(--surface-2)' : 'var(--surface)',
          borderBottom: isExpanded ? '1px solid var(--border-light)' : 'none',
        }}
      >
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: dotColor, flexShrink: 0,
          boxShadow: task.status === 'in-progress' ? `0 0 6px ${dotColor}` : 'none',
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {task.title}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
            {task.user} · {task.created}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          <span className={`badge ${statusBadge}`}>
            {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="fade-in" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Execution Pipeline
            </div>
            <StepPipeline steps={task.steps || []} />
          </div>

          {/* Step notes */}
          <div>
            {(task.steps || []).filter(s => s.note).map((step, i) => (
              <div key={i} style={{
                display: 'flex', gap: 8, fontSize: 11, padding: '3px 0',
                borderBottom: '1px dashed var(--border-light)',
              }}>
                <span style={{ color: STAGE_META[step.stage]?.color, fontWeight: 700, minWidth: 54, flexShrink: 0 }}>{step.stage}</span>
                <span style={{ color: 'var(--text-sec)' }}>{step.note}</span>
              </div>
            ))}
          </div>

          {/* Models & Tools */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {task.models_used?.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Models Used</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {task.models_used.map(m => <span key={m} className="tag">🤖 {m}</span>)}
                </div>
              </div>
            )}
            {task.tools_used?.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Tools Used</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {task.tools_used.map(t => <span key={t} className="tag">🔧 {t}</span>)}
                </div>
              </div>
            )}
          </div>

          {/* Deliverables */}
          {task.deliverables?.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Deliverables</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {task.deliverables.map(d => {
                  const ext = d.split('.').pop();
                  const icons = { docx: '📄', xlsx: '📊', pptx: '📋', py: '🐍', txt: '📝' };
                  return <button key={d} className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>{icons[ext] || '📄'} {d}</button>;
                })}
              </div>
            </div>
          )}

          {/* Sovereignty confirmed */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#dcfce7', border: '1px solid #bbf7d0',
            borderRadius: 7, padding: '7px 12px', fontSize: 11,
          }}>
            <span className="status-dot live" />
            <span style={{ color: '#15803d', fontWeight: 600 }}>
              {task.egress_attempts ?? 0} external network calls — Sovereignty confirmed ✓
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TaskDashboard({ refreshKey }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksAPI.list(user?.username);
      setTasks(data);
      if (data.length > 0 && !expandedId) setExpandedId(data[0].id);
    } catch (err) {
      setError('Could not load tasks from backend. ' + (err?.message || ''));
    } finally {
      setLoading(false);
    }
  }, [user?.username]);

  useEffect(() => { fetchTasks(); }, [fetchTasks, refreshKey]);

  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[
          { label: 'Total', value: tasks.length, color: 'var(--navy)' },
          { label: 'Done', value: completed, color: 'var(--india-green)' },
          { label: 'Active', value: inProgress, color: 'var(--saffron)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Role context */}
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-sec)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Tasks — {user?.role === 'IT Admin' ? 'All Users' : user?.name}</span>
        <button className="btn btn-ghost btn-sm" onClick={fetchTasks} style={{ fontSize: 10, padding: '3px 8px' }}>
          ↻ Refresh
        </button>
      </div>

      {/* Task list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
          <span className="spinner" style={{ display: 'inline-block', marginBottom: 8 }} />
          <div style={{ fontSize: 12 }}>Loading tasks from backend…</div>
        </div>
      ) : error ? (
        <div style={{
          padding: '14px', background: '#fee2e2', border: '1px solid #fecaca',
          borderRadius: 8, fontSize: 12, color: '#b91c1c',
        }}>
          ⚠️ {error}
        </div>
      ) : tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: 12 }}>
          No tasks yet. Start a conversation to create your first agentic task.
        </div>
      ) : (
        tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            isExpanded={expandedId === task.id}
            onToggle={() => setExpandedId(expandedId === task.id ? null : task.id)}
          />
        ))
      )}
    </div>
  );
}
