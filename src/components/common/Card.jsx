import React from 'react';

export const Card = ({ children, className = '', hover = true, glow = null, ...props }) => {
  const glowStyle = {
    cyan: { boxShadow: '0 8px 32px -8px rgba(34,211,238,0.2)', borderColor: 'rgba(34,211,238,0.15)' },
    purple: { boxShadow: '0 8px 32px -8px rgba(139,92,246,0.2)', borderColor: 'rgba(139,92,246,0.15)' },
    amber: { boxShadow: '0 8px 32px -8px rgba(245,158,11,0.2)', borderColor: 'rgba(245,158,11,0.15)' },
  };

  return (
    <div
      className={`pro-card p-6 ${hover ? 'hover:-translate-y-0.5 hover:shadow-2xl' : ''} transition-all duration-200 ${className}`}
      style={glow ? glowStyle[glow] : {}}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-start justify-between mb-5 ${className}`}>
    <div>
      <h3 className="text-sm font-bold text-slate-200 tracking-tight">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0 ml-4">{action}</div>}
  </div>
);

export default Card;
