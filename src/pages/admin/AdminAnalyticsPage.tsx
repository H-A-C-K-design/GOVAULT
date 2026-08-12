import React from 'react';
import { BarChart3, FileSpreadsheet } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

export const AdminAnalyticsPage: React.FC = () => {
  const performanceData = [
    { dept: 'REV', avgDays: 1.2, approved: 154 },
    { dept: 'HLT', avgDays: 2.1, approved: 230 },
    { dept: 'MUN', avgDays: 1.5, approved: 112 },
    { dept: 'PWD', avgDays: 2.8, approved: 198 },
    { dept: 'EDU', avgDays: 1.8, approved: 310 },
    { dept: 'FIN', avgDays: 0.9, approved: 175 }
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Department,AvgApprovalDays,TotalApproved\n" +
      performanceData.map(e => `${e.dept},${e.avgDays},${e.approved}`).join("\n");
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
            Export official monthly performance reports and measure department sign-off velocity.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV Audit Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Average Approval Turnaround Time (Days)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <XAxis dataKey="dept" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="avgDays" fill="#10b981" radius={[6, 6, 0, 0]} name="Avg Turnaround (Days)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cumulative Department Approved Documents</h3>
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
        </div>
      </div>

    </div>
  );
};
