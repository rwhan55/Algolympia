import React from 'react';
import { SUPPORTED_LANGUAGES } from '../../constants/languages';
import { Code2 } from 'lucide-react';

export const LanguageSelector = ({ selectedLanguageId, onSelectLanguage }) => {
  return (
    <div className="flex items-center gap-2">
      <Code2 className="w-4 h-4 text-indigo-500 shrink-0" />
      <select
        value={selectedLanguageId}
        onChange={(e) => onSelectLanguage(e.target.value)}
        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.id} value={lang.id}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
