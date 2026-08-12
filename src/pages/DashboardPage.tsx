import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Search, 
  CheckSquare, 
  ArrowUpRight, 
  Eye, 
  TrendingUp, 
  ShieldAlert,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../services/dataService';
import type { GovernmentDocument, AuditLog } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { ConfidentialityBadge } from '../components/common/ConfidentialityBadge';
import { SkeletonTable } from '../components/common/SkeletonLoader';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState<GovernmentDocument[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const docList = await DataService.getDocumentsList();
        const logs = await DataService.fetchAuditLogs();
        setDocuments(docList);
        setAuditLogs(logs.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalDocs = documents.length;
  const pendingDocs = documents.filter(d => d.status === 'Submitted' || d.status === 'Under Review').length;
  const approvedDocs = documents.filter(d => d.status === 'Approved').length;
  const rejectedDocs = documents.filter(d => d.status === 'Rejected' || d.status === 'Changes Requested').length;

  return (
    <div className="space-y-6">
      
      <div className="p-6 rounded-2xl bg-gradient-to-r from-gov-800 via-navy-900 to-gov-950 text-white shadow-lg border border-gov-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-gov-700/60 border border-gov-500/40 text-[11px] font-semibold text-gov-200 mb-2">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentUser?.departmentName} Directorate</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Officer Command Center
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Digitally manage, track, review, and authorize official department records under strict HTTPS Port 443 governance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/documents/upload"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gov-500 to-indigo-600 hover:from-gov-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all border border-gov-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Documents</span>
            <div className="p-2 rounded-lg bg-gov-50 dark:bg-gov-950 text-gov-600 dark:text-gov-400 border border-gov-200 dark:border-gov-800">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{loading ? '...' : totalDocs}</span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Active registry
            </span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Pending Review</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{loading ? '...' : pendingDocs}</span>
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">Action needed</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Approved</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{loading ? '...' : approvedDocs}</span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Signed off</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Rejections / Revisions</span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{loading ? '...' : rejectedDocs}</span>
            <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400">Requires edit</span>
          </div>
        </div>

      </div>

      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Quick Officer Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/documents/upload"
            className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 hover:bg-gov-50 dark:hover:bg-gov-950/60 border border-slate-200 dark:border-slate-800 hover:border-gov-300 dark:hover:border-gov-700 transition-all flex items-center space-x-3 group"
          >
            <div className="p-2 rounded-lg bg-gov-600 text-white shrink-0 group-hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Upload Document</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Submit new PDF file</p>
            </div>
          </Link>

          <Link
            to="/documents"
            className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 hover:bg-gov-50 dark:hover:bg-gov-950/60 border border-slate-200 dark:border-slate-800 hover:border-gov-300 dark:hover:border-gov-700 transition-all flex items-center space-x-3 group"
          >
            <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0 group-hover:scale-105 transition-transform">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Search Registry</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Filter official docs</p>
            </div>
          </Link>

          <Link
            to="/tasks"
            className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 hover:bg-gov-50 dark:hover:bg-gov-950/60 border border-slate-200 dark:border-slate-800 hover:border-gov-300 dark:hover:border-gov-700 transition-all flex items-center space-x-3 group"
          >
            <div className="p-2 rounded-lg bg-amber-600 text-white shrink-0 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">My Review Tasks</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Pending sign-offs</p>
            </div>
          </Link>

          <Link
            to="/status"
            className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 hover:bg-gov-50 dark:hover:bg-gov-950/60 border border-slate-200 dark:border-slate-800 hover:border-gov-300 dark:hover:border-gov-700 transition-all flex items-center space-x-3 group"
          >
            <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Track Security</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Port 443 Audit</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Official Documents</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Latest active records in database</p>
            </div>
            <Link to="/documents" className="text-xs font-bold text-gov-600 dark:text-gov-400 hover:underline flex items-center gap-1">
              <span>View All Registry</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <SkeletonTable rows={4} />
          ) : documents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No documents available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Doc Number & Title</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Confidentiality</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {documents.slice(0, 5).map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-[11px] font-bold text-gov-600 dark:text-gov-400 block">{doc.documentNumber}</span>
                        <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{doc.title}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-medium">
                        {doc.departmentName}
                      </td>
                      <td className="px-4 py-3">
                        <ConfidentialityBadge level={doc.confidentiality} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={doc.status} size="sm" />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/documents/${doc.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-gov-50 dark:bg-gov-950 text-gov-700 dark:text-gov-300 font-bold hover:bg-gov-100 transition-colors border border-gov-200 dark:border-gov-800"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Audit Activity</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Append-only audit trail entries</p>
          </div>

          <div className="space-y-3">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No audit activity recorded</p>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="flex items-start space-x-3 text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white truncate">{log.actorName}</span>
                      <span className="text-[9px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[11px] font-mono text-gov-600 dark:text-gov-400 font-semibold">{log.action}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{log.details}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link to="/admin/audit-logs" className="text-xs font-bold text-gov-600 dark:text-gov-400 hover:underline">
              View Full System Audit Trail →
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
