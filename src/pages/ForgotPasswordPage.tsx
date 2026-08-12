import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-gov-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-gov-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Shield className="w-7 h-7" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">GovDoc System</span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white">Reset Official Password</h2>
        <p className="text-xs text-slate-400">
          Enter your registered government email address to receive password reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6">

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-800 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Reset Dispatch Sent</h3>
              <p className="text-xs text-slate-300">
                If an official officer account exists for <strong>{email}</strong>, a secure reset link has been dispatched to that address.
              </p>
              <Link
                to="/login"
                className="inline-block w-full py-2.5 px-4 rounded-lg bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs"
              >
                Return to Officer Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Official Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="officer@department.gov.in"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <span>Dispatch Reset Email</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="text-center pt-2">
            <Link to="/login" className="text-xs font-bold text-gov-400 hover:underline">
              Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
