import React, { useState } from 'react';
import { RotateCcw, Maximize2, Minimize2, Save, Sun, Moon, Loader2, Play, Send } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';
import { Clock, Pause } from 'lucide-react';

// ── Inline Timer ──────────────────────────────────────────────────────────────
const InlineTimer = () => {
  const [seconds, setSeconds] = React.useState(0);
  const [running, setRunning] = React.useState(true);
  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  const fmt = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700, color: '#475569', fontFamily: "'JetBrains Mono', monospace" }}>
      <Clock size={13} style={{ color: '#6366f1' }} />
      <span>{fmt}</span>
      <button onClick={() => setRunning(r => !r)} title={running ? 'Pause' : 'Resume'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}>
        {running ? <Pause size={11} /> : <Play size={11} />}
      </button>
    </div>
  );
};

// ── Light icon button ─────────────────────────────────────────────────────────
const IconBtn = ({ onClick, title, children }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 34, height: 34, borderRadius: 8, cursor: 'pointer',
      background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b',
      transition: 'all 0.15s ease',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
    onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
  >
    {children}
  </button>
);

export const EditorToolbar = ({
  selectedLanguageId,
  onSelectLanguage,
  onResetCode,
  onRunCode,
  onSubmitCode,
  isExecuting,
  isSubmitting,
  isFullscreen,
  onToggleFullscreen,
  lastSavedAt
}) => {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
      gap: 10, padding: '8px 14px',
      background: '#f1f3f5', userSelect: 'none',
    }}>
      {/* LEFT: Language + Timer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Language Selector */}
        <select
          value={selectedLanguageId}
          onChange={e => onSelectLanguage(e.target.value)}
          style={{
            padding: '5px 10px', borderRadius: 8,
            background: '#ffffff', border: '1px solid #e2e8f0',
            fontSize: 12, fontWeight: 600, color: '#1e293b',
            outline: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}
        >
          {SUPPORTED_LANGUAGES.map(lang => (
            <option key={lang.id} value={lang.id}>{lang.name}</option>
          ))}
        </select>

        <InlineTimer />

        {lastSavedAt && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#10b981', fontWeight: 600 }}>
            <Save size={11} /> Saved
          </span>
        )}
      </div>

      {/* RIGHT: Controls + Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <IconBtn onClick={onResetCode} title="Reset to starter template">
          <RotateCcw size={15} />
        </IconBtn>

        <IconBtn onClick={onToggleFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen editor'}>
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </IconBtn>

        {/* Divider */}
        <div style={{ width: 1, height: 22, background: '#e2e8f0', margin: '0 4px' }} />

        {/* Run Code — light gray */}
        <button
          onClick={onRunCode}
          disabled={isExecuting || isSubmitting}
          title="Run code (Ctrl + Enter)"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 9, cursor: isExecuting || isSubmitting ? 'not-allowed' : 'pointer',
            background: '#ffffff', border: '1.5px solid #cbd5e1',
            color: '#374151', fontSize: 12, fontWeight: 700,
            fontFamily: 'Inter, sans-serif', opacity: isExecuting || isSubmitting ? 0.6 : 1,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { if (!isExecuting && !isSubmitting) { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = '#f8fafc'; } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#ffffff'; }}
        >
          {isExecuting
            ? <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} />
            : <Play size={13} style={{ fill: '#374151' }} />
          }
          <span>Run</span>
        </button>

        {/* Submit Code — indigo gradient */}
        <button
          onClick={onSubmitCode}
          disabled={isExecuting || isSubmitting}
          title="Submit solution (Ctrl + Shift + Enter)"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 16px', borderRadius: 9, cursor: isExecuting || isSubmitting ? 'not-allowed' : 'pointer',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            border: 'none', color: 'white', fontSize: 12, fontWeight: 700,
            fontFamily: 'Inter, sans-serif', opacity: isExecuting || isSubmitting ? 0.6 : 1,
            boxShadow: '0 3px 10px rgba(99,102,241,0.3)',
            transition: 'opacity 0.15s ease',
          }}
        >
          {isSubmitting
            ? <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} />
            : <Send size={13} />
          }
          <span>Submit</span>
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default EditorToolbar;
