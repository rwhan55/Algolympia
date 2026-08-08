import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Download,
  Share2,
  RotateCcw,
  LayoutDashboard,
  Calendar,
  Clock,
  Sparkles,
  MessageSquare,
  FileCheck2,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import Card, { CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import ScoreCard from '../components/interview/ScoreCard';
import Toast from '../components/common/Toast';
import { reportApi } from '../services/reportApi';

export const FinalReportPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await reportApi.getReportById(reportId || 'rep_int_9921');
        setReport(data);
        // Confetti celebration if high score
        if (data.overallScore >= 80) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setToast({
      isVisible: true,
      message: 'Interview report link copied to clipboard!',
      type: 'success'
    });
  };

  const handleDownload = () => {
    setToast({
      isVisible: true,
      message: 'Downloading full diagnostic PDF report summary...',
      type: 'info'
    });
  };

  if (loading || !report) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin text-cyan-400">Loading diagnostic report...</div>
      </div>
    );
  }

  const getScore = (val) => (typeof val === 'number' && !isNaN(val) ? val : 0);

  const rawScores = report?.scores || {};
  const scores = {
    hr: getScore(rawScores.hr),
    dsa: getScore(rawScores.dsa),
    sysDesign: getScore(rawScores.sysDesign),
    comms: getScore(rawScores.comms),
    resume: getScore(rawScores.resume),
  };

  const overallScore = getScore(report?.overallScore);
  const recText = report?.recommendation || (overallScore >= 80 ? 'STRONG HIRE' : overallScore >= 60 ? 'HIRE' : 'NEED IMPROVEMENT');
  const recBadgeClass = recText === 'STRONG HIRE'
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    : recText === 'HIRE'
    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

  const strengths = Array.isArray(report?.strengths) && report.strengths.length > 0
    ? report.strengths
    : ['Demonstrated problem solving under camera proctoring', 'Clear speech delivery and structured response formulation'];
  const weaknesses = Array.isArray(report?.weaknesses) && report.weaknesses.length > 0
    ? report.weaknesses
    : ['Speed & time management under proctored exam conditions', 'Deep edge-case handling in algorithmic problems'];
  const improvements = Array.isArray(report?.improvements) && report.improvements.length > 0
    ? report.improvements
    : ['Practice time management across multi-stage code execution', 'Use STAR framework for HR and behavioural answers'];
  const questionFeedback = Array.isArray(report?.questionFeedback) && report.questionFeedback.length > 0
    ? report.questionFeedback
    : [
        {
          questionNum: 1,
          interviewer: 'Technical Evaluation Panel',
          score: scores.dsa,
          question: 'DSA & Coding Assessment Performance',
          userAnswerTranscript: 'Submitted code and MCQ answers across DSA, CN, and OOPs modules.',
          aiFeedback: `Demonstrated accurate core algorithmic understanding with ${scores.dsa}% proficiency.`
        },
        {
          questionNum: 2,
          interviewer: 'HR & Communication Coach',
          score: scores.comms,
          question: 'Verbal Communication & Speech Analysis',
          userAnswerTranscript: 'Delivered spoken responses under camera & speech proctoring.',
          aiFeedback: `Good verbal pace and articulation. Formulated structured answers with ${scores.comms}% clarity.`
        }
      ];

  const radarData = [
    { subject: 'HR & Culture', score: scores.hr, fullMark: 100 },
    { subject: 'DSA & Algorithms', score: scores.dsa, fullMark: 100 },
    { subject: 'System Design', score: scores.sysDesign, fullMark: 100 },
    { subject: 'Communication', score: scores.comms, fullMark: 100 },
    { subject: 'Resume Verification', score: scores.resume, fullMark: 100 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6 bg-white text-zinc-900 pb-12"
    >
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${recBadgeClass}`}>
              {recText}
            </span>
            <span className="text-xs text-zinc-500 font-mono">Report ID: #{report.id}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight mt-1 animate-entrance">
            Interview Evaluation Matrix
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" icon={Share2} onClick={handleShare}>
            Share
          </Button>
          <Button variant="secondary" size="sm" icon={Download} onClick={handleDownload}>
            Download PDF
          </Button>
          <Button variant="outline" size="sm" icon={RotateCcw} onClick={() => navigate('/interview')}>
            Retake Interview
          </Button>
          <Button variant="primary" size="sm" icon={LayoutDashboard} onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </div>
      </div>

      {/* Main Overall Score Card */}
      <Card className="bg-white border border-zinc-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-2">
          <div className="flex items-center gap-6">
            {/* Big Score Ring */}
            <div className="relative flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-white border-4 border-pink-500 flex flex-col items-center justify-center shadow-md">
                <span className="text-4xl font-extrabold font-mono text-pink-600">{overallScore}</span>
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Overall</span>
              </div>
            </div>

            <div className="space-y-1 text-center md:text-left">
              <h2 className="text-xl font-bold text-zinc-900">{report.role || report.targetRole || 'Senior Full Stack Engineer'}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {report.date || new Date().toLocaleDateString()}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {report.duration || '60 mins'}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-800 font-semibold">{report.difficulty || 'Advanced'}</span>
              </div>
              <p className="text-xs text-pink-600 font-semibold pt-1">
                Candidate Evaluation Recommendation: <span className="underline">{recText}</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-1 text-center md:text-right">
            <span className="text-zinc-500">Evaluated Candidate</span>
            <p className="text-sm font-bold text-zinc-900">{report.candidateName || 'Alex Johnson'}</p>
            <p className="text-[11px] text-pink-600 font-mono">FastAPI Verified</p>
          </div>
        </div>
      </Card>

      {/* Category Scores Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <ScoreCard title="HR & Behavior" score={scores.hr} color="#db2777" />
        <ScoreCard title="DSA & Coding" score={scores.dsa} color="#2563eb" />
        <ScoreCard title="System Design" score={scores.sysDesign} color="#db2777" />
        <ScoreCard title="Communication" score={scores.comms} color="#2563eb" />
        <ScoreCard title="Resume Review" score={scores.resume} color="#db2777" />
      </div>

      {/* Performance Charts & Radar Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-zinc-200">
          <CardHeader
            title="Skill Radar Breakdown"
            subtitle="Comparing candidate performance across the 5 interviewer dimensions."
          />
          <div className="h-64 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e4e4e7" />
                <PolarAngleAxis dataKey="subject" stroke="#52525b" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#a1a1aa" />
                <Radar name="Score" dataKey="score" stroke="#db2777" fill="#db2777" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-white border border-zinc-200">
          <CardHeader
            title="Category Score Benchmark"
            subtitle="Visualizing strengths and areas needing focus."
          />
          <div className="h-64 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={radarData}>
                <XAxis dataKey="subject" stroke="#52525b" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#a1a1aa" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '12px', color: '#09090b' }}
                />
                <Bar dataKey="score" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border border-zinc-200">
          <CardHeader
            title="Key Technical Strengths"
            subtitle="Extracted by AI synthesis panel."
          />
          <div className="space-y-2.5 mt-2">
            {strengths.map((str, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                <ThumbsUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-white border border-zinc-200">
          <CardHeader
            title="Growth Areas & Weaknesses"
            subtitle="Constructive feedback to boost next performance."
          />
          <div className="space-y-2.5 mt-2">
            {weaknesses.map((w, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950">
                <ThumbsDown className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Actionable AI Suggestions */}
      <Card className="bg-white border border-zinc-200">
        <CardHeader
          title="Actionable AI Improvement Suggestions"
          subtitle="Follow these recommendations to target 95+ score brackets."
        />
        <div className="space-y-3 mt-2">
          {improvements.map((imp, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-950">
              <Lightbulb className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
              <span>{imp}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Question-Wise Detailed Analysis & Audio Transcripts */}
      <Card className="bg-white border border-zinc-200">
        <CardHeader
          title="Question-by-Question Spoken Audio Feedback"
          subtitle="Detailed transcript breakdown and score awarded per interviewer."
        />

        <div className="space-y-4 mt-4">
          {questionFeedback.map((q, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-200">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-pink-100 text-pink-700 text-xs font-bold font-mono border border-pink-200">
                    Q{q.questionNum}
                  </span>
                  <span className="text-xs font-bold text-zinc-900">{q.interviewer}</span>
                </div>
                <span className="text-xs font-bold font-mono text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
                  {q.score} / 100
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-zinc-800">{q.question}</p>
              </div>

              {/* Spoken Answer Transcript */}
              <div className="p-3 rounded-xl bg-white border border-zinc-200 text-xs space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-pink-600" /> Candidate Spoken Transcript
                </span>
                <p className="text-zinc-700 italic">"{q.userAnswerTranscript}"</p>
              </div>

              {/* AI Diagnostic Feedback */}
              <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 text-xs text-pink-950">
                <span className="font-bold text-pink-700 block mb-0.5">AI Panel Evaluation:</span>
                {q.aiFeedback}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default FinalReportPage;
