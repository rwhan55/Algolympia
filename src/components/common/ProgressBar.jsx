import React from 'react';

export const ProgressBar = ({ progress = 0, color = 'cyan', showLabel = true, height = 'h-2.5' }) => {
  const clamped = Math.min(100, Math.max(0, progress));

  const colors = {
    cyan: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    purple: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-500',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    rose: 'bg-gradient-to-r from-rose-500 to-pink-500',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs font-semibold mb-1 text-slate-300">
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden ${height} border border-slate-700/40`}>
        <div
          className={`${height} ${colors[color] || colors.cyan} transition-all duration-500 ease-out rounded-full shadow-sm`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
