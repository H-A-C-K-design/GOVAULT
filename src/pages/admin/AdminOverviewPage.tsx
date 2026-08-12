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
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { DataService } from '../../services/dataService';
import type { UserProfile, GovernmentDocument, Department } from '../../types';

export const AdminOverviewPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [documents, setDocuments] = useState<GovernmentDocument[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const load = async () => {
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
      }
    };
    load();
  }, []);

  const pendingRegistrations = users.filter(u => u.accountStatus === 'pending').length;

  const deptDocData = departments.map(dept => ({
    name: dept.code,
    fullName: dept.name,
    documents: documents.filter(d => d.departmentId === dept.id).length || dept.documentCount
  }));

  const statusDistribution = [
    { name: 'Approved', value: documents.filter(d => d.status === 'Approved').length || 4, color: '#10B981' },
    { name: 'Under Review', value: documents.filter(d => d.status === 'Under Review').length || 2, color: '#F59E0B' },
    { name: 'Submitted', value: documents.filter(d => d.status === 'Submitted').length || 1, color: '#3B82F6' },
    { name: 'Draft', value: documents.filter(d => d.status === 'Draft').length || 1, color: '#64748B' },
    { name: 'Changes / Reject', value: documents.filter(d => d.status === 'Changes Requested' || d.status === 'Rejected').length || 1, color: '#EF4444' }
  ];

  const monthlyActivity = [
    { month: 'Mar', uploads: 45, approvals: 40 },
    { month: 'Apr', uploads: 68, approvals: 62 },
    { month: 'May', uploads: 95, approvals: 88 },
    { month: 'Jun', uploads: 120, approvals: 110 },
    { month: 'Jul', uploads: 154, approvals: 142 },
    { month: 'Aug', uploads: 198, approvals: 185 }
  ];

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
            <span>Review Registrations ({pendingRegistrations})</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Total Officers</span>
            <div className="p-2 rounded-lg bg-gov-50 dark:bg-gov-950 text-gov-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{users.length}</span>
            <Link to="/admin/officers" className="text-[11px] font-bold text-gov-600 dark:text-gov-400 hover:underline">Manage →</Link>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-amber-600">Pending Registrations</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{pendingRegistrations}</span>
            <Link to="/admin/registrations" className="text-[11px] font-bold text-amber-600 hover:underline">Approve →</Link>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">Total Documents</span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{documents.length}</span>
            <Link to="/admin/documents" className="text-[11px] font-bold text-indigo-600 hover:underline">Inspect →</Link>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-emerald-600">Active Departments</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{departments.length}</span>
            <Link to="/admin/departments" className="text-[11px] font-bold text-emerald-600 hover:underline">Departments →</Link>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Documents Output by Department</h3>
            <span className="text-xs text-slate-400">Total Files</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptDocData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="documents" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Document Status Distribution</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
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

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
            {statusDistribution.map(s => (
              <div key={s.name} className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></div>
                <span className="text-slate-600 dark:text-slate-300 font-medium">{s.name}: <strong>{s.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Monthly Upload & Approval Velocity Trends</h3>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyActivity}>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              <Area type="monotone" dataKey="uploads" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Uploads" />
              <Area type="monotone" dataKey="approvals" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Approvals" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
