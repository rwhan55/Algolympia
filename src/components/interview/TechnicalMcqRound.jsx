import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, ChevronRight, ChevronLeft, Flag, Award, BarChart2 } from 'lucide-react';
import { getRandomMcqQuestions } from '../../constants/mcqQuestions';

// ── Design Tokens ─────────────────────────────────────────────────────────────
const TOTAL_QUESTIONS = 10;
const MARKS_PER_QUESTION = 8;
const DURATION_SECONDS = 25 * 60; // 25 minutes

const TOPIC_COLORS = {
  'DSA': { bg: '#eef2ff', border: '#c7d2fe', text: '#4f46e5', badge: '#6366f1' },
  'Computer Networks': { bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46', badge: '#10b981' },
  'OOPs Concepts': { bg: '#fdf4ff', border: '#e9d5ff', text: '#6b21a8', badge: '#9333ea' },
};

const formatTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// ── Sub-components ────────────────────────────────────────────────────────────
const OptionButton = ({ option, index, selected, revealed, correct, onClick }) => {
  const letters = ['A', 'B', 'C', 'D'];
  let bg = '#f8fafc', border = '#e2e8f0', textColor = '#1e293b', badge = '#94a3b8';

  if (revealed) {
    if (index === correct) {
      bg = '#dcfce7'; border = '#86efac'; textColor = '#166534'; badge = '#22c55e';
    } else if (index === selected && index !== correct) {
      bg = '#fee2e2'; border = '#fca5a5'; textColor = '#991b1b'; badge = '#ef4444';
    }
  } else if (selected === index) {
    bg = '#eef2ff'; border = '#818cf8'; textColor = '#3730a3'; badge = '#6366f1';
  }

  return (
    <motion.button
      whileHover={!revealed ? { scale: 1.01 } : {}}
      whileTap={!revealed ? { scale: 0.99 } : {}}
      onClick={() => !revealed && onClick(index)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, width: '100%',
        padding: '14px 18px', borderRadius: 14, cursor: revealed ? 'default' : 'pointer',
        background: bg, border: `2px solid ${border}`, textAlign: 'left',
        transition: 'all 0.2s ease', fontFamily: 'Inter, sans-serif',
      }}
    >
      <span style={{
        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
        background: badge, color: 'white', fontWeight: 800, fontSize: 13,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {letters[index]}
      </span>
      <span style={{ fontSize: 14, fontWeight: 500, color: textColor, lineHeight: 1.5 }}>
        {option}
      </span>
      {revealed && index === correct && (
        <CheckCircle2 size={18} style={{ marginLeft: 'auto', color: '#22c55e', flexShrink: 0 }} />
      )}
      {revealed && index === selected && index !== correct && (
        <XCircle size={18} style={{ marginLeft: 'auto', color: '#ef4444', flexShrink: 0 }} />
      )}
    </motion.button>
  );
};

// ── Main TechnicalMcqRound Component ─────────────────────────────────────────
const TechnicalMcqRound = ({ onRoundComplete }) => {
  const [questions] = useState(() => getRandomMcqQuestions(TOTAL_QUESTIONS));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOptionIndex }
  const [flagged, setFlagged] = useState(new Set());
  const [revealed, setRevealed] = useState({}); // { questionId: true }
  const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS);
  const [phase, setPhase] = useState('active'); // 'active' | 'review' | 'submitted'
  const [score, setScore] = useState(null);
  const timerRef = useRef(null);

  const currentQ = questions[currentIdx];

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'active') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // ── Scoring ────────────────────────────────────────────────────────────────
  const calculateScore = useCallback(() => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });
    return { correct, total: TOTAL_QUESTIONS, marks: correct * MARKS_PER_QUESTION };
  }, [answers, questions]);

  const handleAutoSubmit = useCallback(() => {
    const result = calculateScore();
    setScore(result);
    setPhase('submitted');
    clearInterval(timerRef.current);
    // Reveal all answers
    const rev = {};
    questions.forEach(q => { rev[q.id] = true; });
    setRevealed(rev);
    if (onRoundComplete) {
      setTimeout(() => onRoundComplete({ round: 'MCQ', ...result }), 1200);
    }
  }, [calculateScore, questions, onRoundComplete]);

  const handleSelectOption = (optionIdx) => {
    if (revealed[currentQ.id]) return;
    setAnswers(prev => ({ ...prev, [currentQ.id]: optionIdx }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx(i => i + 1);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const next = new Set(prev);
      next.has(currentQ.id) ? next.delete(currentQ.id) : next.add(currentQ.id);
      return next;
    });
  };

  const handleSubmit = () => {
    clearInterval(timerRef.current);
    const result = calculateScore();
    setScore(result);
    setPhase('submitted');
    const rev = {};
    questions.forEach(q => { rev[q.id] = true; });
    setRevealed(rev);
    if (onRoundComplete) {
      setTimeout(() => onRoundComplete({ round: 'MCQ', ...result }), 400);
    }
  };

  const topicMeta = TOPIC_COLORS[currentQ?.topic] || TOPIC_COLORS['DSA'];
  const timerCritical = timeLeft < 300; // < 5 minutes
  const answeredCount = Object.keys(answers).length;

  // ─── SUBMITTED / RESULTS SCREEN ────────────────────────────────────────────
  if (phase === 'submitted' && score) {
    const pct = Math.round((score.marks / (TOTAL_QUESTIONS * MARKS_PER_QUESTION)) * 100);
    const gradeColor = pct >= 75 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444';

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ maxWidth: 720, margin: '0 auto', padding: '0 0 32px' }}
      >
        {/* Score Card */}
        <div style={{
          background: 'white', borderRadius: 24, border: '1px solid #e2e8f0',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)', overflow: 'hidden',
          marginBottom: 24,
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${gradeColor}15, ${gradeColor}05)`,
            padding: '32px 32px 24px', textAlign: 'center',
            borderBottom: '1px solid #e2e8f0',
          }}>
            <div style={{
              width: 90, height: 90, borderRadius: '50%', margin: '0 auto 16px',
              background: `${gradeColor}20`, border: `3px solid ${gradeColor}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Award size={38} style={{ color: gradeColor }} />
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1e293b', margin: '0 0 6px' }}>
              Round 1 Complete!
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Technical MCQ Round</p>
          </div>

          <div style={{ padding: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
              {[
                { label: 'Score', value: `${score.marks}`, unit: '/ 80', color: gradeColor },
                { label: 'Correct', value: `${score.correct}`, unit: `/ ${TOTAL_QUESTIONS}`, color: '#3b82f6' },
                { label: 'Accuracy', value: `${pct}%`, unit: '', color: pct >= 75 ? '#22c55e' : '#f59e0b' },
              ].map(item => (
                <div key={item.label} style={{
                  textAlign: 'center', padding: '18px 12px', borderRadius: 16,
                  background: '#f8fafc', border: '1px solid #e2e8f0',
                }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: item.color, lineHeight: 1.1 }}>
                    {item.value}<span style={{ fontSize: 14, fontWeight: 500, color: '#94a3b8' }}>{item.unit}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Per-question result list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {questions.map((q, i) => {
                const userAns = answers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                const isSkipped = userAns === undefined;
                return (
                  <div key={q.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '12px 16px', borderRadius: 12, background: '#f8fafc',
                    border: `1px solid ${isCorrect ? '#bbf7d0' : isSkipped ? '#e2e8f0' : '#fecaca'}`,
                  }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                      background: isCorrect ? '#22c55e' : isSkipped ? '#94a3b8' : '#ef4444',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isCorrect ? <CheckCircle2 size={14} color="white" /> : <XCircle size={14} color="white" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>
                        Q{i + 1}: {q.subtopic}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>
                        {q.question.substring(0, 90)}{q.question.length > 90 ? '…' : ''}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: isCorrect ? '#166534' : '#991b1b',
                      background: isCorrect ? '#dcfce7' : isSkipped ? '#f1f5f9' : '#fee2e2',
                      padding: '2px 10px', borderRadius: 99, flexShrink: 0,
                    }}>
                      {isCorrect ? '+8' : isSkipped ? '0' : '0'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ─── ACTIVE EXAM SCREEN ────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Top bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        padding: '12px 20px', background: 'white', borderRadius: 16, border: '1px solid #e2e8f0',
        boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BarChart2 size={18} color="#6366f1" />
          <span style={{ fontWeight: 800, fontSize: 14, color: '#1e293b' }}>Technical MCQ — Round 1</span>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
            background: '#eef2ff', color: '#6366f1', border: '1px solid #c7d2fe',
          }}>
            {answeredCount}/{TOTAL_QUESTIONS} Answered
          </span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px',
          borderRadius: 10, fontFamily: "'JetBrains Mono', monospace",
          background: timerCritical ? '#fee2e2' : '#f1f5f9',
          border: `1px solid ${timerCritical ? '#fca5a5' : '#e2e8f0'}`,
        }}>
          <Clock size={15} color={timerCritical ? '#ef4444' : '#64748b'} />
          <span style={{ fontWeight: 700, fontSize: 15, color: timerCritical ? '#ef4444' : '#1e293b' }}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 16, alignItems: 'start' }}>

        {/* ── Question Card ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28 }}
              style={{
                background: 'white', borderRadius: 20, border: '1px solid #e2e8f0',
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden',
              }}
            >
              {/* Question header */}
              <div style={{
                padding: '20px 24px 16px',
                borderBottom: '1px solid #f1f5f9',
                background: topicMeta.bg,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 99,
                    background: topicMeta.badge, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {currentQ.topic}
                  </span>
                  <span style={{ fontSize: 11, color: topicMeta.text, fontWeight: 600 }}>
                    · {currentQ.subtopic}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#64748b' }}>
                    Q{currentIdx + 1} of {TOTAL_QUESTIONS} · 8 marks
                  </span>
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: 0, lineHeight: 1.6 }}>
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {currentQ.options.map((opt, i) => (
                  <OptionButton
                    key={i}
                    option={opt}
                    index={i}
                    selected={answers[currentQ.id] ?? -1}
                    revealed={!!revealed[currentQ.id]}
                    correct={currentQ.correctAnswer}
                    onClick={handleSelectOption}
                  />
                ))}
              </div>

              {/* Explanation (only revealed) */}
              {revealed[currentQ.id] && (
                <div style={{
                  margin: '0 24px 20px', padding: '14px 16px', borderRadius: 12,
                  background: '#fffbeb', border: '1px solid #fde68a',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#92400e', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    💡 Explanation
                  </div>
                  <p style={{ fontSize: 13, color: '#78350f', margin: 0, lineHeight: 1.6 }}>
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Navigation buttons */}
              <div style={{
                padding: '14px 24px', borderTop: '1px solid #f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handlePrev}
                    disabled={currentIdx === 0}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', borderRadius: 10, cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
                      background: currentIdx === 0 ? '#f8fafc' : '#f1f5f9',
                      border: '1px solid #e2e8f0', color: currentIdx === 0 ? '#cbd5e1' : '#475569',
                      fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <ChevronLeft size={15} /> Prev
                  </button>
                  <button
                    onClick={toggleFlag}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
                      background: flagged.has(currentQ.id) ? '#fff7ed' : '#f8fafc',
                      border: `1px solid ${flagged.has(currentQ.id) ? '#fed7aa' : '#e2e8f0'}`,
                      color: flagged.has(currentQ.id) ? '#ea580c' : '#94a3b8',
                      fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <Flag size={14} /> {flagged.has(currentQ.id) ? 'Flagged' : 'Flag'}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {currentIdx < questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 18px', borderRadius: 10, cursor: 'pointer',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        border: 'none', color: 'white',
                        fontSize: 13, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      Next <ChevronRight size={15} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      style={{
                        padding: '8px 20px', borderRadius: 10, cursor: 'pointer',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        border: 'none', color: 'white',
                        fontSize: 13, fontWeight: 700, fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      Submit All
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Question Navigator ── */}
        <div style={{
          background: 'white', borderRadius: 18, border: '1px solid #e2e8f0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden',
          position: 'sticky', top: 0,
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Question Navigator
            </p>
          </div>
          <div style={{ padding: 14, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
            {questions.map((q, i) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = i === currentIdx;
              const isFlagged = flagged.has(q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(i)}
                  style={{
                    width: '100%', aspectRatio: '1', borderRadius: 10,
                    fontWeight: 700, fontSize: 13,
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    border: isCurrent ? '2px solid #6366f1' : '1.5px solid #e2e8f0',
                    background: isCurrent ? '#eef2ff'
                      : isFlagged ? '#fff7ed'
                        : isAnswered ? '#dcfce7'
                          : '#f8fafc',
                    color: isCurrent ? '#4f46e5'
                      : isFlagged ? '#ea580c'
                        : isAnswered ? '#166534'
                          : '#94a3b8',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isFlagged ? '🚩' : i + 1}
                </button>
              );
            })}
          </div>
          <div style={{ padding: '12px 14px', borderTop: '1px solid #f1f5f9' }}>
            {[
              { color: '#dcfce7', border: '#bbf7d0', label: 'Answered' },
              { color: '#f8fafc', border: '#e2e8f0', label: 'Not Attempted' },
              { color: '#fff7ed', border: '#fed7aa', label: 'Flagged' },
              { color: '#eef2ff', border: '#c7d2fe', label: 'Current' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, background: item.color, border: `1.5px solid ${item.border}`, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: '#64748b' }}>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '0 14px 14px' }}>
            <button
              onClick={handleSubmit}
              style={{
                width: '100%', padding: '10px', borderRadius: 12, cursor: 'pointer',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none', color: 'white', fontSize: 13,
                fontWeight: 700, fontFamily: 'Inter, sans-serif',
              }}
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalMcqRound;
