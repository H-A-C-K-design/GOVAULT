import React from 'react';
import type { ConfidentialityLevel } from '../../types';
import { Shield, ShieldAlert, Lock, Globe } from 'lucide-react';

interface ConfidentialityBadgeProps {
  level: ConfidentialityLevel;
}

export const ConfidentialityBadge: React.FC<ConfidentialityBadgeProps> = ({ level }) => {
  switch (level) {
    case 'Public':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
          <Globe className="w-3 h-3 text-sky-600 dark:text-sky-400" />
          <span>Public</span>
        </span>
      );
    case 'Internal':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
          <Shield className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
          <span>Internal</span>
        </span>
      );
    case 'Confidential':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
          <Lock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
          <span>Confidential</span>
        </span>
      );
    case 'Restricted':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
          <ShieldAlert className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          <span>Restricted</span>
        </span>
      );
  }
};
