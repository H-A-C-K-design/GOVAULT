import React, { useState } from 'react';
import { Shield, Save } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [appCheck, setAppCheck] = useState(true);
  const [mfaEnforced, setMfaEnforced] = useState(true);
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
          <Shield className="w-6 h-6 text-gov-600 dark:text-gov-400" />
          <span>Government Portal Security Configuration</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure security rules, App Check enforcement, and file upload parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            Network & Encryption Rules
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-850">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">HTTPS Port 443 Exclusive Enforcement</span>
                <span className="text-slate-500">Public HTTP 80, FTP, and SSH ports disabled.</span>
              </div>
              <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">ACTIVE</span>
            </div>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-850 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Firebase App Check Token Attestation</span>
                <span className="text-slate-500">Validate request origins with App Check reCAPTCHA v3.</span>
              </div>
              <input
                type="checkbox"
                checked={appCheck}
                onChange={e => setAppCheck(e.target.checked)}
                className="w-4 h-4 text-gov-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-850 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Enforce Multi-Factor Authentication (MFA) for Admins</span>
                <span className="text-slate-500">Require TOTP or SMS verification for Super Admin sign-in.</span>
              </div>
              <input
                type="checkbox"
                checked={mfaEnforced}
                onChange={e => setMfaEnforced(e.target.checked)}
                className="w-4 h-4 text-gov-600 rounded"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {saved ? <span className="text-xs font-bold text-emerald-600">Security configuration saved!</span> : <span></span>}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs shadow-md flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
};
