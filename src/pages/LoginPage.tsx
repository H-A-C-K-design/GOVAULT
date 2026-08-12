import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
  officialEmail: z.string().email("Please enter a valid official email address"),
  password: z.string().min(1, "Password is required")
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { login, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login(data.officialEmail, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setServerError(err.message || "Invalid official credentials or unauthorized login attempt.");
    }
  };

  const handleQuickDemoLogin = async (email: string, pass: string, uid: string) => {
    setValue('officialEmail', email);
    setValue('password', pass);
    setServerError(null);
    try {
      await switchDemoUser(uid);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-gov-500 selection:text-white">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center space-x-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-gov-600 to-indigo-600 flex items-center justify-center text-white shadow-lg border border-gov-400/30">
            <Shield className="w-7 h-7" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">GovDoc System</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white">Officer Portal Authentication</h2>
        <p className="text-xs text-slate-400">
          Enter your official credentials to access government document services.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6">

          {serverError && (
            <div className="p-3.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Official Email Address</label>
              <div className="relative">
                <input
                  {...register('officialEmail')}
                  type="email"
                  placeholder="e.g. admin@gov.in"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
              {errors.officialEmail && <p className="text-[11px] text-rose-400 mt-1">{errors.officialEmail.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-[11px] text-gov-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-rose-400 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gov-600 to-indigo-600 hover:from-gov-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl transition-all border border-gov-400/30 flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider text-center flex items-center justify-center gap-1">
              <Key className="w-3 h-3" /> Quick Demo Accounts (1-Click Login)
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@gov.in', 'password123', 'user-superadmin')}
                className="p-2 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/80 text-left transition-colors"
              >
                <span className="block text-[11px] font-bold text-purple-300">Super Admin</span>
                <span className="block text-[9px] text-purple-400 truncate">admin@gov.in</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('deptadmin@revenue.gov.in', 'password123', 'user-deptadmin-rev')}
                className="p-2 rounded-lg bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/80 text-left transition-colors"
              >
                <span className="block text-[11px] font-bold text-blue-300">Dept Admin</span>
                <span className="block text-[9px] text-blue-400 truncate">deptadmin@revenue.gov.in</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('officer@health.gov.in', 'password123', 'user-officer-hlt')}
                className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/80 text-left transition-colors"
              >
                <span className="block text-[11px] font-bold text-emerald-300">Officer</span>
                <span className="block text-[9px] text-emerald-400 truncate">officer@health.gov.in</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('reviewer@pwd.gov.in', 'password123', 'user-reviewer-pwd')}
                className="p-2 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/80 text-left transition-colors"
              >
                <span className="block text-[11px] font-bold text-amber-300">Reviewer</span>
                <span className="block text-[9px] text-amber-400 truncate">reviewer@pwd.gov.in</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400">Need an officer account? </span>
            <Link to="/register" className="text-xs font-bold text-gov-400 hover:underline">
              Register Here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
