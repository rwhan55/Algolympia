import React, { useState, useEffect, useRef } from 'react';
import ProblemDescription from './ProblemDescription';
import EditorToolbar from './EditorToolbar';
import CodeEditor from './CodeEditor';
import OutputConsole from './OutputConsole';
import TestCasePanel from './TestCasePanel';
import { getLanguageById } from '../../constants/languages';
import { CODING_PROBLEMS } from '../../constants/codingProblems';
import codeExecutionApi from '../../services/codeExecutionApi';
import { Terminal, CheckCircle2, Maximize2, Minimize2 } from 'lucide-react';

// Light theme tokens
const C = {
  bg: '#f5f7fa',
  card: '#ffffff',
  border: '#e8ecf1',
  editorBg: '#1e1e2e',   // editor stays dark (Monaco standard)
  consoleBg: '#0f1117',
  indigo: '#4f46e5',
};

export const LiveCodingWorkspace = ({
  problem = CODING_PROBLEMS[0],
  onSolutionSubmitted
}) => {
  const [selectedLanguageId, setSelectedLanguageId] = useState('python');
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [activeBottomTab, setActiveBottomTab] = useState('console');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const containerRef = useRef(null);

  // Load blank stub (not a solution!) for the problem+language
  useEffect(() => {
    const langObj = getLanguageById(selectedLanguageId);
    const saveKey = `coding_draft_${problem.id}_${selectedLanguageId}`;
    const savedCode = localStorage.getItem(saveKey);
    setCode(savedCode || langObj.defaultCode);
    if (problem.sampleTestCases?.[0]) {
      setCustomInput(problem.sampleTestCases[0].input);
    }
  }, [problem.id, selectedLanguageId]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    const saveKey = `coding_draft_${problem.id}_${selectedLanguageId}`;
    localStorage.setItem(saveKey, newCode);
    setLastSavedAt(new Date().toLocaleTimeString());
  };

  const handleResetCode = () => {
    const langObj = getLanguageById(selectedLanguageId);
    const saveKey = `coding_draft_${problem.id}_${selectedLanguageId}`;
    localStorage.removeItem(saveKey);
    setCode(langObj.defaultCode);
    setExecutionResult(null);
    setSubmissionResult(null);
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    setActiveBottomTab('console');
    setExecutionResult({ status: 'Running' });
    try {
      const res = await codeExecutionApi.runCode({ languageId: selectedLanguageId, sourceCode: code, stdin: customInput });
      setExecutionResult(res);
    } catch {
      setExecutionResult({ status: 'Runtime Error', stdout: '', stderr: 'Failed to reach execution server.', exitCode: 1 });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setActiveBottomTab('console');
    try {
      const res = await codeExecutionApi.submitCode({ languageId: selectedLanguageId, sourceCode: code, problemId: problem.id });
      setSubmissionResult(res);
      setExecutionResult(res.executionResult);
      if (onSolutionSubmitted) onSolutionSubmitted(res);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex', flexDirection: 'column',
        borderRadius: isFullscreen ? 0 : 20,
        overflow: 'hidden',
        border: `1px solid ${C.border}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        height: isFullscreen ? '100vh' : 780,
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : undefined,
        zIndex: isFullscreen ? 9999 : undefined,
      }}
    >
      {/* ── Split: Left Problem | Right Editor ── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

        {/* LEFT: Problem Description — light white background */}
        <div style={{
          width: '38%', minWidth: 300,
          background: C.card,
          borderRight: `1px solid ${C.border}`,
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          <ProblemDescription problem={problem} />
        </div>

        {/* RIGHT: Editor stack */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: C.editorBg }}>

          {/* Toolbar — light gray bar */}
          <div style={{
            background: '#f1f3f5',
            borderBottom: `1px solid ${C.border}`,
            flexShrink: 0,
          }}>
            <EditorToolbar
              selectedLanguageId={selectedLanguageId}
              onSelectLanguage={setSelectedLanguageId}
              onResetCode={handleResetCode}
              onRunCode={handleRunCode}
              onSubmitCode={handleSubmitCode}
              isExecuting={isExecuting}
              isSubmitting={isSubmitting}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              lastSavedAt={lastSavedAt}
            />
          </div>

          {/* Monaco Editor */}
          <div style={{ flex: 1, minHeight: 300, overflow: 'hidden' }}>
            <CodeEditor
              languageId={selectedLanguageId}
              value={code}
              onChange={handleCodeChange}
              onRunCode={handleRunCode}
              onSubmitCode={handleSubmitCode}
            />
          </div>

          {/* Bottom tab bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 12px',
            background: '#1a1b26',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { key: 'console', label: 'Console', icon: <Terminal size={13} /> },
                { key: 'testcases', label: 'Test Cases', icon: <CheckCircle2 size={13} /> },
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveBottomTab(key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
                    background: activeBottomTab === key ? 'rgba(99,102,241,0.25)' : 'transparent',
                    border: activeBottomTab === key ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
                    color: activeBottomTab === key ? '#a5b4fc' : 'rgba(255,255,255,0.4)',
                    fontSize: 11, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.15s',
                  }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>

            {submissionResult && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                background: submissionResult.status === 'Accepted' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                color: submissionResult.status === 'Accepted' ? '#34d399' : '#f87171',
                border: `1px solid ${submissionResult.status === 'Accepted' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              }}>
                {submissionResult.status === 'Accepted' ? '✓' : '✗'} Score: {submissionResult.score}/100 ({submissionResult.passedCases}/{submissionResult.totalCases})
              </span>
            )}
          </div>

          {/* Bottom Panel */}
          <div style={{ height: 220, flexShrink: 0 }}>
            {activeBottomTab === 'console' ? (
              <OutputConsole
                executionResult={executionResult}
                customInput={customInput}
                onCustomInputChange={setCustomInput}
                onClearConsole={() => setExecutionResult(null)}
              />
            ) : (
              <TestCasePanel sampleTestCases={problem.sampleTestCases} activeResult={executionResult} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCodingWorkspace;
