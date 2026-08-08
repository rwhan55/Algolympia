import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full py-6 px-6 border-t border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 text-xs text-slate-400 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[11px]">System Status: All AI Interviewer Engines Operational</span>
        </div>
        <p className="text-center sm:text-right text-slate-500">
          © {new Date().getFullYear()} IntelliCode AI Interviewer. Built with PyMuPDF, Llama 3 & LangGraph Workflow.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
