import React from 'react';

export const ScoreCard = ({ title, score, icon: Icon, color = '#06B6D4', subtitle }) => {
  const getScoreBadge = (s) => {
    if (s >= 90) return { label: 'Exceptional', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    if (s >= 80) return { label: 'Strong Pass', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
    if (s >= 70) return { label: 'Competent', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    return { label: 'Needs Focus', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
  };

  const badge = getScoreBadge(score);

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="p-2 rounded-xl bg-slate-800 text-cyan-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <span className="text-xs font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider">{title}</span>
        </div>
        {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
        <div className="pt-2">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${badge.bg}`}>
            {badge.label}
          </span>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        {/* Score Number Circle */}
        <div
          className="w-16 h-16 rounded-2xl bg-slate-950 border-2 flex flex-col items-center justify-center shadow-lg"
          style={{ borderColor: color }}
        >
          <span className="text-xl font-extrabold font-mono text-slate-100">{score}</span>
          <span className="text-[9px] text-slate-400 font-bold">/100</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
