import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../data/mockData';

export default function LoginPage() {
  const { login, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(username, password);
    setLoading(false);
  };

  const quickLogin = (user) => {
    setUsername(user.username);
    setPassword(user.password);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)', display: 'flex', flexDirection: 'column' }}>

      {/* Top tricolor stripe */}
      <div className="tricolor-stripe" />

      {/* National Header */}
      <header style={{
        background: 'var(--navy)',
        color: '#fff',
        padding: '0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Emblem */}
          <div style={{
            width: 52, height: 52,
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, border: '2px solid rgba(255,255,255,0.25)',
            flexShrink: 0,
          }}>🏛️</div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 1 }}>
              भारत सरकार · Government of India
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>
              Mangalore Refinery and Petrochemicals Limited
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>
              मंगलोर रिफाइनरी एवं पेट्रोकेमिकल्स लिमिटेड (MRPL) · A Govt. of India Enterprise
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>POWERED BY</div>
            <div style={{
              background: 'var(--saffron)',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 4,
              letterSpacing: '0.5px',
            }}>DIGITAL INDIA · AI WORKBENCH</div>
          </div>
        </div>

        {/* Sub-header bar */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '6px 24px',
          fontSize: 11,
          color: 'rgba(255,255,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}>
          <span>🏠 Home</span>
          <span>📋 SIH 2026 — Problem Statement #SIH26117</span>
          <span>🔒 SECURE · ON-PREMISE · AIR-GAPPED</span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>

          {/* Page title */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 64, height: 64,
              background: 'linear-gradient(135deg, var(--navy), var(--navy-light))',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26,
              margin: '0 auto 16px',
              boxShadow: '0 8px 20px rgba(0,53,128,0.25)',
            }}>🤖</div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>
              Sovereign AI Workbench
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-sec)' }}>
              On-Premise · Air-Gapped · Multimodal Agentic AI
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 10 }}>
              <span className="badge badge-green">🔒 Zero Egress</span>
              <span className="badge badge-blue">🏛️ Sovereign</span>
              <span className="badge badge-saffron">🤖 Agentic</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="card" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <div className="card-header" style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
              <span style={{ fontSize: 14 }}>🔐</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>Secure Login — Employee Access</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Use your MRPL employee credentials</div>
              </div>
            </div>

            <div className="card-body">
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', marginBottom: 5 }}>
                    Employee Email ID
                  </label>
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

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', marginBottom: 5 }}>
                    Password
                  </label>
                  <input
                    className="input"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div style={{
                    padding: '8px 12px',
                    background: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: 'var(--radius)',
                    color: '#b91c1c',
                    fontSize: 12,
                    marginBottom: 14,
                  }}>
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-full btn-lg"
                  disabled={loading}
                  style={{ justifyContent: 'center' }}
                >
                  {loading ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Authenticating...</> : '🔐 Login to AI Workbench'}
                </button>
              </form>

              <div className="divider" />

              {/* Quick Demo Login */}
              <div style={{ marginBottom: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, textAlign: 'center' }}>
                  Quick Demo Access (Hackathon)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {DEMO_USERS.map(u => (
                    <button
                      key={u.id}
                      className="btn btn-ghost btn-sm"
                      onClick={() => quickLogin(u)}
                      style={{ justifyContent: 'flex-start', gap: 6, padding: '6px 10px' }}
                    >
                      <span style={{
                        width: 22, height: 22,
                        background: 'var(--navy)',
                        color: '#fff',
                        borderRadius: '50%',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, flexShrink: 0,
                      }}>{u.avatar}</span>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>{u.name.split(' ')[0]}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{u.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            <div>🔒 This system operates entirely on MRPL's internal network.</div>
            <div>No data is transmitted to any external server.</div>
            <div style={{ marginTop: 6, color: 'var(--text-muted)', fontWeight: 500 }}>
              SIH 2026 — Problem #SIH26117 — Team Metamorphosis
            </div>
          </div>
        </div>
      </main>

      {/* Bottom tricolor */}
      <div className="tricolor-stripe" />
    </div>
  );
}
