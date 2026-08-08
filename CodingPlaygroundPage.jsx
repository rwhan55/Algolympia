import React, { useState } from 'react';
import LiveCodingWorkspace from '../components/coding/LiveCodingWorkspace';
import { CODING_PROBLEMS } from '../constants/codingProblems';
import { Code2, Sparkles, ChevronRight } from 'lucide-react';
import Toast from '../components/common/Toast';

export const CodingPlaygroundPage = () => {
  const [selectedProblemIdx, setSelectedProblemIdx] = useState(0);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const activeProblem = CODING_PROBLEMS[selectedProblemIdx] || CODING_PROBLEMS[0];

  const handleSolutionSubmitted = (result) => {
    setToast({
      isVisible: true,
      message: result.status === 'Accepted'
        ? `Solution Accepted! All ${result.passedCases} test cases passed (Score: 100/100).`
        : `Submission Result: ${result.status} (${result.passedCases}/${result.totalCases} passed)`,
      type: result.status === 'Accepted' ? 'success' : 'warning'
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Code2 className="w-4 h-4" />
            <span>Monaco Multi-Language Live IDE</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Live Coding Practice Environment
          </h1>
        </div>

        {/* Problem Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Problem:</span>
          <select
            value={selectedProblemIdx}
            onChange={(e) => setSelectedProblemIdx(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {CODING_PROBLEMS.map((prob, idx) => (
              <option key={prob.id} value={idx}>
                {prob.title} ({prob.difficulty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Monaco Live Coding IDE Workspace */}
      <LiveCodingWorkspace
        problem={activeProblem}
        onSolutionSubmitted={handleSolutionSubmitted}
      />
    </div>
  );
};

export default CodingPlaygroundPage;
