import React, { useState, useEffect } from 'react';
import { Clock, Pause, Play } from 'lucide-react';

export const CodingTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold select-none">
      <Clock className="w-3.5 h-3.5 text-indigo-500" />
      <span>{formatted}</span>
      <button
        onClick={() => setIsRunning(!isRunning)}
        className="p-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        title={isRunning ? 'Pause timer' : 'Resume timer'}
      >
        {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
      </button>
    </div>
  );
};

export default CodingTimer;
