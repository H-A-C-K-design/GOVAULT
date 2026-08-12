import React, { useEffect, useState } from 'react';
import { BarChart3, FileSpreadsheet } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { DataService } from '../../services/dataService';
import type { GovernmentDocument, Department } from '../../types';

export const AdminAnalyticsPage: React.FC = () => {
  const [documents, setDocuments] = useState<GovernmentDocument[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      try {
        const docList = await DataService.getDocumentsList();
        const deptList = await DataService.getDepartmentsList();
        setDocuments(docList);
        setDepartments(deptList);
      } finally {
        setLoading(false);
      }
    };
    loadAnalyticsData();
  }, []);

  const performanceData = departments.map(dept => {
    const deptDocs = documents.filter(d => d.departmentId === dept.id || d.departmentName === dept.name);
    const approvedDocs = deptDocs.filter(d => d.status === 'Approved').length;
    return {
      dept: dept.code || dept.name.slice(0, 4).toUpperCase(),
      approved: approvedDocs
    };
  }).filter(d => d.approved > 0);

  const handleExportCSV = () => {
    if (performanceData.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8,Department,TotalApproved\n" +
      performanceData.map(e => `${e.dept},${e.approved}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "GovDoc_Department_Analytics_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-gov-600 dark:text-gov-400" />
            <span>Government System Analytics & Reports</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export official performance reports and measure department sign-off velocity.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            disabled={performanceData.length === 0}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV Audit Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Department Approved Official Documents</h3>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">
              Loading...
            </div>
          ) : performanceData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-6 text-center">
              <BarChart3 className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">No analytics data available yet</p>
              <p className="text-[11px] text-slate-400 mt-1">Once documents are submitted and approved, department metrics will populate automatically.</p>
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <XAxis dataKey="dept" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="approved" fill="#6366f1" radius={[6, 6, 0, 0]} name="Total Approved Files" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
