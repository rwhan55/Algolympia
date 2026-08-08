import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';

const BG = '#ffffff';

export const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: 'Inter, sans-serif', color: '#09090b' }}>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div style={{ display: 'flex' }}>
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 30,
              background: 'rgba(9,9,11,0.25)',
              backdropFilter: 'blur(3px)',
            }}
            className="lg:hidden"
          />
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main style={{
          flex: 1,
          paddingLeft: 0,
          minWidth: 0,
          minHeight: 'calc(100vh - 60px)',
          background: BG,
        }}>
          {/* Desktop sidebar offset */}
          <div className="lg:pl-[240px]">
            <div style={{ padding: '28px 28px', maxWidth: 1200, margin: '0 auto' }}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
