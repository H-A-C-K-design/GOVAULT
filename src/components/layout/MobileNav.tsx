import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, CheckSquare, Bell, User, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileNav: React.FC = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole(['super_admin', 'department_admin']);

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center py-2 px-1 text-[10px] font-medium transition-colors ${
      isActive
        ? 'text-gov-600 dark:text-gov-400 font-bold'
        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
    }`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-lg">
      <div className="grid grid-cols-5 h-16">
        <NavLink to="/dashboard" className={getLinkClass}>
          <LayoutDashboard className="w-5 h-5 mb-1" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/documents" className={getLinkClass}>
          <FileText className="w-5 h-5 mb-1" />
          <span>Documents</span>
        </NavLink>

        <NavLink to="/tasks" className={getLinkClass}>
          <CheckSquare className="w-5 h-5 mb-1" />
          <span>Tasks</span>
        </NavLink>

        {isAdmin ? (
          <NavLink to="/admin" className={getLinkClass}>
            <ShieldAlert className="w-5 h-5 mb-1 text-amber-500" />
            <span>Admin</span>
          </NavLink>
        ) : (
          <NavLink to="/notifications" className={getLinkClass}>
            <Bell className="w-5 h-5 mb-1" />
            <span>Notifs</span>
          </NavLink>
        )}

        <NavLink to="/profile" className={getLinkClass}>
          <User className="w-5 h-5 mb-1" />
          <span>Profile</span>
        </NavLink>
      </div>
    </div>
  );
};
