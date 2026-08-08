import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import useTheme from '../../hooks/useTheme';
import { getLanguageById } from '../../constants/languages';

export const CodeEditor = ({
  languageId = 'python',
  value = '',
  onChange,
  onRunCode,
  onSubmitCode,
  isReadOnly = false
}) => {
  const { isDark } = useTheme();
  const editorRef = useRef(null);
  const langObj = getLanguageById(languageId);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Keyboard Shortcuts:
    // Ctrl + Enter or Cmd + Enter -> Run Code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRunCode) onRunCode();
    });

    // Ctrl + Shift + Enter or Cmd + Shift + Enter -> Submit Code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      if (onSubmitCode) onSubmitCode();
    });
  };

  return (
    <div className="w-full h-full min-h-[350px] relative bg-slate-950 font-mono">
      <Editor
        height="100%"
        language={langObj.monacoLanguage}
        theme={isDark ? 'vs-dark' : 'light'}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          lineNumbers: 'on',
          folding: true,
          bracketPairColorization: { enabled: true },
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          formatOnPaste: true,
          formatOnType: true,
          readOnly: isReadOnly,
          padding: { top: 12, bottom: 12 },
          cursorBlinking: 'smooth',
          smoothScrolling: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
