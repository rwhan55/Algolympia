import React, { createContext, useContext, useState } from 'react';
import { interviewApi } from '../services/interviewApi';
import { INTERVIEWERS, INTERVIEWER_TYPES } from '../constants/interviewers';

const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [finalReport, setFinalReport] = useState(null);

  const startInterviewSession = async (config) => {
    const sessionData = await interviewApi.startSession(config);
    setSession(sessionData);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFinalReport(null);
    return sessionData;
  };

  const currentQuestion = session?.questions?.[currentQuestionIndex] || null;
  const activeInterviewerType = currentQuestion?.interviewerType || INTERVIEWER_TYPES.HR;
  const activeInterviewer = INTERVIEWERS[activeInterviewerType] || INTERVIEWERS[INTERVIEWER_TYPES.HR];

  const submitCurrentAnswer = async (audioBlob, durationSeconds) => {
    if (!session || !currentQuestion) return;
    setIsEvaluating(true);

    try {
      const evaluation = await interviewApi.submitAnswer(
        session.sessionId,
        currentQuestion.id,
        audioBlob,
        durationSeconds
      );

      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: {
          audioBlob,
          duration: durationSeconds,
          evaluation
        }
      }));

      // Next question or finish
      if (currentQuestionIndex + 1 < session.questions.length) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // All answered - finish session
        const reportResult = await interviewApi.finishInterview(session.sessionId);
        setFinalReport(reportResult.report);
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  const resetInterview = () => {
    setSession(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsEvaluating(false);
    setIsSpeaking(false);
    setFinalReport(null);
  };

  return (
    <InterviewContext.Provider
      value={{
        session,
        currentQuestionIndex,
        currentQuestion,
        activeInterviewer,
        answers,
        isEvaluating,
        isSpeaking,
        setIsSpeaking,
        resumeData,
        setResumeData,
        finalReport,
        setFinalReport,
        startInterviewSession,
        submitCurrentAnswer,
        resetInterview
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};
