import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, RotateCcw, CheckCircle2, Clock, Calendar,
  Target, Sparkles, BookOpen, Code2, Brain, Users, ChevronRight,
  ShieldCheck, Tag, ArrowUpRight, Zap, Trophy, Play, Star, CheckSquare, Square
} from 'lucide-react';
import { MCQ_QUESTION_BANK } from '../../constants/mcqQuestions';
import { CODING_PROBLEMS } from '../../constants/codingProblems';
import { HR_QUESTIONS, COMMUNICATION_QUESTIONS } from '../../constants/hrCommQuestions';

const GOAL_STORAGE_KEY = 'algoolympia_user_goal';
const STARRED_STORAGE_KEY = 'algoolympia_starred_challenges';
const SOLVED_STORAGE_KEY = 'algoolympia_solved_challenges';

const DEFAULT_USER_GOAL = {
  targetRole: 'Senior Full Stack Engineer',
  deadline: '2026-08-31',
  focusSubtopics: ['Inheritance & Classes', 'Graph Algorithms', 'System Design', 'STL & Dynamic Memory'],
  milestones: [
    { id: 1, title: 'Complete 10 Easy & Medium Challenges', completed: true },
    { id: 2, title: 'Solve C++ Exception Handling & Inherited Code', completed: false },
    { id: 3, title: 'Master STAR Format Behavioral Pitch', completed: true },
    { id: 4, title: 'Review System Design Rate Limiter', completed: false },
  ],
};

// Rich HackerRank Challenge Bank Datasets
export const HACKERRANK_CHALLENGES = [
  {
    id: 'hr_cpp_1',
    title: 'Inherited Code',
    difficulty: 'Medium',
    skill: 'C++ (Intermediate)',
    maxScore: 30,
    successRate: 95.41,
    subdomain: 'Debugging',
    description: 'Handle errors that can occur in the existing code by creating a custom BadLengthException struct.',
    status: 'Unsolved',
    type: 'Coding IDE',
  },
  {
    id: 'hr_cpp_2',
    title: 'Exceptional Server',
    difficulty: 'Medium',
    skill: 'C++ (Intermediate)',
    maxScore: 30,
    successRate: 92.03,
    subdomain: 'Debugging',
    description: 'Catch standard exceptions, memory allocation exceptions, and custom server exceptions thrown during computation.',
    status: 'Unsolved',
    type: 'Coding IDE',
  },
  {
    id: 'hr_cpp_3',
    title: 'Virtual Functions',
    difficulty: 'Medium',
    skill: 'C++ (Intermediate)',
    maxScore: 40,
    successRate: 96.14,
    subdomain: 'Inheritance',
    description: 'Create Person, Student, and Professor classes using virtual functions for polymorphic data processing.',
    status: 'Solved',
    type: 'Coding IDE',
  },
  {
    id: 'hr_cpp_4',
    title: 'Abstract Classes - Polymorphism',
    difficulty: 'Hard',
    skill: 'C++ (Basic)',
    maxScore: 60,
    successRate: 89.60,
    subdomain: 'Inheritance',
    description: 'Implement an LRU Cache system deriving from an abstract Cache base class using doubly linked lists and hash maps.',
    status: 'Unsolved',
    type: 'Coding IDE',
  },
  {
    id: 'hr_cpp_5',
    title: 'Deque-STL',
    difficulty: 'Medium',
    skill: 'C++ (Intermediate)',
    maxScore: 50,
    successRate: 78.99,
    subdomain: 'STL',
    description: 'Find the maximum element in every contiguous subarray of size K using std::deque in O(N) linear time.',
    status: 'Unsolved',
    type: 'Coding IDE',
  },
  {
    id: 'hr_cpp_6',
    title: 'Hotel Prices',
    difficulty: 'Medium',
    skill: 'C++ (Intermediate)',
    maxScore: 15,
    successRate: 93.57,
    subdomain: 'Classes',
    description: 'Compute total hotel room cost using inheritance and virtual function overrides for standard vs luxury suites.',
    status: 'Solved',
    type: 'Coding IDE',
  },
  {
    id: 'hr_dsa_7',
    title: 'Two Sum Target Pair',
    difficulty: 'Easy',
    skill: 'Problem Solving',
    maxScore: 20,
    successRate: 98.12,
    subdomain: 'Strings',
    description: 'Find indices of two numbers in an array such that they add up to a specified target value using Hash Table.',
    status: 'Solved',
    type: 'Coding IDE',
  },
  {
    id: 'hr_sys_8',
    title: 'Distributed Rate Limiter Design',
    difficulty: 'Hard',
    skill: 'System Design',
    maxScore: 80,
    successRate: 84.20,
    subdomain: 'Other Concepts',
    description: 'Architect a scalable Token Bucket rate limiter with Redis backend and sliding window log tracking.',
    status: 'Unsolved',
    type: 'System Design',
  },
  {
    id: 'hr_mcq_9',
    title: 'QuickSort Worst-Case Time Complexity',
    difficulty: 'Easy',
    skill: 'Problem Solving',
    maxScore: 10,
    successRate: 97.50,
    subdomain: 'Introduction',
    description: 'Identify the worst-case partition complexity of naive pivot selection in QuickSort algorithms.',
    status: 'Solved',
    type: 'Technical MCQ',
  },
  {
    id: 'hr_hr_10',
    title: 'STAR Method Architectural Trade-Off Pitch',
    difficulty: 'Medium',
    skill: 'Python',
    maxScore: 25,
    successRate: 91.30,
    subdomain: 'Introduction',
    description: 'Articulate technical disagreement and trade-offs between speed vs maintainability during sprint planning.',
    status: 'Unsolved',
    type: 'HR Behavioral',
  },
];

