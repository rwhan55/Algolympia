import React from 'react';

export const Skeleton = ({ className = '', variant = 'text' }) => {
  const base = 'animate-pulse bg-slate-800/80 dark:bg-slate-800/80 light:bg-slate-200 rounded-lg';
  const variants = {
    text: 'h-4 w-full',
    circular: 'rounded-full w-12 h-12',
    card: 'h-48 w-full rounded-2xl',
    button: 'h-10 w-28 rounded-xl',
  };

  return <div className={`${base} ${variants[variant]} ${className}`} />;
};

export default Skeleton;
