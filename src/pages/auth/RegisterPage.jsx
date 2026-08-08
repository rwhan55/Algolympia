import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, GraduationCap, Building2, UserPlus, ArrowRight } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    password: 'password123',
    college: 'Stanford University',
    branch: 'Computer Science & Engineering',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Your Candidate Profile" subtitle="Get instant AI-driven practice interviews and full diagnostic feedback">
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Alex Johnson"
              required
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 text-sm text-slate-100 placeholder-slate-500 outline-none"
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
              placeholder="alex@example.com"
              required
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 text-sm text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">College / Univ</label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Stanford"
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">Branch / Major</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                placeholder="CS & Eng"
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 text-sm text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" icon={UserPlus} isLoading={isLoading} className="w-full mt-2">
          Create Account & Start
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center gap-1">
            Sign In <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
