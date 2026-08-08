import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';

const INDIGO = '#4f46e5';

const InputField = ({ icon: Icon, ...props }) => (
  <div style={{ position: 'relative' }}>
    <Icon size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
    <input
      {...props}
      style={{
        width: '100%', padding: '10px 14px 10px 38px',
        borderRadius: 10, fontSize: 13, color: '#1e293b',
        background: '#f8fafc', border: '1.5px solid #e2e8f0',
        outline: 'none', boxSizing: 'border-box',
        fontFamily: 'Inter, sans-serif',
        transition: 'border-color 0.15s ease',
        ...(props.style || {}),
      }}
      onFocus={e => { e.target.style.borderColor = INDIGO; e.target.style.boxShadow = `0 0 0 3px rgba(79,70,229,0.1)`; }}
      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
    />
  </div>
);

export const LoginPage = () => {
  const [email, setEmail]       = useState('alex.johnson@example.com');
  const [password, setPassword] = useState('password123');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg]   = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); setErrorMsg('');
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials. Please try again.');
    } finally { setIsLoading(false); }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your interview practice">
      {errorMsg && (
        <div style={{
          padding: '10px 14px', borderRadius: 10, marginBottom: 16,
          background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', fontSize: 12, fontWeight: 500,
        }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Email */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
            Email Address
          </label>
          <InputField icon={Mail} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        </div>

        {/* Password */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Password
            </label>
            <Link to="/forgot-password" style={{ fontSize: 11, color: INDIGO, fontWeight: 600, textDecoration: 'none' }}>
              Forgot?
            </Link>
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', zIndex: 1 }} />
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '10px 40px 10px 38px',
                borderRadius: 10, fontSize: 13, color: '#1e293b',
                background: '#f8fafc', border: '1.5px solid #e2e8f0',
                outline: 'none', boxSizing: 'border-box',
                fontFamily: 'Inter, sans-serif',
              }}
              onFocus={e => { e.target.style.borderColor = INDIGO; e.target.style.boxShadow = `0 0 0 3px rgba(79,70,229,0.1)`; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px', borderRadius: 11, fontWeight: 700, fontSize: 13,
            color: 'white', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
            opacity: isLoading ? 0.7 : 1,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {isLoading ? (
            <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
          ) : <LogIn size={15} />}
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {/* Demo hint */}
      <div style={{
        marginTop: 16, padding: '10px 14px', borderRadius: 10,
        background: '#f0fdf4', border: '1px solid #bbf7d0', textAlign: 'center',
      }}>
        <p style={{ fontSize: 11, color: '#16a34a', margin: 0, fontWeight: 500 }}>
          ✓ Demo credentials pre-filled — just click Sign In
        </p>
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 4px' }}>
        <div style={{ flex: 1, height: 1, background: '#e8ecf1' }} />
        <span style={{ fontSize: 11, color: '#cbd5e1', fontWeight: 500 }}>New here?</span>
        <div style={{ flex: 1, height: 1, background: '#e8ecf1' }} />
      </div>

      <Link to="/register" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        padding: '11px', borderRadius: 11, fontWeight: 600, fontSize: 13,
        color: INDIGO, textDecoration: 'none',
        border: '1.5px solid #c7d2fe', background: '#eef2ff',
        marginTop: 8,
      }}>
        Create free account <ArrowRight size={13} />
      </Link>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AuthLayout>
  );
};

export default LoginPage;
