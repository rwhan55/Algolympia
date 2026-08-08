import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export const InterviewTimer = ({ initialSeconds = 180, onTimeExpire }) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeExpire) onTimeExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft < 45;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-colors ${
        isWarning
          ? 'bg-rose-950/60 border-rose-500/50 text-rose-400 animate-pulse'
          : 'bg-slate-900/80 border-slate-700 text-cyan-400'
      }`}
    >
      {isWarning ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
      <span>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
      {isWarning && <span className="text-[10px] uppercase tracking-wider">Low Time</span>}
    </div>
  );
};

export default InterviewTimer;
