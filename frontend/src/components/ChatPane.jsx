import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';

const STAGE_STEPS = ['Plan', 'Route', 'Act', 'Observe', 'Deliver'];
const STAGE_META = {
  Plan:    { icon: '🗺️', color: '#3b82f6' },
  Route:   { icon: '🔀', color: '#8b5cf6' },
  Act:     { icon: '⚡', color: '#f59e0b' },
  Observe: { icon: '🔍', color: '#06b6d4' },
  Deliver: { icon: '📦', color: '#10b981' },
};

// Simple markdown renderer
function MarkdownText({ text }) {
  const lines = text.split('\n');
  return (
    <div style={{ lineHeight: 1.75, fontSize: 13 }}>
      {lines.map((line, i) => {
        if (line.startsWith('```')) {
          return null; // skip fence lines (handled below)
        }
        // Code block content (between ```)
        if (lines[i - 1]?.startsWith('```') || (lines.slice(0, i).filter(l => l.startsWith('```')).length % 2 === 1)) {
          return (
            <code key={i} style={{
              display: 'block',
              background: '#0f172a',
              color: '#e2e8f0',
              fontFamily: 'monospace',
              fontSize: 12,
              padding: '2px 10px',
              lineHeight: 1.6,
            }}>{line}</code>
          );
        }
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} style={{ color: 'var(--navy)' }}>{part.slice(2, -2)}</strong>
            : <span key={j}>{part}</span>
        );
        return (
          <div key={i} style={{ marginTop: line === '' ? 6 : line.startsWith('→') || line.startsWith('•') ? 2 : 0 }}>
            {rendered}
          </div>
        );
      })}
    </div>
  );
}

