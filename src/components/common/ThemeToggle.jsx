import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../../hooks/useTheme';

export const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
      className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${className}`}
      style={{
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        color: isDark ? '#94a3b8' : '#64748b',
      }}
    >
      {isDark
        ? <Sun className="w-4 h-4 hover:text-amber-400 transition-colors" />
        : <Moon className="w-4 h-4 hover:text-slate-700 transition-colors" />
      }
    </button>
  );
};

export default ThemeToggle;
