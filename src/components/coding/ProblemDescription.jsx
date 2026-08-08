import React, { useState } from 'react';
import { BookOpen, Copy, Check, Clock, Database, Tag } from 'lucide-react';

export const ProblemDescription = ({ problem }) => {
  const [copiedIdx, setCopiedIdx] = useState(null);

  if (!problem) return null;

  const getDifficultyBadge = (diff) => {
    if (diff === 'Easy') return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    if (diff === 'Medium') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="h-full overflow-y-auto p-5 space-y-6 bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-100 font-sans">
      {/* Title & Difficulty */}
      <div className="space-y-2 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-extrabold tracking-tight">{problem.title}</h2>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getDifficultyBadge(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 font-medium">
            <Tag className="w-3.5 h-3.5 text-indigo-500" /> {problem.category}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {problem.timeLimit}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5" /> {problem.memoryLimit}
          </span>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Problem Statement</h4>
        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">
          {problem.statement}
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Examples</h4>
        {problem.examples?.map((ex, idx) => (
          <div key={ex.id || idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-500 font-sans text-[11px] font-bold">
              <span>Example {idx + 1}</span>
              <button
                onClick={() => copyToClipboard(ex.input, idx)}
                className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {copiedIdx === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIdx === idx ? 'Copied' : 'Copy Input'}</span>
              </button>
            </div>
            <div>
              <span className="text-slate-500 font-bold font-sans">Input: </span>
              <span className="text-indigo-600 dark:text-indigo-400">{ex.input}</span>
            </div>
            <div>
              <span className="text-slate-500 font-bold font-sans">Output: </span>
              <span className="text-emerald-600 dark:text-emerald-400">{ex.output}</span>
            </div>
            {ex.explanation && (
              <p className="text-[11px] font-sans text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
                <span className="font-bold">Explanation: </span>{ex.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Constraints */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Constraints</h4>
        <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-400 font-mono">
          {problem.constraints?.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProblemDescription;
