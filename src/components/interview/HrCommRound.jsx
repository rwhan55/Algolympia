import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Camera, Eye, Volume2, Zap, SkipForward, CheckCircle2,
  Award, Clock, ChevronRight, AlertTriangle, TrendingUp, Activity
} from 'lucide-react';
import { HR_QUESTIONS, COMMUNICATION_QUESTIONS, HR_COMM_QUESTIONS, getRandomHrCommQuestions } from '../../constants/hrCommQuestions';

// ── Constants ─────────────────────────────────────────────────────────────────
const PREP_SECONDS = 15;
const ANSWER_SECONDS = 150; // 2 min 30 sec
const MARKS_PER_QUESTION = 10;
const TOTAL_QUESTIONS = 16;
const TOTAL_MARKS = 160;

const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// ── Radial Metric Component ────────────────────────────────────────────────────
const RadialMetric = ({ label, value, color, icon: Icon }) => {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 8px' }}>
        <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="45" cy="45" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx="45" cy="45" r={r} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={14} color={color} />
          <span style={{ fontSize: 14, fontWeight: 800, color: '#e2e8f0', marginTop: 2 }}>
            {value}%
          </span>
        </div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </div>
    </div>
  );
};

// ── Live Waveform (simulated) ─────────────────────────────────────────────────
const LiveWaveform = ({ active }) => {
  const bars = 24;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 32 }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} style={{
          width: 3,
          borderRadius: 2,
          background: active ? '#6366f1' : '#334155',
          height: active ? `${Math.random() * 80 + 20}%` : '20%',
          transition: active ? `height 0.12s ease ${i * 10}ms` : 'height 0.3s ease',
          animation: active ? `wave_${i % 4} 0.8s ease-in-out infinite` : 'none',
        }} />
      ))}
    </div>
  );
};

