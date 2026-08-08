import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.97] select-none';

  const variants = {
    primary: 'text-white hover:opacity-90',
    secondary: 'text-slate-300 hover:text-white hover:bg-white/8',
    accent: 'text-white hover:opacity-90',
    danger: 'text-white hover:opacity-90',
    outline: 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/5',
    ghost: 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
  };

  const variantStyles = {
    primary: { background: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%)', boxShadow: '0 6px 20px rgba(34,211,238,0.25)' },
    secondary: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' },
    accent: { background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)', boxShadow: '0 6px 20px rgba(129,140,248,0.25)' },
    danger: { background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', boxShadow: '0 6px 20px rgba(244,63,94,0.2)' },
    outline: { border: '1px solid rgba(34,211,238,0.25)' },
    ghost: {},
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-sm gap-2 font-bold',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      style={variantStyles[variant]}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
