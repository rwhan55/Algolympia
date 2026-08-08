import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="p-4 rounded-3xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
        <AlertCircle className="w-12 h-12 animate-pulse" />
      </div>
      <h1 className="text-4xl font-extrabold font-mono text-slate-100">404</h1>
      <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm">
        The route you requested does not exist or has been relocated within the AI Interviewer platform.
      </p>
      <Link to="/dashboard" className="pt-2">
        <Button variant="primary" icon={Home}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
