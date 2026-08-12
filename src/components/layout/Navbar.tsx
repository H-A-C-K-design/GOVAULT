import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-950/95 border-b border-slate-800 text-white sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Identity */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gov-600 to-indigo-600 flex items-center justify-center text-white shadow-md border border-gov-400/30 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                GOVAULT
              </span>
              <span className="text-[10px] text-gov-300 block -mt-1 font-mono tracking-wider">
                SMART DIGITAL DOCUMENTATION SYSTEM
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-300">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <a href="#features" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
            <Link to="/status" className="hover:text-white transition-colors">System Status</Link>
          </div>

          {/* Action Buttons: Login & Get Started */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs shadow-md border border-gov-400/30 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 hover:border-slate-600 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5 text-gov-400" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-gov-600 to-indigo-600 hover:from-gov-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg border border-gov-400/30 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

