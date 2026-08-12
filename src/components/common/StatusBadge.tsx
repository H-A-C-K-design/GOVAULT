import React from 'react';
import type { DocumentStatus } from '../../types';
import { CheckCircle2, Clock, XCircle, AlertCircle, FileText, Archive, Send } from 'lucide-react';

interface StatusBadgeProps {
  status: DocumentStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2'
  }[size];

  switch (status) {
    case 'Approved':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Approved</span>
        </span>
      );
    case 'Under Review':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 animate-spin" style={{ animationDuration: '3s' }} />
          <span>Under Review</span>
        </span>
      );
    case 'Submitted':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 ${sizeClasses}`}>
          <Send className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>Submitted</span>
        </span>
      );
    case 'Changes Requested':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-800 ${sizeClasses}`}>
          <AlertCircle className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
          <span>Changes Requested</span>
        </span>
      );
    case 'Rejected':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 ${sizeClasses}`}>
          <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>Rejected</span>
        </span>
      );
    case 'Archived':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 ${sizeClasses}`}>
          <Archive className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Archived</span>
        </span>
      );
    case 'Draft':
    default:
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 ${sizeClasses}`}>
          <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Draft</span>
        </span>
      );
  }
};
