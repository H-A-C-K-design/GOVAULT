import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Search, 
  Bell, 
  Users, 
  UserPlus, 
  Building2, 
  ShieldAlert, 
  BarChart3, 
  Settings, 
  User, 
  Lock, 
  LogOut,
  FolderKanban,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { currentUser, logout, hasRole } = useAuth();
  const isAdmin = hasRole(['super_admin', 'department_admin']);

  if (!isOpen) return null;

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? 'bg-gov-600 text-white shadow-md'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Slide-over Content */}
      <div className="relative w-4/5 max-w-xs bg-slate-900 text-slate-100 h-full flex flex-col shadow-2xl z-10 border-r border-slate-800">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img 
              src="/gov_seal.jpg" 
              alt="Government Seal" 
              className="w-9 h-9 rounded-full object-cover border border-amber-500/50" 
            />
            <div>
              <h2 className="font-extrabold text-sm text-white leading-tight">GOVAULT</h2>
              <span className="text-[9px] text-gov-400 font-mono tracking-wider block">ANDROID PORTAL</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        {currentUser && (
          <div className="p-3.5 mx-3 mt-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gov-700 text-white flex items-center justify-center font-bold text-sm shrink-0 border border-gov-500 overflow-hidden">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt={currentUser.fullName} className="w-full h-full object-cover" />
              ) : (
                currentUser.fullName.charAt(0)
              )}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-xs font-bold text-white truncate">{currentUser.fullName}</h3>
              <p className="text-[11px] text-slate-400 truncate">{currentUser.departmentName}</p>
              <span className="inline-block text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}

        {/* Upload quick button */}
        <div className="p-3">
          <NavLink
            to="/documents/upload"
            onClick={onClose}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-gov-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </NavLink>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
          <div>
            <p className="px-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Navigation</p>
            <nav className="space-y-1">
              <NavLink to="/dashboard" onClick={onClose} className={getLinkClass}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/documents" onClick={onClose} className={getLinkClass}>
                <FileText className="w-4 h-4" />
                <span>Documents Registry</span>
              </NavLink>
              <NavLink to="/tasks" onClick={onClose} className={getLinkClass}>
                <CheckSquare className="w-4 h-4" />
                <span>Review Tasks</span>
              </NavLink>
              <NavLink to="/search" onClick={onClose} className={getLinkClass}>
                <Search className="w-4 h-4" />
                <span>Global Search</span>
              </NavLink>
              <NavLink to="/notifications" onClick={onClose} className={getLinkClass}>
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </NavLink>
            </nav>
          </div>

          {isAdmin && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase text-amber-400 tracking-wider mb-2">Administration</p>
              <nav className="space-y-1">
                <NavLink to="/admin" end onClick={onClose} className={getLinkClass}>
                  <FolderKanban className="w-4 h-4" />
                  <span>Overview</span>
                </NavLink>
                <NavLink to="/admin/officers" onClick={onClose} className={getLinkClass}>
                  <Users className="w-4 h-4" />
                  <span>Officer Cadre</span>
                </NavLink>
                <NavLink to="/admin/registrations" onClick={onClose} className={getLinkClass}>
                  <UserPlus className="w-4 h-4" />
                  <span>Registration Requests</span>
                </NavLink>
                <NavLink to="/admin/departments" onClick={onClose} className={getLinkClass}>
                  <Building2 className="w-4 h-4" />
                  <span>Departments</span>
                </NavLink>
                <NavLink to="/admin/approvals" onClick={onClose} className={getLinkClass}>
                  <CheckSquare className="w-4 h-4" />
                  <span>Approvals Queue</span>
                </NavLink>
                <NavLink to="/admin/analytics" onClick={onClose} className={getLinkClass}>
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics Reports</span>
                </NavLink>
                <NavLink to="/admin/audit-logs" onClick={onClose} className={getLinkClass}>
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <span>Audit Trail</span>
                </NavLink>
              </nav>
            </div>
          )}

          <div>
            <p className="px-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">System & Account</p>
            <nav className="space-y-1">
              <NavLink to="/profile" onClick={onClose} className={getLinkClass}>
                <User className="w-4 h-4" />
                <span>Profile Settings</span>
              </NavLink>
              <NavLink to="/settings" onClick={onClose} className={getLinkClass}>
                <Settings className="w-4 h-4" />
                <span>Account Security</span>
              </NavLink>
              <NavLink to="/status" onClick={onClose} className={getLinkClass}>
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Security Status</span>
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Footer Logout */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={() => { onClose(); logout(); }}
            className="w-full py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-900/40 text-rose-300 font-bold text-xs flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
