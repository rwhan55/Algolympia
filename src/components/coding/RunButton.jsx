import React from 'react';
import { Play, Loader2 } from 'lucide-react';

export const RunButton = ({ onClick, isLoading = false, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
      title="Run code against sample test cases (Ctrl + Enter)"
    >
      {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
      <span>Run Code</span>
    </button>
  );
};

export default RunButton;
