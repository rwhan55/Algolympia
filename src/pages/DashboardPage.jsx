import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mic, Upload, Trophy, BarChart3, FileCheck2, Clock,
  ArrowRight, Award, TrendingUp, ChevronRight, Zap,
  Brain, Code2, Users, FileText, Target, Sparkles, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reportApi } from '../services/reportApi';
import { INTERVIEWERS, INTERVIEWER_TYPES } from '../constants/interviewers';
import CareerGoalSection from '../components/common/CareerGoalSection';

// ── Minimal White Palette ──────────────────────────────────
const COLORS = {
  bg:       '#ffffff', 
  card:     '#ffffff', 
  cardBg:   '#fafafa',
  border:   '#e4e4e7', 
  pink:     '#db2777', 
  blue:     '#2563eb', 
  text:     '#09090b', 
  sub:      '#52525b', 
  muted:    '#71717a', 
};

const scoreColor = (s) => s >= 90 ? '#2563eb' : s >= 80 ? '#db2777' : s >= 70 ? '#2563eb' : '#71717a';

const cardStyle = (extra = {}) => ({
  background: COLORS.card,
  borderRadius: 16,
  border: `1px solid ${COLORS.border}`,
  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
  padding: 24,
  ...extra,
});

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
});

// ── Stat Card ─────────────────────────────────────────────
const Stat = ({ label, value, sub, Icon, accent, delay }) => (
  <motion.div {...fadeUp(delay)} style={cardStyle()}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: `${accent}10`, border: `1px solid ${accent}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} style={{ color: accent }} />
      </div>
      <span style={{ fontSize: 11, color: COLORS.muted, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
        <TrendingUp size={11} style={{ color: COLORS.pink }} /> Live
      </span>
    </div>
    <p style={{ fontSize: 28, fontWeight: 800, color: COLORS.text, margin: '0 0 4px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-1px' }}>{value}</p>
    <p style={{ fontSize: 12, color: COLORS.sub, margin: '0 0 6px', fontWeight: 600 }}>{label}</p>
    {sub && <p style={{ fontSize: 11, color: accent, fontWeight: 700 }}>{sub}</p>}
  </motion.div>
);

// ── Panel Card ────────────────────────────────────────────
const PanelCard = ({ iv, delay }) => (
  <motion.div {...fadeUp(delay)} style={{
    ...cardStyle({ padding: 16 }),
    borderLeft: `3px solid ${iv.color}`,
    transition: 'all 0.2s ease',
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.pink; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = iv.color; e.currentTarget.style.transform = 'none'; }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
      <span style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
        padding: '3px 8px', borderRadius: 99,
        background: `${iv.color}10`, color: iv.color, border: `1px solid ${iv.color}20`,
      }}>{iv.badge}</span>
    </div>
    <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, margin: '0 0 3px' }}>{iv.name}</p>
    <p style={{ fontSize: 11, color: COLORS.sub, margin: 0, lineHeight: 1.5 }}>{iv.description}</p>
  </motion.div>
);

// ── History Row ───────────────────────────────────────────
const HistoryRow = ({ item, idx }) => {
  const c = scoreColor(item.overallScore);
  return (
    <motion.div {...fadeUp(0.05 * idx)} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px', borderRadius: 12,
      border: `1px solid ${COLORS.border}`,
      background: COLORS.card, gap: 16,
      transition: 'border-color 0.15s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.pink}
      onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          border: `2px solid ${c}40`, background: `${c}08`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 800, color: c,
          fontFamily: "'JetBrains Mono', monospace",
        }}>{item.overallScore}</div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, margin: '0 0 4px' }}>{item.role}</p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: COLORS.muted, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {item.date}</span>
            <span style={{ fontSize: 11, color: COLORS.muted }}>· {item.duration || '60 mins'}</span>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: '#fafafa', border: '1px solid #e4e4e7', color: COLORS.sub }}>{item.difficulty || 'Advanced'}</span>
          </div>
        </div>
      </div>
      <Link to={`/report/${item.id}`} style={{
        display: 'flex', alignItems: 'center', gap: 5,
        fontSize: 12, fontWeight: 600, color: '#ffffff',
        textDecoration: 'none', padding: '6px 12px', borderRadius: 8,
        background: COLORS.pink, flexShrink: 0,
      }}>
        Report <ArrowRight size={12} />
      </Link>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────
export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportApi.getHistory()
      .then(d => { setHistory(Array.isArray(d) ? d.slice(0, 3) : []); setLoading(false); })
      .catch(() => { setHistory([]); setLoading(false); });
  }, []);

  const stats  = user?.stats || { interviewsCompleted: 14, averageScore: 86, highestScore: 94, resumeMatchScore: 92 };
  const hour   = new Date().getHours();
  const greet  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const panels = Object.values(INTERVIEWER_TYPES).filter(t => t !== INTERVIEWER_TYPES.FINAL).map(t => INTERVIEWERS[t]);

  const quickActions = [
    { label: 'Technical MCQ',  sub: 'DSA, CN & OOPs (80 Marks)', Icon: Brain, color: COLORS.pink, state: { roundMode: 'mcq' } },
    { label: 'Proctored Coding', sub: '2 Problems, Camera & IDE (100 Marks)', Icon: Code2, color: COLORS.blue, state: { roundMode: 'coding' } },
    { label: 'HR & Comm Round', sub: '16 Questions, Speech & Video (160 Marks)', Icon: Users, color: COLORS.pink, state: { roundMode: 'hr_comm' } },
    { label: 'Full Olympia Drive', sub: 'Complete 3-Round Drive (340 Marks)', Icon: Trophy, color: COLORS.blue, state: { roundMode: 'drive' } },
  ];

  const skills = [
    { label: 'HR & Culture',    val: 92, color: COLORS.pink },
    { label: 'DSA & Coding',    val: 85, color: COLORS.blue },
    { label: 'System Design',   val: 88, color: COLORS.pink },
    { label: 'Communication',   val: 94, color: COLORS.blue },
    { label: 'Resume Review',   val: 87, color: COLORS.pink },
  ];

  const sectionLabel = (text) => (
    <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: COLORS.muted, margin: '0 0 14px' }}>{text}</p>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingBottom: 40, background: COLORS.bg }}>

      {/* ═══ HERO ═══════════════════════════════════════════ */}
      <motion.div {...fadeUp(0)} style={{
        borderRadius: 20, overflow: 'hidden',
        background: '#ffffff',
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 4px 25px rgba(0,0,0,0.03)',
        position: 'relative', padding: '32px 36px',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(219,39,119,0.03)' }} />
        <div style={{ position: 'absolute', bottom: -40, right: '25%', width: 160, height: 160, borderRadius: '50%', background: 'rgba(37,99,235,0.03)', filter: 'blur(30px)' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left */}
          <div style={{ maxWidth: 540 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.pink, display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.pink, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                AI Panel Online · 6 Agents Active
              </span>
            </div>
            <p style={{ fontSize: 13, color: COLORS.sub, margin: '0 0 4px', fontWeight: 500 }}>{greet},</p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: 32, fontWeight: 800, color: COLORS.text, margin: '0 0 12px', lineHeight: 1.2, letterSpacing: '-0.5px' }}
            >
              {user?.name?.split(' ')[0] || 'Alex'}
            </motion.h1>
            <p style={{ fontSize: 14, color: COLORS.sub, margin: '0 0 18px', lineHeight: 1.7, maxWidth: 440 }}>
              Your autonomous interview panel is ready. Practice live rounds with speech & camera proctoring.
            </p>
            {/* Chips */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 99, background: '#fafafa', border: `1px solid ${COLORS.border}`, color: COLORS.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Target size={13} className="text-pink-600" /> Target: {user?.targetRole || 'Senior Full Stack Engineer'}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 99, background: '#fafafa', border: `1px solid ${COLORS.border}`, color: COLORS.sub, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={13} className="text-blue-600" /> Top Candidate Pool
              </span>
            </div>
          </div>

          {/* Right: CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 180 }}>
            <button
              onClick={() => navigate('/interview')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '13px 24px', borderRadius: 12, fontWeight: 700, fontSize: 13,
                color: 'white', cursor: 'pointer',
                background: 'linear-gradient(135deg, #db2777, #2563eb)', border: 'none',
                boxShadow: '0 4px 14px rgba(219,39,119,0.2)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <Mic size={15} /> Start Live Interview
            </button>
            <button
              onClick={() => navigate('/resume-upload')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 12, fontWeight: 600, fontSize: 13,
                color: COLORS.text, cursor: 'pointer',
                background: '#fafafa', border: `1px solid ${COLORS.border}`,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <Upload size={15} /> Upload Resume
            </button>
          </div>
        </div>
      </motion.div>

      {/* ═══ CAREER GOAL & SCHEDULED MOCK INTERVIEW ═══════════ */}
      <CareerGoalSection />

      {/* ═══ STATS GRID ═════════════════════════════════════ */}
      <div>
        {sectionLabel('Performance Overview')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
          <Stat label="Interviews Completed" value={stats.interviewsCompleted} sub="+3 this week" Icon={Trophy} accent={COLORS.pink} delay={0.05} />
          <Stat label="Average Score" value={`${stats.averageScore}%`} sub="Top 10% benchmark" Icon={BarChart3} accent={COLORS.blue} delay={0.10} />
          <Stat label="Highest Score" value={`${stats.highestScore}%`} sub="Personal best" Icon={Award} accent={COLORS.pink} delay={0.15} />
          <Stat label="Resume ATS Match" value={`${stats.resumeMatchScore}%`} sub="Strong match" Icon={FileCheck2} accent={COLORS.blue} delay={0.20} />
        </div>
      </div>

      {/* ═══ CAREER PLAN & LEARNING SEARCH WIDGET ════════════ */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          {sectionLabel('Career Plan & Learning Search')}
          <Link to="/career-plan" style={{ fontSize: 11, fontWeight: 700, color: COLORS.pink, textDecoration: 'none' }}>
            Open Learning Hub & Filter →
          </Link>
        </div>
        <motion.div {...fadeUp(0.22)} style={cardStyle({ padding: 24 })}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ maxWidth: 500 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: 'rgba(219,39,119,0.1)', color: COLORS.pink, border: '1px solid rgba(219,39,119,0.2)' }}>
                  ACTIVE ROADMAP
                </span>
                <span style={{ fontSize: 12, color: COLORS.sub, fontWeight: 600 }}>Senior Full Stack Engineer</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: COLORS.text, margin: '0 0 6px' }}>
                Career Progress & Topic Reflections
              </h3>
              <p style={{ fontSize: 12, color: COLORS.sub, margin: 0, lineHeight: 1.5 }}>
                Filter learning modules by topic, difficulty, or deadline. Mark status as <em>Not Started</em>, <em>In Progress</em>, or <em>Completed</em> and save candidate reflections.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', padding: '12px 18px', borderRadius: 14, background: '#fafafa', border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.pink, fontFamily: "'JetBrains Mono', monospace" }}>38%</div>
                <div style={{ fontSize: 11, color: COLORS.sub, fontWeight: 600 }}>Roadmap Done</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px 18px', borderRadius: 14, background: '#fafafa', border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.blue, fontFamily: "'JetBrains Mono', monospace" }}>3 / 8</div>
                <div style={{ fontSize: 11, color: COLORS.sub, fontWeight: 600 }}>Completed</div>
              </div>
              <Link
                to="/career-plan"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '12px 20px', borderRadius: 12, background: COLORS.text,
                  color: 'white', fontWeight: 700, fontSize: 12, textDecoration: 'none',
                }}
              >
                <Target size={14} /> Search & Track
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ QUICK ASSESSMENT LAUNCHERS ═════════════════════ */}
      <div>
        {sectionLabel('Select Assessment Round')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
          {quickActions.map((act, i) => {
            const Icon = act.Icon;
            return (
              <motion.div
                key={act.label}
                {...fadeUp(0.05 * i)}
                onClick={() => navigate('/interview', { state: act.state })}
                style={{
                  ...cardStyle({ cursor: 'pointer' }),
                  borderLeft: `4px solid ${act.color}`,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = act.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${act.color}10`, color: act.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} />
                  </div>
                  <ChevronRight size={16} color={COLORS.muted} />
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, margin: '0 0 4px' }}>{act.label}</p>
                <p style={{ fontSize: 11, color: COLORS.sub, margin: 0, lineHeight: 1.4 }}>{act.sub}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ═══ INTERVIEWERS & RECENT SESSIONS ════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>

        {/* Left: AI Interview Panel */}
        <div>
          {sectionLabel('Active AI Panel (6 Interviewers)')}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {panels.map((iv, i) => (
              <PanelCard key={iv.id} iv={iv} delay={0.05 * i} />
            ))}
          </div>
        </div>

        {/* Right: Skill Matrix & History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Skills Breakdown */}
          <div>
            {sectionLabel('Skill Category Mastery')}
            <motion.div {...fadeUp(0.1)} style={cardStyle({ padding: 20 })}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {skills.map(sk => (
                  <div key={sk.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                      <span style={{ fontWeight: 600, color: COLORS.text }}>{sk.label}</span>
                      <span style={{ fontWeight: 700, color: sk.color, fontFamily: "'JetBrains Mono', monospace" }}>{sk.val}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: '#f4f4f5', overflow: 'hidden' }}>
                      <div style={{ width: `${sk.val}%`, height: '100%', background: sk.color, borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent History */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              {sectionLabel('Recent Evaluation History')}
              <Link to="/history" style={{ fontSize: 11, fontWeight: 700, color: COLORS.pink, textDecoration: 'none' }}>View all →</Link>
            </div>

            {loading ? (
              <p style={{ fontSize: 13, color: COLORS.muted }}>Loading recent sessions...</p>
            ) : history.length === 0 ? (
              <div style={cardStyle({ textAlign: 'center', padding: 32 })}>
                <p style={{ fontSize: 13, color: COLORS.sub, margin: '0 0 12px' }}>No interview sessions completed yet.</p>
                <button onClick={() => navigate('/interview')} style={{ padding: '8px 16px', borderRadius: 8, background: COLORS.pink, color: 'white', border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
                  Start First Session
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {history.map((item, idx) => (
                  <HistoryRow key={item.id} item={item} idx={idx} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
