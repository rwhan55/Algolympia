import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/common/Button';
import { authApi } from '../../services/authApi';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setSuccessMsg(res.message || 'Password reset link has been dispatched to your email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset Your Password" subtitle="We will email you a secure authentication token link">
      {successMsg ? (
        <div className="space-y-4 text-center py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{successMsg}</p>
          <Link to="/login" className="inline-block mt-2">
            <Button variant="outline" size="sm" icon={ArrowLeft}>
              Back to Login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">Account Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 text-sm text-slate-100 placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" icon={KeyRound} isLoading={isLoading} className="w-full">
            Send Reset Instructions
          </Button>

          <div className="text-center pt-2">
            <Link to="/login" className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
