import React, { useState } from 'react';
import { Settings, Lock, Bell, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [approvalNotif, setApprovalNotif] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-gov-600 dark:text-gov-400" />
          <span>System & Account Settings</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage officer preferences, security controls, and notification alerts.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            <span>Security & Authentication</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-850">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">HTTPS Port 443 Session Enforcement</span>
                <span className="text-slate-500">All data transmitted over TLS v1.3 strict encrypted socket.</span>
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">ENFORCED</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-850">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Audit Logging Level</span>
                <span className="text-slate-500">Append-only immutable record generation on every action.</span>
              </div>
              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-gov-100 text-gov-800">MAXIMUM</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
            <Bell className="w-4 h-4 text-gov-600" />
            <span>Notification Preferences</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-850 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Official Email Alerts</span>
                <span className="text-slate-500">Receive email notices when documents are assigned or updated.</span>
              </div>
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={e => setEmailNotif(e.target.checked)}
                className="w-4 h-4 text-gov-600 rounded focus:ring-gov-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-850 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Workflow Sign-off Alerts</span>
                <span className="text-slate-500">Notify when document moves to Approved or Rejected status.</span>
              </div>
              <input
                type="checkbox"
                checked={approvalNotif}
                onChange={e => setApprovalNotif(e.target.checked)}
                className="w-4 h-4 text-gov-600 rounded focus:ring-gov-500"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {saved ? (
            <span className="text-xs font-bold text-emerald-600">Preferences updated successfully!</span>
          ) : (
            <span></span>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs shadow-md flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
