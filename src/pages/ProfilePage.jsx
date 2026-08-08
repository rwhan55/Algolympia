import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  GraduationCap,
  Building2,
  FileText,
  Trophy,
  LogOut,
  Save,
  CheckCircle2,
  ShieldCheck,
  Moon,
  Sun
} from 'lucide-react';
import Card, { CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import useTheme from '../hooks/useTheme';
import { profileApi } from '../services/profileApi';

export const ProfilePage = () => {
  const { user, logout, updateUserProfileState } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'alex.johnson@example.com',
    college: user?.college || 'Stanford University',
    branch: user?.branch || 'Computer Science & Engineering',
    targetRole: user?.targetRole || 'Senior Full Stack Engineer',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updated = await profileApi.updateProfile(formData);
      updateUserProfileState(updated);
      setToast({
        isVisible: true,
        message: 'Profile details updated successfully!',
        type: 'success'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
            Candidate Profile & Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal academic credentials, primary resume, and platform preferences.
          </p>
        </div>

        <Button variant="danger" size="sm" icon={LogOut} onClick={handleLogout}>
          Log Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card & Avatar */}
        <div className="space-y-6">
          <Card className="text-center p-6 space-y-4">
            <div className="relative inline-block mx-auto">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-cyan-500/40 mx-auto shadow-2xl"
              />
              <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 text-slate-950 shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-100">{user?.name}</h3>
              <p className="text-xs text-cyan-400 font-mono mt-0.5">{user?.email}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1 text-left">
              <div className="flex items-center gap-2 text-slate-300">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{user?.college || 'Stanford University'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate">{user?.branch || 'CS & Engineering'}</span>
              </div>
            </div>

            <Link to="/resume-upload" className="block">
              <Button variant="outline" size="sm" icon={FileText} className="w-full">
                Manage Uploaded Resumes
              </Button>
            </Link>
          </Card>

          {/* Quick Performance Stats */}
          <Card>
            <CardHeader title="Performance Stats" />
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Interviews Completed</span>
                <span className="font-bold text-slate-200">{user?.stats?.interviewsCompleted || 14}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Average Score</span>
                <span className="font-bold text-emerald-400">{user?.stats?.averageScore || 86}%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Highest Score</span>
                <span className="font-bold text-purple-400">{user?.stats?.highestScore || 94}%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Edit Profile Form & Settings */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Personal & Academic Information"
              subtitle="Update details used to customize AI interviewer question depth."
            />

            <form onSubmit={handleSaveProfile} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">College / Institution</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">Branch / Specialization</label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">Target Job Role</label>
                <input
                  type="text"
                  name="targetRole"
                  value={formData.targetRole}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" icon={Save} isLoading={isLoading}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Theme & Display Preferences */}
          <Card>
            <CardHeader
              title="Interface & Theme Preferences"
              subtitle="Switch between Dark Mode and Light Mode."
            />
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 mt-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400">
                  {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Appearance Mode</h4>
                  <p className="text-[10px] text-slate-400">Currently active: {isDark ? 'Dark Mode' : 'Light Mode'}</p>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={toggleTheme}>
                Switch to {isDark ? 'Light' : 'Dark'} Mode
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
