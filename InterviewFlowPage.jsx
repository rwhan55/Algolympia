import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, Code2, Clock, ShieldCheck, Sparkles, Play,
  Users, CheckCircle2, Award, ChevronRight, Video, Mic, FileText, ArrowRight, Shield, RefreshCw
} from 'lucide-react';
import TechnicalMcqRound from '../components/interview/TechnicalMcqRound';
import ProctoredCodingRound from '../components/coding/ProctoredCodingRound';
import HrCommRound from '../components/interview/HrCommRound';
import { reportApi } from '../services/reportApi';

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: '#f5f7fa',
  card: '#ffffff',
  border: '#e8ecf1',
  indigo: '#4f46e5',
  indigoBg: '#eef2ff',
  text: '#1e293b',
  sub: '#64748b',
  muted: '#94a3b8',
};

const SectionCard = ({ children, style = {} }) => (
  <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', ...style }}>
    {children}
  </div>
);

// ── Main Unified Interview Flow Page ─────────────────────────────────────────
export const InterviewFlowPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'drive' | 'selector' | 'mcq' | 'coding' | 'hr_comm'
  const [activeMode, setActiveMode] = useState(() => {
    return location.state?.roundMode || 'drive';
  });

  // Track multi-round drive progress: 1 (MCQ) -> 2 (Coding) -> 3 (HR & Comm)
  const [driveCurrentRound, setDriveCurrentRound] = useState(1);
  const [driveScores, setDriveScores] = useState({
    mcq: null,
    coding: null,
    hrComm: null,
  });

  const [transitioning, setTransitioning] = useState(false);
  const [transitionMsg, setTransitionMsg] = useState('');
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  // Unique session key that changes every time a round/section is clicked to generate a new set of questions
  const [sessionKey, setSessionKey] = useState(() => Date.now());

  const handleSelectMode = (mode) => {
    setSessionKey(Date.now());
    setActiveMode(mode);
    setDriveCurrentRound(1);
  };

  const generateDynamicReport = (mode, data) => {
    let dsaScore = 0;
    let hrScore = 0;
    let commsScore = 0;
    let overallScore = 0;
    let sysDesignScore = 0;
    let resumeScore = 0;

    if (mode === 'MCQ') {
      const mcqMarks = data.marks ?? 0; // out of 80
      dsaScore = Math.round((mcqMarks / 80) * 100);
      overallScore = dsaScore;
      sysDesignScore = dsaScore;
      resumeScore = dsaScore;
    } else if (mode === 'CODING') {
      const codingMarks = data.totalMarks ?? 0; // out of 100
      dsaScore = Math.round((codingMarks / 100) * 100);
      overallScore = dsaScore;
      sysDesignScore = dsaScore;
      resumeScore = dsaScore;
    } else if (mode === 'HR_COMM') {
      const scoresArr = data.scores || [];
      const hrEarned = scoresArr.slice(0, 6).reduce((a, b) => a + b, 0); // max 60
      const commEarned = scoresArr.slice(6).reduce((a, b) => a + b, 0); // max 100
      hrScore = Math.round((hrEarned / 60) * 100);
      commsScore = Math.round((commEarned / 100) * 100);
      overallScore = Math.round(((hrEarned + commEarned) / 160) * 100);
      sysDesignScore = commsScore;
      resumeScore = hrScore;
    } else if (mode === 'DRIVE') {
      const mcqMarks = data.mcq?.marks ?? 0; // max 80
      const codingMarks = data.coding?.totalMarks ?? 0; // max 100
      const scoresArr = data.hrComm?.scores || [];
      const hrEarned = scoresArr.slice(0, 6).reduce((a, b) => a + b, 0); // max 60
      const commEarned = scoresArr.slice(6).reduce((a, b) => a + b, 0); // max 100

      const dsaMcqScore = Math.round((mcqMarks / 80) * 100);
      const codingScore = Math.round((codingMarks / 100) * 100);
      dsaScore = Math.round((dsaMcqScore + codingScore) / 2);

      hrScore = Math.round((hrEarned / 60) * 100);
      commsScore = Math.round((commEarned / 100) * 100);

      sysDesignScore = Math.round((dsaScore + hrScore + commsScore) / 3);
      resumeScore = Math.round(dsaScore * 0.5 + commsScore * 0.5);

      const totalEarned = mcqMarks + codingMarks + hrEarned + commEarned; // max 340
      overallScore = Math.round((totalEarned / 340) * 100);
    }

    const rec = overallScore >= 80 ? 'STRONG HIRE' : overallScore >= 60 ? 'HIRE' : 'NEED IMPROVEMENT';
    const reportId = `rep_dyn_${Date.now().toString().slice(-6)}`;

    const newReport = {
      id: reportId,
      candidateName: 'Alex Johnson',
      targetRole: targetRole || 'Senior Full Stack Engineer',
      role: targetRole || 'Senior Full Stack Engineer',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      duration: '60 mins',
      difficulty: 'Advanced',
      overallScore,
      recommendation: rec,
      scores: {
        hr: hrScore,
        dsa: dsaScore,
        sysDesign: sysDesignScore,
        comms: commsScore,
        resume: resumeScore,
      },
      summary: `Candidate completed ${mode === 'DRIVE' ? 'the full 3-Round Placement Drive' : `${mode} assessment`}. Earned score: ${overallScore}%.`,
      strengths: overallScore >= 70 ? [
        'Solid problem solving approach demonstrated during assessment',
        'Good verbal articulation and core computer science fundamentals',
        'Accurate test case execution and logical clarity'
      ] : [
        'Attempted all assessment sections',
        'Basic familiarity with computer science fundamentals'
      ],
      weaknesses: overallScore < 80 ? [
        'Speed & time management under proctored exam conditions',
        'Deep edge-case handling in algorithmic problems'
      ] : [
        'Minor edge case handling in advanced dynamic programming'
      ],
      improvements: [
        'Practice timed coding challenges on LeetCode / HackerRank',
        'Structure HR answers using the STAR technique (Situation, Task, Action, Result)',
        'Review core OS, Networking, and OOPs concepts'
      ],
      questionFeedback: [
        {
          questionNum: 1,
          interviewer: 'Technical Evaluation Panel',
          score: dsaScore,
          question: 'DSA & Technical Core Knowledge',
          userAnswerTranscript: 'Submitted technical MCQ and coding implementations.',
          aiFeedback: `Scored ${dsaScore}% on technical DSA, CN & OOPs assessment.`
        },
        {
          questionNum: 2,
          interviewer: 'HR & Communication Coach',
          score: commsScore,
          question: 'HR & Verbal Communication Assessment',
          userAnswerTranscript: 'Recorded verbal & situational responses under video/audio monitoring.',
          aiFeedback: `Achieved ${hrScore}% in HR responses and ${commsScore}% in speech delivery.`
        }
      ],
      roundBreakdown: [
        { name: 'Technical MCQ', score: dsaScore, feedback: 'Evaluated DSA, CN & OOPs concepts' },
        { name: 'Proctored Coding', score: dsaScore, feedback: 'Live HackerRank-style code test cases' },
        { name: 'HR & Communication', score: commsScore, feedback: 'Evaluated verbal flow, fluency & eye contact' },
      ]
    };

    reportApi.saveReport(newReport);
    return newReport;
  };

  const handleRoundComplete = (roundData) => {
    if (activeMode === 'drive') {
      if (driveCurrentRound === 1) {
        setDriveScores(prev => ({ ...prev, mcq: roundData }));
        setTransitionMsg('Round 1 Completed! Loading Round 2: Proctored Coding Round…');
        setTransitioning(true);
        setTimeout(() => {
          setTransitioning(false);
          setDriveCurrentRound(2);
        }, 600);
      } else if (driveCurrentRound === 2) {
        setDriveScores(prev => ({ ...prev, coding: roundData }));
        setTransitionMsg('Round 2 Completed! Loading Round 3: HR & Communications Round…');
        setTransitioning(true);
        setTimeout(() => {
          setTransitioning(false);
          setDriveCurrentRound(3);
        }, 600);
      } else if (driveCurrentRound === 3) {
        const fullDriveData = {
          mcq: driveScores.mcq,
          coding: driveScores.coding,
          hrComm: roundData,
        };
        setTransitionMsg('Placement Drive Completed! Compiling Diagnostic Report…');
        setTransitioning(true);
        const r = generateDynamicReport('DRIVE', fullDriveData);
        setTimeout(() => {
          setTransitioning(false);
          navigate(`/report/${r.id}`);
        }, 800);
      }
    } else {
      const modeKey = activeMode === 'mcq' ? 'MCQ' : activeMode === 'coding' ? 'CODING' : 'HR_COMM';
      setTransitionMsg('Assessment Completed! Compiling Diagnostic Report…');
      setTransitioning(true);
      const r = generateDynamicReport(modeKey, roundData);
      setTimeout(() => {
        setTransitioning(false);
        navigate(`/report/${r.id}`);
      }, 800);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER: ROUND TRANSITION OVERLAY
  // ──────────────────────────────────────────────────────────────────────────
  if (transitioning) {
    return (
      <div style={{ maxWidth: 520, margin: '60px auto', textAlign: 'center' }}>
        <SectionCard style={{ padding: 48 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: '#eef2ff', border: '2px solid #818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Sparkles size={32} color="#4f46e5" />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: '0 0 10px' }}>Advancing to Next Round</h2>
          <p style={{ fontSize: 14, color: C.sub, margin: '0 0 24px', lineHeight: 1.6 }}>{transitionMsg}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center', fontSize: 13, fontWeight: 700, color: '#4f46e5' }}>
            <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> Initializing Environment…
          </div>
        </SectionCard>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER: ASSESSMENT HUB / SELECTOR
  // ──────────────────────────────────────────────────────────────────────────
  if (activeMode === 'selector') {
    return (
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '8px 0 40px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18, margin: '0 auto 16px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
            }}>
              <BrainCircuit size={32} color="white" />
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
              ALGOOlympia Placement Drive Hub
            </h1>
            <p style={{ fontSize: 14, color: C.sub, margin: 0, lineHeight: 1.6, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
              Run the complete 3-Round Placement Drive consecutively or practice an individual round.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Complete Unified Drive (Recommended) */}
            <SectionCard style={{ padding: 28, background: 'linear-gradient(135deg, #1e1b4b, #312e81)', border: '1px solid #4338ca', color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 99, background: '#4f46e5', color: 'white', letterSpacing: '0.07em' }}>
                    RECOMMENDED · ALL 3 ROUNDS IN SEQUENCE
                  </span>
                  <h2 style={{ fontSize: 22, fontWeight: 800, margin: '8px 0 6px', color: 'white' }}>
                    Complete Placement Drive (340 Marks Total)
                  </h2>
                  <p style={{ fontSize: 13, color: '#a5b4fc', margin: 0, lineHeight: 1.6, maxWidth: 500 }}>
                    Executes <strong>Round 1 (Technical MCQ: DSA/CN/OOPs - 80 pts)</strong> → <strong>Round 2 (Proctored Coding - 100 pts)</strong> → <strong>Round 3 (Combined HR & Comm - 160 pts)</strong> back-to-back.
                  </p>
                </div>
                <button
                  onClick={() => handleSelectMode('drive')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 14, cursor: 'pointer',
                    background: 'linear-gradient(135deg, #db2777, #2563eb)', color: 'white', fontWeight: 800, fontSize: 15,
                    border: 'none', fontFamily: 'Inter, sans-serif', boxShadow: '0 6px 20px rgba(219,39,119,0.25)'
                  }}
                >
                  <Sparkles size={18} /> Start Unified Placement Drive
                </button>
              </div>
            </SectionCard>

            {/* Individual Rounds */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 8 }}>
              {/* Round 1 */}
              <SectionCard style={{ padding: 20 }}>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: '#eef2ff', color: '#4f46e5' }}>ROUND 1</span>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: C.text, margin: '8px 0 4px' }}>Technical MCQ</h4>
                <p style={{ fontSize: 12, color: C.sub, margin: '0 0 16px', lineHeight: 1.4 }}>10 Qs · 25 Mins · 80 Marks · DSA, CN, OOPs</p>
                <button
                  onClick={() => handleSelectMode('mcq')}
                  style={{ width: '100%', padding: '9px', borderRadius: 10, background: C.indigoBg, border: `1px solid ${C.indigo}`, color: C.indigo, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                >
                  Start Round 1
                </button>
              </SectionCard>

              {/* Round 2 */}
              <SectionCard style={{ padding: 20 }}>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: '#f3e8ff', color: '#7c3aed' }}>ROUND 2</span>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: C.text, margin: '8px 0 4px' }}>Proctored Coding</h4>
                <p style={{ fontSize: 12, color: C.sub, margin: '0 0 16px', lineHeight: 1.4 }}>2 Problems · 60 Mins · 100 Marks · Camera Proctoring</p>
                <button
                  onClick={() => handleSelectMode('coding')}
                  style={{ width: '100%', padding: '9px', borderRadius: 10, background: '#f3e8ff', border: '1px solid #7c3aed', color: '#7c3aed', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                >
                  Start Round 2
                </button>
              </SectionCard>

              {/* Round 3 */}
              <SectionCard style={{ padding: 20 }}>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: '#fef3c7', color: '#d97706' }}>ROUND 3</span>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: C.text, margin: '8px 0 4px' }}>HR & Communication</h4>
                <p style={{ fontSize: 12, color: C.sub, margin: '0 0 16px', lineHeight: 1.4 }}>16 Qs · 160 Marks · Mic & Camera Speech Analysis</p>
                <button
                  onClick={() => handleSelectMode('hr_comm')}
                  style={{ width: '100%', padding: '9px', borderRadius: 10, background: '#fef3c7', border: '1px solid #f59e0b', color: '#d97706', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                >
                  Start Round 3
                </button>
              </SectionCard>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER: INDIVIDUAL ROUND MODES
  // ──────────────────────────────────────────────────────────────────────────
  if (activeMode === 'mcq') {
    return (
      <div>
        <button
          onClick={() => setActiveMode('selector')}
          style={{ marginBottom: 16, padding: '6px 14px', borderRadius: 8, background: '#fafafa', border: '1px solid #e4e4e7', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#171717' }}
        >
          ← Back to Hub
        </button>
        <TechnicalMcqRound key={`mcq_${sessionKey}`} onRoundComplete={handleRoundComplete} />
      </div>
    );
  }

  if (activeMode === 'coding') {
    return (
      <div>
        <button
          onClick={() => setActiveMode('selector')}
          style={{ marginBottom: 16, padding: '6px 14px', borderRadius: 8, background: '#fafafa', border: '1px solid #e4e4e7', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#171717' }}
        >
          ← Back to Hub
        </button>
        <ProctoredCodingRound key={`coding_${sessionKey}`} onRoundComplete={handleRoundComplete} />
      </div>
    );
  }

  if (activeMode === 'hr_comm') {
    return (
      <div>
        <button
          onClick={() => setActiveMode('selector')}
          style={{ marginBottom: 16, padding: '6px 14px', borderRadius: 8, background: '#fafafa', border: '1px solid #e4e4e7', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#171717' }}
        >
          ← Back to Hub
        </button>
        <HrCommRound key={`hr_${sessionKey}`} onRoundComplete={handleRoundComplete} />
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER: UNIFIED 3-ROUND DRIVE (DEFAULT & PRIMARY FLOW)
  // ──────────────────────────────────────────────────────────────────────────
  // If activeMode === 'drive' or unhandled, render the drive flow sequentially!
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 22px', borderRadius: 16, background: '#ffffff', border: '1px solid #e4e4e7', color: '#171717', marginBottom: 20,
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 99, background: 'rgba(219,39,119,0.1)', color: '#db2777', border: '1px solid rgba(219,39,119,0.2)', letterSpacing: '0.06em' }}>
            PLACEMENT DRIVE · ROUND {driveCurrentRound} OF 3
          </span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#171717' }}>
            {driveCurrentRound === 1 && 'Round 1: Technical MCQ (DSA, CN & OOPs — 80 Marks)'}
            {driveCurrentRound === 2 && 'Round 2: Proctored Coding (HackerRank IDE — 100 Marks)'}
            {driveCurrentRound === 3 && 'Round 3: Combined HR & Communication (Speech & Video — 160 Marks)'}
          </span>
        </div>
        <button
          onClick={() => setActiveMode('selector')}
          style={{ padding: '6px 14px', borderRadius: 8, background: '#fafafa', border: '1px solid #e4e4e7', color: '#171717', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
        >
          Exit Drive
        </button>
      </div>

      {driveCurrentRound === 1 && <TechnicalMcqRound key={`drive_1_${sessionKey}`} onRoundComplete={handleRoundComplete} />}
      {driveCurrentRound === 2 && <ProctoredCodingRound key={`drive_2_${sessionKey}`} onRoundComplete={handleRoundComplete} />}
      {driveCurrentRound === 3 && <HrCommRound key={`drive_3_${sessionKey}`} onRoundComplete={handleRoundComplete} />}
    </div>
  );
};

export default InterviewFlowPage;
