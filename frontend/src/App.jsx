import { Component } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InitializingLoader from './components/InitializingLoader';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Workbench ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#060911',
          color: '#f8fafc',
          padding: 24,
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏛️</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f87171', marginBottom: 8 }}>
            Application Error Occurred
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: 480, fontSize: 13, marginBottom: 16 }}>
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{
              background: 'linear-gradient(135deg, #FF6600, #cc4400)',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            ↻ Reset &amp; Reload Workbench
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { user, isInitializing, finishInitializing } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  if (isInitializing) {
    return <InitializingLoader user={user} onComplete={finishInitializing} />;
  }

  return <DashboardPage />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
