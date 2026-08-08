import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, Zap } from 'lucide-react';

export const ExecutionStatus = ({ status, executionTime, memoryKb }) => {
  if (!status) return null;

  const isAccepted = status === 'Accepted';
  const isCompilationErr = status === 'Compilation Error';
  const isRunning = status === 'Running';

  const badges = {
    Accepted: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      label: 'Accepted'
    },
    'Compilation Error': {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      icon: <XCircle className="w-4 h-4 text-rose-500" />,
      label: 'Compilation Error'
    },
    'Runtime Error': {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      label: 'Runtime Error'
    },
    Running: {
      bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
      icon: <Zap className="w-4 h-4 text-indigo-500 animate-spin" />,
      label: 'Executing Code...'
    }
  };

  const current = badges[status] || badges['Runtime Error'];

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border ${current.bg} text-xs font-semibold`}>
      <div className="flex items-center gap-2">
        {current.icon}
        <span className="font-bold">{current.label}</span>
      </div>

      {!isRunning && executionTime != null && (
        <div className="flex items-center gap-3 font-mono text-[11px] opacity-90">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Runtime: {executionTime} ms
          </span>
          {memoryKb && (
            <span>• Memory: {(memoryKb / 1024).toFixed(1)} MB</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ExecutionStatus;
