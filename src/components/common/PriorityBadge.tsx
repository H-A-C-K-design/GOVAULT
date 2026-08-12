import React from 'react';
import type { PriorityLevel } from '../../types';
import { AlertTriangle, ArrowUpRight, ArrowDownRight, Flame } from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case 'Urgent':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500 text-white shadow-xs">
          <Flame className="w-3 h-3 text-amber-200 animate-pulse" />
          <span>Urgent</span>
        </span>
      );
    case 'High':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          <span>High</span>
        </span>
      );
    case 'Normal':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <ArrowUpRight className="w-3 h-3 text-slate-500" />
          <span>Normal</span>
        </span>
      );
    case 'Low':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
          <ArrowDownRight className="w-3 h-3 text-slate-400" />
          <span>Low</span>
        </span>
      );
  }
};
