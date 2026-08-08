/**
 * userGoalService.js
 * Manages user target job role choices, scheduled mock interview dates,
 * and countdown notifications across the platform.
 */

const STORAGE_KEY = 'algoolympia_user_career_goal';

export const JOB_ROLE_OPTIONS = [
  'Software Developer',
  'Software Engineer',
  'Full Stack Developer',
  'Web Developer',
  'Backend Specialist',
  'System Architect',
];

export const DEFAULT_USER_CAREER_GOAL = {
  targetRole: 'Full Stack Developer',
  mockInterviewDate: '2026-08-27', // 27 August
  interviewTime: '10:00 AM',
  status: 'Scheduled',
};

export const getUserCareerGoal = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER_CAREER_GOAL));
      return DEFAULT_USER_CAREER_GOAL;
    }
    const parsed = JSON.parse(raw);
    return {
      targetRole: parsed.targetRole || DEFAULT_USER_CAREER_GOAL.targetRole,
      mockInterviewDate: parsed.mockInterviewDate || DEFAULT_USER_CAREER_GOAL.mockInterviewDate,
      interviewTime: parsed.interviewTime || DEFAULT_USER_CAREER_GOAL.interviewTime,
      status: parsed.status || DEFAULT_USER_CAREER_GOAL.status,
    };
  } catch {
    return DEFAULT_USER_CAREER_GOAL;
  }
};

export const saveUserCareerGoal = (goalData) => {
  try {
    const updated = {
      ...getUserCareerGoal(),
      ...goalData,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save career goal:', err);
    return DEFAULT_USER_CAREER_GOAL;
  }
};

export const formatInterviewNotice = (goal) => {
  if (!goal || !goal.mockInterviewDate) return 'Date 27 August is marked for your mock interview';
  
  const d = new Date(goal.mockInterviewDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const day = d.getDate();
  const month = monthNames[d.getMonth()];
  
  return `Date ${day} ${month} is marked for your mock interview`;
};

export const getDaysRemaining = (dateString) => {
  if (!dateString) return 19;
  const target = new Date(dateString);
  const now = new Date();
  const diff = target - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};
