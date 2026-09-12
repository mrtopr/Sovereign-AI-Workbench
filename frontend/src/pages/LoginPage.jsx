import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { DEMO_USERS } from "../data/mockData";

export default function LoginPage() {
  const { login, error } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(username, password);
    setLoading(false);
  };

  const AVATAR_COLORS = {
    'RS': 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    'DN': 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    'MK': 'linear-gradient(135deg, #f97316, #c2410c)',
    'AP': 'linear-gradient(135deg, #6366f1, #4338ca)',
  };

  return (
    <div className="login-shell">
      {/* ── SOLID TRICOLOR STRIPE AT VERY TOP ── */}
      <div className="tricolor-stripe" />

      {/* ── TOPBAR ── */}
      <div className="login-topbar">
        <span style={{ fontSize: 22 }}>🏛️</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            MRPL — Sovereign AI Workbench
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'Noto Sans Devanagari', 'Inter', sans-serif" }}>
            भारत सरकार · Government of India · Ministry of Petroleum &amp; Natural Gas
          </div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            type="button"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          <span className="topbar-badge saffron">
            <span>🇮🇳</span>
            <span>Digital India</span>
          </span>
          <div className="topbar-badge vision">
            <span>🏛️</span>
            <span>Vision: <strong style={{ color: 'var(--text-primary)' }}>PM Shri Narendra Modi</strong></span>
          </div>
        </div>
      </div>

      {/* ── MAIN LOGIN CONTAINER ── */}
      <div className="login-main">
        <div className="login-card fade-in">

          {/* Left Info Panel */}
          <div className="login-left">
            <div>
              <div className="login-left-icon" style={{ filter: 'drop-shadow(0 4px 12px rgba(56, 189, 248, 0.3))' }}>
                🤖
              </div>
              <div className="login-left-title" style={{ marginTop: 6 }}>
                Sovereign AI Workbench
              </div>
              <div className="login-left-sub" style={{ marginTop: 6 }}>
                India's first 100% on-premise, air-gapped, multimodal agentic AI for PSU enterprises
              </div>
              <div className="login-left-sub login-left-sub-hindi" style={{ marginTop: 3, fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                भारत का पहला संप्रभु AI कार्यक्षेत्र
              </div>
            </div>

            <div className="feat-list">
              {[
                "Analyze PDFs, scanned docs, engineering drawings",
                "Generate Word, Excel, PowerPoint deliverables",
                "Execute Python code in isolated local sandbox",
                "Search SOPs from internal knowledge base (RAG)",
                "Full immutable audit trail — every action logged",
              ].map((f, i) => (
                <div key={i} className="feat-item">
                  <div className="feat-dot" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            <div className="login-badges">
              <span className="login-badge">🔒 Zero Egress</span>
              <span className="login-badge">🛡️ Air-Gapped</span>
              <span className="login-badge">🏛️ Sovereign</span>
              <span className="login-badge">SIH26117</span>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="login-right">
            <div className="login-form-title">Employee Login</div>
            <div className="login-form-sub">कर्मचारी लॉगिन — MRPL Secure Portal</div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="field-label">Email ID / ईमेल पता</label>
                <input
                  className="input"
                  type="email"
                  placeholder="employee@mrpl.co.in"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="input-group">
                <label className="field-label">Password / पासवर्ड</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    className="input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      background: 'none',
                      border: 'none',
                      color: showPassword ? 'var(--accent-light)' : 'var(--text-sec)',
                      cursor: 'pointer',
                      padding: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      transition: 'color 0.15s',
                    }}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-error" style={{ marginBottom: 12 }}>
                  ⚠️ {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ height: 44 }}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="spinner" style={{ width: 14, height: 14 }} />
                    <span>Verifying Credentials…</span>
                  </div>
                ) : (
                  '🔐 Login to Workbench'
                )}
              </button>
            </form>

            <div className="divider" style={{ margin: '16px 0' }} />

            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>
                Demo Access (Hackathon Evaluators)
              </div>
              <div className="demo-grid">
                {DEMO_USERS.map(u => (
                  <button
                    key={u.id}
                    className="demo-tile"
                    onClick={() => { setUsername(u.username); setPassword(u.password); }}
                    type="button"
                  >
                    <div
                      className="demo-av"
                      style={{ background: AVATAR_COLORS[u.avatar] || 'var(--navy)' }}
                    >
                      {u.avatar}
                    </div>
                    <div style={{ textAlign: 'left', minWidth: 0 }}>
                      <div className="demo-name">{u.name?.split(' ')[0] || u.name}</div>
                      <div className="demo-role">{u.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="login-security-notice">
              <span>🔒</span>
              <span>100% On-Premise GPU execution. Zero external data transmission.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── PINNED BOTTOM STATUS BAR ── */}
      <div className="statusbar">
        <div className="statusbar-item ok">✔ Zero Egress</div>
        <div className="statusbar-item ok">✔ Air-Gapped</div>
        <div className="statusbar-item ok">✔ On-Premise GPU</div>
        <div className="statusbar-right">
          <span>© 2026 MRPL · भारत सरकार · Ministry of Petroleum</span>
          <span style={{ color: 'var(--saffron)', fontWeight: 600 }}>🇮🇳 Digital India · AI for All</span>
        </div>
      </div>
    </div>
  );
}
