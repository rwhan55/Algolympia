import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bot, LogOut, Sparkles, Bell, ChevronDown, Menu, Camera, Mic, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import CameraMicPermissionModal from '../common/CameraMicPermissionModal';

const NAV_H = 60;

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/interview': 'Assessment Workspace',
    '/career-plan': 'Career Plan & Learning Search',
    '/coding-playground': 'Live Coding IDE',
    '/resume-upload': 'Resume Verification',
    '/history': 'Evaluation History',
    '/profile': 'Settings',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        height: NAV_H,
        background: '#ffffff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex', alignItems: 'center',
        padding: '0 24px',
        justifyContent: 'space-between',
      }}>
        {/* LEFT: Mobile toggle + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={onToggleSidebar}
            className="lg:hidden"
            style={{
              padding: '6px', borderRadius: 8,
              border: '1px solid #eaeaea',
              background: '#ffffff', cursor: 'pointer', color: '#171717',
              display: 'flex', alignItems: 'center',
            }}
          >
            <Menu size={18} />
          </button>

          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #db2777 0%, #2563eb 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Bot size={16} color="white" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#171717', letterSpacing: '-0.4px' }}>
                ALGOOlympia
              </span>
            </div>
          </Link>

          {/* Page breadcrumb — desktop only */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 8 }}>
            <div style={{ width: 1, height: 16, background: '#eaeaea' }} />
            <span style={{ fontSize: 13, color: '#666666', fontWeight: 500 }}>
              {pageTitles[location.pathname] || 'ALGOOlympia'}
            </span>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Device Settings Button */}
          <button
            onClick={() => setShowPermissionModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 8,
              background: '#ffffff', border: '1px solid #eaeaea',
              color: '#171717', fontSize: 12, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.15s'
            }}
          >
            <Settings size={14} className="text-zinc-500" />
            <span className="hidden sm:inline">Device Settings</span>
          </button>

          {/* Start Assessment CTA */}
          <Link
            to="/interview"
            className="hidden md:flex"
            style={{
              alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8,
              background: '#171717',
              color: 'white', fontWeight: 600, fontSize: 12,
              textDecoration: 'none',
              display: 'flex',
            }}
          >
            <Sparkles size={13} />
            Start Assessment
          </Link>

          {/* Notification bell */}
          <button style={{
            position: 'relative', padding: '7px', borderRadius: 8,
            border: '1px solid #eaeaea', background: '#ffffff', cursor: 'pointer',
            color: '#171717', display: 'flex', alignItems: 'center',
          }}>
            <Bell size={16} />
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 6, height: 6, borderRadius: '50%',
              background: '#db2777',
            }} />
          </button>

          {/* Separator */}
          <div style={{ width: 1, height: 20, background: '#eaeaea', margin: '0 2px' }} />

          {/* User Profile */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '4px 8px', borderRadius: 8 }}>
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', border: '1px solid #eaeaea' }}
                />
                <div className="hidden md:block" style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#171717', lineHeight: 1.2, margin: 0 }}>
                    {user.name?.split(' ')[0]}
                  </p>
                  <p style={{ fontSize: 10, color: '#666666', margin: 0 }}>Candidate</p>
                </div>
                <ChevronDown size={12} color="#666666" className="hidden md:block" />
              </Link>
              <button
                onClick={handleLogout}
                title="Sign Out"
                style={{
                  padding: '6px', borderRadius: 8,
                  border: '1px solid #eaeaea', background: '#ffffff', cursor: 'pointer',
                  color: '#666666', display: 'flex', alignItems: 'center',
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ fontSize: 12, fontWeight: 600, color: '#171717', textDecoration: 'none' }}>
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* Camera & Mic Modal */}
      <CameraMicPermissionModal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
      />
    </>
  );
};

export default Navbar;
