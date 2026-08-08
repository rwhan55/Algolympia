import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  Trash2,
  RotateCcw,
  FileCheck2,
  ChevronRight,
  Trophy
} from 'lucide-react';
import Card, { CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import Toast from '../components/common/Toast';
import { reportApi } from '../services/reportApi';

export const InterviewHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, [searchTerm, difficultyFilter]);

  const loadHistory = async () => {
    try {
      const data = await reportApi.getHistory({
        search: searchTerm,
        difficulty: difficultyFilter
      });
      setHistory(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    await reportApi.deleteHistory(deleteTargetId);
    setDeleteTargetId(null);
    await loadHistory();
    setToast({
      isVisible: true,
      message: 'Interview history item deleted.',
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
            Interview Session History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review past practice recordings, score progression, and PDF diagnostic summaries.
          </p>
        </div>

        <Button variant="primary" icon={RotateCcw} onClick={() => navigate('/interview')}>
          New Practice Session
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card hover={false} className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role or date..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 outline-none focus:border-cyan-500"
            />
          </div>

          {/* Difficulty Dropdown Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-400 font-medium">Difficulty:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 outline-none focus:border-cyan-500"
            >
              <option value="All">All Levels</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>
      </Card>

      {/* History List */}
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="hover:border-slate-700">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Score badge circle */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-950 border-2 border-pink-500 flex flex-col items-center justify-center shadow-lg font-mono shrink-0">
                    <span className="text-xl font-extrabold text-pink-400">{item.overallScore}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Score</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-100">{item.role}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-800 text-slate-300">
                        {item.difficulty || 'Advanced'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {item.duration || '60 mins'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-pink-400">
                        <FileCheck2 className="w-3.5 h-3.5" /> {item.resumeUsed || 'Default Resume'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto pt-2 md:pt-0">
                  <button
                    onClick={() => setDeleteTargetId(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                    title="Delete History Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={RotateCcw}
                    onClick={() => navigate('/interview')}
                  >
                    Retake
                  </Button>

                  <Link to={`/report/${item.id}`}>
                    <Button variant="primary" size="sm" icon={ChevronRight}>
                      View Report
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Trophy}
          title="No Interview History Found"
          description="Try adjusting your search query or start a fresh practice interview to build your score history."
          actionText="Start Practice Session"
          onAction={() => navigate('/interview')}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Interview History Item?"
        message="This action will permanently delete the recorded diagnostic report and audio transcripts from your account."
        isDanger={true}
        confirmText="Delete Record"
      />
    </div>
  );
};

export default InterviewHistoryPage;
