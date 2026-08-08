import React from 'react';
import { INTERVIEWERS, INTERVIEWER_TYPES } from '../../constants/interviewers';

export const ActivePanelBadge = ({ type = INTERVIEWER_TYPES.HR, showDescription = false }) => {
  const interviewer = INTERVIEWERS[type] || INTERVIEWERS[INTERVIEWER_TYPES.HR];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${interviewer.badgeBg} text-xs font-semibold shadow-sm`}>
      <span className="text-base">{interviewer.avatar}</span>
      <div className="text-left">
        <span className="font-bold">{interviewer.name}</span>
        <span className="opacity-75 font-normal ml-1 border-l pl-1.5 border-current">
          {interviewer.badge}
        </span>
      </div>
      {showDescription && (
        <p className="text-[11px] opacity-80 mt-0.5">{interviewer.description}</p>
      )}
    </div>
  );
};

export default ActivePanelBadge;