export const SKILL_FILTERS = [
  'C++ (Basic)',
  'C++ (Intermediate)',
  'Problem Solving',
  'Python',
  'Java',
  'System Design',
];

export const DIFFICULTY_FILTERS = ['Easy', 'Medium', 'Hard'];

export const SUBDOMAIN_FILTERS = [
  'Introduction',
  'Strings',
  'Classes',
  'STL',
  'Inheritance',
  'Debugging',
  'Other Concepts',
];

export const HackerRankQuestionExplorer = ({ onStartQuestion }) => {
  // Goal State
  const [userGoal, setUserGoal] = useState(() => {
    try {
      const stored = localStorage.getItem(GOAL_STORAGE_KEY);
      if (!stored) return DEFAULT_USER_GOAL;
      const parsed = JSON.parse(stored);
      return {
        targetRole: parsed.targetRole || DEFAULT_USER_GOAL.targetRole,
        deadline: parsed.deadline || DEFAULT_USER_GOAL.deadline,
        focusSubtopics: Array.isArray(parsed.focusSubtopics) ? parsed.focusSubtopics : DEFAULT_USER_GOAL.focusSubtopics,
        milestones: Array.isArray(parsed.milestones) ? parsed.milestones : DEFAULT_USER_GOAL.milestones,
      };
    } catch {
      return DEFAULT_USER_GOAL;
    }
  });

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editGoalForm, setEditGoalForm] = useState({ ...userGoal });

  // Starred & Solved States
  const [starredIds, setStarredIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STARRED_STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set(['hr_cpp_1', 'hr_cpp_4']);
    } catch {
      return new Set(['hr_cpp_1', 'hr_cpp_4']);
    }
  });

  const [solvedIds, setSolvedIds] = useState(() => {
    try {
      const stored = localStorage.getItem(SOLVED_STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set(['hr_cpp_3', 'hr_cpp_6', 'hr_dsa_7', 'hr_mcq_9']);
    } catch {
      return new Set(['hr_cpp_3', 'hr_cpp_6', 'hr_dsa_7', 'hr_mcq_9']);
    }
  });

  // HACKERRANK SIDEBAR FILTERS STATE (Multi-select Checkboxes)
  const [selectedStatuses, setSelectedStatuses] = useState(['Unsolved']); // default 'Unsolved' as in screenshot
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedSubdomains, setSelectedSubdomains] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle helper for multi-select checkboxes
  const toggleFilter = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Toggle Star / Bookmark
  const toggleStar = (id) => {
    setStarredIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(STARRED_STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // Toggle Solved Status
  const toggleSolved = (id) => {
    setSolvedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(SOLVED_STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatuses([]);
    setSelectedSkills([]);
    setSelectedDifficulties([]);
    setSelectedSubdomains([]);
  };

  // Filtered Challenges List
  const filteredChallenges = useMemo(() => {
    return HACKERRANK_CHALLENGES.filter(item => {
      const isSolved = solvedIds.has(item.id);
      const statusLabel = isSolved ? 'Solved' : 'Unsolved';

      // Keyword search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.skill.toLowerCase().includes(q) ||
        item.subdomain.toLowerCase().includes(q)
      );

      // Checkbox filters
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(statusLabel);
      const matchesSkill = selectedSkills.length === 0 || selectedSkills.includes(item.skill);
      const matchesDiff = selectedDifficulties.length === 0 || selectedDifficulties.includes(item.difficulty);
      const matchesSub = selectedSubdomains.length === 0 || selectedSubdomains.includes(item.subdomain);

      return matchesSearch && matchesStatus && matchesSkill && matchesDiff && matchesSub;
    });
  }, [searchQuery, selectedStatuses, selectedSkills, selectedDifficulties, selectedSubdomains, solvedIds]);

  // Save Goal
  const handleSaveGoal = (e) => {
    e.preventDefault();
    setUserGoal(editGoalForm);
    localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(editGoalForm));
    setShowGoalModal(false);
  };

  // Calculate days remaining to deadline
  const daysRemaining = useMemo(() => {
    if (!userGoal.deadline) return 14;
    const diff = new Date(userGoal.deadline) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [userGoal.deadline]);

  const hasActiveFilters = searchQuery || selectedStatuses.length > 0 || selectedSkills.length > 0 || selectedDifficulties.length > 0 || selectedSubdomains.length > 0;

  return (
    <div className="space-y-6 pb-12 bg-white text-zinc-900">
      
      {/* ── TOP HEADER & USER GOAL BANNER ── */}
      <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-200 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-pink-600" /> Career Goal Target
              </span>
              <span className="text-xs text-zinc-500 font-mono">HackerRank Domain Filters</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900">
              {userGoal.targetRole}
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Select status, skill level, difficulty, and subdomain filters on the right to find targeted challenges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700">
                <Calendar className="w-3.5 h-3.5 text-pink-600" />
                <span>Target: {userGoal.deadline}</span>
              </div>
              <p className="text-[11px] font-extrabold text-pink-600 font-mono mt-0.5">
                {daysRemaining} Days Remaining
              </p>
            </div>

            <button
              onClick={() => { setEditGoalForm({ ...userGoal }); setShowGoalModal(true); }}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition shadow-sm"
            >
              Set Goal & Deadline
            </button>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 mt-1" />
          <input
            type="text"
            placeholder="Search challenges by name, topic, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 mt-1 text-xs text-zinc-400">Clear</button>
          )}
        </div>
      </div>

      {/* ── MAIN HACKERRANK LAYOUT: CHALLENGE CARDS (LEFT 3 COLUMNS) + SIDEBAR FILTERS (RIGHT 1 COLUMN) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LEFT 3 COLUMNS: HACKERRANK CHALLENGE CARDS LIST */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium px-1">
            <span>Showing <strong className="text-zinc-900">{filteredChallenges.length}</strong> of {HACKERRANK_CHALLENGES.length} challenges</span>
            {hasActiveFilters && (
              <button onClick={handleResetFilters} className="text-pink-600 font-bold hover:underline">
                Clear Filters
              </button>
            )}
          </div>

          {filteredChallenges.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-zinc-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-100 mx-auto flex items-center justify-center text-zinc-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900">No challenges match your active filters</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Try unchecking some sidebar filters or clearing your search input.
              </p>
              <button onClick={handleResetFilters} className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-semibold">
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredChallenges.map((item) => {
              const isStarred = starredIds.has(item.id);
              const isSolved = solvedIds.has(item.id);

              const diffColor = item.difficulty === 'Hard'
                ? 'text-rose-600'
                : item.difficulty === 'Medium'
                ? 'text-amber-600'
                : 'text-emerald-600';

              return (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3 hover:border-zinc-300 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-extrabold text-zinc-900 hover:text-pink-600 cursor-pointer transition">
                          {item.title}
                        </h3>
                        {isSolved && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Solved
                          </span>
                        )}
                      </div>

                      {/* HackerRank Metadata Line: Difficulty, Skill, Max Score, Success Rate */}
                      <p className="text-xs font-medium text-zinc-500 flex flex-wrap items-center gap-1.5">
                        <span className={`font-bold ${diffColor}`}>{item.difficulty}</span>
                        <span>,</span>
                        <span>{item.skill}</span>
                        <span>,</span>
                        <span>Max Score: <strong className="text-zinc-800 font-mono">{item.maxScore}</strong></span>
                        <span>,</span>
                        <span>Success Rate: <strong className="text-zinc-800 font-mono">{item.successRate}%</strong></span>
                      </p>
                    </div>

                    {/* Star Icon & Solve Challenge Button */}
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => toggleStar(item.id)}
                        className={`p-2 rounded-xl border transition ${
                          isStarred
                            ? 'bg-amber-50 border-amber-200 text-amber-500'
                            : 'bg-white border-zinc-200 text-zinc-300 hover:text-amber-400'
                        }`}
                        title={isStarred ? 'Starred Challenge' : 'Star Challenge'}
                      >
                        <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400' : ''}`} />
                      </button>

                      <button
                        onClick={() => onStartQuestion && onStartQuestion(item)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Solve Challenge
                      </button>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT 1 COLUMN: HACKERRANK SIDEBAR FILTERS (EXACT MATCH TO HACKERRANK UI) */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-pink-600" /> Filters
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-pink-600 hover:text-pink-700 font-bold"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* 1. STATUS FILTER */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">STATUS</h4>
              <div className="space-y-2 text-xs">
                {['Solved', 'Unsolved'].map(status => {
                  const isChecked = selectedStatuses.includes(status);
                  return (
                    <label
                      key={status}
                      onClick={() => toggleFilter(selectedStatuses, setSelectedStatuses, status)}
                      className="flex items-center gap-2.5 cursor-pointer text-zinc-800 hover:text-zinc-900 select-none"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                        isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-zinc-300 bg-white'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className={isChecked ? 'font-bold' : 'font-medium'}>{status}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. SKILLS FILTER */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-100">
              <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">SKILLS</h4>
              <div className="space-y-2 text-xs">
                {SKILL_FILTERS.map(skill => {
                  const isChecked = selectedSkills.includes(skill);
                  return (
                    <label
                      key={skill}
                      onClick={() => toggleFilter(selectedSkills, setSelectedSkills, skill)}
                      className="flex items-center gap-2.5 cursor-pointer text-zinc-800 hover:text-zinc-900 select-none"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                        isChecked ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300 bg-white'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className={isChecked ? 'font-bold' : 'font-medium'}>{skill}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 3. DIFFICULTY FILTER */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-100">
              <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">DIFFICULTY</h4>
              <div className="space-y-2 text-xs">
                {DIFFICULTY_FILTERS.map(diff => {
                  const isChecked = selectedDifficulties.includes(diff);
                  return (
                    <label
                      key={diff}
                      onClick={() => toggleFilter(selectedDifficulties, setSelectedDifficulties, diff)}
                      className="flex items-center gap-2.5 cursor-pointer text-zinc-800 hover:text-zinc-900 select-none"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                        isChecked ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300 bg-white'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className={isChecked ? 'font-bold' : 'font-medium'}>{diff}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 4. SUBDOMAINS FILTER */}
            <div className="space-y-2.5 pt-4 border-t border-zinc-100">
              <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">SUBDOMAINS</h4>
              <div className="space-y-2 text-xs">
                {SUBDOMAIN_FILTERS.map(sub => {
                  const isChecked = selectedSubdomains.includes(sub);
                  return (
                    <label
                      key={sub}
                      onClick={() => toggleFilter(selectedSubdomains, setSelectedSubdomains, sub)}
                      className="flex items-center gap-2.5 cursor-pointer text-zinc-800 hover:text-zinc-900 select-none"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                        isChecked ? 'bg-zinc-900 border-zinc-900 text-white' : 'border-zinc-300 bg-white'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className={isChecked ? 'font-bold' : 'font-medium'}>{sub}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── MODAL: EDIT GOAL & DEADLINE ── */}
      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden p-6 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h3 className="text-base font-extrabold text-zinc-900">Set Career Goal & Target Deadline</h3>
                <button onClick={() => setShowGoalModal(false)} className="text-zinc-400 hover:text-zinc-600 text-xs">✕</button>
              </div>

              <form onSubmit={handleSaveGoal} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Target Role / Career Goal *</label>
                  <input
                    type="text"
                    required
                    value={editGoalForm.targetRole}
                    onChange={(e) => setEditGoalForm({ ...editGoalForm, targetRole: e.target.value })}
                    placeholder="e.g. Senior Full Stack Engineer, System Architect..."
                    className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Target Completion Deadline *</label>
                  <input
                    type="date"
                    required
                    value={editGoalForm.deadline}
                    onChange={(e) => setEditGoalForm({ ...editGoalForm, deadline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setShowGoalModal(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800"
                  >
                    Save Goal & Deadline
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

export default HackerRankQuestionExplorer;
