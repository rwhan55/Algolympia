import { apiClient } from './apiClient';
import { MOCK_USER } from '../constants/mockData';

export const profileApi = {
  async getProfile() {
    try {
      const response = await apiClient.get('/user/profile');
      return response.data;
    } catch {
      await new Promise(res => setTimeout(res, 400));
      const stored = localStorage.getItem('ai_interviewer_user');
      return stored ? JSON.parse(stored) : MOCK_USER;
    }
  },

  async updateProfile(updates) {
    try {
      const response = await apiClient.put('/user/profile', updates);
      return response.data;
    } catch {
      await new Promise(res => setTimeout(res, 600));
      const current = JSON.parse(localStorage.getItem('ai_interviewer_user') || JSON.stringify(MOCK_USER));
      const updated = { ...current, ...updates };
      localStorage.setItem('ai_interviewer_user', JSON.stringify(updated));
      return updated;
    }
  }
};