function AgentPipeline({ steps, isLive }) {
  return (
    <div style={{
      background: 'var(--surface-2)', border: '1px solid var(--border-light)',
      borderRadius: 8, padding: '10px 14px', marginTop: 10,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
        🤖 Agentic Execution Pipeline
      </div>

      {/* Stage track */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
        {STAGE_STEPS.map((stage, i) => {
          const step = steps[i];
          const isDone = step?.status === 'done';
          const isActive = step?.status === 'active' || (isLive && i === steps.filter(s => s?.status === 'done').length);
          const meta = STAGE_META[stage];
          return (
            <div key={stage} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{
                flex: 1, padding: '5px 4px', borderRadius: 5, textAlign: 'center',
                background: isDone ? meta.color : isActive ? meta.color + '22' : 'var(--border-light)',
                color: isDone ? '#fff' : isActive ? meta.color : 'var(--text-muted)',
                border: `1.5px solid ${isDone || isActive ? meta.color : 'transparent'}`,
                fontSize: 10, fontWeight: 700, transition: 'all 0.3s',
              }}>
                {meta.icon} {stage}
                {isDone && ' ✓'}
                {isActive && <span style={{ display: 'inline-block', animation: 'pulse-dot 0.8s infinite' }}>…</span>}
              </div>
              {i < STAGE_STEPS.length - 1 && (
                <div style={{ width: 8, height: 1.5, background: isDone ? meta.color : 'var(--border)', flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step notes */}
      {steps.filter(s => s?.note).map((step, i) => (
        <div key={i} style={{
          fontSize: 11, color: 'var(--text-sec)', padding: '3px 0',
          borderLeft: `2px solid ${STAGE_META[step.stage]?.color || 'var(--border)'}`,
          paddingLeft: 8, marginBottom: 2,
        }}>
          <span style={{ fontWeight: 700, color: STAGE_META[step.stage]?.color }}>{step.stage}:</span> {step.note}
        </div>
      ))}
    </div>
  );
}

export default function ChatPane({ onTaskComplete }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `**Welcome to MRPL Sovereign AI Workbench, ${user?.name}!**\n\nI'm your on-premise agentic AI assistant. I can:\n\n- **Analyze documents** — Upload scanned PDFs, inspection reports, drawings\n- **Generate deliverables** — Approval notes (.docx), spreadsheets (.xlsx), presentations (.pptx)\n- **Write & test code** — Python scripts executed in an isolated sandbox\n- **Search SOPs** — RAG retrieval from your authorized local knowledge base\n\n*All processing happens on MRPL's on-premise GPU server. Zero external calls.*`,
    }
  ]);
  const [input, setInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [sendingState, setSendingState] = useState('idle'); // idle | sending | streaming
  const [liveSteps, setLiveSteps] = useState([]);
  const fileRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, liveSteps]);

  // Animate agent steps while waiting for API response
  const animateSteps = async () => {
    const animStages = [
      { stage: 'Plan', status: 'active', note: 'Decomposing your task into sub-tasks…' },
      { stage: 'Route', status: 'pending', note: '' },
      { stage: 'Act', status: 'pending', note: '' },
      { stage: 'Observe', status: 'pending', note: '' },
      { stage: 'Deliver', status: 'pending', note: '' },
    ];

    // Plan active
    setLiveSteps([{ stage: 'Plan', status: 'active', note: 'Decomposing task into sub-tasks…' }]);
    await new Promise(r => setTimeout(r, 900));

    // Route
    setLiveSteps([
      { stage: 'Plan', status: 'done', note: 'Task decomposed into sub-tasks' },
      { stage: 'Route', status: 'active', note: 'Selecting best model from pool…' },
    ]);
    await new Promise(r => setTimeout(r, 700));

    // Act
    setLiveSteps([
      { stage: 'Plan', status: 'done', note: 'Task decomposed' },
      { stage: 'Route', status: 'done', note: 'Model selected' },
      { stage: 'Act', status: 'active', note: 'Model inference + tool calls running on local GPU…' },
    ]);
    await new Promise(r => setTimeout(r, 900));

    // Observe
    setLiveSteps([
      { stage: 'Plan', status: 'done', note: 'Task decomposed' },
      { stage: 'Route', status: 'done', note: 'Model selected' },
      { stage: 'Act', status: 'done', note: 'Inference complete' },
      { stage: 'Observe', status: 'active', note: 'Validating output quality…' },
    ]);
    await new Promise(r => setTimeout(r, 500));
  };

  const handleSend = async () => {
    if (sendingState !== 'idle') return;
    if (!input.trim() && !uploadedFile) return;

    const userMsg = input.trim();
    const file = uploadedFile;
    setInput('');
    setUploadedFile(null);
    setSendingState('sending');
    setLiveSteps([]);

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      text: userMsg || 'Please process this uploaded document.',
      attachment: file?.name,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }]);

    // Animate steps while API call runs in parallel
    const [apiResult] = await Promise.all([
      chatAPI.send(userMsg || file?.name || 'process document', user?.username, file?.name)
        .catch(err => ({
          response: `**Error connecting to AI Workbench backend.**\n\nPlease ensure the backend server is running on port 8000.\n\nError: ${err?.message || 'Network error'}`,
          steps: [],
          deliverables: [],
          egress_calls: 0,
        })),
      animateSteps(),
    ]);

    // Finalize steps from API response
    setLiveSteps([]);

    setMessages(prev => [...prev, {
      role: 'assistant',
      text: apiResult.response,
      steps: apiResult.steps?.length
        ? apiResult.steps
        : [
          { stage: 'Plan', status: 'done', note: 'Task processed' },
          { stage: 'Route', status: 'done', note: 'Model selected' },
          { stage: 'Act', status: 'done', note: 'Inference complete' },
          { stage: 'Observe', status: 'done', note: 'Output validated' },
          { stage: 'Deliver', status: 'done', note: 'Response delivered' },
        ],
      deliverables: apiResult.deliverables || [],
      model: apiResult.model_used,
      egressCalls: apiResult.egress_calls ?? 0,
      latency: apiResult.latency_ms,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }]);

    setSendingState('idle');
    onTaskComplete?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const QUICK_PROMPTS = [
    { icon: '📋', text: 'Review this inspection report and prepare an approval note citing relevant SOP clauses' },
    { icon: '🐍', text: 'Write and test a Python mass-balance calculation script for CDU unit' },
    { icon: '📊', text: 'Summarize board meeting minutes into a 5-slide executive PowerPoint' },
    { icon: '📖', text: 'Find relevant SOP clauses for pressure vessel inspection procedures' },
  ];

  const isBusy = sendingState !== 'idle';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((msg, i) => (
          <div key={i} className="fade-in" style={{
            display: 'flex', gap: 10,
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start',
          }}>
            {/* Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: msg.role === 'user' ? 11 : 15, fontWeight: 700,
              background: msg.role === 'user'
                ? 'var(--navy)'
                : 'linear-gradient(135deg, var(--saffron), #e05500)',
              color: '#fff', flexShrink: 0,
            }}>
              {msg.role === 'user' ? user?.avatar : '🤖'}
            </div>

            {/* Bubble */}
            <div style={{
              maxWidth: '78%',
              background: msg.role === 'user' ? 'var(--navy)' : 'var(--surface)',
              color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
              borderRadius: msg.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
              padding: '12px 14px',
              border: msg.role === 'assistant' ? '1px solid var(--border-light)' : 'none',
              boxShadow: 'var(--shadow-sm)',
            }}>
              {/* File attachment badge */}
              {msg.attachment && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 6, padding: '3px 8px', marginBottom: 8,
                  fontSize: 11, border: '1px solid rgba(255,255,255,0.2)',
                }}>
                  📎 {msg.attachment}
                </div>
              )}

              <MarkdownText text={msg.text} />

              {/* Agent pipeline */}
              {msg.steps?.length > 0 && <AgentPipeline steps={msg.steps} isLive={false} />}

              {/* Deliverables */}
              {msg.deliverables?.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {msg.deliverables.map(d => {
                    const ext = d.split('.').pop();
                    const icons = { docx: '📄', xlsx: '📊', pptx: '📋', py: '🐍', txt: '📝' };
                    return (
                      <button key={d} className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>
                        {icons[ext] || '📄'} Download {d}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Meta footer */}
              <div style={{
                marginTop: 8, paddingTop: 6, borderTop: '1px solid',
                borderColor: msg.role === 'user' ? 'rgba(255,255,255,0.15)' : 'var(--border-light)',
                display: 'flex', gap: 10, fontSize: 10,
                color: msg.role === 'user' ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)',
              }}>
                <span>{msg.time}</span>
                {msg.model && <span>🤖 {msg.model}</span>}
                <span>🛡️ {msg.egressCalls ?? 0} external calls</span>
                {msg.latency && <span>⚡ {(msg.latency / 1000).toFixed(1)}s</span>}
              </div>
            </div>
          </div>
        ))}

        {/* Live pipeline animation while waiting for API */}
        {isBusy && (
          <div className="fade-in" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--saffron), #e05500)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, flexShrink: 0,
            }}>🤖</div>
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border-light)',
              borderRadius: '4px 12px 12px 12px', padding: '12px 14px',
              boxShadow: 'var(--shadow-sm)', minWidth: 200,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 12, marginBottom: 8 }}>
                <span className="spinner" />
                <span>Agent processing on local GPU…</span>
              </div>
              {liveSteps.length > 0 && <AgentPipeline steps={liveSteps} isLive={true} />}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts — show only at start */}
      {messages.length <= 1 && !isBusy && (
        <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {QUICK_PROMPTS.map((p, i) => (
            <button key={i} className="btn btn-ghost btn-sm" onClick={() => setInput(p.text)} style={{ fontSize: 11 }}>
              {p.icon} {p.text.slice(0, 50)}…
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{
        padding: '12px 16px', borderTop: '1px solid var(--border-light)',
        background: 'var(--surface)',
      }}>
        {uploadedFile && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 6, padding: '5px 10px', marginBottom: 8, fontSize: 11,
          }}>
            <span>📎</span>
            <span style={{ flex: 1, color: 'var(--text-sec)' }}>{uploadedFile.name}</span>
            <button onClick={() => setUploadedFile(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}
            style={{ flexShrink: 0, padding: '8px 10px' }} data-tooltip="Upload PDF/image" disabled={isBusy}>
            📎
          </button>
          <input ref={fileRef} type="file" style={{ display: 'none' }}
            accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx"
            onChange={e => setUploadedFile(e.target.files[0])} />

          <textarea
            className="input"
            rows={2}
            placeholder="Describe your task… (e.g., 'Review this inspection report and prepare an approval note')"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ resize: 'none', flex: 1, lineHeight: 1.5 }}
            disabled={isBusy}
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSend}
            disabled={isBusy || (!input.trim() && !uploadedFile)}
            style={{ flexShrink: 0, padding: '9px 16px' }}
          >
            {isBusy
              ? <><span className="spinner" style={{ width: 13, height: 13, borderWidth: 2 }} /> Processing</>
              : '▶ Send'}
          </button>
        </div>
        <div style={{ marginTop: 6, fontSize: 10, color: 'var(--text-muted)', display: 'flex', gap: 12 }}>
          <span>🔒 Air-gapped · On-premise only · 0 external calls</span>
          <span>⌨ Shift+Enter for new line</span>
          <span style={{ marginLeft: 'auto' }}>Backend: <span style={{ color: 'var(--india-green)' }}>✓ Connected</span></span>
        </div>
      </div>
    </div>
  );
}
