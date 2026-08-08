import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Mic, Code2, FileText, History, User, Zap, Target } from 'lucide-react';

const SIDEBAR_W = 240;

const NAV_ITEMS = [
  { name: 'Dashboard',         path: '/dashboard',         icon: LayoutDashboard, desc: 'Overview & stats' },
  { name: 'Assessment',        path: '/interview',          icon: Mic,             desc: 'Live interview session', badge: 'AI' },
  { name: 'Career Plan',       path: '/career-plan',        icon: Target,          desc: 'Search & status tracker', badge: 'NEW' },
  { name: 'Coding Playground', path: '/coding-playground', icon: Code2,           desc: 'Monaco editor', badge: 'IDE' },
  { name: 'Resume Analysis',   path: '/resume-upload',      icon: FileText,        desc: 'Parse & match PDF' },
  { name: 'History',           path: '/history',            icon: History,         desc: 'Past evaluation sessions' },
  { name: 'Settings',          path: '/profile',            icon: User,            desc: 'Account preferences' },
];

export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside
      className={`lg:translate-x-0 ${isOpen ? '' : '-translate-x-full'}`}
      style={{
        position: 'fixed', top: 60, bottom: 0, left: 0,
        width: SIDEBAR_W, zIndex: 30,
        background: '#ffffff',
        borderRight: '1px solid #f0f0f0',
        display: 'flex', flexDirection: 'column',
        transition: 'transform 0.2s cubic-bezier(0.16,1,0.3,1)',
        transform: isOpen ? 'translateX(0)' : undefined,
      }}
    >
      {/* ── NAV ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px 12px' }}>
        <p style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: '#888888', padding: '0 8px 10px',
        }}>
          Navigation
        </p>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px', borderRadius: 8,
                  textDecoration: 'none',
                  background: isActive ? '#f5f5f5' : 'transparent',
                  color: isActive ? '#171717' : '#666666',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: 13,
                  transition: 'all 0.15s ease',
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={16}
                      color={isActive ? '#171717' : '#888888'}
                      style={{ flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ lineHeight: 1.2, fontSize: 13 }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: '#888888', lineHeight: 1.2, marginTop: 2 }}>
                        {item.desc}
                      </div>
                    </div>
                    {item.badge && (
                      <span style={{
                        fontSize: 9, fontWeight: 600, letterSpacing: '0.04em',
                        padding: '1px 6px', borderRadius: 4,
                        background: '#f0f0f0',
                        color: '#666666',
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* ── FOOTER CARD ── */}
      <div style={{ padding: '12px 14px 16px', borderTop: '1px solid #f0f0f0' }}>
        <div style={{
          padding: 12, borderRadius: 10,
          background: '#fafafa',
          border: '1px solid #eaeaea',
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#171717', margin: '0 0 2px' }}>
            Assessment Workspace
          </div>
          <p style={{ fontSize: 11, color: '#666666', margin: '0 0 10px', lineHeight: 1.4 }}>
            Monaco Compiler & AI Evaluation Engine
          </p>
          <NavLink
            to="/interview"
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', justify: 'center', gap: 6,
              padding: '7px 12px', borderRadius: 6,
              background: '#171717',
              color: 'white', fontWeight: 600, fontSize: 12,
              textDecoration: 'none',
            }}
          >
            <Zap size={13} /> Start Assessment
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
