import { useState, useCallback, useEffect } from "react";
import GovtHeader, { Sidebar } from "../components/GovtHeader";
import ChatPane from "../components/ChatPane";
import TaskDashboard from "../components/TaskDashboard";
import SovereigntyPanel from "../components/SovereigntyPanel";
import AuditTrail from "../components/AuditTrail";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState("chat");
  const [refreshKey, setRefreshKey] = useState(0);
  const [chatPrompt, setChatPrompt] = useState("");
  const [rightPanelWidth, setRightPanelWidth] = useState(() => {
    const saved = localStorage.getItem('mrpl_right_panel_width');
    return saved ? Math.max(240, Math.min(parseInt(saved, 10), 550)) : 340;
  });
  const [isRightDragging, setIsRightDragging] = useState(false);

  const startRightResizing = useCallback((mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    setIsRightDragging(true);

    const startX = mouseDownEvent.clientX;
    const startWidth = rightPanelWidth;

    const onMouseMove = (mouseMoveEvent) => {
      const newWidth = Math.min(Math.max(startWidth - (mouseMoveEvent.clientX - startX), 240), 550);
      setRightPanelWidth(newWidth);
    };

    const onMouseUp = () => {
      setIsRightDragging(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [rightPanelWidth]);

  useEffect(() => {
    localStorage.setItem('mrpl_right_panel_width', rightPanelWidth);
  }, [rightPanelWidth]);

  return (
    <div className="app-shell">
      {/* ── TOPBAR: Compact Govt Identity ── */}
      <GovtHeader activeView={activeView} setActiveView={setActiveView} />

      {/* ── MAIN BODY: Sidebar + Content ── */}
      <div className="app-body">
        <Sidebar activeView={activeView} setActiveView={setActiveView} user={user} />

        {/* ── CONTENT AREA ── */}
        <div className="content-area">
          {/* ── CHAT VIEW ── */}
          {activeView === "chat" && (
            <div className="chat-layout">
              <div className="chat-main">
                <ChatPane
                  onTaskComplete={() => setRefreshKey(k => k + 1)}
                  initialPrompt={chatPrompt}
                  onPromptUsed={() => setChatPrompt("")}
                />
              </div>

              {/* Right task panel */}
              <div
                className={`chat-panel ${isRightDragging ? 'resizing' : ''}`}
                style={{
                  width: `${rightPanelWidth}px`,
                  minWidth: `${rightPanelWidth}px`,
                  maxWidth: `${rightPanelWidth}px`,
                  position: 'relative',
                }}
              >
                {/* Draggable Resizer Edge */}
                <div
                  className={`right-panel-resizer ${isRightDragging ? 'active' : ''}`}
                  onMouseDown={startRightResizing}
                  title="Drag with cursor to resize task panel"
                />

                <div className="panel-head">
                  <span>📋</span>
                  <span>Task Monitor</span>
                </div>
                <div className="panel-body">
                  <TaskDashboard refreshKey={refreshKey} />
                </div>
              </div>
            </div>
          )}

          {/* ── TASKS FULL VIEW ── */}
          {activeView === "tasks" && (
            <div className="page-view">
              <div className="page-heading">📋 All Tasks</div>
              <div className="page-sub">Track, manage and monitor all AI-generated task executions across MRPL departments.</div>
              <TaskDashboard refreshKey={refreshKey} showAll />
            </div>
          )}

          {/* ── AUDIT TRAIL ── */}
          {activeView === "audit" && (
            <div className="page-view">
              <div className="page-heading">📜 Immutable Audit Trail</div>
              <div className="page-sub">
                Every agent action, model call, and file generated is permanently hash-chained here. Append-only for MRPL compliance and regulatory audit.
              </div>
              <AuditTrail />
            </div>
          )}

          {/* ── SOVEREIGNTY MONITOR ── */}
          {activeView === "monitor" && (
            <div className="page-view">
              <div className="page-heading">🛡️ Sovereignty &amp; Egress Monitor</div>
              <div className="page-sub">
                Live monitoring of all network activity. The system must show <strong style={{ color: 'var(--success)' }}>zero</strong> external calls at all times. Any outbound traffic triggers a security alert.
              </div>
              <SovereigntyPanel refreshKey={refreshKey} />
            </div>
          )}
        </div>
      </div>

      {/* ── PINNED BOTTOM STATUS BAR ── */}
      <div className="statusbar">
        <div className="statusbar-item ok">✔ Air-Gapped</div>
        <div className="statusbar-item ok">✔ On-Premise Only</div>
        <div className="statusbar-item ok">✔ Zero External Calls</div>
        <div className="statusbar-item">🏛️ MRPL — Mangalore Refinery &amp; Petrochemicals Ltd.</div>
        <div className="statusbar-right">
          <span>SIH26117 · Team Metamorphosis</span>
          <span style={{ color: 'var(--accent-light)', fontWeight: 600 }}>🔒 Sovereign On-Premise Platform</span>
        </div>
      </div>
    </div>
  );
}
