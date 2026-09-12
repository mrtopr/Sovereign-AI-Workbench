import { useState, useEffect } from 'react';

const INIT_STEPS = [
  { id: 1, text: 'Establishing secure air-gapped IPC socket (192.168.10.0/24)', doneAt: 300 },
  { id: 2, text: 'Binding local GPU tensor weights (LLaMA-3.1-70B + Qwen2.5)', doneAt: 750 },
  { id: 3, text: 'Mounting authorized knowledge base from Qdrant vector DB', doneAt: 1200 },
  { id: 4, text: 'Enforcing zero-egress firewall & immutable SHA-256 audit ledger', doneAt: 1550 },
];

export default function InitializingLoader({ user, onComplete }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setCompletedSteps(p => [...p, 1]);
      setProgress(40);
    }, 300);

    const t2 = setTimeout(() => {
      setCompletedSteps(p => [...p, 2]);
      setProgress(68);
    }, 750);

    const t3 = setTimeout(() => {
      setCompletedSteps(p => [...p, 3]);
      setProgress(88);
    }, 1200);

    const t4 = setTimeout(() => {
      setCompletedSteps(p => [...p, 4]);
      setProgress(100);
    }, 1550);

    const t5 = setTimeout(() => {
      onComplete?.();
    }, 1900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <div className="init-loader-shell">
      {/* ── SOLID TRICOLOR STRIPE AT VERY TOP ── */}
      <div className="tricolor-stripe" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} />

      {/* Aurora mesh orbs in background */}
      <div className="init-aurora-orb" />

      {/* Central Glass Card */}
      <div className="init-loader-card fade-in">
        {/* Quantum Spinner */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div className="quantum-loader" style={{ width: 44, height: 44 }}>
            <div className="quantum-ring-outer" />
            <div className="quantum-ring-inner" />
            <div className="quantum-core" style={{ width: 12, height: 12 }} />
          </div>
        </div>

        <div className="init-loader-title">
          MRPL Sovereign AI Workbench
        </div>
        <div className="init-loader-sub">
          भारत सरकार · Ministry of Petroleum &amp; Natural Gas · A Miniratna Enterprise
        </div>

        {/* User context greeting */}
        <div className="init-session-badge">
          <span>👤</span>
          <span>Preparing Session for <strong>{user?.name || 'Authorized Officer'}</strong> ({user?.department || 'Operations'})</span>
        </div>

        {/* Progress Bar */}
        <div className="init-progress-track">
          <div className="init-progress-bar" style={{ width: `${progress}%` }} />
        </div>

        {/* Telemetry checklist */}
        <div className="init-telemetry-box">
          {INIT_STEPS.map(s => {
            const isDone = completedSteps.includes(s.id);
            return (
              <div key={s.id} className={`init-telemetry-item ${isDone ? 'done' : 'pending'}`}>
                <span className={`init-check-icon ${isDone ? 'done' : 'pending'}`}>
                  {isDone ? '✓' : '○'}
                </span>
                <span style={{ flex: 1 }}>{s.text}</span>
              </div>
            );
          })}
        </div>

        <div className="init-footer-note">
          <span>🔒</span>
          <span>100% On-Premise GPU Cluster · Zero External Network Transmission</span>
        </div>
      </div>

      {/* Pinned Bottom Status Bar */}
      <div className="statusbar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <div className="statusbar-item ok">✔ Zero Egress</div>
        <div className="statusbar-item ok">✔ Air-Gapped</div>
        <div className="statusbar-item ok">✔ On-Premise GPU</div>
        <div className="statusbar-right">
          <span>SIH26117 · Team Metamorphosis</span>
          <span style={{ color: 'var(--saffron)', fontWeight: 600 }}>🇮🇳 Digital India</span>
        </div>
      </div>
    </div>
  );
}
