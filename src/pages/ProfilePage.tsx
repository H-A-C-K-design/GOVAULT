import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="p-6 rounded-2xl bg-gradient-to-r from-gov-800 to-navy-900 text-white shadow-lg border border-gov-700 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="w-20 h-20 rounded-full bg-gov-700 text-white flex items-center justify-center font-extrabold text-2xl border-4 border-gov-500 shadow-md overflow-hidden shrink-0">
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt={currentUser.fullName} className="w-full h-full object-cover" />
          ) : (
            currentUser.fullName.charAt(0)
          )}
        </div>

        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <h1 className="text-xl sm:text-2xl font-extrabold">{currentUser.fullName}</h1>
            <BadgeCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-xs text-gov-200">{currentUser.designation} • {currentUser.departmentName}</p>
          <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800">
              STATUS: {currentUser.accountStatus}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-800">
              ROLE: {currentUser.role.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            Officer Identification
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Employee ID</span>
              <span className="font-mono font-bold text-gov-600 dark:text-gov-400 text-sm">{currentUser.employeeId}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Official Email</span>
              <span className="font-semibold text-slate-900 dark:text-white">{currentUser.officialEmail}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Mobile Contact</span>
              <span className="font-semibold text-slate-900 dark:text-white">{currentUser.mobileNumber || 'Not specified'}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Verification</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Verified via Secure Gov Domain</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            Departmental Deployment
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
              <span className="font-bold text-slate-900 dark:text-white">{currentUser.departmentName}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Official Designation</span>
              <span className="font-semibold text-slate-900 dark:text-white">{currentUser.designation}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Office Branch / Directorate</span>
              <span className="font-semibold text-slate-900 dark:text-white">{currentUser.officeBranch}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Account Created</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{new Date(currentUser.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
