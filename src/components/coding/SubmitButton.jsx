import React from 'react';
import { Send, Loader2 } from 'lucide-react';

export const SubmitButton = ({ onClick, isLoading = false, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
      title="Submit solution for AI evaluation (Ctrl + Shift + Enter)"
    >
      {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
      <span>Submit Code</span>
    </button>
  );
};

export default SubmitButton;
