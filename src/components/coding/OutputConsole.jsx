import React, { useState } from 'react';
import { Terminal, Trash2, TerminalSquare } from 'lucide-react';
import ExecutionStatus from './ExecutionStatus';

export const OutputConsole = ({ executionResult, customInput, onCustomInputChange, onClearConsole }) => {
  const [activeTab, setActiveTab] = useState('output'); // 'output' | 'stdin'

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-t border-slate-800 rounded-b-xl overflow-hidden font-mono">
      {/* Console Header Tabs */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-slate-800 text-xs font-sans">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('output')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'output'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Output Console</span>
          </button>
          <button
            onClick={() => setActiveTab('stdin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'stdin'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TerminalSquare className="w-3.5 h-3.5" />
            <span>Custom Stdin</span>
          </button>
        </div>

        <button
          onClick={onClearConsole}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          title="Clear Console Output"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {/* Body Area */}
      <div className="flex-1 p-3 overflow-y-auto font-mono text-xs">
        {activeTab === 'output' ? (
          <div className="space-y-3">
            {executionResult ? (
              <>
                <ExecutionStatus
                  status={executionResult.status}
                  executionTime={executionResult.executionTimeMs}
                  memoryKb={executionResult.memoryKb}
                />

                {executionResult.stdout && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-sans uppercase tracking-wider font-bold">Standard Output (stdout):</span>
                    <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                      {executionResult.stdout}
                    </pre>
                  </div>
                )}

                {executionResult.stderr && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-rose-400 font-sans uppercase tracking-wider font-bold">Standard Error / Compiler Logs (stderr):</span>
                    <pre className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 overflow-x-auto whitespace-pre-wrap">
                      {executionResult.stderr}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-slate-500 space-y-1 font-sans text-xs">
                <Terminal className="w-6 h-6 text-slate-600 mb-1" />
                <span>Click "Run Code" to execute program output.</span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col space-y-2">
            <label className="text-[10px] text-slate-400 font-sans uppercase tracking-wider font-bold">
              Standard Input (stdin) sent to program execution:
            </label>
            <textarea
              value={customInput}
              onChange={(e) => onCustomInputChange(e.target.value)}
              placeholder="Enter custom input args here (e.g. 2 7 11 15)"
              className="w-full flex-1 min-h-[100px] p-3 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 outline-none focus:border-cyan-500 font-mono text-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputConsole;
