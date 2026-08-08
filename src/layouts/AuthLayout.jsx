import React from 'react';
import { Bot } from 'lucide-react';

const INDIGO = '#4f46e5';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f5f7fa', fontFamily: 'Inter, sans-serif' }}>

      {/* ── LEFT BRAND PANEL ── */}
      <div
        className="hidden lg:flex"
        style={{
          width: '42%', flexDirection: 'column', justifyContent: 'space-between',
          padding: '40px 48px',
          background: 'linear-gradient(145deg, #312e81 0%, #4338ca 40%, #4f46e5 100%)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 240, height: 240, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '20%',
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(167,139,250,0.15)',
          filter: 'blur(40px)',
        }} />

        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bot size={22} color="white" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'white', letterSpacing: '-0.5px' }}>
            IntelliCode AI
          </span>
        </div>

        {/* Main copy */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: 36, fontWeight: 800, color: 'white',
            lineHeight: 1.2, letterSpacing: '-1px', margin: '0 0 16px',
          }}>
            Ace Your<br />
            <span style={{ color: '#a5b4fc' }}>Next Interview</span>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: '0 0 32px', maxWidth: 300 }}>
            Practice with 6 specialized AI interviewers powered by Llama 3 and LangGraph. Get real-time evaluation of your technical and behavioral responses.
          </p>

          {/* Feature chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '🤖', text: 'Autonomous 6-Agent AI Interview Panel' },
              { icon: '🎙️', text: 'Speech-to-Text Answer Evaluation' },
              { icon: '📊', text: 'Detailed Performance Analytics & Reports' },
              { icon: '📄', text: 'PyMuPDF Resume Skill Extraction' },
            ].map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}>
                <span style={{ fontSize: 16 }}>{f.icon}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div style={{
          position: 'relative', zIndex: 1, padding: 16, borderRadius: 12,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 8px' }}>
            "IntelliCode's AI panel found exactly where my system design answers were weak. Helped me crack my FAANG interview."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>P</div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>Priya S. — SWE at Google</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT: FORM PANEL ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
        background: '#f5f7fa',
      }}>
        {/* Mobile brand */}
        <div className="flex lg:hidden" style={{ alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bot size={18} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>IntelliCode AI</span>
        </div>

        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Header */}
          {title && (
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                {title}
              </h2>
              {subtitle && (
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{subtitle}</p>
              )}
            </div>
          )}

          {/* Card */}
          <div style={{
            background: '#ffffff', borderRadius: 20, padding: 32,
            border: '1px solid #e8ecf1',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
          }}>
            {children}
          </div>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#cbd5e1', marginTop: 20 }}>
            Powered by PyMuPDF · Llama 3 · LangGraph
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
