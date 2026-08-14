import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../services/dataService';
import type { Department } from '../types';

const registerSchema = z.object({
  fullName: z.string().min(3, "Full Name must be at least 3 characters"),
  officialEmail: z.string().email("Must be a valid official email address (e.g. name@department.gov.in)"),
  employeeId: z.string().min(4, "Employee / Officer ID is required"),
  departmentId: z.string().min(1, "Please select your official department"),
  designation: z.string().min(2, "Designation is required"),
  officeBranch: z.string().min(2, "Office / Branch location is required"),
  mobileNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  joiningDate: z.string().optional(),
  reportingOfficer: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register: registerAuth } = useAuth();

  useEffect(() => {
    DataService.getDepartmentsList().then(setDepartments);
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      const selectedDept = departments.find(d => d.id === data.departmentId);
      await registerAuth({
        fullName: data.fullName,
        officialEmail: data.officialEmail,
        employeeId: data.employeeId,
        departmentId: data.departmentId,
        departmentName: selectedDept?.name || 'Government Office',
        designation: data.designation,
        officeBranch: data.officeBranch,
        mobileNumber: data.mobileNumber,
        dateOfBirth: data.dateOfBirth,
        joiningDate: data.joiningDate,
        reportingOfficer: data.reportingOfficer,
        password: data.password
      });
      setIsSuccess(true);
    } catch (err: any) {
      setServerError(err.message || "Registration submission failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-gov-500 selection:text-white">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center space-y-2">
        <Link to="/" className="inline-flex items-center space-x-3 group">
          <img 
            src="/govvault_logo.png" 
            alt="GOVVault Logo" 
            className="w-16 h-16 rounded-xl object-contain shadow-2xl bg-slate-950 p-1 border border-slate-800 group-hover:scale-105 transition-transform" 
          />
          <span className="font-extrabold text-2xl tracking-tight text-white flex items-center">
            <span>GOV</span><span className="text-emerald-400">Vault</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-white">Officer Registration Request</h2>
        <p className="text-xs text-slate-400">
          Official accounts require department verification and administrative approval before access is granted.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6">

          {isSuccess ? (
            <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Registration Submitted Successfully</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                Your officer application has been dispatched to the Chief Secretariat for review.
                Your account status is currently <span className="font-bold text-amber-400 uppercase">PENDING</span>.
                You will receive an email notice once approved.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs"
                >
                  Proceed to Officer Login
                </Link>
                <Link
                  to="/"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {serverError && (
                <div className="p-3.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{serverError}</span>
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gov-400 mb-3 border-b border-slate-800 pb-1">
                  1. Personal & Officer Identification
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                    <input
                      {...register('fullName')}
                      type="text"
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                    />
                    {errors.fullName && <p className="text-[11px] text-rose-400 mt-1">{errors.fullName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Official Email Address *</label>
                    <input
                      {...register('officialEmail')}
                      type="email"
                      placeholder="e.g. officer@revenue.gov.in"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                    />
                    {errors.officialEmail && <p className="text-[11px] text-rose-400 mt-1">{errors.officialEmail.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Employee / Officer ID *</label>
                    <input
                      {...register('employeeId')}
                      type="text"
                      placeholder="e.g. EMP-REV-104"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                    />
                    {errors.employeeId && <p className="text-[11px] text-rose-400 mt-1">{errors.employeeId.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Contact Number</label>
                    <input
                      {...register('mobileNumber')}
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                    />
                  </div>

                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gov-400 mb-3 border-b border-slate-800 pb-1">
                  2. Departmental Deployment
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Official Department *</label>
                    <select
                      {...register('departmentId')}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                    >
                      <option value="">Select Department...</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                    {errors.departmentId && <p className="text-[11px] text-rose-400 mt-1">{errors.departmentId.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Official Designation *</label>
                    <input
                      {...register('designation')}
                      type="text"
                      placeholder="e.g. Senior Nodal Officer"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                    />
                    {errors.designation && <p className="text-[11px] text-rose-400 mt-1">{errors.designation.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Office Branch / Directorate *</label>
                    <input
                      {...register('officeBranch')}
                      type="text"
                      placeholder="e.g. Central Secretariat Wing B"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                    />
                    {errors.officeBranch && <p className="text-[11px] text-rose-400 mt-1">{errors.officeBranch.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Reporting Officer (Optional)</label>
                    <input
                      {...register('reportingOfficer')}
                      type="text"
                      placeholder="e.g. Joint Secretary"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                    />
                  </div>

                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gov-400 mb-3 border-b border-slate-800 pb-1">
                  3. Account Security Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Password *</label>
                    <input
                      {...register('password')}
                      type="password"
                      placeholder="Minimum 8 characters"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                    />
                    {errors.password && <p className="text-[11px] text-rose-400 mt-1">{errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password *</label>
                    <input
                      {...register('confirmPassword')}
                      type="password"
                      placeholder="Re-enter password"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-gov-500 focus:outline-none"
                    />
                    {errors.confirmPassword && <p className="text-[11px] text-rose-400 mt-1">{errors.confirmPassword.message}</p>}
                  </div>

                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300 flex items-start space-x-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Verification Policy:</strong> Registration will not activate immediate access. Your details will be routed to the Super Admin for identity verification.
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gov-600 to-indigo-600 hover:from-gov-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl transition-all border border-gov-400/30 flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? 'Submitting Registration...' : 'Submit Registration Request'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-400">Already registered as an officer? </span>
                <Link to="/login" className="text-xs font-bold text-gov-400 hover:underline">
                  Sign In Here
                </Link>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
