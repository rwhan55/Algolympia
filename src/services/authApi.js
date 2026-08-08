import { apiClient } from './apiClient';
import { MOCK_USER } from '../constants/mockData';

export const authApi = {
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch {
      // Mock Fallback
      await new Promise(res => setTimeout(res, 800));
      if (credentials.email && credentials.password) {
        const mockToken = `jwt_token_mock_${Date.now()}`;
        localStorage.setItem('ai_interviewer_token', mockToken);
        localStorage.setItem('ai_interviewer_user', JSON.stringify(MOCK_USER));
        return {
          token: mockToken,
          user: MOCK_USER
        };
      }
      throw new Error('Invalid email or password credentials');
    }
  },

  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch {
      await new Promise(res => setTimeout(res, 900));
      const newUser = {
        ...MOCK_USER,
        name: userData.name || 'Alex Johnson',
        email: userData.email,
        college: userData.college || 'Stanford University',
        branch: userData.branch || 'Computer Science'
      };
      const mockToken = `jwt_token_mock_${Date.now()}`;
      localStorage.setItem('ai_interviewer_token', mockToken);
      localStorage.setItem('ai_interviewer_user', JSON.stringify(newUser));
      return { token: mockToken, user: newUser };
    }
  },

  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch {
      await new Promise(res => setTimeout(res, 600));
      return { message: `Password reset link sent to ${email}` };
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch {
      const stored = localStorage.getItem('ai_interviewer_user');
      if (stored) return JSON.parse(stored);
      return MOCK_USER;
    }
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore mock error
    } finally {
      localStorage.removeItem('ai_interviewer_token');
      localStorage.removeItem('ai_interviewer_user');
    }
  }
};
