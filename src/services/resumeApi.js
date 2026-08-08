import { apiClient } from './apiClient';
import { MOCK_RESUMES } from '../constants/mockData';

export const resumeApi = {
  async uploadResume(file, onProgress) {
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await apiClient.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        }
      });
      return response.data;
    } catch {
      // Mock progress simulation for smooth UX
      for (let i = 10; i <= 100; i += 20) {
        if (onProgress) onProgress(i);
        await new Promise(res => setTimeout(res, 200));
      }

      const newResume = {
        id: `res_${Date.now()}`,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: new Date().toISOString().split('T')[0],
        isPrimary: true,
        analysis: MOCK_RESUMES[0].analysis
      };

      const existing = JSON.parse(localStorage.getItem('ai_user_resumes') || '[]');
      const updated = [newResume, ...existing.map(r => ({ ...r, isPrimary: false }))];
      localStorage.setItem('ai_user_resumes', JSON.stringify(updated));

      return {
        resume: newResume,
        analysis: newResume.analysis
      };
    }
  },

  async getResumes() {
    try {
      const response = await apiClient.get('/resume/list');
      return response.data;
    } catch {
      await new Promise(res => setTimeout(res, 400));
      const stored = localStorage.getItem('ai_user_resumes');
      return stored ? JSON.parse(stored) : MOCK_RESUMES;
    }
  },

  async deleteResume(id) {
    try {
      await apiClient.delete(`/resume/${id}`);
    } catch {
      const stored = JSON.parse(localStorage.getItem('ai_user_resumes') || JSON.stringify(MOCK_RESUMES));
      const filtered = stored.filter(r => r.id !== id);
      localStorage.setItem('ai_user_resumes', JSON.stringify(filtered));
    }
  }
};
