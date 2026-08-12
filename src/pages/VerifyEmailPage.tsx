import React from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, ArrowRight } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gov-600 text-white flex items-center justify-center mx-auto shadow-xl">
          <MailCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">Official Email Verification Required</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          We have sent a verification code to your official government email address. Please click the link inside your email to complete initial officer verification.
        </p>

        <div className="pt-4">
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs shadow-lg"
          >
            <span>Proceed to Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
