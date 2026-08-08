import { apiClient } from './apiClient';
import { MOCK_REPORT_DETAILS, MOCK_INTERVIEW_HISTORY } from '../constants/mockData';

export const reportApi = {
  async getReportById(reportId) {
    try {
      const response = await apiClient.get(`/reports/${reportId}`);
      return response.data;
    } catch {
      await new Promise(res => setTimeout(res, 300));
      // Check if candidate generated a report in this session
      const storedReport = localStorage.getItem(`report_${reportId}`);
      if (storedReport) return JSON.parse(storedReport);

      const latestReport = localStorage.getItem('latest_candidate_report');
      if (latestReport) return JSON.parse(latestReport);

      return MOCK_REPORT_DETAILS;
    }
  },

  async saveReport(report) {
    try {
      localStorage.setItem(`report_${report.id}`, JSON.stringify(report));
      localStorage.setItem('latest_candidate_report', JSON.stringify(report));

      const storedHistory = localStorage.getItem('ai_interview_history');
      let historyList = storedHistory ? JSON.parse(storedHistory) : MOCK_INTERVIEW_HISTORY;
      const historyItem = {
        id: report.id,
        role: report.targetRole || report.role || 'Senior Full Stack Engineer',
        date: report.date || new Date().toLocaleDateString(),
        overallScore: report.overallScore,
        duration: report.duration || '60 mins',
        difficulty: report.difficulty || 'Advanced',
        recommendation: report.recommendation,
      };
      historyList = [historyItem, ...historyList.filter(item => item.id !== report.id)];
      localStorage.setItem('ai_interview_history', JSON.stringify(historyList));

      await apiClient.post('/reports', report).catch(() => {});
      return { success: true, id: report.id };
    } catch (e) {
      console.warn('Failed to save report', e);
    }
  },

  async getHistory(filters = {}) {
    try {
      const response = await apiClient.get('/reports/history', { params: filters });
      return response.data;
    } catch {
      await new Promise(res => setTimeout(res, 400));
      const stored = localStorage.getItem('ai_interview_history');
      let list = stored ? JSON.parse(stored) : MOCK_INTERVIEW_HISTORY;

      if (filters.search) {
        const query = filters.search.toLowerCase();
        list = list.filter(item => item.role.toLowerCase().includes(query) || item.date.includes(query));
      }
      if (filters.difficulty && filters.difficulty !== 'All') {
        list = list.filter(item => item.difficulty === filters.difficulty);
      }
      return list;
    }
  },

  async deleteHistory(id) {
    try {
      await apiClient.delete(`/reports/history/${id}`);
    } catch {
      const stored = JSON.parse(localStorage.getItem('ai_interview_history') || JSON.stringify(MOCK_INTERVIEW_HISTORY));
      const filtered = stored.filter(item => item.id !== id);
      localStorage.setItem('ai_interview_history', JSON.stringify(filtered));
    }
  }
};
