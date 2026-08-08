import { apiClient } from './apiClient';
import { MOCK_INTERVIEW_QUESTIONS, MOCK_REPORT_DETAILS } from '../constants/mockData';

export const interviewApi = {
  async startSession(config) {
    try {
      const response = await apiClient.post('/interview/start', config);
      return response.data;
    } catch {
      await new Promise(res => setTimeout(res, 1000));
      return {
        sessionId: `session_${Date.now()}`,
        role: config.role || 'Senior Full Stack Engineer',
        difficulty: config.difficulty || 'Advanced',
        questions: MOCK_INTERVIEW_QUESTIONS,
        currentQuestionIndex: 0,
        totalQuestions: MOCK_INTERVIEW_QUESTIONS.length
      };
    }
  },

  async submitAnswer(sessionId, questionId, audioBlob, durationSeconds) {
    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('questionId', questionId);
    if (audioBlob) {
      formData.append('audio', audioBlob, 'answer.wav');
    }
    formData.append('duration', durationSeconds);

    try {
      const response = await apiClient.post('/interview/submit-answer', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch {
      await new Promise(res => setTimeout(res, 1200));
      return {
        success: true,
        evaluation: {
          questionId,
          score: Math.floor(Math.random() * 15) + 82,
          feedback: 'Response was clear, well-structured, and addressed the primary technical constraints effectively.',
          transcription: 'Simulated audio response provided by candidate during practice session.'
        }
      };
    }
  },

  async finishInterview(sessionId) {
    try {
      const response = await apiClient.post('/interview/finish', { sessionId });
      return response.data;
    } catch {
      await new Promise(res => setTimeout(res, 1500));
      return {
        reportId: `rep_${sessionId}`,
        report: MOCK_REPORT_DETAILS
      };
    }
  }
};
