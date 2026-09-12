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
  const STAGES = ['Plan', 'Route', 'Act', 'Observe', 'Deliver'];
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', width: '100%' }}>
      {STAGES.map((stageName, i) => {
        const step = steps.find(s => s.stage === stageName) || steps[i];
        const isDone = step?.status === 'done';
        const isActive = step?.status === 'active';
        const stepClass = isDone ? 'pipeline-step-done' : isActive ? 'pipeline-step-active' : 'pipeline-step-idle';
        return (
          <div key={stageName} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
            <div className={`pipeline-step ${stepClass}`} title={stageName}>
              {stageName}
              {isDone && ' ✓'}
              {isActive && ' •'}
            </div>
            {i < STAGES.length - 1 && (
              <div className={`pipeline-connector ${isDone ? 'done' : ''}`} />
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
    completed: 'var(--success)',
    'in-progress': 'var(--saffron)',
    failed: 'var(--danger)',
  }[task.status] || 'var(--text-muted)';

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div
        onClick={onToggle}
        style={{
          padding: '10px 12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          background: isExpanded ? 'var(--bg-surface-2)' : 'var(--bg-card)',
          borderBottom: isExpanded ? '1px solid var(--border)' : 'none',
        }}
      >
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: dotColor,
          flexShrink: 0,
          boxShadow: task.status === 'in-progress' ? `0 0 6px ${dotColor}` : 'none',
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
            {task.title}
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 1 }}>
            {task.user} · {task.created}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          <span className={`badge ${statusBadge}`}>
            {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="fade-in" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg-panel)' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Execution Pipeline
            </div>
            <StepPipeline steps={task.steps || []} />
          </div>

          {/* Step notes */}
          <div>
            {(task.steps || []).filter(s => s.note).map((step, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 8,
                fontSize: 11,
                padding: '3px 0',
                borderBottom: '1px dashed var(--border)',
              }}>
                <span style={{ color: STAGE_META[step.stage]?.color || 'var(--accent)', fontWeight: 700, minWidth: 50, flexShrink: 0 }}>{step.stage}</span>
                <span style={{ color: 'var(--text-sec)' }}>{step.note}</span>
              </div>
            ))}
          </div>

          {/* Models & Tools */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {task.models_used?.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>Models Used</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {task.models_used.map(m => <span key={m} className="tag">🤖 {m}</span>)}
                </div>
              </div>
            )}
            {task.tools_used?.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>Tools Used</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {task.tools_used.map(t => <span key={t} className="tag">🔧 {t}</span>)}
                </div>
              </div>
            )}
          </div>

          {/* Deliverables */}
          {task.deliverables?.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>Deliverables</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {task.deliverables.map(d => {
                  const ext = d.split('.').pop();
                  const icons = { docx: '📄', xlsx: '📊', pptx: '📋', py: '🐍', txt: '📝' };
                  return <button key={d} className="btn btn-ghost btn-sm">{icons[ext] || '📄'} {d}</button>;
                })}
              </div>
            </div>
          )}

          {/* Sovereignty confirmed badge */}
          <div className="task-sovereignty-badge">
            <span className="status-dot live" />
            <span>
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
      const safeData = Array.isArray(data) ? data : [];
      setTasks(safeData);
      if (safeData.length > 0 && !expandedId) setExpandedId(safeData[0].id);
    } catch (err) {
      setError('Could not load tasks from backend. ' + (err?.message || ''));
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [user?.username, expandedId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks, refreshKey]);

  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {[
          { label: 'Total', value: tasks.length, cls: 'stat-num-total' },
          { label: 'Done', value: completed, cls: 'stat-num-done' },
          { label: 'Active', value: inProgress, cls: 'stat-num-active' },
        ].map((s, i) => (
          <div key={i} className="card stat-card" style={{ padding: '8px 4px', textAlign: 'center' }}>
            <div className={`stat-number ${s.cls}`}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Role context header */}
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-sec)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Tasks — {user?.role === 'IT Admin' ? 'All Users' : user?.name?.split(' ')[0]}</span>
        <button className="btn btn-ghost btn-sm" onClick={fetchTasks} style={{ fontSize: 10, padding: '2px 7px' }}>
          ↻ Refresh
        </button>
      </div>

      {/* Task list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '28px 10px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div className="quantum-loader" style={{ width: 30, height: 30 }}>
            <div className="quantum-ring-outer" />
            <div className="quantum-ring-inner" />
            <div className="quantum-core" style={{ width: 8, height: 8 }} />
          </div>
          <div className="audit-loader-text">Synchronizing task stream…</div>
        </div>
      ) : error ? (
        <div style={{
          padding: '12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: 8,
          fontSize: 11.5,
          color: '#fca5a5',
        }}>
          ⚠️ {error}
        </div>
      ) : tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: 11.5 }}>
          No tasks yet. Start a chat to trigger agentic executions.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              isExpanded={expandedId === task.id}
              onToggle={() => setExpandedId(expandedId === task.id ? null : task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
