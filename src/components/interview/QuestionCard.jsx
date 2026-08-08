import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Volume2, VolumeX, Tag, Hash } from 'lucide-react';

const ROUND_COLORS = {
  HR: { bg: '#fef3c7', border: '#fde68a', text: '#92400e', dot: '#f59e0b' },
  DSA: { bg: '#ede9fe', border: '#c4b5fd', text: '#5b21b6', dot: '#7c3aed' },
  SYSTEM_DESIGN: { bg: '#dbeafe', border: '#bfdbfe', text: '#1e40af', dot: '#3b82f6' },
  COMMUNICATION: { bg: '#d1fae5', border: '#a7f3d0', text: '#065f46', dot: '#10b981' },
  RESUME: { bg: '#fce7f3', border: '#fbcfe8', text: '#9d174d', dot: '#ec4899' },
};

export const QuestionCard = ({ question, questionNumber, totalQuestions, onSpeechStart, onSpeechEnd }) => {
  const [showHint, setShowHint] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedText, setDisplayedText] = useState('');

  const colors = ROUND_COLORS[question?.interviewerType] || ROUND_COLORS.HR;

  // Typewriter animation for question text — makes it feel like AI is reading aloud
  useEffect(() => {
    if (!question?.question) return;
    setDisplayedText('');
    setIsTyping(true);
    setShowHint(false);

    let i = 0;
    const text = question.question;
    const speed = 18; // ms per character

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [question?.id]);

  const handleSpeak = () => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      if (onSpeechEnd) onSpeechEnd();
      return;
    }
    const utterance = new SpeechSynthesisUtterance(question.question);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => { setIsSpeaking(true); if (onSpeechStart) onSpeechStart(); };
    utterance.onend = () => { setIsSpeaking(false); if (onSpeechEnd) onSpeechEnd(); };
    utterance.onerror = () => { setIsSpeaking(false); };
    window.speechSynthesis.speak(utterance);
  };

  if (!question) return null;

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e8ecf1',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    }}>
      {/* Top accent bar with round color */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${colors.dot}, ${colors.dot}aa)` }} />

      {/* Header */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, padding: '16px 20px',
        borderBottom: '1px solid #f1f5f9',
        background: '#fafbfc',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Question number */}
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: colors.bg, border: `1.5px solid ${colors.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color: colors.text,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {questionNumber}
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
              Question {questionNumber} of {totalQuestions}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 11, color: colors.dot }}>●</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>{question.round}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Category tag */}
          <span style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 99,
            background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
          }}>
            <Tag size={10} /> {question.category}
          </span>

          {/* TTS Play Button */}
          <button
            onClick={handleSpeak}
            title={isSpeaking ? 'Stop speaking' : 'Listen to question (Text-to-Speech)'}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 9, cursor: 'pointer',
              background: isSpeaking ? colors.bg : '#f8fafc',
              border: `1.5px solid ${isSpeaking ? colors.border : '#e2e8f0'}`,
              color: isSpeaking ? colors.text : '#64748b',
              fontSize: 11, fontWeight: 600,
              transition: 'all 0.15s ease',
            }}
          >
            {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
          </button>
        </div>
      </div>

      {/* Main Question Body */}
      <div style={{ padding: '24px 24px 20px' }}>
        <p style={{
          fontSize: 17,
          fontWeight: 600,
          color: '#1e293b',
          lineHeight: 1.75,
          margin: 0,
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '-0.1px',
        }}>
          {displayedText}
          {isTyping && (
            <span style={{
              display: 'inline-block', width: 2, height: 18, marginLeft: 2,
              background: colors.dot, borderRadius: 2,
              animation: 'blink 0.9s infinite',
              verticalAlign: 'middle',
            }} />
          )}
        </p>

        {/* Hint section - shown after typing completes */}
        {!isTyping && question.sampleAnswerHint && (
          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => setShowHint(!showHint)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                background: '#fffbeb', border: '1px solid #fde68a',
                color: '#92400e', fontSize: 12, fontWeight: 600,
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <HelpCircle size={14} style={{ color: '#f59e0b' }} />
                <span>Need a hint? View structure guide</span>
              </div>
              {showHint ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showHint && (
              <div style={{
                marginTop: 8, padding: '12px 16px', borderRadius: 10,
                background: '#fffbeb', border: '1px solid #fde68a',
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#92400e', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Key Talking Points:
                </p>
                <p style={{ fontSize: 13, color: '#78350f', lineHeight: 1.65, margin: 0 }}>
                  {question.sampleAnswerHint}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pacing Tip Footer */}
      <div style={{
        padding: '10px 20px', borderTop: '1px solid #f1f5f9',
        background: '#fafbfc', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 11, color: '#94a3b8' }}>
          💡 Take a moment to think before answering. You can ask for clarification if needed.
        </span>
      </div>

      {/* CSS for blink animation */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default QuestionCard;
