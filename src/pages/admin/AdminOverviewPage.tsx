import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Building2, 
  BarChart3 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { DataService } from '../../services/dataService';
import type { UserProfile, GovernmentDocument, Department } from '../../types';

export const AdminOverviewPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [documents, setDocuments] = useState<GovernmentDocument[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [uList, dList, deptList] = await Promise.all([
          DataService.getAllUsers(),
          DataService.getDocumentsList(),
          DataService.getDepartmentsList()
        ]);
        setUsers(uList);
        setDocuments(dList);
        setDepartments(deptList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pendingRegistrations = users.filter(u => u.accountStatus === 'pending').length;

  const deptDocData = departments.map(dept => ({
    name: dept.code || dept.name.slice(0, 4).toUpperCase(),
    fullName: dept.name,
    documents: documents.filter(d => d.departmentId === dept.id || d.departmentName === dept.name).length
  })).filter(d => d.documents > 0);

  const statusDistribution = [
    { name: 'Approved', value: documents.filter(d => d.status === 'Approved').length, color: '#10B981' },
    { name: 'Under Review', value: documents.filter(d => d.status === 'Under Review').length, color: '#F59E0B' },
    { name: 'Submitted', value: documents.filter(d => d.status === 'Submitted').length, color: '#3B82F6' },
    { name: 'Draft', value: documents.filter(d => d.status === 'Draft').length, color: '#64748B' },
    { name: 'Changes / Reject', value: documents.filter(d => d.status === 'Changes Requested' || d.status === 'Rejected').length, color: '#EF4444' }
  ].filter(s => s.value > 0);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-gov-600 dark:text-gov-400" />
            <span>Chief Administrator Executive Overview</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            System-wide statistics, pending officer registration queues, and departmental analytics.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/registrations"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Review Registrations ({loading ? '...' : pendingRegistrations})</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Registered Users</span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{loading ? '...' : users.length}</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Pending Registrations</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{loading ? '...' : pendingRegistrations}</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gov-600 dark:text-gov-400">Total Documents</span>
            <div className="p-2 rounded-lg bg-gov-50 dark:bg-gov-950 text-gov-600 dark:text-gov-400 border border-gov-200 dark:border-gov-800">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{loading ? '...' : documents.length}</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Active Departments</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{loading ? '...' : departments.length}</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Department Document Volume</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">Loading...</div>
          ) : deptDocData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-6 text-center">
              <BarChart3 className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">No analytics data available yet</p>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptDocData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="documents" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Documents" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Document Lifecycle Status</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">Loading...</div>
          ) : statusDistribution.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-6 text-center">
              <PieChart className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">No analytics data available yet</p>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
