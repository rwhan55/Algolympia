import React, { useState } from 'react';
import { CheckCircle2, XCircle, Code } from 'lucide-react';

export const TestCasePanel = ({ sampleTestCases = [], activeResult }) => {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  if (!sampleTestCases.length) return null;

  const currentCase = sampleTestCases[selectedCaseIdx] || sampleTestCases[0];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-t border-slate-800 rounded-b-xl overflow-hidden font-sans text-xs">
      {/* Tabs for Test Cases */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border-b border-slate-800">
        {sampleTestCases.map((tc, idx) => (
          <button
            key={tc.id || idx}
            onClick={() => setSelectedCaseIdx(idx)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-all ${
              selectedCaseIdx === idx
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Case {idx + 1}</span>
            {activeResult && (
              activeResult.status === 'Accepted' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-400" />
              )
            )}
          </button>
        ))}
      </div>

      {/* Details of Selected Test Case */}
      <div className="p-4 space-y-3 font-mono">
        <div>
          <span className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider">Input:</span>
          <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 mt-1">
            {currentCase.input}
          </pre>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider">Expected Output:</span>
          <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 mt-1">
            {currentCase.expectedOutput}
          </pre>
        </div>

        {activeResult && activeResult.stdout && (
          <div>
            <span className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider">Your Output:</span>
            <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 mt-1">
              {activeResult.stdout}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCasePanel;
