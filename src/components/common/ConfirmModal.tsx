import React, { useState } from 'react';
import { X, ShieldAlert } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  requireReason?: boolean;
  reasonPlaceholder?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  type = 'danger',
  requireReason = false,
  reasonPlaceholder = 'Please specify administrative reason for this action...'
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) {
      setError('A valid administrative reason is required for audit logs.');
      return;
    }
    onConfirm(reason);
    setReason('');
    setError('');
    onClose();
  };

  const buttonColors = {
    danger: 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white border-amber-500',
    info: 'bg-gov-600 hover:bg-gov-700 text-white border-gov-500'
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full overflow-hidden">
        
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${type === 'danger' ? 'bg-rose-100 dark:bg-rose-950 text-rose-600' : 'bg-amber-100 dark:bg-amber-950 text-amber-600'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{message}</p>

          {requireReason && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                Reason / Remark (Mandatory for Audit Trail)
              </label>
              <textarea
                value={reason}
                onChange={e => { setReason(e.target.value); setError(''); }}
                placeholder={reasonPlaceholder}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
              />
              {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-all border ${buttonColors}`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};
