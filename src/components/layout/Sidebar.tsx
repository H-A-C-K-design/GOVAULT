import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
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
  LogOut, 
  FolderKanban,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { currentUser, logout, hasRole } = useAuth();

  const isAdmin = hasRole(['super_admin', 'department_admin']);

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-gov-600 text-white shadow-md font-semibold'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <aside className={`w-64 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col h-screen sticky top-0 ${className}`}>
      
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
        <img 
          src="/govvault_logo.png" 
          alt="GOVVault Logo" 
          className="w-10 h-10 rounded-lg object-contain shadow-md drop-shadow-md bg-slate-950 p-0.5 border border-slate-800" 
        />
        <div>
          <h1 className="font-extrabold text-lg leading-none tracking-wide text-white flex items-center">
            <span>GOV</span><span className="text-emerald-400">Vault</span>
          </h1>
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> PORT 443 HTTPS
          </span>
        </div>
      </div>

      {/* User Info Capsule */}
      {currentUser && (
        <div className="p-3.5 mx-3 mt-3 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gov-700 text-white flex items-center justify-center font-bold text-sm overflow-hidden shrink-0 border border-gov-500">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt={currentUser.fullName} className="w-full h-full object-cover" />
            ) : (
              currentUser.fullName.charAt(0)
            )}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-xs font-bold text-white truncate">{currentUser.fullName}</h2>
            <p className="text-[11px] text-slate-400 truncate">{currentUser.departmentName}</p>
            <span className={`inline-block px-1.5 py-0.2 mt-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${
              currentUser.role === 'super_admin' ? 'bg-purple-900/80 text-purple-300 border border-purple-700/50' :
              currentUser.role === 'department_admin' ? 'bg-blue-900/80 text-blue-300 border border-blue-700/50' :
              currentUser.role === 'reviewer' ? 'bg-amber-900/80 text-amber-300 border border-amber-700/50' :
              'bg-slate-700 text-slate-300'
            }`}>
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        
        {/* Main Section */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Main Menu</p>
          <nav className="space-y-1">
            <NavLink to="/dashboard" className={getLinkClass}>
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/documents" className={getLinkClass}>
              <FileText className="w-4 h-4 shrink-0" />
              <span>Documents</span>
            </NavLink>
            <NavLink to="/tasks" className={getLinkClass}>
              <CheckSquare className="w-4 h-4 shrink-0" />
              <span>My Tasks</span>
            </NavLink>
            <NavLink to="/search" className={getLinkClass}>
              <Search className="w-4 h-4 shrink-0" />
              <span>Search</span>
            </NavLink>
            <NavLink to="/notifications" className={getLinkClass}>
              <Bell className="w-4 h-4 shrink-0" />
              <span>Notifications</span>
            </NavLink>
          </nav>
        </div>

        {/* Administration Section */}
        {isAdmin && (
          <div>
            <p className="px-3 text-[10px] font-bold uppercase text-amber-400 tracking-wider mb-2 flex items-center justify-between">
              <span>Administration</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30">ADMIN</span>
            </p>
            <nav className="space-y-1">
              <NavLink to="/admin" end className={getLinkClass}>
                <FolderKanban className="w-4 h-4 shrink-0" />
                <span>Overview</span>
              </NavLink>
              <NavLink to="/admin/officers" className={getLinkClass}>
                <Users className="w-4 h-4 shrink-0" />
                <span>Officers</span>
              </NavLink>
              <NavLink to="/admin/registrations" className={getLinkClass}>
                <UserPlus className="w-4 h-4 shrink-0" />
                <span>Registration Requests</span>
              </NavLink>
              <NavLink to="/admin/departments" className={getLinkClass}>
                <Building2 className="w-4 h-4 shrink-0" />
                <span>Departments</span>
              </NavLink>
              <NavLink to="/admin/approvals" className={getLinkClass}>
                <CheckSquare className="w-4 h-4 shrink-0" />
                <span>Workflow Approvals</span>
              </NavLink>
              <NavLink to="/admin/analytics" className={getLinkClass}>
                <BarChart3 className="w-4 h-4 shrink-0" />
                <span>Analytics & Reports</span>
              </NavLink>
              <NavLink to="/admin/audit-logs" className={getLinkClass}>
                <ShieldAlert className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Audit Logs</span>
              </NavLink>
            </nav>
          </div>
        )}

        {/* Account & Security */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Account & System</p>
          <nav className="space-y-1">
            <NavLink to="/profile" className={getLinkClass}>
              <User className="w-4 h-4 shrink-0" />
              <span>Profile</span>
            </NavLink>
            <NavLink to="/settings" className={getLinkClass}>
              <Settings className="w-4 h-4 shrink-0" />
              <span>Settings</span>
            </NavLink>
            <NavLink to="/status" className={getLinkClass}>
              <Lock className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Security Status</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Footer Logout Action */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-300 hover:bg-rose-950/60 hover:text-rose-200 transition-colors border border-rose-900/40"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
};
