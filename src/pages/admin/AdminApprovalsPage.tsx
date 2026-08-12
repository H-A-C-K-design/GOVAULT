import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Eye } from 'lucide-react';
import { DataService } from '../../services/dataService';
import type { GovernmentDocument } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminApprovalsPage: React.FC = () => {
  const [pendingDocs, setPendingDocs] = useState<GovernmentDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DataService.getDocumentsList().then(docs => {
      setPendingDocs(docs.filter(d => d.status === 'Submitted' || d.status === 'Under Review'));
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-amber-500" />
          <span>Departmental Approvals Center</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Executive document approval stream across all state departments.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading document approvals...</div>
      ) : pendingDocs.length === 0 ? (
        <EmptyState
          title="No pending approvals"
          description="All submitted documents across departments have been reviewed and processed."
        />
      ) : (
        <div className="space-y-4">
          {pendingDocs.map(doc => (
            <div key={doc.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-gov-600 dark:text-gov-400">{doc.documentNumber}</span>
                  <StatusBadge status={doc.status} size="sm" />
                  <PriorityBadge priority={doc.priority} />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{doc.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{doc.description}</p>
                <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
                  <span>Department: <strong className="text-slate-700 dark:text-slate-300">{doc.departmentName}</strong></span>
                  <span>Owner: <strong className="text-slate-700 dark:text-slate-300">{doc.ownerName}</strong></span>
                </div>
              </div>

              <Link
                to={`/documents/${doc.id}`}
                className="px-4 py-2 rounded-xl bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs shadow-md shrink-0 flex items-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>Review & Approve</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
