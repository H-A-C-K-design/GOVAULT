import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { currentUser, switchDemoUser } = useAuth();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  return (
    <nav className="bg-navy-950 border-b border-slate-800 text-white sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Identity */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gov-600 to-indigo-600 flex items-center justify-center text-white shadow-md border border-gov-400/30 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                GovDoc
              </span>
              <span className="text-[10px] text-gov-300 block -mt-1 font-mono tracking-wider">
                SMART DIGITAL DOCUMENT SYSTEM
              </span>
            </div>
          </Link>

          {/* Center Badges */}
          <div className="hidden md:flex items-center space-x-4 text-xs">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>HTTPS Socket (Port 443 Exclusive)</span>
            </span>

            <Link
              to="/status"
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gov-950 border border-gov-800 text-gov-300 hover:border-gov-600 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>System Infrastructure Operational</span>
            </Link>
          </div>

          {/* Right Action / Quick Role Switcher */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-bold text-[11px] uppercase tracking-wider">
                  Role: {currentUser ? currentUser.role.replace('_', ' ') : 'Guest'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-800 text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    Quick Demo Persona Switcher
                  </div>

                  <div className="space-y-1 mt-1">
                    <button
                      onClick={() => { switchDemoUser('user-superadmin'); setShowRoleSwitcher(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-slate-800 ${currentUser?.role === 'super_admin' ? 'bg-gov-900/60 text-gov-300 font-bold' : 'text-slate-300'}`}
                    >
                      <div>
                        <span className="block font-bold">Dr. Rajesh Sharma</span>
                        <span className="text-[10px] text-slate-400">Super Admin / Principal Secretary</span>
                      </div>
                      {currentUser?.role === 'super_admin' && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => { switchDemoUser('user-deptadmin-rev'); setShowRoleSwitcher(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-slate-800 ${currentUser?.role === 'department_admin' ? 'bg-gov-900/60 text-gov-300 font-bold' : 'text-slate-300'}`}
                    >
                      <div>
                        <span className="block font-bold">Smt. Sunita Rao</span>
                        <span className="text-[10px] text-slate-400">Dept Admin (Revenue)</span>
                      </div>
                      {currentUser?.role === 'department_admin' && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => { switchDemoUser('user-officer-hlt'); setShowRoleSwitcher(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-slate-800 ${currentUser?.role === 'officer' ? 'bg-gov-900/60 text-gov-300 font-bold' : 'text-slate-300'}`}
                    >
                      <div>
                        <span className="block font-bold">Officer Amit Verma</span>
                        <span className="text-[10px] text-slate-400">Nodal Officer (Health)</span>
                      </div>
                      {currentUser?.role === 'officer' && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => { switchDemoUser('user-reviewer-pwd'); setShowRoleSwitcher(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-slate-800 ${currentUser?.role === 'reviewer' ? 'bg-gov-900/60 text-gov-300 font-bold' : 'text-slate-300'}`}
                    >
                      <div>
                        <span className="block font-bold">Er. Vikram Singh</span>
                        <span className="text-[10px] text-slate-400">Review Officer (PWD)</span>
                      </div>
                      {currentUser?.role === 'reviewer' && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {currentUser ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs shadow-md border border-gov-400/30 transition-all"
              >
                Go to Portal →
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs shadow-md border border-gov-400/30 transition-all"
              >
                Officer Sign In
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};
