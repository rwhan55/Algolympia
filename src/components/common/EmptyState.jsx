import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No Data Found',
  description = 'There are no items matching your criteria at this moment.',
  actionText = null,
  onAction = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-2xl border border-dashed border-slate-700/60">
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-cyan-400 mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