// ── Score Card (after completion) ─────────────────────────────────────────────
const RoundScoreCard = ({ scores, skipped, onDone }) => {
  const totalEarned = scores.reduce((s, sc) => s + sc, 0);
  const pct = Math.round((totalEarned / TOTAL_MARKS) * 100);
  const gradeColor = pct >= 75 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444';
  const questions = HR_COMM_QUESTIONS;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ maxWidth: 740, margin: '0 auto', padding: '0 0 32px' }}
    >
      <div style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '32px', textAlign: 'center', background: `${gradeColor}08`, borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🤝</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', margin: '0 0 6px' }}>Round 3 Complete!</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>HR & Communication Round</p>
          <div style={{ fontSize: 40, fontWeight: 900, color: gradeColor, margin: '18px 0 4px' }}>
            {totalEarned}<span style={{ fontSize: 18, fontWeight: 500, color: '#94a3b8' }}> / {TOTAL_MARKS}</span>
          </div>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            {pct}% · {skipped.length} question{skipped.length !== 1 ? 's' : ''} skipped
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ padding: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'HR Round', count: 6, earned: scores.slice(0, 6).reduce((s, v) => s + v, 0), max: 60, color: '#f59e0b' },
              { label: 'Communication Round', count: 10, earned: scores.slice(6).reduce((s, v) => s + v, 0), max: 100, color: '#10b981' },
            ].map(item => (
              <div key={item.label} style={{ padding: '16px 20px', borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: item.color }}>
                  {item.earned}<span style={{ fontSize: 14, fontWeight: 500, color: '#94a3b8' }}> / {item.max}</span>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{item.count} questions × 10 marks</div>
              </div>
            ))}
          </div>

          {/* Per question list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {questions.map((q, i) => {
              const isSkipped = skipped.includes(q.id);
              const earned = scores[i] || 0;
              const isHR = q.type === 'HR';
              return (
                <div key={q.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0',
                }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                    background: isHR ? '#fef3c7' : '#ecfdf5',
                    color: isHR ? '#92400e' : '#065f46',
                    border: `1px solid ${isHR ? '#fcd34d' : '#a7f3d0'}`,
                    flexShrink: 0,
                  }}>
                    {q.type === 'HR' ? '🤝 HR' : '🗣️ COMM'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 1 }}>{q.category}</div>
                    <div style={{ fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {q.question.substring(0, 70)}…
                    </div>
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 700, padding: '2px 12px', borderRadius: 99, flexShrink: 0,
                    background: isSkipped ? '#f1f5f9' : earned >= 7 ? '#dcfce7' : earned >= 4 ? '#fef3c7' : '#fee2e2',
                    color: isSkipped ? '#94a3b8' : earned >= 7 ? '#166534' : earned >= 4 ? '#92400e' : '#991b1b',
                  }}>
                    {isSkipped ? 'Skipped' : `+${earned}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main HrCommRound Component ────────────────────────────────────────────────
const HrCommRound = ({ onRoundComplete }) => {
  const [questions, setQuestions] = useState(() => getRandomHrCommQuestions());
  const [phase, setPhase] = useState('setup'); // setup | active | submitted
  const [currentIdx, setCurrentIdx] = useState(0);
  const [subPhase, setSubPhase] = useState('prep'); // prep | answering | done
  const [prepTimeLeft, setPrepTimeLeft] = useState(PREP_SECONDS);
  const [answerTimeLeft, setAnswerTimeLeft] = useState(ANSWER_SECONDS);
  const [skipped, setSkipped] = useState([]); // array of question IDs
  const [scores, setScores] = useState([]); // per-question scores (simulated)
  const [micActive, setMicActive] = useState(false);
  const [metrics, setMetrics] = useState({ fluency: 0, eyeContact: 0, confidence: 0 });
  const [metricsHistory, setMetricsHistory] = useState([]);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const micStreamRef = useRef(null);
  const prepTimerRef = useRef(null);
  const answerTimerRef = useRef(null);
  const metricsIntervalRef = useRef(null);

  const question = questions[currentIdx] || HR_COMM_QUESTIONS[0];
  const isHrQuestion = question?.type === 'HR';
  const isLastQuestion = currentIdx === TOTAL_QUESTIONS - 1;

  // ── Setup camera & mic ────────────────────────────────────────────────────
  const startMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setMicActive(true);
    } catch {
      console.warn('Camera/Mic not accessible');
    }
  }, []);

  const stopMedia = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setMicActive(false);
  }, []);

  // ── Simulated live metrics ─────────────────────────────────────────────────
  const startMetrics = useCallback(() => {
    let t = 0;
    metricsIntervalRef.current = setInterval(() => {
      t += 0.5;
      // Simulate: metrics improve gradually with some noise
      setMetrics({
        fluency: Math.min(100, Math.round(45 + t * 2 + (Math.random() - 0.5) * 15)),
        eyeContact: Math.min(100, Math.round(55 + t * 1.5 + (Math.random() - 0.5) * 18)),
        confidence: Math.min(100, Math.round(40 + t * 2.2 + (Math.random() - 0.5) * 20)),
      });
    }, 600);
  }, []);

  const stopMetrics = useCallback(() => {
    clearInterval(metricsIntervalRef.current);
  }, []);

  // ── Prep timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'active' || subPhase !== 'prep') return;
    setPrepTimeLeft(PREP_SECONDS);
    prepTimerRef.current = setInterval(() => {
      setPrepTimeLeft(t => {
        if (t <= 1) {
          clearInterval(prepTimerRef.current);
          setSubPhase('answering');
          startMetrics();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(prepTimerRef.current);
  }, [phase, subPhase, currentIdx, startMetrics]);

  // ── Answer timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'active' || subPhase !== 'answering') return;
    setAnswerTimeLeft(ANSWER_SECONDS);
    answerTimerRef.current = setInterval(() => {
      setAnswerTimeLeft(t => {
        if (t <= 1) {
          clearInterval(answerTimerRef.current);
          handleAnswerDone();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(answerTimerRef.current);
  }, [phase, subPhase, currentIdx]);

  // ── Scoring (simulated from metrics) ─────────────────────────────────────
  const computeScore = useCallback(() => {
    const { fluency, eyeContact, confidence } = metrics;
    const raw = (fluency * 0.4 + eyeContact * 0.3 + confidence * 0.3) / 10;
    return Math.min(10, Math.max(0, Math.round(raw)));
  }, [metrics]);

  const handleAnswerDone = useCallback(() => {
    stopMetrics();
    clearInterval(answerTimerRef.current);
    const earned = computeScore();
    setScores(prev => [...prev, earned]);
    setMetricsHistory(prev => [...prev, { ...metrics }]);
    setMetrics({ fluency: 0, eyeContact: 0, confidence: 0 });

    if (currentIdx + 1 >= TOTAL_QUESTIONS) {
      setPhase('submitted');
      stopMedia();
    } else {
      setCurrentIdx(i => i + 1);
      setSubPhase('prep');
    }
  }, [computeScore, stopMetrics, stopMedia, currentIdx, metrics]);

  const handleSkip = useCallback(() => {
    stopMetrics();
    clearInterval(prepTimerRef.current);
    clearInterval(answerTimerRef.current);
    setSkipped(prev => [...prev, question.id]);
    setScores(prev => [...prev, 0]); // 0 marks for skipped
    setMetricsHistory(prev => [...prev, { fluency: 0, eyeContact: 0, confidence: 0 }]);
    setMetrics({ fluency: 0, eyeContact: 0, confidence: 0 });

    if (currentIdx + 1 >= TOTAL_QUESTIONS) {
      setPhase('submitted');
      stopMedia();
    } else {
      setCurrentIdx(i => i + 1);
      setSubPhase('prep');
    }
  }, [stopMetrics, stopMedia, currentIdx, question]);

  const handleSubmitAnswer = useCallback(() => {
    clearInterval(answerTimerRef.current);
    handleAnswerDone();
  }, [handleAnswerDone]);

  useEffect(() => {
    if (phase === 'submitted' && onRoundComplete) {
      const totalEarned = scores.reduce((s, v) => s + v, 0);
      onRoundComplete({ round: 'HR_COMM', totalMarks: totalEarned, scores, skipped });
    }
  }, [phase]);

  useEffect(() => () => {
    stopMedia();
    stopMetrics();
    clearInterval(prepTimerRef.current);
    clearInterval(answerTimerRef.current);
  }, []);

  // ─── SETUP SCREEN ──────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 600, margin: '0 auto', padding: '0 0 40px' }}
      >
        <div style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '28px 32px 24px', background: 'linear-gradient(135deg, #f59e0b12, #10b98108)', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 24 }}>🤝</span>
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: 0 }}>HR & Communication Round</h2>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Round 3 · Camera & Microphone Required</p>
              </div>
            </div>
          </div>

          <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 22 }}>
            {/* Round breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { icon: '🤝', label: 'HR Round', count: 6, max: 60, color: '#f59e0b', bg: '#fef3c7' },
                { icon: '🗣️', label: 'Communication', count: 10, max: 100, color: '#10b981', bg: '#ecfdf5' },
              ].map(item => (
                <div key={item.label} style={{ padding: '16px 20px', borderRadius: 16, background: item.bg, border: `1px solid ${item.color}30` }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{item.count} questions · {item.max} marks</div>
                </div>
              ))}
            </div>

            {/* Timers info */}
            <div style={{ padding: '16px 18px', borderRadius: 14, background: '#eef2ff', border: '1px solid #c7d2fe' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#4f46e5', marginBottom: 10 }}>⏱️ Per-Question Timer</div>
              {[
                ['Preparation Time', '15 seconds — Read and analyze the question'],
                ['Answer Time', '2 min 30 sec — Speak your answer clearly'],
                ['Skip Option', 'Available but marks will be deducted (0/10 for skip)'],
              ].map(([k, v]) => (
                <div key={k} style={{ fontSize: 12, color: '#3730a3', marginBottom: 5 }}>
                  <strong>{k}:</strong> {v}
                </div>
              ))}
            </div>

            {/* AI analysis metrics */}
            <div style={{ padding: '16px 18px', borderRadius: 14, background: '#0f172a', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#e2e8f0', marginBottom: 12 }}>🤖 Real-Time AI Analysis</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {[
                  { icon: '💬', label: 'Word Flow & Fluency', desc: 'WPM, hesitations, pace' },
                  { icon: '👁️', label: 'Eye Contact', desc: 'Camera gaze tracking' },
                  { icon: '⚡', label: 'Confidence', desc: 'Tone, pauses, clarity' },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'center', padding: '10px 8px', borderRadius: 10, background: '#1e293b' }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: 9, color: '#64748b' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Marking */}
            <div style={{ padding: '14px 16px', borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>
              📊 <strong style={{ color: '#1e293b' }}>Marks:</strong> 16 questions × 10 marks = 160 total marks
            </div>

            <button
              onClick={() => { startMedia().catch(() => {}); setPhase('active'); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '15px', borderRadius: 14, cursor: 'pointer',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none', color: 'white', fontWeight: 700, fontSize: 15,
                fontFamily: 'Inter, sans-serif', boxShadow: '0 6px 20px rgba(245,158,11,0.35)',
              }}
            >
              <Mic size={18} /> Start Round — Enable Camera & Mic
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ─── SUBMITTED ──────────────────────────────────────────────────────────────
  if (phase === 'submitted') {
    return <RoundScoreCard scores={scores} skipped={skipped} onDone={onRoundComplete} />;
  }

  // ─── ACTIVE ROUND ──────────────────────────────────────────────────────────
  const progress = ((currentIdx) / TOTAL_QUESTIONS) * 100;
  const answerPct = ((ANSWER_SECONDS - answerTimeLeft) / ANSWER_SECONDS) * 100;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Top Progress Bar ── */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ height: 4, background: '#f1f5f9', borderRadius: 99 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#f59e0b,#10b981)', borderRadius: 99, transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase',
              background: isHrQuestion ? '#fef3c7' : '#ecfdf5',
              color: isHrQuestion ? '#92400e' : '#065f46',
              border: `1px solid ${isHrQuestion ? '#fcd34d' : '#a7f3d0'}`,
            }}>
              {isHrQuestion ? '🤝 HR Round' : '🗣️ Communication Round'}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
              Question {currentIdx + 1} / {TOTAL_QUESTIONS}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
              {skipped.length} skipped · {scores.reduce((s, v) => s + v, 0)}/{currentIdx * 10} pts so far
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, alignItems: 'start' }}>

        {/* ── Left: Question + Timers ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}
            >
              {/* Phase indicator */}
              <div style={{
                padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10,
                background: subPhase === 'prep' ? '#fef3c7' : '#eef2ff',
                borderBottom: '1px solid #e2e8f0',
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: subPhase === 'prep' ? '#f59e0b' : '#6366f1',
                  boxShadow: `0 0 8px ${subPhase === 'prep' ? '#f59e0b' : '#6366f1'}`,
                  animation: 'pulse 1s ease-in-out infinite',
                }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: subPhase === 'prep' ? '#92400e' : '#3730a3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {subPhase === 'prep' ? `⏳ Preparation Phase — Analyze the question carefully` : '🎤 Answer Phase — Speak your response clearly'}
                </span>
                {/* Per-phase timer */}
                <span style={{
                  marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 15, fontWeight: 800,
                  color: subPhase === 'prep'
                    ? (prepTimeLeft < 5 ? '#ef4444' : '#92400e')
                    : (answerTimeLeft < 30 ? '#ef4444' : '#3730a3'),
                }}>
                  {subPhase === 'prep' ? formatTime(prepTimeLeft) : formatTime(answerTimeLeft)}
                </span>
              </div>

              {/* Answer progress bar */}
              {subPhase === 'answering' && (
                <div style={{ height: 3, background: '#e2e8f0' }}>
                  <div style={{
                    height: '100%', background: answerTimeLeft < 30 ? '#ef4444' : '#6366f1',
                    width: `${100 - answerPct}%`,
                    transition: 'width 1s linear',
                  }} />
                </div>
              )}

              {/* Question body */}
              <div style={{ padding: '24px 26px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                  {question.category} · 10 marks
                </div>
                <p style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', lineHeight: 1.65, margin: '0 0 20px' }}>
                  {question.question}
                </p>

                {/* Tips (during prep phase) */}
                {subPhase === 'prep' && (
                  <div style={{ padding: '12px 16px', borderRadius: 12, background: '#fffbeb', border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#92400e', marginBottom: 5 }}>💡 Answer Tip</div>
                    <p style={{ fontSize: 12, color: '#78350f', margin: 0, lineHeight: 1.6 }}>{question.tips}</p>
                  </div>
                )}
              </div>

              {/* Live waveform (answering phase) */}
              {subPhase === 'answering' && (
                <div style={{ padding: '0 26px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Mic size={16} color="#6366f1" />
                  <LiveWaveform active={micActive} />
                  <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Recording…</span>
                </div>
              )}

              {/* Action buttons */}
              <div style={{
                padding: '14px 24px', borderTop: '1px solid #f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
              }}>
                {/* Skip */}
                <button
                  onClick={handleSkip}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 10, cursor: 'pointer',
                    background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48',
                    fontSize: 12, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                  }}
                >
                  <SkipForward size={14} /> Skip (−10 marks)
                </button>

                {subPhase === 'answering' && (
                  <button
                    onClick={handleSubmitAnswer}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '10px 22px', borderRadius: 12, cursor: 'pointer',
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      border: 'none', color: 'white', fontSize: 13, fontWeight: 700,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Submit Answer <ChevronRight size={15} />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Right: Camera + Metrics ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Camera feed */}
          <div style={{ background: '#0f172a', borderRadius: 18, border: '1px solid #1e293b', overflow: 'hidden' }}>
            <div style={{ aspectRatio: '4/3', position: 'relative', background: '#0f172a' }}>
              <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* Live indicator */}
              <div style={{
                position: 'absolute', top: 10, left: 10, display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 10px', borderRadius: 99, background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444', animation: 'pulse 1s ease-in-out infinite' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: 'white' }}>LIVE</span>
              </div>
              {/* Mic indicator */}
              <div style={{
                position: 'absolute', top: 10, right: 10, padding: '4px 8px',
                borderRadius: 99, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
              }}>
                {micActive ? <Mic size={13} color="#22c55e" /> : <MicOff size={13} color="#ef4444" />}
              </div>
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid #1e293b', fontSize: 11, color: '#64748b', textAlign: 'center' }}>
              📷 Proctored · Analyzing eye contact & confidence
            </div>
          </div>

          {/* Live Metrics panel */}
          <div style={{ background: '#0f172a', borderRadius: 18, border: '1px solid #1e293b', padding: '18px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16, textAlign: 'center' }}>
              🤖 Live AI Analysis
            </div>
            {subPhase === 'answering' ? (
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <RadialMetric label="Fluency" value={metrics.fluency} color="#6366f1" icon={Volume2} />
                <RadialMetric label="Eye Contact" value={metrics.eyeContact} color="#10b981" icon={Eye} />
                <RadialMetric label="Confidence" value={metrics.confidence} color="#f59e0b" icon={Zap} />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0', color: '#475569', fontSize: 12 }}>
                Analysis begins when you start answering
              </div>
            )}
          </div>

          {/* Question map */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '14px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
              Progress
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 5 }}>
              {HR_COMM_QUESTIONS.map((q, i) => {
                const isDone = i < currentIdx;
                const isCurrent = i === currentIdx;
                const wasSkipped = skipped.includes(q.id);
                const earned = scores[i];
                return (
                  <div key={q.id} style={{
                    height: 24, borderRadius: 6,
                    background: isCurrent ? '#6366f1' : isDone ? (wasSkipped ? '#e2e8f0' : earned >= 7 ? '#dcfce7' : '#fef3c7') : '#f8fafc',
                    border: `1.5px solid ${isCurrent ? '#818cf8' : isDone ? (wasSkipped ? '#cbd5e1' : earned >= 7 ? '#86efac' : '#fcd34d') : '#e2e8f0'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 8, fontWeight: 700,
                    color: isCurrent ? 'white' : isDone ? '#64748b' : '#cbd5e1',
                  }}>
                    {isDone ? (wasSkipped ? '−' : `${earned}`) : isCurrent ? '●' : i + 1}
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
              {[
                { bg: '#dcfce7', border: '#86efac', label: '≥7 pts' },
                { bg: '#fef3c7', border: '#fcd34d', label: '<7 pts' },
                { bg: '#e2e8f0', border: '#cbd5e1', label: 'Skipped' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.bg, border: `1px solid ${item.border}` }} />
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
};

export default HrCommRound;
