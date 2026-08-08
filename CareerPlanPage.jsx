import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, RotateCcw, Plus, Download, CheckCircle2,
  Clock, AlertCircle, Sparkles, BookOpen, ChevronRight, FileText,
  Trash2, Edit3, Save, Tag, ArrowUpRight, BarChart2, ShieldAlert, Award, MessageSquare
} from 'lucide-react';
import {
  getCareerPlanRecords,
  updateRecordStatus,
  updateRecordNote,
  addCareerPlanRecord,
  deleteCareerPlanRecord,
  resetToDemoData,
  calculateCareerPlanStats,
  exportCareerPlanCSV,
  TOPIC_OPTIONS,
  DIFFICULTY_OPTIONS,
  STATUS_OPTIONS,
  GOAL_OPTIONS,
} from '../services/careerPlanService';
import HackerRankQuestionExplorer from '../components/interview/HackerRankQuestionExplorer';
import CareerGoalSection from '../components/common/CareerGoalSection';

export const CareerPlanPage = () => {
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' | 'tracker'
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Difficulties');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedGoal, setSelectedGoal] = useState('All Goals');

  // Active reflection note editing state: { id: noteText }
  const [editingNotes, setEditingNotes] = useState({});
  const [savedFeedback, setSavedFeedback] = useState(null);

  // New Record Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newForm, setNewForm] = useState({
    title: '',
    topic: 'Data Structures & Algorithms',
    difficulty: 'Medium',
    goal: 'Senior Full Stack Engineer',
    deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    priority: 'High',
    note: '',
    estimatedHours: 6,
  });

  // Load records on mount
  useEffect(() => {
    const data = getCareerPlanRecords();
    setRecords(data);
  }, []);

  // Handle status update
  const handleStatusChange = (id, newStatus) => {
    const updated = updateRecordStatus(id, newStatus);
    setRecords(updated);
    showToast(`Status updated to "${newStatus}"`);
  };

  // Handle note save
  const handleSaveNote = (id) => {
    const noteText = editingNotes[id];
    if (noteText === undefined) return;
    const updated = updateRecordNote(id, noteText);
    setRecords(updated);
    showToast('Reflection note saved successfully');
    setEditingNotes(prev => ({ ...prev, [id]: undefined }));
  };

  // Handle add record
  const handleCreateRecord = (e) => {
    e.preventDefault();
    if (!newForm.title.trim()) return;
    const updated = addCareerPlanRecord(newForm);
    setRecords(updated);
    setShowAddModal(false);
    setNewForm({
      title: '',
      topic: 'Data Structures & Algorithms',
      difficulty: 'Medium',
      goal: 'Senior Full Stack Engineer',
      deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      priority: 'High',
      note: '',
      estimatedHours: 6,
    });
    showToast('New Career Goal added!');
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('All Topics');
    setSelectedDifficulty('All Difficulties');
    setSelectedStatus('All Statuses');
    setSelectedGoal('All Goals');
    showToast('Filters reset to default');
  };

  // Handle reset to demo data
  const handleResetDemoData = () => {
    const data = resetToDemoData();
    setRecords(data);
    showToast('Reset career plan data to demo records');
  };

  const showToast = (msg) => {
    setSavedFeedback(msg);
    setTimeout(() => setSavedFeedback(null), 2500);
  };

  // Filter records dynamically
  const filteredRecords = useMemo(() => {
    return records.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        item.title.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.goal.toLowerCase().includes(q) ||
        (item.note && item.note.toLowerCase().includes(q))
      );

      const matchesTopic = selectedTopic === 'All Topics' || item.topic === selectedTopic;
      const matchesDifficulty = selectedDifficulty === 'All Difficulties' || item.difficulty === selectedDifficulty;
      const matchesStatus = selectedStatus === 'All Statuses' || item.status === selectedStatus;
      const matchesGoal = selectedGoal === 'All Goals' || item.goal === selectedGoal;

      return matchesSearch && matchesTopic && matchesDifficulty && matchesStatus && matchesGoal;
    });
  }, [records, searchQuery, selectedTopic, selectedDifficulty, selectedStatus, selectedGoal]);

  // Calculate summary statistics
  const stats = useMemo(() => calculateCareerPlanStats(records), [records]);

  const hasActiveFilters = searchQuery || selectedTopic !== 'All Topics' || selectedDifficulty !== 'All Difficulties' || selectedStatus !== 'All Statuses' || selectedGoal !== 'All Goals';

  return (
    <div className="space-y-6 pb-12 bg-white text-zinc-900 min-h-screen">
      {/* Toast Feedback */}
      <AnimatePresence>
        {savedFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold shadow-xl border border-zinc-800 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>{savedFeedback}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-200 text-[11px] font-extrabold uppercase tracking-wider">
              Career Roadmap
            </span>
            <span className="text-xs text-zinc-500 font-mono">Demo Dataset Active</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
            Career Plan & Learning Hub
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Track module status, capture short reflections, filter by topic/difficulty, and export progress summaries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportCareerPlanCSV(records)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition"
          >
            <Download className="w-3.5 h-3.5 text-zinc-600" />
            Export CSV Report
          </button>
          <button
            onClick={handleResetDemoData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
            Reset Demo Data
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Learning Record
          </button>
        </div>
      </div>

      {/* ── CAREER GOAL & SCHEDULED MOCK INTERVIEW NOTICE ── */}
      <CareerGoalSection />

      {/* TABS SWITCHER */}
      <div className="flex items-center gap-2 p-1 rounded-2xl bg-zinc-100 border border-zinc-200 text-xs w-fit">
        <button
          onClick={() => setActiveTab('explorer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition ${
            activeTab === 'explorer'
              ? 'bg-zinc-900 text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          HackerRank Question Explorer & Sub-topics
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition ${
            activeTab === 'tracker'
              ? 'bg-zinc-900 text-white shadow-sm'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          Career Roadmap & Reflection Notes ({records.length})
        </button>
      </div>

      {activeTab === 'explorer' ? (
        <HackerRankQuestionExplorer />
      ) : (
        <>
          {/* Overview Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Completion Progress */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Overall Progress</span>
            <span className="text-xs font-extrabold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-200">
              {stats.completionPercentage}% Done
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-zinc-900">{stats.completedCount}</span>
            <span className="text-xs text-zinc-500 font-medium">of {stats.totalCount} modules completed</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-pink-500 to-blue-600 h-full transition-all duration-500"
              style={{ width: `${stats.completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Card 2: In Progress */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">In Progress</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-blue-600">{stats.inProgressCount}</span>
            <span className="text-xs text-zinc-500 font-medium">active modules</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">Requires active practice & notes</p>
        </div>

        {/* Card 3: Not Started */}
        <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Pending</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-600">{stats.notStartedCount}</span>
            <span className="text-xs text-zinc-500 font-medium">modules queued</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2">Scheduled in career roadmap</p>
        </div>

        {/* Card 4: Next Recommendation Highlight */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" /> Next Focus Item
            </span>
            <span className="text-[10px] font-bold text-pink-600 uppercase bg-pink-100 px-2 py-0.5 rounded">AI Pick</span>
          </div>
          {stats.nextRecommendation ? (
            <div className="mt-2.5">
              <p className="text-xs font-bold text-zinc-900 line-clamp-1">{stats.nextRecommendation.item.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-semibold text-zinc-500">{stats.nextRecommendation.item.topic}</span>
                <span className="text-[10px] text-pink-600 font-mono">Due {stats.nextRecommendation.item.deadline}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 mt-2">All modules completed! Great work.</p>
          )}
        </div>
      </div>

      {/* ── SEARCH & MULTI-FILTER CONTROL BAR ── */}
      <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keyword, title, topic, reflection note, or goal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Topic Filter */}
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="py-2 px-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              {TOPIC_OPTIONS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="py-2 px-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              {DIFFICULTY_OPTIONS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2 px-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Goal Filter */}
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="py-2 px-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-800 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              {GOAL_OPTIONS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Badges & Reset Controls */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-zinc-400 font-medium">Active Filters:</span>
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 font-mono text-[11px] border border-zinc-200">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedTopic !== 'All Topics' && (
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 font-semibold text-[11px] border border-zinc-200">
                  Topic: {selectedTopic}
                </span>
              )}
              {selectedDifficulty !== 'All Difficulties' && (
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 font-semibold text-[11px] border border-zinc-200">
                  Difficulty: {selectedDifficulty}
                </span>
              )}
              {selectedStatus !== 'All Statuses' && (
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 font-semibold text-[11px] border border-zinc-200">
                  Status: {selectedStatus}
                </span>
              )}
              {selectedGoal !== 'All Goals' && (
                <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 font-semibold text-[11px] border border-zinc-200">
                  Goal: {selectedGoal}
                </span>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="text-xs text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout: Records List (Left) + Summary Analytics Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLUMNS: CAREER RECORDS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium px-1">
            <span>Showing <strong className="text-zinc-900">{filteredRecords.length}</strong> of {records.length} career modules</span>
            <span>Click status or notes to update progress</span>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-zinc-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-100 mx-auto flex items-center justify-center text-zinc-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900">No matching career records found</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                No items match your active search or topic filters. Try clearing your filters or adding a new record.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredRecords.map((item) => {
              const isNoteEditing = editingNotes[item.id] !== undefined;
              const currentNoteText = isNoteEditing ? editingNotes[item.id] : (item.note || '');

              const statusColor = item.status === 'Completed'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : item.status === 'In Progress'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-amber-50 text-amber-700 border-amber-200';

              const diffColor = item.difficulty === 'Hard'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : item.difficulty === 'Medium'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200';

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4 hover:border-zinc-300 transition"
                >
                  {/* Card Header: Topic badge, Difficulty, Goal, & Delete */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-bold border border-zinc-200">
                        {item.topic}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${diffColor}`}>
                        {item.difficulty}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                        <Tag className="w-3 h-3 text-zinc-400" /> {item.goal}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-400 font-mono">
                        Due {item.deadline}
                      </span>
                      <button
                        onClick={() => {
                          const updated = deleteCareerPlanRecord(item.id);
                          setRecords(updated);
                          showToast('Record deleted');
                        }}
                        className="text-zinc-400 hover:text-rose-600 p-1 rounded-md transition"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Status Selector Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <h3 className="text-base font-bold text-zinc-900 leading-snug">
                      {item.title}
                    </h3>

                    {/* STATUS SELECTOR DROPDOWN */}
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[11px] text-zinc-400 font-medium hidden sm:inline">Status:</span>
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`py-1.5 px-3 rounded-xl text-xs font-extrabold border cursor-pointer focus:outline-none ${statusColor}`}
                      >
                        <option value="Not Started">⚪ Not Started</option>
                        <option value="In Progress">🔵 In Progress</option>
                        <option value="Completed">🟢 Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* REFLECTION & NOTES FIELD */}
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-700 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-pink-600" /> Candidate Reflection & Note
                      </span>

                      {!isNoteEditing ? (
                        <button
                          onClick={() => setEditingNotes({ ...editingNotes, [item.id]: item.note || '' })}
                          className="text-[11px] text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Edit Note
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingNotes({ ...editingNotes, [item.id]: undefined })}
                            className="text-[11px] text-zinc-500 hover:text-zinc-700 font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNote(item.id)}
                            className="px-2.5 py-1 rounded-md bg-zinc-900 text-white text-[11px] font-bold flex items-center gap-1 hover:bg-zinc-800"
                          >
                            <Save className="w-3 h-3" /> Save Note
                          </button>
                        </div>
                      )}
                    </div>

                    {isNoteEditing ? (
                      <textarea
                        rows={2}
                        value={currentNoteText}
                        onChange={(e) => setEditingNotes({ ...editingNotes, [item.id]: e.target.value })}
                        placeholder="Write a short reflection or note regarding key takeaways, code bottlenecks, or practice notes..."
                        className="w-full p-2.5 rounded-lg border border-zinc-300 bg-white text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                      />
                    ) : (
                      <p className="text-zinc-600 italic">
                        {item.note ? `"${item.note}"` : 'No reflection note saved yet. Click "Edit Note" to record key learnings.'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: SUMMARY ANALYTICS & JUDGE DEMO PANEL */}
        <div className="space-y-6">

          {/* SUMMARY PANEL FOR JUDGES */}
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-extrabold text-zinc-900 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-pink-600" /> Summary Analytics
                </h3>
                <p className="text-[11px] text-zinc-500">Real-time status breakdown for evaluators</p>
              </div>
              <span className="text-[10px] font-bold uppercase bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded border border-zinc-200">
                Judge View
              </span>
            </div>

            {/* Counts by Status & Topic Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Status by Topic Breakdown</h4>
              <div className="space-y-2">
                {Object.entries(stats.byTopic).map(([topic, data]) => {
                  const pct = Math.round((data.completed / data.total) * 100);
                  return (
                    <div key={topic} className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-zinc-900">
                        <span className="truncate pr-2">{topic}</span>
                        <span className="font-mono text-pink-600 shrink-0">{pct}% ({data.completed}/{data.total})</span>
                      </div>
                      <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-pink-600 h-full" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                        <span className="text-emerald-600 font-bold">🟢 {data.completed} Done</span>
                        <span className="text-blue-600 font-bold">🔵 {data.inProgress} In Progress</span>
                        <span className="text-amber-600 font-bold">⚪ {data.notStarted} Pending</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* WEAK AREAS IDENTIFIED */}
            <div className="pt-2 border-t border-zinc-100 space-y-2">
              <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> Weak Areas Identified
              </h4>
              <div className="space-y-1.5">
                {stats.weakAreas.length > 0 ? (
                  stats.weakAreas.slice(0, 3).map((wa) => (
                    <div key={wa.topic} className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-950 flex items-center justify-between">
                      <span className="font-semibold truncate">{wa.topic}</span>
                      <span className="font-mono text-[11px] text-rose-700 font-bold shrink-0">{wa.pending} pending</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500">No weak areas identified!</p>
                )}
              </div>
            </div>

            {/* NEXT RECOMMENDED ACTION */}
            <div className="pt-2 border-t border-zinc-100 space-y-2">
              <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Next Recommended Action
              </h4>
              {stats.nextRecommendation ? (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
                  <p className="font-bold text-blue-900">{stats.nextRecommendation.item.title}</p>
                  <p className="text-[11px] text-blue-800">{stats.nextRecommendation.reason}</p>
                  <div className="flex items-center justify-between text-[10px] text-blue-700 font-semibold pt-1">
                    <span>Priority: {stats.nextRecommendation.item.priority}</span>
                    <span className="font-mono">Due: {stats.nextRecommendation.item.deadline}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-zinc-500">No pending items remaining.</p>
              )}
            </div>

            {/* RECENT ACTIVITY & REFLECTION TIMELINE */}
            <div className="pt-2 border-t border-zinc-100 space-y-2">
              <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Recent Activity & Notes</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {stats.recentActivity.map((act) => (
                  <div key={act.id} className="p-2 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] space-y-0.5">
                    <div className="flex items-center justify-between font-semibold text-zinc-900">
                      <span className="truncate">{act.title}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{act.status}</span>
                    </div>
                    {act.note && (
                      <p className="text-zinc-500 italic truncate">"{act.note}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Download Report Action */}
            <button
              onClick={() => exportCareerPlanCSV(records)}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" /> Download Summary CSV Report
            </button>
          </div>
        </div>

      </div>
        </>
      )}

      {/* ── MODAL: CREATE NEW CAREER RECORD ── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden p-6 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h3 className="text-base font-extrabold text-zinc-900">Add New Career Goal / Module</h3>
                <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-600 text-xs">✕</button>
              </div>

              <form onSubmit={handleCreateRecord} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Module Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Master Distributed Consensus & Raft Algorithm"
                    value={newForm.title}
                    onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Topic</label>
                    <select
                      value={newForm.topic}
                      onChange={(e) => setNewForm({ ...newForm, topic: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    >
                      {TOPIC_OPTIONS.filter(t => t !== 'All Topics').map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Difficulty</label>
                    <select
                      value={newForm.difficulty}
                      onChange={(e) => setNewForm({ ...newForm, difficulty: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Target Career Goal</label>
                    <select
                      value={newForm.goal}
                      onChange={(e) => setNewForm({ ...newForm, goal: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    >
                      {GOAL_OPTIONS.filter(g => g !== 'All Goals').map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Target Deadline</label>
                    <input
                      type="date"
                      value={newForm.deadline}
                      onChange={(e) => setNewForm({ ...newForm, deadline: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Initial Reflection or Study Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Add initial notes or key resources..."
                    value={newForm.note}
                    onChange={(e) => setNewForm({ ...newForm, note: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-700 font-semibold hover:bg-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800"
                  >
                    Create Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerPlanPage;
