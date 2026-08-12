import React from 'react';
import { FileQuestion, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No documents found",
  description = "There are no records matching your selected query or filters in the government database.",
  actionText,
  actionLink,
  onActionClick,
  icon
}) => {
  return (
    <div className="p-8 sm:p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-gov-50 dark:bg-gov-950/80 text-gov-600 dark:text-gov-400 border border-gov-200 dark:border-gov-800 flex items-center justify-center mx-auto mb-4 shadow-inner">
        {icon || <FileQuestion className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{description}</p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-gov-600 hover:bg-gov-500 text-white font-semibold text-xs transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{actionText}</span>
        </Link>
      )}

      {actionText && onActionClick && !actionLink && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-gov-600 hover:bg-gov-500 text-white font-semibold text-xs transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
