import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, Lock } from 'lucide-react';
import { DataService } from '../../services/dataService';
import type { AuditLog } from '../../types';

export const AdminAuditLogsPage: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const logs = await DataService.fetchAuditLogs({
          resourceType: selectedResourceType !== 'all' ? selectedResourceType : undefined,
          query: searchQuery
        });
        setAuditLogs(logs);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [searchQuery, selectedResourceType]);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-emerald-500" />
            <span>Immutable Security Audit Log Viewer</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Append-only system security logs. Records cannot be edited, modified, or deleted by any user account.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span>APPEND-ONLY IMMUTABLE AUDIT TRAIL</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search action (OFFICER_LOGIN, DOCUMENT_UPLOAD, APPROVE...), actor name, details..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-lg focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <select
            value={selectedResourceType}
            onChange={e => setSelectedResourceType(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs rounded-lg"
          >
            <option value="all">All Resource Types</option>
            <option value="auth">Authentication & Login</option>
            <option value="document">Document Operations</option>
            <option value="user">User & Officer Cadre</option>
            <option value="department">Departments</option>
            <option value="system">System Configuration</option>
          </select>

        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor Officer</th>
                <th className="px-4 py-3">Action Event</th>
                <th className="px-4 py-3">Resource & Details</th>
                <th className="px-4 py-3">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400 font-sans">Loading immutable audit trail...</td>
                </tr>
              ) : auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400 font-sans">No audit records match query.</td>
                </tr>
              ) : (
                auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60">
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 dark:text-white block font-sans">{log.actorName}</span>
                      <span className="text-[10px] text-slate-400">{log.actorEmail} ({log.actorRole})</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-gov-600 dark:text-gov-400">{log.action}</span>
                    </td>
                    <td className="px-4 py-3 font-sans text-slate-700 dark:text-slate-300 max-w-md">
                      {log.details}
                      {log.ipAddress && <span className="block text-[10px] text-slate-400 font-mono mt-0.5">IP: {log.ipAddress}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.result === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.result}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
