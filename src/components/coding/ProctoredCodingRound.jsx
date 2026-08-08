import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  Clock, Camera, AlertTriangle, Shield, CheckCircle2, XCircle,
  Play, Send, ChevronRight, Award, Code2, FlaskConical
} from 'lucide-react';
import { getProblemsByDifficulty } from '../../constants/codingProblems';

// ── Constants ────────────────────────────────────────────────────────────────
const ROUND_DURATION = 60 * 60; // 60 minutes
const MARKS_PER_QUESTION = 50;
const MARKS_PER_TESTCASE = 10;
const MAX_WARNINGS = 3;

const LANGUAGES = [
  { id: 'cpp', label: 'C++', monacoId: 'cpp' },
  { id: 'java', label: 'Java', monacoId: 'java' },
  { id: 'python', label: 'Python', monacoId: 'python' },
];

const DIFFICULTIES = [
  { v: 'EASY', color: '#22c55e', bg: '#dcfce7', border: '#86efac' },
  { v: 'MEDIUM', color: '#f59e0b', bg: '#fef3c7', border: '#fcd34d' },
  { v: 'HARD', color: '#ef4444', bg: '#fee2e2', border: '#fca5a5' },
];

const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// ── ProctoredCodingRound Component ───────────────────────────────────────────
const ProctoredCodingRound = ({ onRoundComplete }) => {
  const [phase, setPhase] = useState('setup'); // setup | active | submitted
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [problems, setProblems] = useState([]);
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const [lang, setLang] = useState('cpp');
  const [codes, setCodes] = useState({}); // { problemId_lang: code }
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [warnings, setWarnings] = useState(0);
  const [warningMsg, setWarningMsg] = useState('');
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [testResults, setTestResults] = useState({}); // { problemId: [{ id, passed, output }] }
  const [runningTests, setRunningTests] = useState(false);
  const [activeTab, setActiveTab] = useState('problem'); // problem | testcases
  const [finalScore, setFinalScore] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const warningTimeoutRef = useRef(null);

  const problem = problems[activeProblemIdx];
  const codeKey = problem ? `${problem.id}_${lang}` : '';

  // ── Camera ────────────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      console.warn('Camera not accessible');
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  // ── Anti-cheat: tab focus listener ───────────────────────────────────────
  useEffect(() => {
    if (phase !== 'active') return;

    const handleBlur = () => {
      triggerWarning('Tab switch / window focus loss detected!');
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [phase, warnings]);

  const triggerWarning = useCallback((reason) => {
    setWarnings(w => {
      const next = w + 1;
      if (next >= MAX_WARNINGS) {
        setWarningMsg('⛔ 3rd violation detected — AUTO-SUBMITTING exam!');
        setTimeout(() => handleAutoSubmit(), 2000);
      } else {
        setWarningMsg(`⚠️ Warning ${next}/${MAX_WARNINGS}: ${reason}`);
        clearTimeout(warningTimeoutRef.current);
        warningTimeoutRef.current = setTimeout(() => setWarningMsg(''), 5000);
      }
      return next;
    });
  }, []);

  // ── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'active') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { handleAutoSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // ── Start round ───────────────────────────────────────────────────────────
  const handleStart = () => {
    const ps = getProblemsByDifficulty(difficulty);
    setProblems(ps);
    // Initialize codes with boilerplates
    const initCodes = {};
    ps.forEach(p => {
      LANGUAGES.forEach(l => {
        initCodes[`${p.id}_${l.id}`] = p.boilerplates?.[l.id] || '';
      });
    });
    setCodes(initCodes);
    setPhase('active');
    startCamera().catch(() => {});
  };

  // ── Auto submit ───────────────────────────────────────────────────────────
  const handleAutoSubmit = useCallback(() => {
    clearInterval(timerRef.current);
    stopCamera();
    computeAndSetFinalScore();
    setAutoSubmitted(true);
    setPhase('submitted');
  }, [testResults, problems, stopCamera]);

  const handleManualSubmit = () => {
    clearInterval(timerRef.current);
    stopCamera();
    computeAndSetFinalScore();
    setPhase('submitted');
  };

  const computeAndSetFinalScore = () => {
    let totalMarks = 0;
    const detail = {};
    problems.forEach(p => {
      const results = testResults[p.id] || [];
      const passed = results.filter(r => r.passed).length;
      const marks = passed * MARKS_PER_TESTCASE;
      totalMarks += marks;
      detail[p.id] = { passed, total: p.testCases?.length || 5, marks };
    });
    setFinalScore({ totalMarks, detail });
    if (onRoundComplete) {
      setTimeout(() => onRoundComplete({ round: 'CODING', totalMarks, detail }), 500);
    }
  };

  // ── Run test cases (simulated) ────────────────────────────────────────────
  const handleRunTests = async () => {
    if (!problem) return;
    setRunningTests(true);
    setActiveTab('testcases');
    await new Promise(res => setTimeout(res, 1400));

    const code = codes[codeKey] || '';
    const hasContent = code.trim().length > 50;
    // Simulate test results – in real system would call execution API
    const results = (problem.testCases || []).map((tc, i) => {
      const passed = hasContent && (i < 2 ? true : Math.random() > 0.35);
      return {
        id: tc.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: passed ? tc.expectedOutput : 'Wrong Answer',
        passed,
        isHidden: tc.isHidden,
      };
    });

    setTestResults(prev => ({ ...prev, [problem.id]: results }));
    setRunningTests(false);
  };

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => () => { stopCamera(); clearInterval(timerRef.current); }, []);

  const timerCritical = timeLeft < 600; // < 10 min

  // ─── SETUP SCREEN ──────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 600, margin: '0 auto', padding: '0 0 40px' }}
      >
        <div style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '28px 32px 24px', background: 'linear-gradient(135deg, #7c3aed15, #6366f110)', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #7c3aed, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Code2 size={24} color="white" />
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: 0 }}>Proctored Coding Round</h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Round 2 · Camera Required · No AI Code Generation</p>
              </div>
            </div>
          </div>

          <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Difficulty selection */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                Select Difficulty Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {DIFFICULTIES.map(d => (
                  <button
                    key={d.v}
                    onClick={() => setDifficulty(d.v)}
                    style={{
                      padding: '16px 8px', borderRadius: 14, cursor: 'pointer', textAlign: 'center',
                      border: `2px solid ${difficulty === d.v ? d.color : '#e2e8f0'}`,
                      background: difficulty === d.v ? d.bg : '#f8fafc',
                      color: difficulty === d.v ? d.color : '#94a3b8',
                      fontWeight: 700, fontSize: 13, fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                      <span style={{
                        width: 10, height: 10, borderRadius: '50%',
                        background: d.v === 'EASY' ? '#16a34a' : d.v === 'MEDIUM' ? '#d97706' : '#dc2626',
                        display: 'inline-block'
                      }} />
                    </div>
                    {d.v}
                    <div style={{ fontSize: 10, fontWeight: 500, color: difficulty === d.v ? d.color : '#cbd5e1', marginTop: 2 }}>
                      {d.v === 'EASY' ? '50 marks' : d.v === 'MEDIUM' ? '50 marks' : '50 marks'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div style={{ padding: '16px 18px', borderRadius: 14, background: '#fef3c7', border: '1px solid #fcd34d' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#92400e', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={15} /> Proctoring Rules
              </div>
              {[
                'Camera must remain active throughout the round',
                'Code auto-generation tools (AI, ChatGPT, etc.) are prohibited',
                'Tab switching or window focus loss triggers a warning',
                '3 violations cause automatic submission and session termination',
                'Time limit: 60 minutes for 2 questions',
              ].map((rule, i) => (
                <div key={i} style={{ fontSize: 12, color: '#78350f', marginBottom: 5, lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#92400e' }} />
                  {rule}
                </div>
              ))}
            </div>

            {/* Marking scheme */}
            <div style={{ padding: '16px 18px', borderRadius: 14, background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#065f46', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={15} /> Marking Scheme
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  ['Questions', '2'],
                  ['Marks per Question', '50'],
                  ['Test Cases per Question', '5'],
                  ['Marks per Test Case', '10'],
                  ['Total Marks', '100'],
                ].map(([k, v]) => (
                  <div key={k} style={{ fontSize: 12, color: '#064e3b' }}>
                    <span style={{ fontWeight: 600 }}>{k}:</span> {v}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleStart}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '15px', borderRadius: 14, cursor: 'pointer',
                background: 'linear-gradient(135deg, #db2777, #2563eb)',
                border: 'none', color: 'white', fontWeight: 700, fontSize: 15,
                fontFamily: 'Inter, sans-serif', boxShadow: '0 6px 20px rgba(219,39,119,0.25)',
              }}
            >
              <Camera size={18} /> Start Coding Round — Enable Camera
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ─── SUBMITTED SCREEN ─────────────────────────────────────────────────────
  if (phase === 'submitted' && finalScore) {
    const pct = Math.round((finalScore.totalMarks / 100) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: 680, margin: '0 auto', padding: '0 0 32px' }}>
        <div style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '32px', textAlign: 'center', borderBottom: '1px solid #e2e8f0', background: autoSubmitted ? '#fff1f2' : '#f0fdf4' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              {autoSubmitted ? <AlertTriangle size={42} className="text-red-500" /> : <CheckCircle2 size={42} className="text-emerald-500" />}
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', margin: '0 0 8px' }}>
              {autoSubmitted ? 'Auto-Submitted' : 'Coding Round Submitted'}
            </h2>
            {autoSubmitted && (
              <p style={{ fontSize: 13, color: '#dc2626', margin: '0 0 8px', fontWeight: 600 }}>
                Session auto-submitted due to 3 anti-cheat violations.
              </p>
            )}
            <div style={{ fontSize: 36, fontWeight: 900, color: '#7c3aed', margin: '16px 0 4px' }}>
              {finalScore.totalMarks}<span style={{ fontSize: 18, fontWeight: 500, color: '#94a3b8' }}> / 100</span>
            </div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Coding Round Score ({pct}%)</div>
          </div>

          <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {problems.map((p, idx) => {
              const d = finalScore.detail[p.id] || { passed: 0, total: 5, marks: 0 };
              return (
                <div key={p.id} style={{
                  padding: '18px 20px', borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Question {idx + 1}
                      </span>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>{p.title}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#7c3aed' }}>{d.marks}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>/ 50 marks</div>
                    </div>
                  </div>
                  {/* Test case row */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {Array.from({ length: d.total }).map((_, i) => {
                      const tc = (testResults[p.id] || [])[i];
                      const passed = tc?.passed;
                      return (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                          background: passed === true ? '#dcfce7' : passed === false ? '#fee2e2' : '#f1f5f9',
                          color: passed === true ? '#166534' : passed === false ? '#991b1b' : '#94a3b8',
                          border: `1px solid ${passed === true ? '#bbf7d0' : passed === false ? '#fecaca' : '#e2e8f0'}`,
                        }}>
                          {passed === true ? <CheckCircle2 size={12} /> : passed === false ? <XCircle size={12} /> : <span style={{ width: 12, height: 12 }} />}
                          TC{i + 1} · {passed === true ? '+10' : passed === false ? '0' : '—'}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  }

  // ─── ACTIVE CODING EXAM ───────────────────────────────────────────────────
  const currentProb = problems[activeProblemIdx];
  if (!currentProb) return null;

  const currentResults = testResults[currentProb.id] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100vh', maxHeight: 'calc(100vh - 100px)' }}>

      {/* ── Top bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
        padding: '10px 16px', background: '#0f172a', borderRadius: '16px 16px 0 0',
        borderBottom: '1px solid #1e293b', gap: 10,
      }}>
        {/* Problem switcher */}
        <div style={{ display: 'flex', gap: 6 }}>
          {problems.map((p, i) => {
            const passCnt = (testResults[p.id] || []).filter(r => r.passed).length;
            return (
              <button
                key={p.id}
                onClick={() => setActiveProblemIdx(i)}
                style={{
                  padding: '5px 14px', borderRadius: 9, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  background: activeProblemIdx === i ? '#6366f1' : '#1e293b',
                  border: `1px solid ${activeProblemIdx === i ? '#818cf8' : '#334155'}`,
                  color: activeProblemIdx === i ? 'white' : '#94a3b8',
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                }}
              >
                Q{i + 1} · {passCnt > 0 ? `${passCnt}✓` : p.difficulty}
              </button>
            );
          })}
        </div>

        {/* Warnings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[...Array(MAX_WARNINGS)].map((_, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: i < warnings ? '#ef4444' : '#1e293b',
              border: `2px solid ${i < warnings ? '#ef4444' : '#334155'}`,
              boxShadow: i < warnings ? '0 0 8px #ef4444' : 'none',
            }} />
          ))}
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
            {warnings === 0 ? 'No Warnings' : `${warnings}/${MAX_WARNINGS} Warnings`}
          </span>
        </div>

        {/* Timer + Submit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
            borderRadius: 9, background: timerCritical ? '#450a0a' : '#1e293b',
            border: `1px solid ${timerCritical ? '#7f1d1d' : '#334155'}`,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <Clock size={13} color={timerCritical ? '#ef4444' : '#94a3b8'} />
            <span style={{ fontSize: 14, fontWeight: 700, color: timerCritical ? '#ef4444' : '#e2e8f0' }}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <button
            onClick={handleManualSubmit}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 9, cursor: 'pointer',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none', color: 'white', fontSize: 12, fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            <Send size={13} /> Final Submit
          </button>
        </div>
      </div>

      {/* ── Warning Banner ── */}
      <AnimatePresence>
        {warningMsg && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px', background: '#450a0a',
              borderBottom: '1px solid #7f1d1d',
            }}
          >
            <AlertTriangle size={16} color="#f87171" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fca5a5' }}>{warningMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main split pane ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', flex: 1, overflow: 'hidden', minHeight: 0 }}>

        {/* ── Left: Problem + Test Cases ── */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#1e293b', borderRight: '1px solid #334155', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #334155' }}>
            {[{ id: 'problem', label: 'Problem', icon: '📄' }, { id: 'testcases', label: 'Test Cases', icon: '🧪' }].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1, padding: '10px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  background: activeTab === tab.id ? '#0f172a' : 'transparent',
                  border: 'none', color: activeTab === tab.id ? '#e2e8f0' : '#64748b',
                  borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
            {activeTab === 'problem' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                    background: difficulty === 'EASY' ? '#22c55e' : difficulty === 'MEDIUM' ? '#f59e0b' : '#ef4444',
                    color: 'white',
                  }}>{difficulty}</span>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{currentProb.category}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b' }}>
                    ⏱ {currentProb.timeLimit} · 💾 {currentProb.memoryLimit}
                  </span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#e2e8f0', margin: '0 0 12px', lineHeight: 1.4 }}>
                  {currentProb.title}
                </h3>
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 16px', whiteSpace: 'pre-line' }}>
                  {currentProb.statement}
                </p>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  Examples
                </div>
                {(currentProb.examples || []).map(ex => (
                  <div key={ex.id} style={{ padding: '12px', borderRadius: 10, background: '#0f172a', border: '1px solid #334155', marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Input:</div>
                    <pre style={{ fontSize: 12, color: '#a5f3fc', margin: '0 0 8px', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'pre-wrap' }}>{ex.input}</pre>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>Output:</div>
                    <pre style={{ fontSize: 12, color: '#86efac', margin: '0 0 8px', fontFamily: "'JetBrains Mono', monospace" }}>{ex.output}</pre>
                    {ex.explanation && <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{ex.explanation}</p>}
                  </div>
                ))}
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, marginTop: 16 }}>
                  Constraints
                </div>
                {(currentProb.constraints || []).map((c, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4, lineHeight: 1.5 }}>
                    <span style={{ color: '#6366f1', fontWeight: 700 }}>•</span> {c}
                  </div>
                ))}
                <div style={{ marginTop: 20, padding: '10px 14px', borderRadius: 10, background: '#0f172a', border: '1px solid #334155' }}>
                  <div style={{ fontSize: 11, color: '#475569' }}>
                    <span style={{ color: '#6366f1' }}>📌 Scoring:</span> 5 test cases × 10 marks = 50 marks per question
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                  Test Case Results
                </div>
                {currentResults.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 32, color: '#475569', fontSize: 13 }}>
                    Run your code to see test results
                  </div>
                ) : (
                  currentResults.map((tc, i) => (
                    <div key={tc.id} style={{
                      padding: '12px 14px', borderRadius: 12, background: '#0f172a',
                      border: `1px solid ${tc.passed ? '#166534' : '#991b1b'}`,
                      marginBottom: 10,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{
                          width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', background: tc.passed ? '#22c55e' : '#ef4444',
                        }}>
                          {tc.passed ? <CheckCircle2 size={12} color="white" /> : <XCircle size={12} color="white" />}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>
                          Test Case {i + 1} · {tc.isHidden ? '(Hidden)' : '(Visible)'} · {tc.passed ? '+10 marks' : '0 marks'}
                        </span>
                      </div>
                      {!tc.isHidden && (
                        <>
                          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 3 }}>Input:</div>
                          <pre style={{ fontSize: 11, color: '#a5f3fc', margin: '0 0 6px', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'pre-wrap' }}>{tc.input}</pre>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            <div>
                              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 3 }}>Expected:</div>
                              <pre style={{ fontSize: 11, color: '#86efac', margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>{tc.expectedOutput}</pre>
                            </div>
                            <div>
                              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 3 }}>Got:</div>
                              <pre style={{ fontSize: 11, color: tc.passed ? '#86efac' : '#fca5a5', margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>{tc.actualOutput}</pre>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Editor ── */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#0f172a' }}>
          {/* Editor toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 14px', borderBottom: '1px solid #1e293b', gap: 10, flexWrap: 'wrap',
          }}>
            {/* Language selector */}
            <div style={{ display: 'flex', gap: 6 }}>
              {LANGUAGES.map(l => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  style={{
                    padding: '4px 12px', borderRadius: 8, cursor: 'pointer',
                    background: lang === l.id ? '#6366f1' : '#1e293b',
                    border: `1px solid ${lang === l.id ? '#818cf8' : '#334155'}`,
                    color: lang === l.id ? 'white' : '#94a3b8',
                    fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.15s',
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Camera + Run + Shield */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, background: '#1e293b', border: '1px solid #334155' }}>
                <Shield size={13} color="#22c55e" />
                <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>Anti-Cheat Active</span>
              </div>
              {/* Camera preview */}
              <div style={{ width: 70, height: 52, borderRadius: 8, overflow: 'hidden', border: '2px solid #334155', background: '#1e293b', flexShrink: 0 }}>
                <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <button
                onClick={handleRunTests}
                disabled={runningTests}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 9, cursor: runningTests ? 'wait' : 'pointer',
                  background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0',
                  fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                }}
              >
                <Play size={13} />{runningTests ? 'Running…' : 'Run Tests'}
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <Editor
              height="100%"
              language={LANGUAGES.find(l => l.id === lang)?.monacoId || 'cpp'}
              value={codes[codeKey] || ''}
              onChange={(val) => {
                if (!codeKey) return;
                setCodes(prev => ({ ...prev, [codeKey]: val || '' }));
              }}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                lineNumbers: 'on',
                glyphMargin: true,
                quickSuggestions: false,         // Disable auto-suggestions
                suggestOnTriggerCharacters: false, // Prevent auto-generation
                parameterHints: { enabled: false },
                inlineSuggest: { enabled: false },
                renderWhitespace: 'boundary',
              }}
            />
          </div>

          {/* Bottom score bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 16px', background: '#0f172a', borderTop: '1px solid #1e293b',
          }}>
            <div style={{ display: 'flex', gap: 16 }}>
              {problems.map((p, i) => {
                const passed = (testResults[p.id] || []).filter(r => r.passed).length;
                return (
                  <div key={p.id} style={{ fontSize: 12, color: passed > 0 ? '#86efac' : '#475569', fontWeight: 600 }}>
                    Q{i + 1}: {passed * MARKS_PER_TESTCASE}/{MARKS_PER_QUESTION}pts ({passed}/5 ✓)
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', fontFamily: "'JetBrains Mono', monospace" }}>
              {lang.toUpperCase()} · Human-Coded Only
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProctoredCodingRound;
