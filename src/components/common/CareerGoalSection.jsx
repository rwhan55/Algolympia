import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Target, Calendar, Clock, Sparkles, CheckCircle2,
  Briefcase, Edit3, ArrowRight, Bell, Zap, Code2, Laptop
} from 'lucide-react';
import {
  getUserCareerGoal,
  saveUserCareerGoal,
  formatInterviewNotice,
  getDaysRemaining,
  JOB_ROLE_OPTIONS,
} from '../../services/userGoalService';

export const CareerGoalSection = ({ compact = false }) => {
  const navigate = useNavigate();
  const [goal, setGoal] = useState(getUserCareerGoal());
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...goal });
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    setGoal(getUserCareerGoal());
  }, []);

  const handleRoleSelect = (role) => {
    const updated = saveUserCareerGoal({ targetRole: role });
    setGoal(updated);
    showToast(`Target Job Role updated to "${role}"`);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    const updated = saveUserCareerGoal(editForm);
    setGoal(updated);
    setIsEditing(false);
    showToast('Mock Interview date & target goal updated!');
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const daysLeft = getDaysRemaining(goal.mockInterviewDate);
  const noticeText = formatInterviewNotice(goal);

  return (
    <div className="space-y-4">
      {/* Toast Feedback */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold shadow-xl border border-zinc-800 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SCHEDULED MOCK INTERVIEW NOTICE BANNER (PROMINENT HIGHLIGHT) ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-white border-2 border-pink-500/30 shadow-sm relative overflow-hidden space-y-3"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1 border border-pink-200">
                <Bell className="w-3.5 h-3.5 text-pink-600 animate-pulse" /> Mock Interview Scheduled
              </span>
              <span className="text-xs text-zinc-500 font-mono">Confirmed Date</span>
            </div>

            {/* Core User Requirement Notice: "Date 27 August is marked for your mock interview" */}
            <h3 className="text-lg font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-600 shrink-0" />
              <span>{noticeText}</span>
            </h3>

            <p className="text-xs text-zinc-500">
              Target Position: <strong className="text-zinc-900">{goal.targetRole}</strong> • Prepare with 3-Round Placement Drive
            </p>
          </div>

          {/* Days Countdown Badge & Action */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
              <span className="text-2xl font-extrabold font-mono text-pink-600 block leading-tight">{daysLeft}</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Days Remaining</span>
            </div>

            <button
              onClick={() => navigate('/interview')}
              className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition shadow-sm flex items-center gap-2 shrink-0"
            >
              <Zap className="w-4 h-4 text-pink-400 fill-current" />
              <span>Start Mock Interview</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── JOB ROLE SELECTION SECTION (SOFTWARE DEVELOPER, SOFTWARE ENGINEER, FULL STACK DEVELOPER, WEB DEVELOPER) ── */}
      <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-blue-600" /> Select Target Career Job Role
            </h4>
            <p className="text-[11px] text-zinc-500">Choose the job title you are targeting for your mock interview evaluation.</p>
          </div>

          <button
            onClick={() => { setEditForm({ ...goal }); setIsEditing(true); }}
            className="text-xs text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Interview Date
          </button>
        </div>

        {/* Role Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { name: 'Software Developer', icon: Code2, desc: 'Core logic & application development' },
            { name: 'Software Engineer', icon: Laptop, desc: 'Systems, performance & algorithms' },
            { name: 'Full Stack Developer', icon: Zap, desc: 'Frontend UI & Backend FastAPI/Node' },
            { name: 'Web Developer', icon: Briefcase, desc: 'Web applications & interactive UX' },
          ].map((roleItem) => {
            const isSelected = goal.targetRole === roleItem.name;
            const Icon = roleItem.icon;

            return (
              <button
                key={roleItem.name}
                onClick={() => handleRoleSelect(roleItem.name)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm scale-[1.02]'
                    : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-zinc-800 text-pink-400' : 'bg-white text-zinc-700 border border-zinc-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>

                <div className="font-bold text-xs leading-snug">{roleItem.name}</div>
                <p className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {roleItem.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── EDIT GOAL & INTERVIEW DATE MODAL ── */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden p-6 space-y-4 text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h3 className="text-base font-extrabold text-zinc-900">Configure Target Role & Mock Interview</h3>
                <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-zinc-600 text-xs">✕</button>
              </div>

              <form onSubmit={handleSaveForm} className="space-y-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Target Job Role *</label>
                  <select
                    value={editForm.targetRole}
                    onChange={(e) => setEditForm({ ...editForm, targetRole: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  >
                    {JOB_ROLE_OPTIONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Scheduled Mock Interview Date *</label>
                  <input
                    type="date"
                    required
                    value={editForm.mockInterviewDate}
                    onChange={(e) => setEditForm({ ...editForm, mockInterviewDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                  <p className="text-[11px] text-pink-600 font-semibold mt-1">
                    Example: Select 2026-08-27 to mark "Date 27 August is marked for your mock interview".
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Preferred Time</label>
                  <input
                    type="text"
                    value={editForm.interviewTime}
                    onChange={(e) => setEditForm({ ...editForm, interviewTime: e.target.value })}
                    placeholder="e.g. 10:00 AM"
                    className="w-full p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-100 text-zinc-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800"
                  >
                    Save Changes
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

export default CareerGoalSection;
